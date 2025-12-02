import { Router } from "express";

import { createSection, deleteSection } from "../controllers/sectionController.js";
import { auth } from "../middlewares/auth.js";
const router = Router()

router.use(auth);

router.post('/:courseId',createSection);
// router.delete('/:sectionId',deleteSection);


export default router;