import Course from "../models/course.js";
import Enrollment from "../models/enrolment.js";
import LessonProgress from "../models/lessonProgress.js";
import Lesson from "../models/lesson.js";
import mongoose from "mongoose";




/**
 * Get total number of courses for an instructor
 */
const getTotalCourses = async (instructorId) => {
  return await Course.countDocuments({ instructor: instructorId });
};

/**
 * Get total enrollments across all instructor's courses
 */
const getTotalEnrollments = async (instructorId) => {
  const result = await Enrollment.aggregate([
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "courseData",
      },
    },
    { $unwind: "$courseData" },
    { $match: { "courseData.instructor": instructorId } },
    { $count: "total" },
  ]);

  return result[0]?.total || 0;
};

/**
 * Get revenue and enrollment stats grouped by course
 */
const getCourseRevenueStats = async (instructorId) => {
  return await Enrollment.aggregate([
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "courseData",
      },
    },
    { $unwind: "$courseData" },
    {
      $match: {
        "courseData.instructor": instructorId,
        status: "paid",
      },
    },
    {
      $group: {
        _id: "$courseData._id",
        title: { $first: "$courseData.title" },
        enrollments: { $sum: 1 },
        revenue: { $sum: "$instructorEarnings" },
      },
    },
    { $sort: { revenue: -1 } },
  ]);
};

/**
 * Get total lessons count for each course
 */
const getCourseLessonCounts = async (courseIds) => {
  const result = await Lesson.aggregate([
    { $match: { course: { $in: courseIds } } },
    {
      $group: {
        _id: "$course",
        totalLessons: { $sum: 1 },
      },
    },
  ]);

  // Convert to a map for easy lookup
  const lessonCountMap = {};
  result.forEach((item) => {
    lessonCountMap[item._id.toString()] = item.totalLessons;
  });
  return lessonCountMap;
};

/**
 * Get completed lessons count for each course
 */
const getCourseCompletionCounts = async (courseIds) => {
  const result = await LessonProgress.aggregate([
    {
      $match: {
        course: { $in: courseIds },
        status: "completed",
      },
    },
    {
      $group: {
        _id: "$course",
        completedCount: { $sum: 1 },
      },
    },
  ]);

  // Convert to a map for easy lookup
  const completionMap = {};
  result.forEach((item) => {
    completionMap[item._id.toString()] = item.completedCount;
  });
  return completionMap;
};

/**
 * Calculate completion rate percentage
 */
const calculateCompletionRate = (completedLessons, totalLessons, enrollments) => {
  if (totalLessons === 0 || enrollments === 0) return 0;
  const rate = (completedLessons / (totalLessons * enrollments)) * 100;
  return Math.round(rate * 100) / 100; // Round to 2 decimal places
};

/**
 * Get earnings trend for last 30 days
 */
