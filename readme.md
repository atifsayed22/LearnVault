# LearnVault - Online Learning Platform

A full-stack learning management system built with **MERN Stack** (MongoDB, Express, React, Node.js).

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB
- npm or yarn

### Installation

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend/vite-project
npm install
```

### Setup Environment Variables

Create `.env` file in `server` folder:
```
MONGO_URI=mongodb://localhost:27017/learnavault
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Run Application

```bash
# Terminal 1: Start Backend
cd server
npm run dev

# Terminal 2: Start Frontend
cd frontend/vite-project
npm run dev
```

Backend runs on `http://localhost:5000`
Frontend runs on `http://localhost:5173`

---

## 📁 Project Structure

```
LearnVault/
├── server/
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── middlewares/     # Auth, validation
│   ├── utils/           # Email, S3, payments
│   ├── app.js          # Express app
│   └── package.json
│
└── frontend/vite-project/
    ├── src/
    │   ├── pages/      # Page components
    │   ├── components/ # Reusable components
    │   ├── layout/     # Layout wrappers
    │   ├── context/    # Auth context
    │   ├── routes/     # Route guards
    │   ├── utils/      # Helpers
    │   └── App.jsx     # Main app
    └── package.json
```

---

## 👥 User Roles

### 1. **Student**
- Browse and enroll in courses
- Watch video lessons
- Track learning progress
- View certificates

### 2. **Instructor**
- Create and manage courses
- Upload video lessons
- Set pricing
- View earnings
- Track student enrollments

### 3. **Admin**
- Verify instructor applications
- Manage users and courses
- View platform statistics
- Monitor system health

---

## 🎛️ Admin Panel

### Access Admin Panel
1. Login with admin credentials (role: "admin")
2. Navigate to `/admin`

### Features

**Dashboard**
- Platform statistics (users, courses, enrollments)
- Quick action buttons
- Verification status overview

**Instructor Management**
- List all instructors
- Filter by status (Pending, Approved, Rejected)
- Approve/Reject applications
- View instructor details and documents

**Pending Applications**
- Review new instructor applications
- Access uploaded documents
- Approve or reject with feedback

**Student Management**
- View all registered students
- Search by name or email

**Course Management**
- Monitor all courses
- View course details and instructor info
- Track course status

### Create Admin User

**Using MongoDB Direct:**
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@learnavault.com",
  password: "hashed_password_from_bcrypt",
  role: "admin",
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

**Using Node Script:**
```bash
cd server
node scripts/create-admin.js
```

Then follow the prompts to create admin account.

### Admin API Endpoints

All endpoints require JWT token + admin role

```
GET    /api/admin/stats                    # Dashboard statistics
GET    /api/admin/instructors              # List instructors
GET    /api/admin/instructors/:id          # Instructor details
PUT    /api/admin/instructors/:id/approve  # Approve instructor
PUT    /api/admin/instructors/:id/reject   # Reject instructor
GET    /api/admin/applications/pending     # Pending applications
GET    /api/admin/students                 # List students
GET    /api/admin/courses                  # List courses
PUT    /api/admin/users/:id/deactivate     # Deactivate user
```

---

## 🔐 Security Features

- ✅ JWT Authentication
- ✅ Password Hashing (bcryptjs)
- ✅ Role-Based Access Control (RBAC)
- ✅ Protected Routes
- ✅ Email Verification
- ✅ Secure Payment Integration (Razorpay)

---

## 📚 Key Features

### For Students
- Course browsing with filters
- Video lesson streaming
- Progress tracking
- Lesson completion
- Enrollment management

### For Instructors
- Course creation and editing
- Lesson management
- Video uploading
- Price setting
- Earnings dashboard
- Student enrollment tracking

### For Admin
- User verification workflow
- Platform monitoring
- Content management
- Analytics dashboard
- System health checks

---

## 🛠️ Tech Stack

**Backend**
- Express.js - REST API
- MongoDB - Database
- JWT - Authentication
- bcryptjs - Password hashing
- Multer - File uploads
- Nodemailer - Email service
- Razorpay - Payment processing

**Frontend**
- React 18 - UI library
- Vite - Build tool
- React Router v6 - Navigation
- Tailwind CSS - Styling
- Axios - HTTP client
- Lucide Icons - Icons
- Context API - State management

---

## 📝 API Documentation

### Authentication Routes
```
POST   /api/auth/register              # Register student
POST   /api/auth/register-instructor   # Register instructor
POST   /api/auth/login                 # Login user
```

### Course Routes
```
GET    /api/course/all                 # Get all courses
POST   /api/course/create              # Create course (instructor)
GET    /api/course/:id                 # Get course details
PUT    /api/course/:id/edit            # Edit course (instructor)
DELETE /api/course/:id                 # Delete course (instructor)
```

### Enrollment Routes
```
POST   /api/enrollment/enroll          # Enroll in course
GET    /api/enrollment/my-courses      # Get enrolled courses
```

### Payment Routes
```
POST   /api/payment/create-order       # Create payment order
POST   /api/payment/verify-payment     # Verify payment

```

---

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`

**Email Not Sending**
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Use Gmail app password (not regular password)
- Enable "Less secure app access" if needed

**Admin Panel Not Loading**
- Verify user has `role: "admin"` in database
- Check JWT token is valid
- Clear browser cache and localStorage

**Video Upload Issues**
- Check Cloudinary credentials
- Verify file size limits
- Check internet connection

---

## 📊 Database Schema

### Users
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'instructor' | 'admin',
  isVerified: Boolean,
  documentStatus: 'pending' | 'approved' | 'rejected',
  documents: String (URL),
  createdAt: Date
}
```

### Courses
```javascript
{
  title: String,
  description: String,
  instructor: ObjectId (User),
  price: Number,
  image: String (URL),
  category: String,
  level: 'beginner' | 'intermediate' | 'advanced',
  isPublished: Boolean,
  createdAt: Date
}
```

### Enrollments
```javascript
{
  student: ObjectId (User),
  course: ObjectId (Course),
  progress: Number,
  enrolledAt: Date
}
```

---

## 🚀 Deployment

### Deploy Backend (Heroku)
```bash
cd server
git push heroku main
```

### Deploy Frontend (Vercel)
```bash
cd frontend/vite-project
vercel
```

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

MIT License - feel free to use this project

---

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation
- Check browser console for errors

---

**Last Updated:** January 28, 2026
**Version:** 1.0
