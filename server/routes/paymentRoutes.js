import express from "express";
import { auth } from "../middlewares/auth.js";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();
console.log("Payment routes loaded");

router.post("/create-order", auth, createOrder);
router.post("/verify", auth, verifyPayment);

export default router;
