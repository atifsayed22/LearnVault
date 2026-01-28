import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/users.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Admin credentials
    const adminData = {
      name: 'Super Admin',
      email: 'admin@learnavault.com',
      password: 'admin@123',
      role: 'admin',
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('❌ Admin with this email already exists!');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Name: ${existingAdmin.name}`);
      console.log(`Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(adminData.password, 10);

    // Create admin user
    const admin = await User.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role,
      isVerified: true,
      appliedAsInstructor: false,
      documentStatus: 'approved',
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:    ${adminData.email}`);
    console.log(`🔐 Password: ${adminData.password}`);
    console.log(`👤 Name:     ${admin.name}`);
    console.log(`👑 Role:     ${admin.role}`);
    console.log(`🆔 ID:       ${admin._id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✨ You can now login to the admin panel!');
    console.log('🌐 Go to: http://localhost:5173/auth/login\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
