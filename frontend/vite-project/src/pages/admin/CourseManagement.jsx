import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Search, Star } from "lucide-react";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/courses");
      setCourses(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
        <p className="text-gray-600 mt-2">View all courses on the platform</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          <p>{error}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            <p>No courses found</p>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Image */}
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
              )}

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {course.title}
                </h3>

                {/* Instructor */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500">Instructor</p>
                  <p className="text-sm font-medium text-gray-700">
                    {course.instructor?.name || "Unknown"}
                  </p>
                </div>

                {/* Category & Level */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm font-medium text-gray-700">{course.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Level</p>
                    <p className="text-sm font-medium text-gray-700 capitalize">
                      {course.level}
                    </p>
                  </div>
                </div>

                {/* Price & Rating */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="text-sm font-bold text-green-600">
                      ${course.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {course.rating || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      course.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-600">
          <span className="font-bold text-lg">{filteredCourses.length}</span> course(s) found
        </p>
      </div>
    </div>
  );
};

export default CourseManagement;
