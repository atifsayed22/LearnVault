import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function BrowseCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  const loadCourses = async () => {
    try {
      const res = await api.get("/course");
      setCourses(res.data.courses);
    } catch (err) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // FILTERS APPLY
  const filteredCourses = courses
    .filter((c) =>
      category ? c.category?.toLowerCase() === category.toLowerCase() : true
    )
    .filter((c) =>
      priceFilter === "free" ? c.price === 0 :
      priceFilter === "paid" ? c.price > 0 : true
    )
    .sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return 0;
    });

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <div className="p-10 max-w-7xl mx-auto">

        {/* HEADING */}
        <h1 className="text-3xl font-bold mb-6">Browse Courses</h1>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 mb-8">

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white/10 border border-white/20 p-2 rounded-lg"
          >
            <option value="">All Categories</option>
            <option value="IT">IT</option>
            <option value="Programming">Programming</option>
            <option value="Business">Business</option>
          </select>

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="bg-white/10 border border-white/20 p-2 rounded-lg"
          >
            <option value="">All Prices</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white/10 border border-white/20 p-2 rounded-lg"
          >
            <option value="">Sort</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

        </div>

        {/* COURSE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Link
              to={`/course/${course._id}`}
              key={course._id}
              className="bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/20 transition"
            >
              <div className="h-40 bg-black/20 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400">Thumbnail</span>
              </div>

              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>

              <p className="text-gray-400 text-sm mb-2">
                {course.description.substring(0, 80)}...
              </p>

              <p className="text-purple-300 font-semibold">₹{course.price}</p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
