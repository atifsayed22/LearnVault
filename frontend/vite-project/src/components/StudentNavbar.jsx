import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="w-full bg-black/80 backdrop-blur-lg border-b border-white/10 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-xl font-semibold text-white">
          LearnVault
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-6 text-gray-300 relative">

          <Link to="/student/courses" className="hover:text-white transition">
            Browse
          </Link>

          {user && (
            <Link to="/student/my-learning" className="hover:text-white transition">
              My Learning
            </Link>
          )}

          {/* AUTH SECTION */}
          {!user ? (
            <Link
              to="/auth"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              {/* PROFILE BUTTON */}
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>

                {/* Name */}
                <span className="hidden md:block text-white">
                  {user.name || "User"}
                </span>

                {/* Chevron */}
                <span className="text-sm">▾</span>
              </button>

              {/* DROPDOWN */}
              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg overflow-hidden">
                  
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-medium">
                      {user.name || "User"}
                    </p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <p className="text-xs text-purple-400 mt-1 capitalize">
                      {user.role}
                    </p>
                  </div>

                  <div className="flex flex-col">
                    {user.role === "instructor" && (
                      <button
                        onClick={() => navigate("/instructor/dashboard")}
                        className="px-4 py-2 text-left text-gray-300 hover:bg-white/10 transition"
                      >
                        Instructor Dashboard
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-left text-red-400 hover:bg-white/10 transition"
                    >
                      Logout
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
