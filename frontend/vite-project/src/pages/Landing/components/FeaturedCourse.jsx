const courses = [
  {
    title: "Full-Stack Web Development",
    instructor: "John Carter",
    price: 499,
    img: "https://i.imgur.com/Z7AzH2c.png"
  },
  {
    title: "Data Science Bootcamp",
    instructor: "Sarah Lee",
    price: 699,
    img: "https://i.imgur.com/4Z8G7Qp.png"
  },
  {
    title: "Mastering React",
    instructor: "David Kim",
    price: 399,
    img: "https://i.imgur.com/pZ75vVh.png"
  },
];

export default function FeaturedCourses() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-semibold mb-6">Featured Courses</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {courses.map((course, i) => (
         <div className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl border border-white/20 shadow-lg hover:shadow-purple-900/40 transition cursor-pointer">


            <img src={course.img} alt="" className="rounded-lg mb-4" />

            <h3 className="text-xl font-semibold">{course.title}</h3>

            <p className="text-gray-500 text-sm">{course.instructor}</p>

            <p className="mt-3 text-indigo-600 font-bold">₹{course.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
