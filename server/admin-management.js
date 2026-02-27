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

const showMenu = () => {
 console.log('\n╔════════════════════════════════════════╗');
  console.log('║        Admin Management Menu           ║');
  console.log('╠════════════════════════════════════════╣');
  console.log('║ 1. List all admins                     ║');
  console.log('║ 2. Create new admin                    ║');
  console.log('║ 3. Update admin password               ║');
  console.log('║ 4. Delete admin                        ║');
  console.log('║ 5. Exit                                ║');
  console.log('╚════════════════════════════════════════╝\n');
};

const listAdmins = async () => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');

    if (admins.length === 0) {
      console.log('\n❌ No admin users found in the database.\n');
      return;
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    📋 Registered Admins                         ║');
    console.log('╠════════════════════════════════════════════════════════════════╣');

    admins.forEach((admin, index) => {
      const createdDate = new Date(admin.createdAt).toLocaleDateString();
      console.log(`\n│ ${index + 1}. Name: ${admin.name}`);
      console.log(`│    Email: ${admin.email}`);
      console.log(`│    ID: ${admin._id}`);
      console.log(`│    Created: ${createdDate}`);
      console.log(`│    Status: ${admin.isVerified ? '✅ Verified' : '❌ Not Verified'}`);
    });

    console.log('\n╚════════════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('❌ Error listing admins:', error.message);
  }
};

const createNewAdmin = async () => {
  try {
    console.log('\n📝 Create New Admin User\n');

    const name = await question('👤 Admin Name: ');
    const email = await question('📧 Email: ');
    const password = await question('🔐 Password: ');
    const confirmPassword = await question('🔐 Confirm Password: ');

    // Validate inputs
    if (!name || !email || !password) {
      console.log('\n❌ All fields are required!');
      return;
    }

    if (password !== confirmPassword) {
      console.log('\n❌ Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      console.log('\n❌ Password must be at least 6 characters!');
      return;
    }

    if (!email.includes('@')) {
      console.log('\n❌ Invalid email format!');
      return;
    }

    // Check if already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`\n❌ Admin with email "${email}" already exists!`);
      return;
    }

    // Create admin
    const hashedPassword = await bcryptjs.hash(password, 10);
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      appliedAsInstructor: false,
      documentStatus: 'approved',
    });

    console.log('\n✅ Admin created successfully!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}\n`);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
};

const updateAdminPassword = async () => {
  try {
    console.log('\n🔐 Update Admin Password\n');

    const email = await question('📧 Admin Email: ');
    const admin = await User.findOne({ email, role: 'admin' });

    if (!admin) {
      console.log(`\n❌ Admin with email "${email}" not found!`);
      return;
    }

    console.log(`✓ Found admin: ${admin.name}`);

    const newPassword = await question('🔐 New Password: ');
    const confirmPassword = await question('🔐 Confirm Password: ');

    if (newPassword !== confirmPassword) {
      console.log('\n❌ Passwords do not match!');
      return;
    }

    if (newPassword.length < 6) {
      console.log('\n❌ Password must be at least 6 characters!');
      return;
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await User.updateOne({ _id: admin._id }, { password: hashedPassword });

    console.log(`\n✅ Password updated successfully for ${admin.name}!\n`);
  } catch (error) {
    console.error('❌ Error updating password:', error.message);
  }
};

const deleteAdmin = async () => {
  try {
    console.log('\n🗑️  Delete Admin User\n');

    const email = await question('📧 Admin Email to Delete: ');
    const admin = await User.findOne({ email, role: 'admin' });

    if (!admin) {
      console.log(`\n❌ Admin with email "${email}" not found!`);
      return;
    }

    console.log(`\n⚠️  You are about to delete: ${admin.name} (${admin.email})`);
    const confirm = await question('Are you sure? (type "DELETE" to confirm): ');

    if (confirm !== 'DELETE') {
      console.log('\n❌ Deletion cancelled.\n');
      return;
    }

    await User.deleteOne({ _id: admin._id });
    console.log(`\n✅ Admin "${admin.name}" deleted successfully!\n`);
  } catch (error) {
    console.error('❌ Error deleting admin:', error.message);
  }
};

const main = async () => {
  try {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║  LearnVault - Admin Management System   ║');
    console.log('╚════════════════════════════════════════╝');

    console.log('\n🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    let isRunning = true;

    while (isRunning) {
      showMenu();
      const choice = await question('Enter your choice (1-5): ');

      switch (choice.trim()) {
        case '1':
          await listAdmins();
          break;
        case '2':
          await createNewAdmin();
          break;
        case '3':
          await updateAdminPassword();
          break;
        case '4':
          await deleteAdmin();
          break;
        case '5':
          console.log('👋 Goodbye!\n');
          isRunning = false;
          break;
        default:
          console.log('\n❌ Invalid choice! Please select 1-5.\n');
      }
    }

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

main();
