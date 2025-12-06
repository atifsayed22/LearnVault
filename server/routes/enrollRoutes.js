import express from "express";
import { enrollCourse , getMyCourses } from "../controllers/enrollmentController.js";
import {auth }from "../middlewares/auth.js";

const router = express.Router();

// POST /api/enroll/:courseId
router.post("/:courseId", auth, enrollCourse);
router.get("/my-courses", auth, getMyCourses);
export default router;
