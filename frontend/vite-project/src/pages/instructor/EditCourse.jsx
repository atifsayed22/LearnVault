import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../utils/axiosInstance.js";
import toast from "react-hot-toast";

import EditBasicInfo from "../../components/instructor/edit-course/EditBasicInfo";
import EditSections from "../../components/instructor/edit-course/EditSection";
import EditLessons from "../../components/instructor/edit-course/EditLessons";
import EditPreview from "../../components/instructor/edit-course/EditPreview";

export default function EditCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");

  const loadCourse = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/course/edit-data/${courseId}`);
      setCourse(res.data.course);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
    // eslint-disable-next-line
  }, [courseId]);

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (!course) return <div className="p-8 text-red-400">Course not found or you don't have access.</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Course: {course.title}</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 items-center mb-6">
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "basic" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300"}`}
          onClick={() => setActiveTab("basic")}
        >
          Basic Info
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "sections" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300"}`}
          onClick={() => setActiveTab("sections")}
        >
          Sections
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "lessons" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300"}`}
          onClick={() => setActiveTab("lessons")}
        >
          Lessons
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "preview" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300"}`}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </button>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "basic" && (
          <EditBasicInfo course={course} onUpdated={loadCourse} />
        )}
        {activeTab === "sections" && (
          <EditSections course={course} refresh={loadCourse} />
        )}
        {activeTab === "lessons" && (
          <EditLessons course={course} refresh={loadCourse} />
        )}
        {activeTab === "preview" && (
          <EditPreview course={course} onPublished={loadCourse} />
        )}
      </div>
    </div>
  );
}
