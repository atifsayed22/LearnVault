export default function Hero() {
  return (
   <section className="max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-12 items-center">

  <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20 shadow-lg">
    <h1 className="text-5xl font-extrabold leading-tight text-white">
      Unlock Your Potential with  
      <span className="text-purple-400 drop-shadow-lg"> Expert-Led Courses</span>
    </h1>

    <p className="mt-4 text-gray-300 text-lg">
      Learn industry-ready skills at your own pace.
    </p>

    <div className="mt-6 flex gap-4">
      <a className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-md shadow-purple-900/40">
        Start Learning
      </a>

      <a className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20">
        Browse Courses
      </a>
    </div>
  </div>

  <div className="relative">
    <img
      className="rounded-2xl shadow-xl border border-white/20 backdrop-blur-xl"
      src="YOUR_HERO_IMAGE"
    />

    <div className="absolute inset-0 bg-purple-500/20 blur-3xl"></div>
  </div>

</section>

  );
}
