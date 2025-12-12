import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Landing from "./pages/Landing/Landing.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import InstructorHome from "./pages/instructor/InsDashboard.jsx";
import StuDashboard from "./pages/student/StuDashboard.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";
import InstructorLayout from "./layout/InstructorLayout.jsx";
import CreateCourse from "./pages/instructor/CreateCourse.jsx";
import MyCourses from "./pages/instructor/MyCourses.jsx";
import Earnings from "./pages/instructor/Earnings.jsx";
import Profile from "./pages/instructor/Profile.jsx";
import EditCourse from "./pages/instructor/EditCourse.jsx";
import BrowseCourses from "./pages/student/BrowseCourse.jsx";
import CourseDetails from "./pages/student/CourseDetail.jsx";
import CoursePlayer from "./pages/student/CoursePlayer.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="auth/*" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

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
          <Route path="dashboard" element={<InstructorHome />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="course/:courseId/edit" element={<EditCourse />} />
        </Route>
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowed={["student"]}>
                {/* <StuDashboard /> */}
                <BrowseCourses />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <ProtectedRoute>
              <RoleRoute allowed={["student"]}>
                <CourseDetails />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:courseId/learn"
          element={
            <ProtectedRoute>
              <RoleRoute allowed={["student"]}>
                <CoursePlayer />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
