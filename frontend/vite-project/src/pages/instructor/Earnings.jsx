import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import formatCurrency from "../../utils/formatCurrency";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Earnings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await api.get("/instructor/analytics");
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-gray-300">Loading analytics…</div>;
  }

  if (!data) {
    return <div className="p-10 text-gray-300">No analytics available.</div>;
  }

  return (
    <div className="p-10 space-y-10">

      {/* PAGE TITLE */}
      <div>
        <h1 className="text-3xl font-bold text-white">Instructor Analytics</h1>
        <p className="text-gray-400 mt-1">
          Track your course performance and earnings
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Earnings"
          // value={`₹${data.totals.totalEarnings}`}
          value={formatCurrency(data.totals.totalEarnings)}
          highlight="green"
        />
        <StatCard
          title="Total Enrollments"
          value={data.totals.totalEnrollments}
        />
        <StatCard
          title="Total Courses"
          value={data.totals.totalCourses}
        />
      </div>

      {/* TREND CHART */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Earnings & Enrollments (Last 30 days)
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data.earningsTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2933" />
            <XAxis dataKey="_id" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="enrollments"
              stroke="#a855f7"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* COURSE PERFORMANCE TABLE */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Course Performance
        </h2>

        {data.coursePerformance.length === 0 ? (
          <p className="text-gray-400">
            No enrollments yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3">Course</th>
                  <th>Enrollments</th>
                  <th>Earnings</th>
                </tr>
              </thead>
              <tbody>
                {data.coursePerformance.map((course) => (
                  <tr
                    key={course._id}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="py-3">{course.title}</td>
                    <td>{course.enrollments}</td>
                    <td className="text-green-400">
                      ₹{course.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

/* ---------------- SMALL COMPONENT ---------------- */

function StatCard({ title, value, highlight }) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-6">
      <p className="text-gray-400">{title}</p>
      <p
        className={`text-3xl font-bold mt-2 ${
          highlight === "green" ? "text-green-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
