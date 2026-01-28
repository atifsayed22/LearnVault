import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import readline from 'readline';
import User from './models/users.js';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdminInteractive = async () => {
  try {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║  LearnVault - Create Admin User Script  ║');
    console.log('╚════════════════════════════════════════╝\n');

    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get admin details from user
    console.log('📝 Enter admin details:\n');
    const name = await question('👤 Admin Name: ');
    const email = await question('📧 Email: ');
    const password = await question('🔐 Password: ');
    const confirmPassword = await question('🔐 Confirm Password: ');

    // Validate inputs
    if (!name || !email || !password) {
      console.log('\n❌ Error: All fields are required!');
      process.exit(1);
    }

    if (password !== confirmPassword) {
      console.log('\n❌ Error: Passwords do not match!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('\n❌ Error: Password must be at least 6 characters long!');
      process.exit(1);
    }

    if (!email.includes('@')) {
      console.log('\n❌ Error: Please enter a valid email address!');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('\n❌ Error: Admin with this email already exists!');
      console.log(`   Email: ${existingAdmin.email}`);
      process.exit(1);
    }

    // Hash password
    console.log('\n🔒 Hashing password...');
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      appliedAsInstructor: false,
      documentStatus: 'approved',
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║          🎉 Admin Created Successfully! 🎉     ║');
    console.log('╠════════════════════════════════════════════════╣');
    console.log(`║ 👤 Name:    ${name.padEnd(33)}║`);
    console.log(`║ 📧 Email:   ${email.padEnd(33)}║`);
    console.log(`║ 👑 Role:    Admin${' '.repeat(30)}║`);
    console.log(`║ 🆔 ID:      ${admin._id.toString().substring(0, 35)}║`);
    console.log('╠════════════════════════════════════════════════╣');
    console.log('║ 🌐 Login URL:                                  ║');
    console.log('║    http://localhost:5173/auth/login            ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

createAdminInteractive();
