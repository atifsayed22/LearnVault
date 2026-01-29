import Course from "../models/course.js";
import Enrollment from "../models/enrolment.js";
import LessonProgress from "../models/lessonProgress.js";
import Lesson from "../models/lesson.js";
import mongoose from "mongoose";

export const instructorAnalytics = async (req, res) => {
  try {
    const instructorId = new mongoose.Types.ObjectId(req.user.id);

    //Total Courses
    const totalCourses = await Course.countDocuments({
      instructor: instructorId,
    });

    // Total Enrollments
    const totalEnrollmentsAgg = await Enrollment.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      { $match: { "course.instructor": instructorId } },
      { $count: "count" },
    ]);

    const totalEnrollments = totalEnrollmentsAgg[0]?.count || 0;

    /* ---------------- COURSE PERFORMANCE ---------------- */
    const coursePerformance = await Enrollment.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $match: {
          "course.instructor": instructorId,
          status: "paid",
        },
      },
      {
        $group: {
          _id: "$course._id",
          title: { $first: "$course.title" },
          enrollments: { $sum: 1 },
          revenue: { $sum: "$instructorEarnings" },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // Enhance coursePerformance with completion rates
    const coursePerformanceWithCompletion = await Promise.all(
      coursePerformance.map(async (course) => {
        // Get total lessons in course
        const totalLessons = await Lesson.countDocuments({ course: course._id });

        if (totalLessons === 0) {
          return {
            ...course,
            totalLessons: 0,
            completedLessonCount: 0,
            completionRate: 0,
          };
        }

        // Count total completed lessons across all students in this course
        const completedLessons = await LessonProgress.countDocuments({
          course: course._id,
          status: "completed",
        });

        // Calculate completion rate
        const completionRate =
          course.enrollments > 0
            ? Math.round(
                (completedLessons / (totalLessons * course.enrollments)) * 100 * 100
              ) / 100
            : 0;

        return {
          ...course,
          totalLessons,
          completedLessonCount: completedLessons,
          completionRate,
        };
      })
    );

    /* ---------------- TOTAL EARNINGS ---------------- */
    const totalEarnings = coursePerformanceWithCompletion.reduce(
      (sum, course) => sum + (course.revenue || 0),
      0
    );

    /* ---------------- EARNINGS TREND (LAST 30 DAYS) ---------------- */
    const earningsTrend = await Enrollment.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $match: {
          "course.instructor": instructorId,
          status: "paid",
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          earnings: { $sum: "$instructorEarnings" },
          enrollments: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Calculate overall completion rate across all courses
    const totalLessonsAllCourses = coursePerformanceWithCompletion.reduce(
      (sum, course) => sum + course.totalLessons,
      0
    );
    const totalCompletedAllCourses = coursePerformanceWithCompletion.reduce(
      (sum, course) => sum + course.completedLessonCount,
      0
    );
    const overallCompletionRate =
      totalLessonsAllCourses > 0
        ? Math.round(
            (totalCompletedAllCourses / (totalLessonsAllCourses * totalEnrollments)) * 100 * 100
          ) / 100
        : 0;

    /* ---------------- FINAL RESPONSE (MATCHES FRONTEND) ---------------- */
    return res.json({
      totals: {
        totalCourses,
        totalEnrollments,
        totalEarnings,
        overallCompletionRate,
      },
      coursePerformance: coursePerformanceWithCompletion,
      earningsTrend,
    });
  } catch (err) {
    console.error("Instructor analytics error:", err);
    return res.status(500).json({ message: "Analytics error" });
  }
};

/**
 * Get course completion stats for a specific course
 * Returns overall completion rate and per-student completion details
 */
export const getCourseCompletionStats = async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructorId = new mongoose.Types.ObjectId(req.user.id);

    // Verify course exists and belongs to instructor
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.instructor.toString() !== instructorId.toString()) {
      return res.status(403).json({ message: "Forbidden - Not your course" });
    }

    // Get total lessons in course
    const totalLessons = await Lesson.countDocuments({ course: courseId });

    if (totalLessons === 0) {
      return res.status(200).json({
        courseId,
        courseTitle: course.title,
        totalLessons: 0,
        totalEnrolledStudents: 0,
        overallCompletionRate: 0,
        studentCompletionDetails: [],
      });
    }

    // Get all enrolled students for this course
    const enrolledStudents = await Enrollment.find({ course: courseId })
      .populate("user", "name email")
      .lean();

    if (enrolledStudents.length === 0) {
      return res.status(200).json({
        courseId,
        courseTitle: course.title,
        totalLessons,
        totalEnrolledStudents: 0,
        overallCompletionRate: 0,
        studentCompletionDetails: [],
      });
    }

    // Calculate completion stats for each student
    const studentCompletionDetails = [];
    let totalCompletedLessons = 0;

    for (const enrollment of enrolledStudents) {
      const userId = enrollment.user._id;
      
      // Count completed lessons for this student
      const completedLessons = await LessonProgress.countDocuments({
        user: userId,
        course: courseId,
        status: "completed",
      });

      const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      studentCompletionDetails.push({
        studentId: userId,
        studentName: enrollment.user.name,
        studentEmail: enrollment.user.email,
        completedLessons,
        totalLessons,
        completionRate: Math.round(completionRate * 100) / 100, // Round to 2 decimal places
        enrolledAt: enrollment.enrolledAt,
      });

      totalCompletedLessons += completedLessons;
    }

    // Calculate overall completion rate
    const overallCompletionRate =
      totalEnrolledStudents > 0
        ? Math.round((totalCompletedLessons / (totalLessons * enrolledStudents.length)) * 100 * 100) / 100
        : 0;

    // Sort by completion rate (descending)
    studentCompletionDetails.sort((a, b) => b.completionRate - a.completionRate);

    return res.status(200).json({
      courseId,
      courseTitle: course.title,
      totalLessons,
      totalEnrolledStudents: enrolledStudents.length,
      overallCompletionRate,
      studentCompletionDetails,
    });
  } catch (err) {
    console.error("Course completion stats error:", err);
    return res.status(500).json({ message: "Error fetching completion stats" });
  }
};
