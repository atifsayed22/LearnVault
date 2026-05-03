import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/S3Client.js";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export const processVideoToHLS = async (fileKey, lessonId) => {
    const tempDir = path.join(process.cwd(), 'temp', lessonId);
    const inputPath = path.join(tempDir, 'input.mp4');
    const outputPlaylist = path.join(tempDir, 'index.m3u8');

    try {
        // 1. CREATE TEMP DIRECTORY
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        // 2. DOWNLOAD RAW MP4 FROM S3
        const getCommand = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
        });
        const response = await s3.send(getCommand);
        const fileStream = fs.createWriteStream(inputPath);
        await new Promise((resolve, reject) => {
            response.Body.pipe(fileStream);
            response.Body.on("error", reject);
            fileStream.on("finish", resolve);
        });

        // 3. RUN FFMPEG (The "Byte-by-Byte" Magic)
        // This command creates 10-second chunks (.ts files)
        const ffmpegCmd = `ffmpeg -i ${inputPath} -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ${outputPlaylist}`;
        await execPromise(ffmpegCmd);

        
        // 4. UPLOAD ALL GENERATED FILES (.m3u8 and .ts) TO S3 IN PARALLEL
        const files = fs.readdirSync(tempDir).filter(file => file !== 'input.mp4');

        // Create an array of Promises
        const uploadPromises = files.map(async (file) => {
            const filePath = path.join(tempDir, file);
            
            // Using Streams instead of Buffer for memory efficiency
            const fileStream = fs.createReadStream(filePath);

            const putCommand = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `streams/${lessonId}/${file}`,
                Body: fileStream,
                ContentType: file.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/MP2T'
            });

            return s3.send(putCommand);
        });

        // Fire all network calls simultaneously
        await Promise.all(uploadPromises);

        console.log(`✅ Parallel upload of ${files.length} files complete for lesson: ${lessonId}`);

    } catch (error) {
        console.error("FFmpeg Error:", error);
        throw error;
    } finally {
        // 5. CLEANUP LOCAL FILES
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
};