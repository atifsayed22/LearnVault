import User from "../models/users.js";
import Course from "../models/course.js";
import Enrollment from "../models/enrolment.js";
import { sendApprovalEmail , sendRejectionEmail} from "../utils/emailService.js";

// Get all instructors with their statistics
export const getInstructors = async (req, res) => {
  try {
    const { verified, status } = req.query;
    let query = { role: "instructor" };

    // Filter by verification status
    if (verified !== undefined) {
      query.isVerified = verified === "true";
    }

    // Filter by document status
    if (status) {
      query.documentStatus = status;
    }

    const instructors = await User.find(query).select("-password");

    // Get statistics for each instructor
    const instructorsWithStats = await Promise.all(
      instructors.map(async (instructor) => {
        const courseCount = await Course.countDocuments({ instructor: instructor._id });
        const enrollmentCount = await Enrollment.countDocuments({
          course: { $in: (await Course.find({ instructor: instructor._id }).select("_id")).map(c => c._id) }
        });

        return {
          ...instructor.toObject(),
          courseCount,
          enrollmentCount
        };
      })
    );

    res.status(200).json({
      message: "Instructors fetched successfully",
      total: instructorsWithStats.length,
      data: instructorsWithStats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get instructor details
export const getInstructorDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await User.findById(id).select("-password");

    if (!instructor || instructor.role !== "instructor") {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Get courses and enrollments
    const courses = await Course.find({ instructor: id });
    const enrollmentCount = await Enrollment.countDocuments({
      course: { $in: courses.map(c => c._id) }
    });

    res.status(200).json({
      message: "Instructor details fetched",
      data: {
        ...instructor.toObject(),
        courseCount: courses.length,
        enrollmentCount,
        courses
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify/Approve instructor
export const approveInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await User.findByIdAndUpdate(
      id,
      {
        isVerified: true,
        documentStatus: "approved"
      },
      { new: true }
    ).select("-password");

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }
    // Send approval email
    await sendApprovalEmail(instructor.email, instructor.name);
    res.status(200).json({
      message: "Instructor approved successfully",
      data: instructor
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject instructor
export const rejectInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const instructor = await User.findByIdAndUpdate(
      id,
      {
        isVerified: false,
        documentStatus: "rejected",
        rejectionReason
      },
      { new: true }
    ).select("-password");

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }
    // Send rejection email
    await sendRejectionEmail(instructor.email, instructor.name, rejectionReason);

    res.status(200).json({
      message: "Instructor rejected",
      data: instructor
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get admin dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalInstructors = await User.countDocuments({ role: "instructor" });
    const verifiedInstructors = await User.countDocuments({ role: "instructor", isVerified: true });
    const pendingInstructors = await User.countDocuments({ role: "instructor", documentStatus: "pending" });
    
    const totalCourses = await Course.countDocuments({});
    const totalEnrollments = await Enrollment.countDocuments({});

    res.status(200).json({
      message: "Dashboard statistics fetched",
      stats: {
        totalUsers,
        totalStudents,
        totalInstructors,
        verifiedInstructors,
        pendingInstructors,
        totalCourses,
        totalEnrollments
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all students
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");

    res.status(200).json({
      message: "Students fetched successfully",
      total: students.length,
      data: students
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");

    res.status(200).json({
      message: "Courses fetched successfully",
      total: courses.length,
      data: courses
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Deactivate user
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deactivated",
      data: user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get pending instructor applications
export const getPendingApplications = async (req, res) => {
  try {
    const applications = await User.find({
      role: "instructor",
      documentStatus: "pending"
    }).select("-password");

    res.status(200).json({
      message: "Pending applications fetched",
      total: applications.length,
      data: applications
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
