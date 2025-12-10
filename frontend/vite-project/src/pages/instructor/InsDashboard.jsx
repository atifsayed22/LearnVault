import DashboardCard from "../../components/instructor/DashboardCard";

export default function InstructorHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-200 p-10">

      <h1 className="text-3xl font-bold mb-10">Instructor Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">

        <DashboardCard
          title="Create New Course"
          description="Start building a new course complete with sections and lessons."
          link="/instructor/create-course"
        />

        <DashboardCard
          title="My Courses"
          description="View, edit or manage all the courses you have created."
          link="/instructor/my-courses"
        />

        <DashboardCard
          title="Earnings"
          description="Track your course sales and revenue performance."
          link="/instructor/earnings"
        />

        <DashboardCard
          title="Profile Settings"
          description="Update your instructor profile and preferences."
          link="/instructor/profile"
        />
      </div>
    </div>
  );
}
