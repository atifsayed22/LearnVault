import LessonProgress from "../models/lessonProgress.js";
import Course from "../models/course.js";
import Section from "../models/section.js";

export const updateLessonProgress = async (req, res) => {
  try {
    const { lessonId, courseId, status, lastWatchedTime } = req.body;

    if (!lessonId || !courseId) {
      return res.status(400).json({ message: "lessonId and courseId required" });
    }

    const progress = await LessonProgress.findOneAndUpdate(
      {
        user: req.user.id,
        lesson: lessonId,
      },
      {
        course: courseId,
        status,
        lastWatchedTime,
        ...(status === "completed" && { completedAt: new Date() }),
      },
      { upsert: true, new: true }
    );

    res.json({ progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update progress" });
  }
};
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Get all progress records for this user in this course
    const progress = await LessonProgress.find({
      user: req.user.id,
      course: courseId,
    }).select("lesson status lastWatchedTime");

    // Get actual course structure to count total lessons
    const course = await Course.findById(courseId).populate({
      path: "sections",
      populate: {
        path: "lessons"
      }
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Count total lessons in course
    let totalLessons = 0;
    course.sections.forEach(section => {
      if (section.lessons) {
        totalLessons += section.lessons.length;
      }
    });

    // Count completed lessons
    const completedLessons = progress.filter(p => p.status === "completed").length;
    
    // Calculate percentage
    const completionPercentage = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

    res.json({ 
      progress,
      completion: {
        completedLessons,
        totalLessons,
        completionPercentage
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch progress" });
  }
};
