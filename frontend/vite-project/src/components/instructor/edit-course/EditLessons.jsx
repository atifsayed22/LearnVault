import { useEffect, useState } from "react";
import api from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import LessonRow from "./LessonRow";

export default function EditLessons({ course, refresh }) {
  const [sections, setSections] = useState([]);

  const load = async () => {
    try {
      const res = await api.get(`/course/edit-data/${course._id}`);
      setSections(res.data.course.sections || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load lessons");
    }
  };

  useEffect(() => { load(); }, [course._id]);

  return (
    <div className="bg-white/6 p-6 rounded-lg border border-white/10">
      <h2 className="text-xl font-semibold mb-4">Lessons</h2>

      {sections.length === 0 && <p className="text-gray-300">No sections found.</p>}

      <div className="space-y-6">
        {sections.map((s) => (
          <div key={s._id} className="p-4 bg-white/5 rounded-md border border-white/10">
            <h3 className="font-semibold mb-3">{s.title}</h3>

            {/* lessons */}
            <div className="space-y-2">
              {s.lessons.map((lesson) => (
                <LessonRow key={lesson._id} lesson={lesson} refresh={load} />
              ))}
            </div>

            {/* add lesson inline */}
            <AddLessonForm sectionId={s._id} onAdded={load} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AddLessonForm({ sectionId, onAdded }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const createAndUpload = async () => {
    if (!title.trim()) return toast.error("Lesson title required");
    if (!file) return toast.error("Please select a video");

    try {
      setLoading(true);
      const res = await api.post(`/lessons/${sectionId}`, { title, type: "video" });
      const lesson = res.data.lesson;

      toast.success("Lesson created — uploading...");
      // presign
      const presign = await api.post("/videos/presign-upload", { lessonId: lesson._id, fileType: file.type, originalName: file.name });
      const { uploadUrl, fileKey } = presign.data;

      // upload to S3
      await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });

      // complete notify
      await api.post("/videos/complete", { lessonId: lesson._id, fileKey, originalName: file.name, size: file.size });

      toast.success("Video uploaded");
      setTitle(""); setFile(null);
      onAdded();
    } catch (err) {
      console.log(err);
      toast.error("Failed to create/upload lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 border-t pt-3">
      <input className="input mb-2" placeholder="Lesson title" value={title} onChange={(e)=>setTitle(e.target.value)} />
      <input type="file" accept="video/*" className="input mb-2" onChange={(e)=>setFile(e.target.files[0])} />
      <div>
        <button className="btn-primary mr-2" onClick={createAndUpload} disabled={loading}>{loading ? "Saving..." : "Add Lesson"}</button>
      </div>
    </div>
  );
}
