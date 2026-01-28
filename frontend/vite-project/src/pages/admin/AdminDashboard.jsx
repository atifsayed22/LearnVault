import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Users, BookOpen, CheckCircle, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/stats");
      setStats(response.data.stats);
      setError(null);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err.response?.data?.message || "Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        <p className="font-semibold">Error loading dashboard</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats?.totalUsers || 0}
          color="#3B82F6"
        />
        <StatCard
          icon={Users}
          title="Total Students"
          value={stats?.totalStudents || 0}
          color="#10B981"
        />
        <StatCard
          icon={Users}
          title="Total Instructors"
          value={stats?.totalInstructors || 0}
          color="#F59E0B"
        />
        <StatCard
          icon={CheckCircle}
          title="Verified Instructors"
          value={stats?.verifiedInstructors || 0}
          color="#8B5CF6"
        />
        <StatCard
          icon={AlertCircle}
          title="Pending Applications"
          value={stats?.pendingInstructors || 0}
          color="#EF4444"
        />
        <StatCard
          icon={BookOpen}
          title="Total Courses"
          value={stats?.totalCourses || 0}
          color="#06B6D4"
        />
        <StatCard
          icon={BookOpen}
          title="Total Enrollments"
          value={stats?.totalEnrollments || 0}
          color="#EC4899"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/pending-applications"
            className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition text-center"
          >
            <AlertCircle className="text-red-600 mx-auto mb-2" size={24} />
            <p className="font-semibold text-red-600">
              {stats?.pendingInstructors || 0} Pending Applications
            </p>
          </a>
          <a
            href="/admin/instructors"
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition text-center"
          >
            <Users className="text-blue-600 mx-auto mb-2" size={24} />
            <p className="font-semibold text-blue-600">Manage Instructors</p>
          </a>
          <a
            href="/admin/courses"
            className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition text-center"
          >
            <BookOpen className="text-purple-600 mx-auto mb-2" size={24} />
            <p className="font-semibold text-purple-600">View All Courses</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
