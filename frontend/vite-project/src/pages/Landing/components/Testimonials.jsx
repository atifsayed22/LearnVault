import { Quote } from "lucide-react";

const data = [
  {
    name: "Amit Sharma",
    text: "This platform helped me get my first developer job!",
    role: "Software Developer"
  },
  {
    name: "Priya Mehta",
    text: "The courses are well-structured and easy to follow.",
    role: "Data Analyst"
  },
  {
    name: "Raj Malhotra",
    text: "Best investment I've made in my learning journey.",
    role: "Business Owner"
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-50 dark:bg-slate-800/50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          What Our Students Say
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {data.map((t, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-md hover:shadow-xl dark:shadow-slate-900/50 transition-all border border-gray-200 dark:border-slate-600"
            >
              <Quote className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-3" />
              <p className="text-gray-700 dark:text-gray-300 italic text-lg">"{t.text}"</p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
                <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
