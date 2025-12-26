import mongoose from "mongoose";

const lessonProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },

    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },

    lastWatchedTime: {
      type: Number, // seconds
      default: 0,
    },

    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// IMPORTANT: prevent duplicate progress rows
lessonProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });

export default mongoose.model("LessonProgress", lessonProgressSchema);
