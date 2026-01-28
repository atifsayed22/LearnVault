import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import InstructorRegister from "./pages/Auth/InstructorRegister.jsx";
import Dashboard from "./pages/Dashboard.jsx";

/* ROUTE GUARDS */
import ProtectedRoute from "./routes/ProtectedRoutes";
import RoleRoute from "./routes/RoleRoute";

/* LAYOUTS */
import InstructorLayout from "./layout/InstructorLayout.jsx";
import StudentLayout from "./layout/StudentLayout.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";

/* INSTRUCTOR PAGES */
import InstructorHome from "./pages/instructor/InsDashboard.jsx";
import CreateCourse from "./pages/instructor/CreateCourse.jsx";
import MyCourses from "./pages/instructor/MyCourses.jsx";
import Earnings from "./pages/instructor/Earnings.jsx";
import Profile from "./pages/instructor/Profile.jsx";
import EditCourse from "./pages/instructor/EditCourse.jsx";

/* STUDENT PAGES */
import BrowseCourses from "./pages/student/BrowseCourse.jsx";
import CourseDetails from "./pages/student/CourseDetail.jsx";
import CoursePlayer from "./pages/student/CoursePlayer.jsx";
import MyLearning from "./pages/student/MyLearning.jsx";

/* ADMIN PAGES */
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import InstructorManagement from "./pages/admin/InstructorManagement.jsx";
import StudentManagement from "./pages/admin/StudentManagement.jsx";
import CourseManagement from "./pages/admin/CourseManagement.jsx";
import PendingApplications from "./pages/admin/PendingApplications.jsx";

const App = () => {
  return (
    <Router>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/auth/instructor-register" element={<InstructorRegister />} />

        {/* OPTIONAL DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ===================== */}
        {/* INSTRUCTOR ROUTES */}
        {/* ===================== */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute>
              <RoleRoute allowed={["instructor"]}>
                <InstructorLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route path='home' element={<InstructorHome />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="course/:courseId/edit" element={<EditCourse />} />
        </Route>

        {/* ===================== */}
        {/* ADMIN ROUTES */}
        {/* ===================== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowed={["admin"]}>
                <AdminLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="instructors" element={<InstructorManagement />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="pending-applications" element={<PendingApplications />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;
 