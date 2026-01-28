import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║              LEARNAVAULT - CONFIGURATION CHECK                 ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Check MongoDB
console.log('📦 DATABASE CONFIGURATION');
console.log('─────────────────────────────────────────');
if (process.env.MONGO_URI) {
  console.log('✅ MONGO_URI: Set');
  // Hide actual URI for security
  const uriParts = process.env.MONGO_URI.split('@');
  if (uriParts.length === 2) {
    console.log(`   → mongodb+srv://***@${uriParts[1].substring(0, 20)}...`);
  }
} else {
  console.log('❌ MONGO_URI: Missing');
}

// Check JWT
console.log('\n🔐 AUTHENTICATION CONFIGURATION');
console.log('─────────────────────────────────────────');
if (process.env.JWT_SECRET) {
  console.log('✅ JWT_SECRET: Set');
  console.log(`   → ${process.env.JWT_SECRET.substring(0, 10)}...`);
} else {
  console.log('❌ JWT_SECRET: Missing');
}

// Check Email
console.log('\n📧 EMAIL CONFIGURATION');
console.log('─────────────────────────────────────────');
if (process.env.EMAIL_USER) {
  console.log('✅ EMAIL_USER: Set');
  console.log(`   → ${process.env.EMAIL_USER}`);
} else {
  console.log('❌ EMAIL_USER: Missing');
}

if (process.env.EMAIL_PASSWORD) {
  console.log('✅ EMAIL_PASSWORD: Set');
  console.log(`   → ${process.env.EMAIL_PASSWORD.substring(0, 5)}...`);
} else {
  console.log('❌ EMAIL_PASSWORD: Missing');
}

// Check AWS
console.log('\n☁️  AWS S3 CONFIGURATION');
console.log('─────────────────────────────────────────');
if (process.env.AWS_ACCESS_KEY_ID) {
  console.log('✅ AWS_ACCESS_KEY_ID: Set');
  console.log(`   → ${process.env.AWS_ACCESS_KEY_ID.substring(0, 10)}...`);
} else {
  console.log('❌ AWS_ACCESS_KEY_ID: Missing');
}

if (process.env.AWS_SECRET_ACCESS_KEY) {
  console.log('✅ AWS_SECRET_ACCESS_KEY: Set');
} else {
  console.log('❌ AWS_SECRET_ACCESS_KEY: Missing');
}

if (process.env.AWS_BUCKET_NAME) {
  console.log('✅ AWS_BUCKET_NAME: Set');
  console.log(`   → ${process.env.AWS_BUCKET_NAME}`);
} else {
  console.log('❌ AWS_BUCKET_NAME: Missing');
}

// Check Cloudinary
console.log('\n🖼️  CLOUDINARY CONFIGURATION');
console.log('─────────────────────────────────────────');
if (process.env.CLOUDINARY_CLOUD_NAME) {
  console.log('✅ CLOUDINARY_CLOUD_NAME: Set');
  console.log(`   → ${process.env.CLOUDINARY_CLOUD_NAME}`);
} else {
  console.log('❌ CLOUDINARY_CLOUD_NAME: Missing');
}

if (process.env.CLOUDINARY_API_KEY) {
  console.log('✅ CLOUDINARY_API_KEY: Set');
} else {
  console.log('❌ CLOUDINARY_API_KEY: Missing');
}

// Check Razorpay
console.log('\n💳 RAZORPAY CONFIGURATION');
console.log('─────────────────────────────────────────');
if (process.env.RAZORPAY_KEY_ID) {
  console.log('✅ RAZORPAY_KEY_ID: Set');
  console.log(`   → ${process.env.RAZORPAY_KEY_ID.substring(0, 10)}...`);
} else {
  console.log('❌ RAZORPAY_KEY_ID: Missing');
}

if (process.env.RAZORPAY_KEY_SECRET) {
  console.log('✅ RAZORPAY_KEY_SECRET: Set');
} else {
  console.log('❌ RAZORPAY_KEY_SECRET: Missing');
}

// Test MongoDB Connection
console.log('\n🔗 DATABASE CONNECTION TEST');
console.log('─────────────────────────────────────────');

try {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
  });
  console.log('✅ MongoDB Connection: Success');
  await mongoose.disconnect();
} catch (err) {
  console.log('❌ MongoDB Connection: Failed');
  console.log(`   → Error: ${err.message.substring(0, 50)}...`);
}

// Summary
console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                        SUMMARY                                 ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const required = [
  'MONGO_URI',
  'JWT_SECRET',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_BUCKET_NAME',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET'
];

const missing = required.filter(key => !process.env[key]);
const configured = required.length - missing.length;

console.log(`Total Required Variables: ${required.length}`);
console.log(`Configured Variables: ${configured} ✅`);
console.log(`Missing Variables: ${missing.length} ${missing.length > 0 ? '❌' : '✅'}`);

if (missing.length > 0) {
  console.log('\n⚠️  Missing Variables:');
  missing.forEach(v => console.log(`   • ${v}`));
  console.log('\nPlease add these to your .env file');
} else {
  console.log('\n✅ All configurations are set!');
  console.log('Ready to run admin creation script: node server/create-admin.js');
}

console.log('\n');
