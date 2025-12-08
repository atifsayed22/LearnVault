const categories = [
  { name: "Web Development", color: "bg-blue-100 text-blue-700" },
  { name: "Data Science", color: "bg-green-100 text-green-700" },
  { name: "Cybersecurity", color: "bg-red-100 text-red-700" },
  { name: "AI & Machine Learning", color: "bg-purple-100 text-purple-700" },
  { name: "Business", color: "bg-yellow-100 text-yellow-700" },
  { name: "Cloud Computing", color: "bg-indigo-100 text-indigo-700" },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-semibold mb-6">Popular Categories</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((c, i) => (
          <div
            key={i}
            className={`p-4 rounded-lg text-center font-medium shadow ${c.color} cursor-pointer hover:shadow-md transition`}
          >
            {c.name}
          </div>
        ))}
      </div>
    </section>
  );
}
