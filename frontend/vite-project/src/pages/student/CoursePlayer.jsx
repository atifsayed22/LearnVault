import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import Sidebar from "../../components/course-player/Sidebar";
import VideoPlayer from "../../components/course-player/VideoPlayer";
import toast from "react-hot-toast";

export default function CoursePlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [completion, setCompletion] = useState(null);
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileTab, setMobileTab] = useState("video");

  const lastSaveRef = useRef(0);

  /* ---------------- ACCESS CHECK ---------------- */
  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const res = await api.get(`/enrollment/check/${courseId}`);
      if (res.data.enrolled || res.data.isInstructor) {
        setAllowed(true);
        await initPlayer();
      } else {
        setAllowed(false);
        setLoading(false);
      }
    } catch {
      setAllowed(false);
      setLoading(false);
    }
  };

  /* ---------------- INIT PLAYER ---------------- */
  const initPlayer = async () => {
    try {
      const [curriculumRes, progressRes] = await Promise.all([
        api.get(`/course/${courseId}/curriculum`),
        api.get(`/progress/course/${courseId}`),
      ]);

      const courseData = curriculumRes.data.course;
      setCourse(courseData);

      // Build progress map
      const map = {};
      progressRes.data.progress.forEach((p) => {
        map[p.lesson] = p;
      });
      setProgressMap(map);
      
      // Store completion data
      setCompletion(progressRes.data.completion);

      // Resume last lesson
      const lastLessonProgress = progressRes.data.progress
        .filter(p => p.status !== "completed")
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

      let lessonToOpen =
        courseData.sections?.[0]?.lessons?.[0] || null;

      if (lastLessonProgress) {
        courseData.sections.forEach(section => {
          section.lessons.forEach(lesson => {
            if (lesson._id === lastLessonProgress.lesson) {
              lessonToOpen = lesson;
            }
          });
        });
      }

      if (lessonToOpen) {
        setCurrentLesson(lessonToOpen);
        loadLessonVideo(lessonToOpen._id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to load course");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOAD VIDEO ---------------- */
  const loadLessonVideo = async (lessonId) => {
    try {
      const res = await api.get(`/videos/get-playback-url/${lessonId}`);
      setVideoUrl(res.data.playbackUrl);
    } catch (err) {
      console.error("Video load error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Unable to load video");
    }
  };

  /* ---------------- PROGRESS UPDATE ---------------- */
  const updateProgress = async ({ status, time }) => {
    if (!currentLesson) return;

    try {
      await api.post("/progress/update", {
        lessonId: currentLesson._id,
        courseId,
        status,
        lastWatchedTime: time,
      });

      // If lesson completed, refresh completion stats
      if (status === "completed") {
        const res = await api.get(`/progress/course/${courseId}`);
        setCompletion(res.data.completion);
      }
    } catch (err) {
      console.log("Progress update failed");
    }
  };

  /* ---------------- VIDEO EVENTS ---------------- */
  const handleTimeUpdate = (currentTime, duration) => {
    const now = Date.now();
    if (now - lastSaveRef.current > 20000) {
      lastSaveRef.current = now;
      updateProgress({ status: "in_progress", time: currentTime });
    }

    if (currentTime >= duration * 0.9) {
      updateProgress({ status: "completed", time: duration });
    }
  };

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
    loadLessonVideo(lesson._id);
    setMobileTab("video");
  };

  /* ---------------- UI STATES ---------------- */
  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  if (!allowed) {
    return (
      <div className="text-center text-white p-16">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-300 mb-6">
          You are not enrolled in this course.
        </p>
        <button className="btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  /* ---------------- MAIN RENDER ---------------- */
  return (
    <>
      {/* TOP BAR */}
      <div className="w-full bg-black/80 border-b border-white/10 px-4 sm:px-6 py-4 sticky top-16 z-40 flex justify-between items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-300 hover:text-white">
          ← Back
        </button>
        <h1 className="text-sm sm:text-lg font-semibold truncate max-w-[55vw] sm:max-w-md">
          {course.title}
        </h1>
        <div className="w-12" />
      </div>

      {/* MOBILE VIEW SWITCHER */}
      <div className="md:hidden sticky top-[129px] z-30 bg-black/95 border-b border-white/10 px-4 py-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMobileTab("video")}
            className={`rounded-lg py-2 text-sm font-medium transition ${
              mobileTab === "video"
                ? "bg-white text-black"
                : "bg-white/10 text-gray-200 hover:bg-white/20"
            }`}
          >
            Video
          </button>
          <button
            onClick={() => setMobileTab("curriculum")}
            className={`rounded-lg py-2 text-sm font-medium transition ${
              mobileTab === "curriculum"
                ? "bg-white text-black"
                : "bg-white/10 text-gray-200 hover:bg-white/20"
            }`}
          >
            Curriculum
          </button>
        </div>
      </div>

      <div className="flex bg-black min-h-[calc(100vh-64px)] text-white">
        {/* SIDEBAR */}
        <div className={`w-full md:w-auto ${mobileTab === "curriculum" ? "block" : "hidden"} md:block`}>
          <Sidebar
            course={course}
            currentLesson={currentLesson}
            progressMap={progressMap}
            completion={completion}
            onLessonSelect={handleLessonSelect}
          />
        </div>

        {/* PLAYER */}
        <div className={`flex-1 p-4 sm:p-6 ${mobileTab === "video" ? "block" : "hidden"} md:block`}>
          <h1 className="text-xl sm:text-2xl font-bold mb-4">{currentLesson?.title}</h1>

          <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black">
            <VideoPlayer
              url={videoUrl}
              initialTime={progressMap[currentLesson?._id]?.lastWatchedTime || 0}
              onTimeUpdate={handleTimeUpdate}
            />
          </div>

          <p className="text-gray-300 mt-4 text-sm sm:text-base">{currentLesson?.description || ""}</p>
        </div>
      </div>
    </>
  );
}
