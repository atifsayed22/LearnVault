import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Icons (lucide-react recommended)
import { LayoutDashboard, BookOpen, PlusCircle, Wallet, User, LogOut, Menu } from "lucide-react";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { label: "Dashboard", path: "/instructor/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Create Course", path: "/instructor/create-course", icon: <PlusCircle size={18} /> },
    { label: "My Courses", path: "/instructor/my-courses", icon: <BookOpen size={18} /> },
    { label: "Earnings", path: "/instructor/earnings", icon: <Wallet size={18} /> },
    { label: "Profile", path: "/instructor/profile", icon: <User size={18} /> },
  ];

  return (
    <aside
      className={`
        h-screen border-r border-white/10 bg-white/5 backdrop-blur-xl
        transition-all duration-300 flex flex-col
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* TOP SECTION */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <h1 className="text-lg font-semibold text-purple-300">
            Instructor
          </h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
              flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
              ${collapsed ? "justify-center" : ""}
              ${isActive ? "bg-purple-600 text-white" : "text-gray-300 hover:bg-white/10"}
            `
            }
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT SECTION */}
      <div className="p-3 border-t border-white/10">
        <button
          className={`
            flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm transition
            bg-red-600/80 text-white hover:bg-red-600
            ${collapsed ? "justify-center" : ""}
          `}
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
