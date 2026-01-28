import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/", icon: LayoutDashboard },
    { name: "Instructors", path: "/admin/instructors", icon: Users },
    { name: "Students", path: "/admin/students", icon: Users },
    { name: "Courses", path: "/admin/courses", icon: BookOpen },
    { name: "Pending Applications", path: "/admin/pending-applications", icon: AlertCircle },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:static md:translate-x-0 w-64 h-full bg-gray-900 text-white transition-transform duration-300 z-50 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold">LearnVault</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 text-center">Admin Panel v1.0</p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
