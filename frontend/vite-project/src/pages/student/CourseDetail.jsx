import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  // ----------------------------------
  // LOAD COURSE DETAILS
  // ----------------------------------
  useEffect(() => {
    if (!courseId) return;
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const res = await api.get(`/course/${courseId}`);
      setCourse(res.data.course);
    } catch (err) {
      toast.error("Course not found");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // CHECK ENROLLMENT STATUS
  // ----------------------------------
  useEffect(() => {
    if (!course?._id) return;

    const checkEnroll = async () => {
      try {
        const res = await api.get(`/enrollment/check/${course._id}`);
        setEnrolled(res.data.enrolled);
      } catch (err) {
        console.log("Enrollment check failed:", err);
      }
    };

    checkEnroll();
  }, [course]);

  // ----------------------------------
  // HANDLE PAYMENT / ENROLLMENT
  // ----------------------------------
  const handleEnroll = async () => {
    setBuying(true);

    try {
      const orderRes = await api.post("/payment/create-order", { courseId });

      const { amount, orderId, key } = orderRes.data;

      const options = {
        key,
        amount,
        currency: "INR",
        name: course.title,
        order_id: orderId,

        handler: async (response) => {
          try {
            await api.post("/payment/verify", {
              ...response,
              courseId,
            });
            setEnrolled(true);
            toast.success("Enrolled successfully 🎉");
            navigate(`/student/course/${courseId}/learn`);
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Unable to start payment");
    } finally {
      setBuying(false);
    }
  };

  // ----------------------------------
  // UI RENDERING
  // ----------------------------------
  if (loading)
    return <div className="text-white p-10 text-xl">Loading course...</div>;

  if (!course)
    return <div className="text-white p-10 text-xl">Course not found</div>;

  return (
    <div className="bg-black min-h-screen text-white">
      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-10">
        {/* HERO */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start mb-10">
          <div className="md:col-span-2">
            <p className="text-sm uppercase tracking-wider text-purple-300 mb-3">
              {course.category}
            </p>
            <h1 className="text-4xl font-bold mb-3 leading-tight">{course.title}</h1>
            <p className="text-gray-300 text-lg mb-5">{course.description}</p>
            <p className="text-purple-300 font-semibold text-lg">
              Instructor: {course.instructor?.name}
            </p>
          </div>

          <aside className="bg-white/10 p-6 rounded-xl border border-white/20 h-fit md:sticky md:top-20">
            <div className="h-48 bg-black/20 rounded-lg mb-4 overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-3xl font-bold mb-4">₹{course.price}</p>

            {enrolled ? (
              <button
                className="btn-primary bg-green-600 hover:bg-green-700 w-full"
                onClick={() => navigate(`/student/course/${courseId}/learn`)}
              >
                Go to Course
              </button>
            ) : (
              <button
                className="btn-primary w-full"
                disabled={buying}
                onClick={handleEnroll}
              >
                {buying ? "Processing..." : "Enroll Now"}
              </button>
            )}

            <div className="text-gray-400 text-sm mt-3 text-center">
              Lifetime access • Certificate • 30-day refund
            </div>
          </aside>
        </section>

        {/* BODY */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-10">
          {/* WHAT YOU'LL LEARN */}
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>

            <ul className="space-y-2 text-gray-300">
              <li className="flex gap-2">• Learn the fundamentals</li>
              <li className="flex gap-2">• Build real-world projects</li>
              <li className="flex gap-2">• Improve your skill & confidence</li>
            </ul>
          </div>

          {/* CURRICULUM */}
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4">Course Content</h2>

            {course.sections?.length > 0 ? (
              course.sections.map((section) => (
                <div key={section._id} className="mb-6">
                  <p className="font-semibold text-lg mb-2">{section.title}</p>

                  <div className="ml-4 space-y-1">
                    {section.lessons.length > 0 ? (
                      section.lessons.map((lesson) => (
                        <div
                          key={lesson._id}
                          className="text-gray-300 text-sm flex items-center gap-2"
                        >
                          <span>•</span> {lesson.title}
                          <span className="text-yellow-400 ml-2">(Locked)</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm ml-2">
                        No lessons yet.
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No sections added yet.</p>
            )}
          </div>

            <div className="md:hidden bg-white/10 p-6 rounded-xl border border-white/20 h-fit">
              <div className="h-40 bg-black/20 rounded-lg mb-4 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-3xl font-bold mb-4">₹{course.price}</p>
              {enrolled ? (
                <button
                  className="btn-primary bg-green-600 hover:bg-green-700 w-full"
                  onClick={() => navigate(`/student/course/${courseId}/learn`)}
                >
                  Go to Course
                </button>
              ) : (
                <button
                  className="btn-primary w-full"
                  disabled={buying}
                  onClick={handleEnroll}
                >
                  {buying ? "Processing..." : "Enroll Now"}
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
