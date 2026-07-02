import { Worker } from "bullmq";
import { redisConnection } from "./config/redis.js";
import { processVideoToHLS } from "./services/videoProcessor.js";
import Lesson from "./models/lesson.js";
import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🍃 Worker connected to MongoDB successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB();
const worker = new Worker(
  "video-processing",
  async (job) => {
    const { fileKey, lessonId } = job.data;

    console.log(`--- 🎥 New Job Started: ${job.id} ---`);
    console.log(`📍 Lesson ID: ${lessonId}`);
    console.log(`📁 S3 Key: ${fileKey}`);

    try {
      // Phase 1: Processing
      console.log(`⚙️ Starting FFmpeg transcoding for lesson ${lessonId}...`);

      await processVideoToHLS(fileKey, lessonId);

      console.log(`✨ FFmpeg transcoding successful for lesson ${lessonId}`);

      // Phase 2: DB Update
      console.log(`💾 Updating MongoDB status to 'ready'...`);

      const updatedLesson = await Lesson.findByIdAndUpdate(
        lessonId,
        {
          "video.status": "ready",
          "video.hlsPath": `streams/${lessonId}/index.m3u8`,
        },
        { new: true },
      );

      if (!updatedLesson) {
        console.error(
          `❌ Error: Lesson ${lessonId} not found in database during status update.`,
        );
      } else {
        console.log(
          `✅ Database updated. HLS Path: ${updatedLesson.video.hlsPath}`,
        );
      }

      console.log(`🏁 --- Job ${job.id} Finished Successfully ---\n`);
    } catch (err) {
      console.error(`💥 CRITICAL ERROR in Job ${job.id}:`, err.message);

      // Attempt to mark as failed so the frontend knows
      await Lesson.findByIdAndUpdate(lessonId, { "video.status": "failed" });

      console.log(
        `⚠️ Lesson ${lessonId} status set to 'failed'. Retrying via BullMQ...`,
      );

      // Re-throw so BullMQ sees the job as failed and handles retries/waiting rooms
      throw err;
    }
  },
  {
    connection: redisConnection,
    concurrency: 1, // Only process one video at a time to save CPU
  },
);

// Listener for general worker events
worker.on("ready", () => {
  console.log("🚀 Worker is connected to Redis and listening for jobs...");
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed after all retries: ${err.message}`);
});
