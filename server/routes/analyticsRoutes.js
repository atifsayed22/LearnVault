import { Router } from "express";
import { instructorAnalytics } from "../controllers/analyticsController.js";

import { auth } from "../middlewares/auth.js";
import { isInstructor } from "../middlewares/isInstructor.js";

const router = Router();
router.use(auth, isInstructor);
router.get("/analytics", instructorAnalytics);


export default router;