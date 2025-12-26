import Navbar from "../../components/StudentNavbar";
import Categories from "./components/Categories";
import Hero from "./components/Hero";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTASection";
import SearchBar from "./components/SearchBar";
import FeaturedCourses from "./components/FeaturedCourse";



export default function Landing() {
  return (
   <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-200">

      <Navbar />
    
      <Hero />
      <SearchBar />
      <Categories />
      <FeaturedCourses />
      <Testimonials />
      <CTASection />
    </div>
  );
}