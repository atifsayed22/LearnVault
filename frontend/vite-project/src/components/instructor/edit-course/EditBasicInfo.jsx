import { useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function EditBasicInfo({ course, onUpdated }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: course.title || "",
      subtitle: course.subtitle || "",
      description: course.description || "",
      category: course.category || "",
      thumbnail: course.thumbnail || "",
      price: course.price || 0,
    },
  });

  useEffect(() => {
    reset({
      title: course.title || "",
      subtitle: course.subtitle || "",
      description: course.description || "",
      category: course.category || "",
      thumbnail: course.thumbnail || "",
      price: course.price || 0,
    });
  }, [course, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await api.put(`/course/update-course/${course._id}`, data);
      toast.success("Course info updated");
      onUpdated();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white/6 p-6 rounded-lg border border-white/10">
      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

      <input {...register("title", { required: true })} className="input mb-3" placeholder="Course title" />
      <input {...register("subtitle")} className="input mb-3" placeholder="Subtitle (optional)" />
      <textarea {...register("description", { required: true })} className="input mb-3" placeholder="Description" />
      <input {...register("category", { required: true })} className="input mb-3" placeholder="Category" />
      <input {...register("thumbnail")} className="input mb-3" placeholder="Thumbnail URL" />
      <input type="number" {...register("price", { valueAsNumber: true })} className="input mb-3" placeholder="Price" />

      {/* Thumbnail upload can be implemented here later */}
      <div className="flex gap-3">
        <button className="btn-primary">Save Changes</button>
        <button type="button" className="btn-primary bg-gray-700" onClick={() => { reset(); toast("Reverted to last loaded"); }}>
          Reset
        </button>
      </div>
    </form>
  );
}
