import { useEffect, useState } from "react";
import api from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import SectionBox from "./SectionBox";

export default function StepLessons({ next, course }) {
  const [sections, setSections] = useState([]);

  const loadSections = async () => {
    try {
      const res = await api.get(`/course/${course._id}/curriculum`);
      setSections(res.data.course.sections || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load curriculum");
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  return (
    <div className="bg-white/10 p-8 rounded-xl border border-white/20 backdrop-blur-xl">

      <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>

      {sections.length === 0 && (
        <p className="text-gray-300">No sections added yet.</p>
      )}

      <div className="space-y-6">
        {sections.map((sec) => (
          <SectionBox key={sec._id} section={sec} refresh={loadSections} />
        ))}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end mt-10">
        <button className="btn-primary" onClick={next}>
          Continue
        </button>
      </div>
    </div>
  );
}
