import { useState } from "react";
import api from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function EditPreview({ course, onPublished }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const publish = async () => {
    try {
      setLoading(true);
      await api.patch(`/course/publish-course/${course._id}`);
      toast.success("Course published");
      if (onPublished) onPublished();
      navigate("/instructor/dashboard");
    } catch (err) {
      console.log(err);
      toast.error("Failed to publish");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/6 p-6 rounded-lg border border-white/10">
      <h2 className="text-xl font-semibold mb-4">Preview & Publish</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <p className="text-gray-300">{course.description}</p>
      </div>

      <div className="mb-4">
        <strong>Sections:</strong>
        <ul className="list-disc ml-6">
          {course.sections?.map((s) => <li key={s._id}>{s.title} ({s.lessons?.length || 0} lessons)</li>)}
        </ul>
      </div>

      <div className="flex gap-3">
        <button className="btn-primary" onClick={publish} disabled={loading}>
          {loading ? "Publishing..." : "Publish Course"}
        </button>
      </div>
    </div>
  );
}
