import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance.js";
import toast from "react-hot-toast";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const limit = 6;

  useEffect(() => {
    loadCourses(page);
  }, [page]);
  const deleteCourse = async (id) => {
  if (!confirm("Are you sure you want to delete this course?")) return;

  try {
   let res = await api.delete(`/course/delete-course/${id}`);
    toast.success("Course deleted");
    loadCourses();
  } catch (err) {
    console.log(err?.response?.data);
    toast.error(err?.response?.data?.message || "Failed to delete course  ");
  }
};

  const loadCourses = async (pageNumber) => {
    try {
      setLoading(true);

      const res = await api.get(
        `/course/instructor/my-courses?page=${pageNumber}&limit=${limit}`
      );
      
      setCourses(res.data.courses);
      setPages(res.data.pages);
    } catch (err) {
      console.log(err);
      alert("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>

      {courses.length === 0 && (
        <p className="text-gray-300">No courses found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white/10 border border-white/20 rounded-xl p-6"
          >
            <div className="h-40 bg-white/5 rounded-lg mb-4 flex items-center justify-center">
             
             <img src={`${course.thumbnail}`} />
            </div>

            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>

            <p className="mb-3">
              {course.published ? (
                <span className="text-green-400 font-semibold">Published</span>
              ) : (
                <span className="text-yellow-400 font-semibold">Draft</span>
              )}
            </p>
            <p className="mb-3">₹{course.price}</p>

            <div className="flex gap-3">
              <button
                className="btn-primary"
                onClick={() =>
                  (window.location.href = `/instructor/course/${course._id}/edit`)
                }
              >
                Edit
              </button>

              <button
                className="btn-danger "
                onClick={() => deleteCourse(course._id)}
              >
                Delete
              </button>

              {course.published && (
                <button
                  className="btn-primary bg-gray-700"
                  onClick={() =>
                    (window.location.href = `/course/${course._id}`)
                  }
                >
                  View
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-md disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-gray-300">
          Page {page} of {pages}
        </span>

        <button
          disabled={page === pages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-md disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}