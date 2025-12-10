import { useState } from "react";
import api from "../../../utils/axiosInstance.js";
import toast from "react-hot-toast";

export default function StepSections({ next, prev, course }) {
  const [sections, setSections] = useState(course.sections || []);
  const [title, setTitle] = useState("");

  const addSection = async () => {
    const res = await api.post(`/sections/${course._id}`, {
      courseId: course._id,
      title
    });

    setSections([...sections, res.data.section]);
    setTitle("");
  };

  return (
    <div className="bg-white/10 p-8 rounded-xl border border-white/10 backdrop-blur-xl">

      <h2 className="text-2xl font-semibold mb-4">Course Sections</h2>

      <div className="flex gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Section title"
          className="input"
        />
        <button className="btn-primary" onClick={addSection}>Add</button>
      </div>

      <ul className="mt-6 space-y-2">
        {sections.map((s) => (
          <li key={s._id} className="bg-white/10 p-3 rounded-xl">
            {s.title}
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-10">
      
        <button className="btn-primary" onClick={next}>Continue</button>
      </div>
    </div>
  );
}