const getEarningsTrend = async (instructorId) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return await Enrollment.aggregate([
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "courseData",
      },
    },
    { $unwind: "$courseData" },
    {
      $match: {
        "courseData.instructor": instructorId,
        status: "paid",
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        earnings: { $sum: "$instructorEarnings" },
        enrollments: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

/**
 * Combine all course data with completion stats
 */
const buildCoursePerformanceData = async (instructorId) => {
  // Step 1: Get basic revenue stats per course
  const courseStats = await getCourseRevenueStats(instructorId);

  if (courseStats.length === 0) return [];

  // Step 2: Get course IDs for further queries
  const courseIds = courseStats.map((course) => course._id);

  // Step 3: Get lesson counts and completion counts in parallel
  const [lessonCounts, completionCounts] = await Promise.all([
    getCourseLessonCounts(courseIds),
    getCourseCompletionCounts(courseIds),
  ]);

  // Step 4: Combine all data
  return courseStats.map((course) => {
    const courseIdStr = course._id.toString();
    const totalLessons = lessonCounts[courseIdStr] || 0;
    const completedLessonCount = completionCounts[courseIdStr] || 0;
    const completionRate = calculateCompletionRate(
      completedLessonCount,
      totalLessons,
      course.enrollments
    );

    return {
      _id: course._id,
      title: course.title,
      enrollments: course.enrollments,
      revenue: course.revenue,
      totalLessons,
      completedLessonCount,
      completionRate,
    };
  });
};

// ============================================
// MAIN CONTROLLER FUNCTIONS
// ============================================

/**
 * Get comprehensive instructor analytics
 * Returns: totals, course performance, and earnings trend
 */
export const instructorAnalytics = async (req, res) => {
  try {
    const instructorId = new mongoose.Types.ObjectId(req.user.id);

    // Fetch all analytics data in parallel for performance
    const [totalCourses, totalEnrollments, coursePerformance, earningsTrend] =
      await Promise.all([
        getTotalCourses(instructorId),
        getTotalEnrollments(instructorId),
        buildCoursePerformanceData(instructorId),
        getEarningsTrend(instructorId),
      ]);

    // Calculate total earnings from course performance
    const totalEarnings = coursePerformance.reduce(
      (sum, course) => sum + (course.revenue || 0),
      0
    );

    // Calculate overall completion rate
    const totalLessonsAllCourses = coursePerformance.reduce(
      (sum, course) => sum + course.totalLessons,
      0
    );
    const totalCompletedAllCourses = coursePerformance.reduce(
      (sum, course) => sum + course.completedLessonCount,
      0
    );
    const overallCompletionRate = calculateCompletionRate(
      totalCompletedAllCourses,
      totalLessonsAllCourses,
      totalEnrollments
    );

    return res.json({
      totals: {
        totalCourses,
        totalEnrollments,
        totalEarnings,
        overallCompletionRate,
      },
      coursePerformance,
      earningsTrend,
    });
  } catch (err) {
    console.error("Instructor analytics error:", err);
    return res.status(500).json({ message: "Analytics error" });
  }
};


// ============================================
// COURSE COMPLETION HELPERS
// ============================================

/**
 * Get enrolled students with their basic info
 */
const getEnrolledStudents = async (courseId) => {
  return await Enrollment.aggregate([
    { $match: { course: courseId } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },
    {
      $project: {
        studentId: "$user",
        studentName: "$userDetails.name",
        studentEmail: "$userDetails.email",
        enrolledAt: 1,
      },
    },
  ]);
};

/**
 * Get completed lessons count per student for a course
 */
const getStudentCompletedLessons = async (courseId) => {
  const result = await LessonProgress.aggregate([
    {
      $match: {
        course: courseId,
        status: "completed",
      },
    },
    {
      $group: {
        _id: "$user",
        completedLessons: { $sum: 1 },
      },
    },
  ]);

  // Convert to a map for easy lookup
  const completionMap = {};
  result.forEach((item) => {
    completionMap[item._id.toString()] = item.completedLessons;
  });
  return completionMap;
};

/**
 * Get total lessons count for a course
 */
const getTotalLessonsForCourse = async (courseId) => {
  return await Lesson.countDocuments({ course: courseId });
};

/**
 * Calculate student completion rate
 */
const calculateStudentCompletionRate = (completedLessons, totalLessons) => {
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons / totalLessons) * 100 * 100) / 100;
};

/**
 * Get course completion stats for a specific course
 * Returns overall completion rate and per-student completion details
 */
export const getCourseCompletionStats = async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructorId = new mongoose.Types.ObjectId(req.user.id);
    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    // Step 1: Verify course ownership
    const course = await Course.findOne({
      _id: courseObjectId,
      instructor: instructorId,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Step 2: Get enrolled students
    const enrolledStudents = await getEnrolledStudents(courseObjectId);

    // Handle no enrollments
    if (enrolledStudents.length === 0) {
      return res.status(200).json({
        courseId,
        courseTitle: course.title,
        totalLessons: 0,
        totalEnrolledStudents: 0,
        overallCompletionRate: 0,
        studentCompletionDetails: [],
      });
    }

    // Step 3: Get total lessons and student completion data in parallel
    const [totalLessons, studentCompletionMap] = await Promise.all([
      getTotalLessonsForCourse(courseObjectId),
      getStudentCompletedLessons(courseObjectId),
    ]);

    // Handle no lessons
    if (totalLessons === 0) {
      return res.status(200).json({
        courseId,
        courseTitle: course.title,
        totalLessons: 0,
        totalEnrolledStudents: enrolledStudents.length,
        overallCompletionRate: 0,
        studentCompletionDetails: enrolledStudents.map((student) => ({
          ...student,
          completedLessons: 0,
          totalLessons: 0,
          completionRate: 0,
        })),
      });
    }

    // Step 4: Build student completion details
    let totalCompletedLessons = 0;
    const studentCompletionDetails = enrolledStudents.map((student) => {
      const completedLessons = studentCompletionMap[student.studentId.toString()] || 0;
      const completionRate = calculateStudentCompletionRate(completedLessons, totalLessons);
      totalCompletedLessons += completedLessons;

      return {
        ...student,
        completedLessons,
        totalLessons,
        completionRate,
      };
    });

    // Sort by completion (highest first)
    studentCompletionDetails.sort((a, b) => b.completedLessons - a.completedLessons);

    // Step 5: Calculate overall completion rate
    const overallCompletionRate = calculateCompletionRate(
      totalCompletedLessons,
      totalLessons,
      enrolledStudents.length
    );

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
