import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ["video", "text"], default: "video" },
    
    // Video details (stored after S3 upload)
    video: {
        key: { type: String },         // S3 file key
        originalName: { type: String },
        size: { type: Number },
        status: { type: String, enum: ["pending", "uploaded"] },
        uploadedAt: { type: Date }
    },

    content: { type: String },         // for text lessons
    duration: { type: Number },

    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" }
    
}, { timestamps: true });

export default mongoose.models.Lesson || mongoose.model("Lesson", lessonSchema);
