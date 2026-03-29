import { memo, useEffect, useState } from "react";
import api from "../../utils/axiosInstance";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { COURSE_CATEGORIES } from "../../constants/courseCategories";

const PAGE_LIMIT = 9;

const CoursesSection = memo(function CoursesSection({
  loading,
  courses,
  pagination,
  onPageChange,
}) {
  return (
    <>
      {/* COURSE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading
          ? Array.from({ length: PAGE_LIMIT }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="rounded-xl border border-white/10 p-4 animate-pulse"
              >
                <div className="h-40 bg-white/10 rounded-lg mb-4" />
                <div className="h-5 bg-white/10 rounded w-3/4 mb-3" />
                <div className="h-4 bg-white/10 rounded w-full mb-2" />
                <div className="h-4 bg-white/10 rounded w-5/6 mb-4" />
                <div className="h-5 bg-white/10 rounded w-1/4" />
              </div>
            ))
          : courses.map((course) => (
              <Link
                to={`/student/course/${course._id}`}
                key={course._id}
                className="bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/20 transition"
              >
                <div className="h-40 bg-black/20 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>

                <p className="text-gray-400 text-sm mb-2">
                  {course.description.substring(0, 80)}...
                </p>

                <p className="text-purple-300 font-semibold">₹{course.price}</p>
              </Link>
            ))}
      </div>

      {!loading && courses.length === 0 && (
        <p className="text-gray-400 text-center mt-8">No courses found.</p>
      )}

      {!loading && courses.length > 0 && (
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <span className="text-sm text-gray-300 mr-2">
            Page {pagination.page} of {pagination.pages}
          </span>

          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            className="px-4 py-2 rounded-lg border border-white/20 disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`px-3 py-2 rounded-lg border ${
                pagination.page === p
                  ? "bg-white text-black border-white"
                  : "border-white/20"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            disabled={pagination.page >= pagination.pages}
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.pages))}
            className="px-4 py-2 rounded-lg border border-white/20 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
});

export default function BrowseCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: PAGE_LIMIT,
    pages: 1,
  });

  // filters
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest");
  const [priceFilter, setPriceFilter] = useState("");
  const [search, setSearch] = useState("");

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/course", {
        params: {
          page,
          limit: PAGE_LIMIT,
          category: category || undefined,
          priceType: priceFilter || undefined,
          search: search.trim() || undefined,
          sort,
        },
      });
      const safeCourses = (res.data.courses || []).filter(
        (c) => c?._id && c?.instructor,
      );
      setCourses(safeCourses);
      setPagination(
        res.data.pagination || {
          total: safeCourses.length,
          page,
          limit: PAGE_LIMIT,
          pages: 1,
        },
      );
    } catch (err) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [page, category, sort, priceFilter, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handlePriceChange = (event) => {
    setPriceFilter(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="p-10 max-w-7xl mx-auto">
        {/* HEADING */}
        <h1 className="text-3xl font-bold mb-6">Browse Courses</h1>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search courses..."
            className="bg-black/100 border border-white/20 p-2 rounded-lg min-w-[220px]"
          />

          <select
            value={category}
            onChange={handleCategoryChange}
            className="bg-black/100 border border-white/20 p-2 rounded-lg"
          >
            <option value="">All Categories</option>
            {COURSE_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={priceFilter}
            onChange={handlePriceChange}
            className="bg-black/100 border border-white/20 p-2 rounded-lg"
          >
            <option value="">All Prices</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>

          <select
            value={sort}
            onChange={handleSortChange}
            className="bg-black/100 border border-white/20 p-2 rounded-lg"
          >
            <option value="latest">Latest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <CoursesSection
          loading={loading}
          courses={courses}
          pagination={pagination}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
