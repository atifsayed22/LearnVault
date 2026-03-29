import { useForm } from "react-hook-form";
import api from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import { COURSE_CATEGORIES } from "../../../constants/courseCategories";

export default function StepBasicInfo({ next, setCourse }) {

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/course/create-course", data);

      toast.success("Course created successfully!");

      setCourse(res.data.course);   // set course for next steps

      next();  // Go to Step 2

    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating course");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white/10 p-8 rounded-xl border border-white/10 backdrop-blur-xl space-y-5"
    >
      <h2 className="text-2xl font-semibold mb-4">Course Basic Information</h2>

      <input
        placeholder="Course Title"
        className="input"
        {...register("title", { required: true })}
      />

      <input
        placeholder="Subtitle (optional)"
        className="input"
        {...register("subtitle")}
      />

      <textarea
        placeholder="Description"
        className="input"
        {...register("description", { required: true })}
      />

      <select className="input" defaultValue="" {...register("category", { required: true })}>
        <option value="" disabled>
          Select Category
        </option>
        {COURSE_CATEGORIES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <input
        placeholder="Thumbnail URL"
        className="input"
        {...register("thumbnail")}
      />

      <input
        type="number"
        placeholder="Price"
        className="input"
        {...register("price", { required: true })}
      />

      <button className="btn-primary">
        Save & Continue
      </button>
    </form>
  );
}
