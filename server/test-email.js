import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

console.log("Testing Email Configuration...\n");

// Show what's loaded
console.log("EMAIL_USER:", process.env.EMAIL_USER ? `✓ ${process.env.EMAIL_USER}` : "❌ NOT SET");
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? `✓ ***hidden***` : "❌ NOT SET");

// Test transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

console.log("\nVerifying SMTP connection...");
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP Connection Failed:");
    console.log("Error:", error.message);
    console.log("\nPossible issues:");
    console.log("1. EMAIL_USER is not set in .env");
    console.log("2. EMAIL_PASSWORD is not set in .env");
    console.log("3. EMAIL_PASSWORD is regular Gmail password (not App Password)");
    console.log("4. Gmail account has 2FA enabled without App Password");
    process.exit(1);
  } else {
    console.log("✅ SMTP Connection Successful!");
    console.log("Email service is ready to send emails");
    process.exit(0);
  }
});
