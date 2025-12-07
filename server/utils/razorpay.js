import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";

console.log("Razorpay Key:", process.env.RAZORPAY_KEY_ID);

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

