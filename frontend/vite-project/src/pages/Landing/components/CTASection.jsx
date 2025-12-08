export default function CTASection() {
  return (
  <section className="py-20 text-center bg-gradient-to-r from-purple-700/40 to-blue-600/40 backdrop-blur-xl border-t border-white/10">
  <h2 className="text-4xl font-bold text-white drop-shadow-lg">
    Start Your Learning Journey Today
  </h2>

  <p className="mt-4 text-gray-300">
    Join thousands of students leveling up their careers.
  </p>

  <a
    href="/register"
    className="mt-8 inline-block px-10 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold shadow-lg shadow-purple-900/40"
  >
    Join Now
  </a>
</section>

  );
}
