import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axiosInstance";
import formatCurrency from "../../utils/formatCurrency";
import { TrendingUp, Users, BarChart3, Target } from "lucide-react";

export default function CoursesSummary() {
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
    return <div className="p-6 text-gray-300">Loading courses summary…</div>;
  }

  if (!data || data.coursePerformance.length === 0) {
    return (
      <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
        <p className="text-gray-400">No courses available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox
          icon={<BarChart3 className="w-5 h-5" />}
          label="Total Courses"
          value={data.totals.totalCourses}
          color="from-blue-600 to-blue-400"
        />
        <StatBox
          icon={<Users className="w-5 h-5" />}
          label="Total Enrollments"
          value={data.totals.totalEnrollments}
          color="from-purple-600 to-purple-400"
        />
        <StatBox
          icon={<TrendingUp className="w-5 h-5" />}
          label="Total Earnings"
          value={formatCurrency(data.totals.totalEarnings)}
          color="from-green-600 to-green-400"
        />
        <StatBox
          icon={<Target className="w-5 h-5" />}
          label="Completion Rate"
          value={`${data.totals.overallCompletionRate}%`}
          color="from-orange-600 to-orange-400"
        />
      </div>

      {/* COURSES TABLE */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Performing Courses</h3>

        {data.coursePerformance.length === 0 ? (
          <p className="text-gray-400 text-center py-6">No course data available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-2">Course</th>
                  <th className="py-3 px-2">Students</th>
                  <th className="py-3 px-2">Completion</th>
                  <th className="py-3 px-2">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {data.coursePerformance.map((course) => (
                  <tr
                    key={course._id}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="py-3 px-2">
                      <Link
                        to={`/instructor/course/${course._id}/completion-details`}
                        className="font-medium text-white hover:text-blue-400 transition truncate max-w-xs block"
                      >
                        {course.title}
                      </Link>
                    </td>
                    <td className="py-3 px-2 text-gray-300">
                      {course.enrollments}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(course.completionRate, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-blue-400 font-semibold text-xs min-w-8">
                          {course.completionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-green-400 font-semibold">
                      {formatCurrency(course.revenue)}
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

function StatBox({ icon, label, value, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} bg-opacity-10 border border-white/10 rounded-lg p-4 hover:border-white/20 transition`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`text-${color.split(" ")[1]} opacity-70`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
