import { useState } from "react";
import api from "../../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function SectionRow({ section, onDeleted, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(section.title);

  const save = async () => {
    if (!title.trim()) return toast.error("Title required");
    try {
      // try update endpoint — if missing add one in backend
      await api.put(`/sections/${section._id}`, { title });
      toast.success("Section updated");
      setEditing(false);
      if (onUpdated) onUpdated();
    } catch (err) {
      console.log(err);
      toast.error("Failed to update section");
    }
  };

  return (
    <div className="p-3 bg-white/5 rounded-md border border-white/10 flex items-center justify-between">
      <div>
        {editing ? (
          <input className="input" value={title} onChange={(e)=>setTitle(e.target.value)} />
        ) : (
          <div className="font-semibold">{section.title}</div>
        )}
      </div>

      <div className="flex gap-2">
        {editing ? (
          <>
            <button className="btn-primary" onClick={save}>Save</button>
            <button className="btn-primary bg-gray-700" onClick={()=>{ setEditing(false); setTitle(section.title); }}>Cancel</button>
          </>
        ) : (
          <>
            <button className="btn-primary" onClick={()=>setEditing(true)}>Edit</button>
            <button className="btn-primary bg-red-600" onClick={onDeleted}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
