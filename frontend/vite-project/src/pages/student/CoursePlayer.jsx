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
      <div className="w-full bg-black/80 border-b border-white/10 px-6 py-4 sticky top-0 z-40 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-gray-300 hover:text-white">
          ← Back
        </button>
        <h1 className="text-lg font-semibold truncate max-w-md">
          {course.title}
        </h1>
        <div className="w-12" />
      </div>

      <div className="flex bg-black min-h-screen text-white">
        {/* SIDEBAR */}
        <Sidebar
          course={course}
          currentLesson={currentLesson}
          progressMap={progressMap}
          completion={completion}
          onLessonSelect={handleLessonSelect}
        />

        {/* PLAYER */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">
            {currentLesson?.title}
          </h1>

          <VideoPlayer
            url={videoUrl}
            initialTime={progressMap[currentLesson?._id]?.lastWatchedTime || 0}
            onTimeUpdate={handleTimeUpdate}
          />

          <p className="text-gray-300 mt-4">
            {currentLesson?.description || ""}
          </p>
        </div>
      </div>
    </>
  );
}
