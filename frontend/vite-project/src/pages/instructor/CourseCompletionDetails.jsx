import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";
import { Users, BookOpen, TrendingUp, AlertCircle } from "lucide-react";

export default function CourseCompletionDetails() {
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompletionStats();
  }, [courseId]);

  const loadCompletionStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/instructor/course/${courseId}/completion-stats`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load completion stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-200 p-10">
        <p>Loading completion details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-200 p-10">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-200 p-10">
        <p>No data available</p>
      </div>
    );
  }

  const getProgressColor = (rate) => {
    if (rate >= 80) return "from-green-500 to-green-400";
    if (rate >= 50) return "from-yellow-500 to-yellow-400";
    return "from-red-500 to-red-400";
  };

  const getProgressBgColor = (rate) => {
    if (rate >= 80) return "bg-green-500";
    if (rate >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-200 p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{data.courseTitle}</h1>
          <p className="text-gray-400">Student Completion Analytics</p>
        </div>

        {/* KEY METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            icon={<BookOpen className="w-6 h-6" />}
            label="Total Lessons"
            value={data.totalLessons}
            color="blue"
          />
          <MetricCard
            icon={<Users className="w-6 h-6" />}
            label="Enrolled Students"
            value={data.totalEnrolledStudents}
            color="purple"
          />
          <MetricCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Overall Completion Rate"
            value={`${data.overallCompletionRate}%`}
            color="green"
          />
        </div>

        {/* STUDENT COMPLETION TABLE */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Student Progress
          </h2>

          {data.studentCompletionDetails.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No students enrolled yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4">Completion Rate</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.studentCompletionDetails.map((student) => (
                    <tr
                      key={student.studentId}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-white">
                          {student.studentName}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-gray-400">
                        {student.studentEmail}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-300">
                            {student.completedLessons}/{student.totalLessons}
                          </span>
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${getProgressColor(
                                student.completionRate
                              )} h-2 rounded-full transition-all`}
                              style={{
                                width: `${student.completionRate}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${getProgressBgColor(
                            student.completionRate
                          ) === "bg-green-500"
                            ? "text-green-400"
                            : getProgressBgColor(
                                student.completionRate
                              ) === "bg-yellow-500"
                            ? "text-yellow-400"
                            : "text-red-400"
                          }`}>
                            {student.completionRate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            student.completionRate === 100
                              ? "bg-green-900/30 text-green-400 border border-green-700"
                              : student.completionRate > 0
                              ? "bg-yellow-900/30 text-yellow-400 border border-yellow-700"
                              : "bg-gray-900/30 text-gray-400 border border-gray-700"
                          }`}
                        >
                          {student.completionRate === 100
                            ? "✓ Completed"
                            : student.completionRate > 0
                            ? "⏳ In Progress"
                            : "○ Not Started"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* COMPLETION BREAKDOWN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatBox
            title="Completed"
            value={data.studentCompletionDetails.filter(
              (s) => s.completionRate === 100
            ).length}
            total={data.totalEnrolledStudents}
            color="green"
          />
          <StatBox
            title="In Progress"
            value={data.studentCompletionDetails.filter(
              (s) => s.completionRate > 0 && s.completionRate < 100
            ).length}
            total={data.totalEnrolledStudents}
            color="yellow"
          />
          <StatBox
            title="Not Started"
            value={data.studentCompletionDetails.filter(
              (s) => s.completionRate === 0
            ).length}
            total={data.totalEnrolledStudents}
            color="gray"
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color }) {
  const colorMap = {
    blue: "from-blue-600 to-blue-400",
    purple: "from-purple-600 to-purple-400",
    green: "from-green-600 to-green-400",
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} bg-opacity-10 border border-white/20 rounded-xl p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className="text-white/40">{icon}</div>
      </div>
    </div>
  );
}

function StatBox({ title, value, total, color }) {
  const colorMap = {
    green: {
      bg: "bg-green-900/20",
      border: "border-green-700",
      text: "text-green-400",
    },
    yellow: {
      bg: "bg-yellow-900/20",
      border: "border-yellow-700",
      text: "text-yellow-400",
    },
    gray: {
      bg: "bg-gray-900/20",
      border: "border-gray-700",
      text: "text-gray-400",
    },
  };

  const style = colorMap[color];
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

  return (
    <div
      className={`${style.bg} border ${style.border} rounded-xl p-6`}
    >
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <p className={`text-3xl font-bold ${style.text} mb-2`}>
        {value}/{total}
      </p>
      <p className={`text-sm ${style.text}`}>{percentage}%</p>
    </div>
  );
}
