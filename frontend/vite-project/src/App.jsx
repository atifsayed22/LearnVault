import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Landing from "./pages/Landing/Landing.jsx";
import Auth from "./pages/Auth.jsx";
import InsDashboard from "./pages/instructor/InsDashboard.jsx";
import StuDashboard from "./pages/student/StuDashboard.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";

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
          path="/instructor/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowed={["instructor"]}>
                <InsDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
               <RoleRoute allowed={["student"]}>
                <StuDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
