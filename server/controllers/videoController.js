import { PutObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Lesson from "../models/lesson.js";
import Enrollment from "../models/enrolment.js";

import crypto from "crypto";

import { s3 } from "../utils/S3Client.js";

const makeFileKey = (lessonId, mimeType, originalName = "") => {
    const ext = (mimeType?.split("/")[1]) || (originalName.split(".").pop() || "mp4");
    return `videos/${lessonId}/${crypto.randomUUID()}.${ext}`;
};

export const presignUpload = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const { lessonId, fileType, originalName } = req.body;
        if (!lessonId || !fileType) return res.status(400).json({ message: "lessonId and fileType required" });

        const lesson = await Lesson.findById(lessonId).populate("course");
        if (!lesson) return res.status(404).json({ message: "Lesson not found" });

        // Ownership check — adjust to your schema
        if (lesson.course.instructor.toString() !== user.id.toString()) {
            return res.status(403).json({ message: "Not allowed to upload for this lesson" });
        }

        const fileKey = makeFileKey(lessonId, fileType, originalName);
        const putCmd = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
            ContentType: fileType,
           
        });

        const expires = parseInt(process.env.S3_SIGNED_URL_EXPIRES || "300", 10);
        const uploadUrl = await getSignedUrl(s3, putCmd, { expiresIn: expires });

        return res.json({ uploadUrl, fileKey, expiresIn: expires });
    } catch (err) {
        console.error("presignUpload", err);
        return res.status(500).json({ message: "Could not generate upload url" });
    }
};

export const getPlaybackUrl = async (req, res) => {
    try {
        const { lessonId } = req.params;

        const lesson = await Lesson.findById(lessonId).populate("course");
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        // Access control
        const isInstructor = lesson.course.instructor.toString() === req.user._id.toString();

        const isEnrolled = await Enrollment.findOne({
            user: req.user._id,
            course: lesson.course._id
        });

        if (!isInstructor && !isEnrolled) {
            return res.status(403).json({ message: "You are not enrolled in this course" });
        }

        if (!lesson.video || !lesson.video.key) {
            return res.status(400).json({ message: "No video found for this lesson" });
        }

        // Generate signed playback URL
        const getCMD = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: lesson.video.key,
        });

        const playbackUrl = await getSignedUrl(s3, getCMD, { expiresIn: 3600 });

        return res.json({ playbackUrl });

    } catch (err) {
        console.error("Playback error:", err);
        return res.status(500).json({ message: "Server error during playback" });
    }
};

export const completeUpload = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const { lessonId, fileKey, originalName, size } = req.body;
        if (!lessonId || !fileKey) return res.status(400).json({ message: "lessonId and fileKey required" });

        const lesson = await Lesson.findById(lessonId).populate("course");
        if (!lesson) return res.status(404).json({ message: "Lesson not found" });


        if (lesson.course.instructor.toString() !== user.id.toString()) {
            return res.status(403).json({ message: "Not allowed to complete upload for this lesson" });
        }

        lesson.video = {
            key: fileKey,
            size: size || 0,
            originalName: originalName || "",
            status: "uploaded",
            uploadedAt: new Date(),
        };
        await lesson.save();

        return res.json({ message: "Upload completed", lessonId: lesson._id });
    } catch (err) {
        console.error("completeUpload", err);
        return res.status(500).json({ message: "Error saving upload info" });
    }
};

