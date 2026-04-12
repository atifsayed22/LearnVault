import { useAuth } from "../../context/AuthContext";
import DashboardCard from "../../components/instructor/DashboardCard";
import CoursesSummary from "../../components/instructor/CoursesSummary";
import { AlertCircle, CheckCircle2 } from "lucide-react";


export default function InstructorHome() {
  const { user } = useAuth();
  const isVerified = user?.isVerified;
  const documentStatus = user?.documentStatus;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-200 p-10">
      <h1 className="text-3xl font-bold mb-10">Instructor Dashboard</h1>

      {/* Verification Status Alert */}
      {!isVerified && (
        <div className="mb-8 p-6 bg-yellow-900/20 border border-yellow-700 rounded-lg flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-yellow-300 mb-2">
              Application Under Review
            </h2>
            <p className="text-yellow-200 mb-3">
              Your instructor profile is currently under review by our admin
              team. We'll verify your credentials and documents within 1-3
              business days.
            </p>
            <p className="text-yellow-200 text-sm">
              <strong>Status:</strong>{" "}
              {documentStatus === "pending" && "⏳ Pending Review"}
              {documentStatus === "rejected" && "❌ Application Rejected"}
              {documentStatus === "approved" && "✅ Approved (Refreshing...)"}
            </p>
            <p className="text-yellow-200 text-sm mt-2">
              You'll receive an email once your profile has been verified. Until
              then, you can't create courses.
            </p>
          </div>
        </div>
      )}

      {/* Verified Status Alert */}
     
      {/* Dashboard Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Create Course - Only if verified */}
        <DashboardCard
          title="Create New Course"
          description="Start building a new course complete with sections and lessons."
          link="/instructor/create-course"
          disabled={!isVerified}
          disabledReason={!isVerified ? "Pending verification" : null}
        />

        {/* My Courses - Only if verified */}
        <DashboardCard
          title="My Courses"
          description="View, edit or manage all the courses you have created."
          link="/instructor/my-courses"
          disabled={!isVerified}
          disabledReason={!isVerified ? "Pending verification" : null}
        />

        {/* Earnings - Only if verified */}
        <DashboardCard
          title="Earnings"
          description="Track your course sales and revenue performance."
          link="/instructor/earnings"
          disabled={!isVerified}
          disabledReason={!isVerified ? "Pending verification" : null}
        />

        {/* Profile Settings - Always available */}
        <DashboardCard
          title="Profile Settings"
          description="Update your instructor profile and preferences."
          link="/instructor/profile"
        />
      </div>

      {/* COURSES SUMMARY SECTION - Only if verified */}
      {isVerified && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Courses Summary</h2>
          <CoursesSummary />
        </div>
      )}
    </div>
  );
}
