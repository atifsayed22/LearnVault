import Enrollment from "../models/enrolment.js";
import Course from "../models/course.js";

export const checkEnrollment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID missing" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // If user is instructor → always allow
    if (course.instructor.toString() === userId) {
      req.enrolled = true;
      req.isInstructor = true;
      return next();
    }

    // Check enrollment record
    const isEnrolled = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    req.enrolled = !!isEnrolled;

    return next();

  } catch (err) {
    console.log("Enrollment middleware error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
