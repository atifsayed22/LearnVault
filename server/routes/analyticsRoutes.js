import { Router } from "express";
import { instructorAnalytics, getCourseCompletionStats } from "../controllers/analyticsController.js";

import { auth } from "../middlewares/auth.js";
import { isInstructor } from "../middlewares/isInstructor.js";

const router = Router();
router.use(auth, isInstructor);
router.get("/analytics", instructorAnalytics);
router.get("/course/:courseId/completion-stats", getCourseCompletionStats);


export default router;