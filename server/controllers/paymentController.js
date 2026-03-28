import Course from "../models/course.js";
import crypto from "crypto";
import Enrollment from "../models/enrolment.js";
import Wallet from "../models/wallet.js";
import { razorpay } from "../utils/razorpay.js";
export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.body;

        const course = await Course.findById(courseId).populate("instructor");
        if (!course) return res.status(404).json({ message: "Course not found" });
        if (!course.instructor) {
            return res.status(400).json({
                message: "This course is currently unavailable for purchase"
            });
        }

        const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (existingEnrollment) {
            return res.status(409).json({ message: "You are already enrolled in this course" });
        }

        const amount = course.price * 100; // convert to paise

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt:`rcpt_${Date.now()}`,
        });

        return res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            courseId,
            key: process.env.RAZORPAY_KEY_ID,
        });

    } catch (err) {
        console.error("createOrder Error:", err);
        res.status(500).json({ message: "Failed to create order" });
    }
};
export const verifyPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature, 
            courseId 
        } = req.body;

        const userId = req.user.id;

        // 1️⃣ Validate signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        // 2️⃣ Fetch course
        const course = await Course.findById(courseId).populate("instructor");
        if (!course) return res.status(404).json({ message: "Course not found" });
        if (!course.instructor) {
            return res.status(400).json({
                message: "Payment cannot be verified because course instructor is unavailable"
            });
        }

        const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (existingEnrollment) {
            return res.status(409).json({ message: "You are already enrolled in this course" });
        }

        const price = course.price;
        const platformFee = price * 20 / 100; // 20% platform fee
        const instructorEarnings = Math.floor(price - platformFee);

        // 3️⃣ Create enrollment
        const enrollment = await Enrollment.create({
            user: userId,
            course: courseId,
            status: "paid",
            amountPaid: price,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            platformFees: platformFee,
            instructorEarnings
        });

        // 4️⃣ Update course.student list
        if (!course.students.some((studentId) => studentId.toString() === userId.toString())) {
            course.students.push(userId);
        }
        await course.save();

        // 5️⃣ Update instructor wallet
        let wallet = await Wallet.findOne({ instructor: course.instructor._id });

        if (!wallet) {
            wallet = await Wallet.create({
                instructor: course.instructor._id,
                availableBalance: instructorEarnings,
                totalEarned: instructorEarnings
            });
        } else {
            wallet.availableBalance += instructorEarnings;
            wallet.totalEarned += instructorEarnings;
            await wallet.save();
        }

        return res.json({
            success: true,
            message: "Payment verified. Enrollment created.",
            enrollmentId: enrollment._id
        });

    } catch (err) {
        console.error("verifyPayment Error:", err);
        res.status(500).json({ message: "Payment verification failed" });
    }
};
