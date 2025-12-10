import { useState } from "react";
import api from "../../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function SectionBox({ section, refresh }) {
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);   // PREVENT MULTIPLE CLICKS

  // Create lesson THEN upload video
  const addLesson = async () => {
    if (!newLessonTitle.trim()) {
      toast.error("Lesson title is required");
      return;
    }

    if (!videoFile) {
      toast.error("Please select a video file");
      return;
    }

    try {
      setIsLoading(true);

      // PHASE 1 — Create lesson record
      toast.loading("Creating lesson...");
      const res = await api.post(`/lessons/${section._id}`, {
        title: newLessonTitle,
        type: "video",
      });

      toast.dismiss(); // remove loading toast

      const lesson = res.data.lesson;
      toast.success("Lesson created. Uploading video...");

      // PHASE 2 — Upload video
      await uploadVideo(lesson._id);

      toast.success("Video uploaded successfully");

      // Reset fields & refresh
      setNewLessonTitle("");
      setVideoFile(null);
      setIsAdding(false);
      refresh();

    } catch (err) {
      console.log(err);
      toast.error("Error creating lesson");
    } finally {
      setIsLoading(false);
    }
  };

  // Upload video via S3 presigned URL
  const uploadVideo = async (lessonId) => {
    try {
      // 1) Presign request
      const presign = await api.post("/videos/presign-upload", {
        lessonId,
        fileType: videoFile.type,
        originalName: videoFile.name,
      });

      const { uploadUrl, fileKey } = presign.data;

      // 2) Upload to S3
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": videoFile.type },
        body: videoFile,
      });

      // 3) Notify backend
      await api.post("/videos/complete", {
        lessonId,
        fileKey,
        originalName: videoFile.name,
        size: videoFile.size,
      });

    } catch (err) {
      console.log(err);
      throw new Error("Video upload failed");
    }
  };

  return (
    <div className="bg-white/5 p-4 rounded-lg border border-white/10">

      <h3 className="font-semibold text-lg mb-3">{section.title}</h3>

      {/* Existing lessons */}
      {section.lessons.map((lesson) => (
        <div key={lesson._id} className="text-sm text-gray-200 ml-2">
          • {lesson.title}
          {lesson.video?.status === "uploaded" ? (
            <span className="text-green-400 ml-2">(Uploaded)</span>
          ) : (
            <span className="text-yellow-400 ml-2">(Pending)</span>
          )}
        </div>
      ))}

      {/* Add Lesson Button */}
      {!isAdding ? (
        <button
          className="btn-primary mt-3"
          onClick={() => setIsAdding(true)}
        >
          + Add Lesson
        </button>
      ) : (
        <div className="mt-4 space-y-3">

          <input
            className="input"
            placeholder="Lesson title"
            value={newLessonTitle}
            onChange={(e) => setNewLessonTitle(e.target.value)}
          />

          <input
            type="file"
            accept="video/*"
            className="input"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />

          <div className="flex gap-3">
            <button
              className={`btn-primary ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={addLesson}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Lesson"}
            </button>

            <button
              className="btn-primary bg-gray-600"
              onClick={() => {
                setIsAdding(false);
                setNewLessonTitle("");
                setVideoFile(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
