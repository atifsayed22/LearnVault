export default function Hero() {
  return (
    <>
      {/* Main Hero Banner */}
      <section className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Learn in-demand skills, advance your career
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                LearnVault connects learners with expert instructors. Choose from thousands of courses in programming, design, business, and more. Learn at your own pace and get recognized with certificates.
              </p>

              <p className="text-base text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                Whether you're looking to switch careers, start a business, or advance in your current role, you'll find the right course for you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                  Start Learning Today
                </button>
                <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-700">
                  Explore Instructors
                </button>
              </div>

              {/* Stats */}
              <div className="mt-12 flex gap-8 flex-wrap">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">210M+</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Enrollments</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">200K+</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Expert Instructors</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">70+</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Languages</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                alt="Students learning together"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Start Learning CTA Section */}
      <section className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <div className="relative order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
                alt="Online learning on laptop"
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Right Content */}
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Learning designed for real life
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold">✓</div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">Learn at your own pace</p>
                    <p className="text-gray-600 dark:text-gray-400">Work through courses on your schedule with lifetime access</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold">✓</div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">Courses that grow with you</p>
                    <p className="text-gray-600 dark:text-gray-400">From beginner to advanced, find the right level for you</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold">✓</div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">Get professional credentials</p>
                    <p className="text-gray-600 dark:text-gray-400">Earn certificates and shareable credentials to boost your career</p>
                  </div>
                </div>
              </div>

              <button className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                Browse Courses Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Become an Instructor CTA Section */}
      <section className="w-full bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Turn your expertise into income
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Become an instructor and change lives—including your own. Share your knowledge with millions of students worldwide and earn money doing what you love.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold">✓</div>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">Instructor Dashboard</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Track student progress and engagement in real-time</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold">✓</div>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">Earn Revenue</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Competitive revenue share from every student enrollment</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold">✓</div>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">Marketing Tools</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Built-in tools to help you promote your courses</p>
                  </div>
                </div>
              </div>

              <button className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                Start Teaching Today
              </button>
            </div>

            {/* Right Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800&h=600&fit=crop"
                alt="Instructor teaching online"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
