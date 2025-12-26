import LessonProgress from "../models/lessonProgress.js";

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

    const progress = await LessonProgress.find({
      user: req.user.id,
      course: courseId,
    }).select("lesson status lastWatchedTime");

    res.json({ progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch progress" });
  }
};
