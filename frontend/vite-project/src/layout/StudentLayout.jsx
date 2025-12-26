import { Outlet } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar.jsx";

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed Navbar */}
      <StudentNavbar />

      {/* Page Content */}
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}
