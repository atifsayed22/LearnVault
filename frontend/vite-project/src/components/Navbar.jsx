import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-4 flex justify-between items-center">

      {/* LOGO */}
      <Link to="/" className="text-xl font-bold text-gray-100">
        LearnVault
      </Link>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex gap-6 text-gray-300">
        <Link to="/courses" className="hover:text-white">Browse Courses</Link>
        <Link to="/login" className="hover:text-white">Login</Link>
      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        className="md:hidden text-white"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-black/80 backdrop-blur-xl p-6 flex flex-col gap-4 md:hidden">
          <Link to="/courses" onClick={() => setOpen(false)}>Browse Courses</Link>
          <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
        </div>
      )}
    </nav>
  );
}
