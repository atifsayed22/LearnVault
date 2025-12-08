const data = [
  {
    name: "Amit Sharma",
    text: "This platform helped me get my first developer job!",
  },
  {
    name: "Priya Mehta",
    text: "The courses are well-structured and easy to follow.",
  },
  {
    name: "Raj Malhotra",
    text: "Best investment I've made in my learning journey.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-3xl font-semibold text-center mb-10">
          What Our Students Say
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {data.map((t, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <p className="text-gray-700 italic">"{t.text}"</p>
              <p className="mt-4 font-semibold">{t.name}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
