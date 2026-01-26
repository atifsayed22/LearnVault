import { useTheme } from "../../context/ThemeContext";
import Categories from "./components/Categories";
import Hero from "./components/Hero";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTASection";
import SearchBar from "./components/SearchBar";
import FeaturedCourses from "./components/FeaturedCourse";
import { Sun, Moon } from "lucide-react";

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-20 right-6 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-gray-700" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-400" />
        )}
      </button>

      <Hero />
    
      <Categories />
      <FeaturedCourses />
      <Testimonials />
      <CTASection />
    </div>
  );
}