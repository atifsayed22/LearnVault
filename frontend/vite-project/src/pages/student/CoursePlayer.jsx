import { useEffect, useState } from "react";
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
  const [allowed, setAllowed] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurriculum();
  }, []);

   useEffect(() => {
    checkAccess();
  }, []);

  // -------------------------
  // 1️⃣ CHECK ENROLLMENT
  // -------------------------
  const checkAccess = async () => {
    try {
      const res = await api.get(`/enrollment/check/${courseId}`);

      if (res.data.enrolled || res.data.isInstructor) {
        setAllowed(true);
        loadCurriculum();
      } else {
        setAllowed(false);
      }
    } catch (err) {
      setAllowed(false);
    }
  };

  const loadCurriculum = async () => {
    try {
      const res = await api.get(`/course/${courseId}/curriculum`);
      setCourse(res.data.course);

      const firstLesson = res.data.course.sections?.[0]?.lessons?.[0];
      if (firstLesson) {
        loadLessonVideo(firstLesson._id);
        setCurrentLesson(firstLesson);
      }

    } catch (err) {
      console.log(err);
      toast.error("Access denied or course not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadLessonVideo = async (lessonId) => {
    try {
      const res = await api.get(`/videos/get-playback-url/${lessonId}`);
      setVideoUrl(res.data.playbackUrl);
    } catch (err) {
      toast.error("Unable to load video");
    }
  };

  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson);
    loadLessonVideo(lesson._id);
  };

  if (loading || !course) return <div className="text-white p-10">Loading...</div>;

  if(!allowed) {
     return (
    <div className="text-center text-white p-16">
      <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
      <p className="text-gray-300 mb-6">You are not enrolled in this course.</p>

      <button
        className="btn-primary"
        onClick={() => navigate(`/course/${courseId}`)}
      >
        Go Back to Course Page
      </button>
    </div>
  );
  }

  return (
    <div className="flex bg-black text-white min-h-screen">

      {/* LEFT SIDEBAR */}
      <Sidebar
        course={course}
        currentLesson={currentLesson}
        onLessonSelect={handleLessonClick}
      />

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">{currentLesson?.title}</h1>

        <VideoPlayer url={videoUrl} />

        <p className="text-gray-300 mt-4">{currentLesson?.description || ""}</p>
      </div>

    </div>
  );
}
