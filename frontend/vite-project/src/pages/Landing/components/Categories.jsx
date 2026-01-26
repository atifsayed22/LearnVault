const categories = [
  { name: "Web Development", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { name: "Data Science", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800" },
  { name: "Cybersecurity", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800" },
  { name: "AI & Machine Learning", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
  { name: "Business", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800" },
  { name: "Cloud Computing", color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800" },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Popular Categories</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((c, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl text-center font-medium shadow-md hover:shadow-lg border ${c.color} cursor-pointer transition-all hover:scale-105`}
          >
            {c.name}
          </div>
        ))}
      </div>
    </section>
  );
}
