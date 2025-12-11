import { useState } from "react";
import api from "../../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function LessonRow({ lesson, refresh }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [showVideo, setShowVideo] = useState(false);
  const [playbackUrl, setPlaybackUrl] = useState(null);

  const save = async () => {
    if (!title.trim()) return toast.error("Title required");
    try {
      await api.put(`/lessons/${lesson._id}`, { title });
      toast.success("Lesson title updated");
      setEditing(false);
      if (refresh) refresh();
    } catch (err) {
      console.log(err);
      toast.error("Failed to update lesson");
    }
  };

  const remove = async () => {
    if (!confirm("Delete this lesson?")) return;
    try {
      await api.delete(`/lessons/${lesson._id}`);
      toast.success("Lesson deleted");
      if (refresh) refresh();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete lesson");
    }
  };

  const togglePreview = async () => {
    if (!showVideo) {
      try {
        const res = await api.get(`/videos/get-playback-url/${lesson._id}`);
        setPlaybackUrl(res.data.playbackUrl);
        setShowVideo(true);
      } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.message || "Cannot load playback URL");
      }
    } else {
      setShowVideo(false);
      setPlaybackUrl(null);
    }
  };

  return (
    <div className="p-2 bg-white/4 rounded-md border border-white/10 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-medium">{lesson.title}</div>
          {lesson.video?.status === "uploaded" ? (
            <span className="text-green-400 text-sm">(Uploaded)</span>
          ) : (
            <span className="text-yellow-400 text-sm">(Pending)</span>
          )}
        </div>

        <div className="flex gap-2">
          {editing ? (
            <>
              <button className="btn-primary" onClick={save}>Save</button>
              <button className="btn-primary bg-gray-700" onClick={() => { setEditing(false); setTitle(lesson.title); }}>Cancel</button>
            </>
          ) : (
            <>
              <button className="btn-primary" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn-primary" onClick={togglePreview}>{showVideo ? "Hide" : "Preview"}</button>
              <button className="btn-primary bg-red-600" onClick={remove}>Delete</button>
            </>
          )}
        </div>
      </div>

      {editing && (
        <input className="input" value={title} onChange={(e)=>setTitle(e.target.value)} />
      )}

      {showVideo && playbackUrl && (
        <div className="mt-2">
          <video controls className="w-full rounded-md">
            <source src={playbackUrl} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
