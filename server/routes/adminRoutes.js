import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
  getInstructors,
  getInstructorDetails,
  approveInstructor,
  rejectInstructor,
  getDashboardStats,
  getStudents,
  getAllCourses,
  deactivateUser,
  getPendingApplications
} from "../controllers/adminController.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(auth);
router.use(isAdmin);

// Dashboard
router.get("/stats", getDashboardStats);

// Instructors Management
router.get("/instructors", getInstructors);
router.get("/instructors/:id", getInstructorDetails);
router.put("/instructors/:id/approve", approveInstructor);
router.put("/instructors/:id/reject", rejectInstructor);
router.get("/applications/pending", getPendingApplications);

// Students Management
router.get("/students", getStudents);

// Courses Management
router.get("/courses", getAllCourses);

// User Management
router.delete("/users/:id/deactivate", deactivateUser);

export default router;
