import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function CTASection() {
  return (
    <section className="w-full bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to start learning?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join millions of learners acquiring new skills every day. Choose from thousands of courses and start your journey today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-start">
            <CheckCircle2 className="w-8 h-8 text-gray-900 dark:text-white mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Flexible Learning</h3>
            <p className="text-gray-600 dark:text-gray-400">Learn at your own pace with lifetime access to course materials</p>
          </div>
          <div className="flex flex-col items-start">
            <CheckCircle2 className="w-8 h-8 text-gray-900 dark:text-white mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Expert Instructors</h3>
            <p className="text-gray-600 dark:text-gray-400">Learn from industry experts with years of real-world experience</p>
          </div>
          <div className="flex flex-col items-start">
            <CheckCircle2 className="w-8 h-8 text-gray-900 dark:text-white mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Recognized Certificates</h3>
            <p className="text-gray-600 dark:text-gray-400">Get shareable credentials upon course completion</p>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/auth/login"
            className="inline-flex items-center gap-2 px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">Create a free account to browse courses</p>
        </div>
      </div>
    </section>
  );
}
