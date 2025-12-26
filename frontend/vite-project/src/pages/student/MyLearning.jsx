import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function MyLearning() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await api.get("/enrollment/my-courses");
      setCourses(res.data.courses);
    } catch (err) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-white">Loading...</div>;
  }

  return (
    <div className="p-6 md:p-10">

      <h1 className="text-3xl font-bold mb-8">My Learning</h1>

      {courses.length === 0 && (
        <p className="text-gray-400">
          You haven’t enrolled in any courses yet.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div
            key={course._id}
            className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-purple-500 transition"
          >
            {/* Thumbnail placeholder */}
            <div className="h-40 bg-black/30 rounded-lg mb-4 flex items-center justify-center text-gray-500">
              Course Preview
            </div>

            <h2 className="text-lg font-semibold mb-1">
              {course.title}
            </h2>

            <p className="text-sm text-gray-400 mb-4">
              {course.instructor?.name}
            </p>

            {/* Progress placeholder */}
            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-1">
                Progress
              </div>
              <div className="w-full bg-white/10 h-2 rounded">
                <div className="bg-purple-500 h-2 rounded w-[0%]" />
              </div>
            </div>

            <button
              className="btn-primary w-full"
              onClick={() =>
                navigate(`/student/course/${course._id}/learn`)
              }
            >
              Continue Learning
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
