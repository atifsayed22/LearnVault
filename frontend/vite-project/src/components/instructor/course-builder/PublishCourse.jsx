import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function PublishCourse({ course }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!course) return <p className="text-white">No course data found.</p>;

  const publishCourse = async () => {
    try {
      setLoading(true);

      await api.patch(`/course/publish-course/${course._id}`);

      toast.success("Course published successfully!");

      // Redirect to instructor dashboard after publishing
      navigate("/instructor/dashboard");

    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to publish course");
    } finally {
      setLoading(false);
    }
  };

  const goToEditPage = () => {
    navigate(`/instructor/course/${course._id}/edit`);
  };

  return (
    <div className="bg-white/10 p-8 rounded-xl border border-white/20 backdrop-blur-xl">

      <h2 className="text-3xl font-bold mb-6">Publish Course</h2>

      <p className="text-lg text-gray-300 mb-6">
        Your course <span className="font-semibold text-white">{course.title}</span> is ready.
        You can publish it now or continue editing later.
      </p>

      <div className="space-y-4">

        {/* Publish Button */}
        <button
          onClick={publishCourse}
          disabled={loading}
          className={`btn-primary w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Publishing..." : "Publish Now"}
        </button>

        {/* Edit Later */}
        <button
          onClick={goToEditPage}
          className="btn-primary bg-gray-700 hover:bg-gray-600 w-full"
        >
          Edit Later
        </button>

      </div>
    </div>
  );
}
