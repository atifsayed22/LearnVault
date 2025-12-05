// server/routes/videoRoutes.js
import express from "express";
import { presignUpload, completeUpload ,getPlaybackUrl } from "../controllers/videoController.js";
import {auth} from "../middlewares/auth.js"; // adjust path to your middleware

const router = express.Router();
router.use(auth);
router.post("/presign-upload", presignUpload);
router.post("/complete", completeUpload);
router.get("/get-playback-url/:lessonId", getPlaybackUrl);


export default router;
