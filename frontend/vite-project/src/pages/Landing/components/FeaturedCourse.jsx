const courses = [
  {
    title: "Full-Stack Web Development",
    instructor: "John Carter",
    price: 499,
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop"
  },
  {
    title: "Data Science Bootcamp",
    instructor: "Sarah Lee",
    price: 699,
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
  },
  {
    title: "Mastering React",
    instructor: "David Kim",
    price: 399,
    img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop"
  },
];

export default function FeaturedCourses() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Featured Courses</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {courses.map((course, i) => (
          <div 
            key={i}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl dark:hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group"
          >
            <img 
              src={course.img} 
              alt={course.title} 
              className="rounded-lg mb-4 w-full h-48 object-cover group-hover:opacity-90 transition-opacity" 
            />

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{course.title}</h3>

            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{course.instructor}</p>

            <p className="mt-3 text-blue-600 dark:text-blue-400 font-bold text-lg">₹{course.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
