import { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import SectionRow from "./SectionRow";

export default function EditSections({ course, refresh }) {
  const [sections, setSections] = useState([]);
  const [title, setTitle] = useState("");

  const load = async () => {
    try {
      const res = await api.get(`/course/edit-data/${course._id}`);
      setSections(res.data.course.sections || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load sections");
    }
  };

  useEffect(() => { load(); }, [course._id]);

  const add = async () => {
    if (!title.trim()) return toast.error("Section title required");
    try {
      const res = await api.post(`/sections/${course._id}`, { title });
      toast.success("Section added");
      setTitle("");
      load();
      if (refresh) refresh();
    } catch (err) {
      console.log(err);
      toast.error("Failed to add section");
    }
  };

  const handleDelete = async (sectionId) => {
    if (!confirm("Delete this section?")) return;
    try {
      await api.delete(`/sections/${sectionId}`);
      toast.success("Section deleted");
      load();
      if (refresh) refresh();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete section");
    }
  };

  return (
    <div className="bg-white/6 p-6 rounded-lg border border-white/10">
      <h2 className="text-xl font-semibold mb-4">Sections</h2>

      <div className="flex gap-3 mb-4">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} className="input" placeholder="New section title" />
        <button className="btn-primary" onClick={add}>Add Section</button>
      </div>

      <div className="space-y-3">
        {sections.map((s) => (
          <SectionRow key={s._id} section={s} onDeleted={() => handleDelete(s._id)} onUpdated={load} />
        ))}
      </div>
    </div>
  );
}
