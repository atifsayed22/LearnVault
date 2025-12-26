import Course from "../models/course.js";
import Enrollment from "../models/enrolment.js";
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

    /* ---------------- TOTAL EARNINGS ---------------- */
    const totalEarnings = coursePerformance.reduce(
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

    /* ---------------- FINAL RESPONSE (MATCHES FRONTEND) ---------------- */
    return res.json({
      totals: {
        totalCourses,
        totalEnrollments,
        totalEarnings,
      },
      coursePerformance,
      earningsTrend,
    });
  } catch (err) {
    console.error("Instructor analytics error:", err);
    return res.status(500).json({ message: "Analytics error" });
  }
};
