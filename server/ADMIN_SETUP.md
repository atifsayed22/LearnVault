/**
 * ADMIN USER SETUP GUIDE
 * 
 * You need to manually create the first admin user.
 * Choose ONE of these methods:
 */

/**
 * METHOD 1: MongoDB Compass (GUI - Easiest)
 * ==========================================
 * 
 * 1. Open MongoDB Compass
 * 2. Connect to your LearnVault database
 * 3. Find the 'users' collection
 * 4. Click "Insert Document"
 * 5. Copy-paste this JSON:
 */

{
  "_id": ObjectId("507f1f77bcf86cd799439011"),  // Leave empty, Mongo will auto-generate
  "name": "Admin",
  "email": "admin@learnvault.com",
  "password": "$2a$10$...",  // See METHOD 3 for bcrypt hash
  "role": "admin",
  "isVerified": true,
  "appliedAsInstructor": false,
  "documentStatus": "pending",
  "createdAt": new Date(),
  "updatedAt": new Date()
}

/**
 * METHOD 2: Using MongoDB CLI (Command Line)
 * ===========================================
 * 
 * 1. Open terminal/PowerShell
 * 2. Run: mongosh
 * 3. Run: use learnvault  (replace with your db name)
 * 4. Run:
 */

db.users.insertOne({
  name: "Admin",
  email: "admin@learnvault.com",
  password: "$2a$10$...",  // bcrypt hash
  role: "admin",
  isVerified: true,
  appliedAsInstructor: false,
  documentStatus: "pending"
})

/**
 * METHOD 3: Generate Bcrypt Password Hash
 * ========================================
 * 
 * Create this temp file: hash-password.js
 */

import bcrypt from "bcryptjs";

const password = "your_admin_password_here";
const hashed = await bcrypt.hash(password, 10);
console.log(hashed);

/**
 * Then run: node hash-password.js
 * Copy the output and use it in the password field above
 */

/**
 * METHOD 4: Create Admin via Node Script (Recommended)
 * ===================================================
 * 
 * Create file: server/scripts/create-admin.js
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/users.js";
import dotenv from "dotenv";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const exists = await User.findOne({ email: "admin@learnvault.com" });
    if (exists) {
      console.log("❌ Admin already exists");
      process.exit(1);
    }

    const hashed = await bcrypt.hash("admin123", 10);
    
    const admin = await User.create({
      name: "Admin",
      email: "admin@learnvault.com",
      password: hashed,
      role: "admin",
      isVerified: true,
      appliedAsInstructor: false,
      documentStatus: "pending"
    });

    console.log("✅ Admin created successfully");
    console.log("Email: admin@learnvault.com");
    console.log("Password: admin123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();

/**
 * TO RUN:
 * In terminal: node server/scripts/create-admin.js
 * Change email and password as needed
 */
