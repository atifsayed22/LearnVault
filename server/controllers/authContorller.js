import User from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendApplicationReceivedEmail } from "../utils/emailService.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "student"
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ message: "User created", token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// New endpoint: Instructor Registration with Documents
export const registerInstructor = async (req, res) => {
  try {
    const { name, email, password, documents } = req.body;

    // Validation
    if (!name || !email || !password || !documents) {
      return res.status(400).json({ message: "All fields required. Name, email, password, and documents URL are mandatory." });
    }

    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create instructor user with verification fields
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "instructor",
      documents,  // Store Cloudinary URL
      appliedAsInstructor: true,
      applicationDate: new Date(),
      isVerified: false,  // Not verified yet
      documentStatus: "pending"  // Waiting for admin review
    });

    // Send application received email
    try {
      await sendApplicationReceivedEmail(email, name);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Don't fail the registration if email fails
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      message: "Instructor application submitted! Check your email for confirmation.", 
      token, 
      user 
    });
  } catch (err) {
    console.error("Instructor registration error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
