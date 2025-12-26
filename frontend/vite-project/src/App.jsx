import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";

/* ROUTE GUARDS */
import ProtectedRoute from "./routes/ProtectedRoutes";
import RoleRoute from "./routes/RoleRoute";

/* LAYOUTS */
import InstructorLayout from "./layout/InstructorLayout.jsx";
import StudentLayout from "./layout/StudentLayout.jsx";

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

const App = () => {
  return (
    <Router>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth/*" element={<Auth />} />

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
        {/* STUDENT ROUTES */}
        {/* ===================== */}
        <Route
        path="/student"
          element={
            <ProtectedRoute>
              <RoleRoute allowed={["student"]}>
                <StudentLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route path="courses" element={<BrowseCourses />} />
          <Route path="course/:courseId" element={<CourseDetails />} />
          <Route path="my-learning" element={<MyLearning />} />
        </Route>
          <Route path="student/course/:courseId/learn" element={
            <ProtectedRoute>
              <RoleRoute allowed={["student"]}>
                <CoursePlayer />
              </RoleRoute>
            </ProtectedRoute>
          } />

      </Routes>
    </Router>
  );
};

export default App;
 