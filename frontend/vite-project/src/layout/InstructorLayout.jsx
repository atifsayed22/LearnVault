import Sidebar from "../components/instructor/Sidebar";
import { Outlet } from "react-router-dom";

export default function InstructorLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
