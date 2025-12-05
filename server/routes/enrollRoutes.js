import express from "express";
import { enrollCourse } from "../controllers/enrollmentController.js";
import {auth }from "../middlewares/auth.js";

const router = express.Router();

// POST /api/enroll/:courseId
router.post("/:courseId", auth, enrollCourse);

export default router;
