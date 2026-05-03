# LearnVault - High Level Design (HLD) Document

## 1. System Overview

**LearnVault** is a full-stack online learning platform that enables instructors to create and sell courses while students can learn through video-based content. It follows a **MERN Stack** architecture (MongoDB, Express, React, Node.js) with role-based access control for three user types: Student, Instructor, and Admin.

### Core Objective
- Enable course creators to monetize their content
- Provide students with a platform to purchase and learn from courses
- Allow admins to manage platform operations and user verification

---

## 2. System Architecture (Layered View)

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │
│  │   Student UI   │  │  Instructor UI │  │    Admin UI    │    │
│  │  (React/Vite)  │  │  (React/Vite)  │  │  (React/Vite)  │    │
│  └────────────────┘  └────────────────┘  └────────────────┘    │
└────────┬────────────────────────────────────────────────────┬───┘
         │ HTTP/HTTPS Requests with JWT Token               │
         ▼                                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                            │
│  Express.js Server with CORS, Auth Middleware, Rate Limiting   │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─────────────────────────────────────────────────────────┐
         ▼                                                         ▼
┌─────────────────────────────┐                   ┌──────────────────────────────┐
│   BUSINESS LOGIC LAYER      │                   │  EXTERNAL SERVICES LAYER     │
│  (Route Handlers & Logic)   │                   │                              │
│                             │                   │  ┌────────────────────────┐  │
│  ┌──────────────────────┐   │                   │  │  Razorpay (Payments)   │  │
│  │ Auth Controller      │   │                   │  └────────────────────────┘  │
│  ├──────────────────────┤   │                   │                              │
│  │ Course Controller    │   │                   │  ┌────────────────────────┐  │
│  ├──────────────────────┤   │                   │  │  AWS S3 (Storage)      │  │
│  │ Lesson Controller    │   │                   │  └────────────────────────┘  │
│  ├──────────────────────┤   │                   │                              │
│  │ Enrollment Controller│   │                   │  ┌────────────────────────┐  │
│  ├──────────────────────┤   │                   │  │  Email Service (Gmail) │  │
│  │ Payment Controller   │   │                   │  └────────────────────────┘  │
│  ├──────────────────────┤   │                   │                              │
│  │ Progress Controller  │   │                   └──────────────────────────────┘
│  ├──────────────────────┤   │
│  │ Analytics Controller │   │
│  ├──────────────────────┤   │
│  │ Admin Controller     │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   DATA ACCESS LAYER         │
│  (Models & Queries)         │
│                             │
│  ┌──────────────────────┐   │
│  │ User Model           │   │
│  ├──────────────────────┤   │
│  │ Course Model         │   │
│  ├──────────────────────┤   │
│  │ Section Model        │   │
│  ├──────────────────────┤   │
│  │ Lesson Model         │   │
│  ├──────────────────────┤   │
│  │ Enrollment Model     │   │
│  ├──────────────────────┤   │
│  │ LessonProgress Model │   │
│  ├──────────────────────┤   │
│  │ Wallet Model         │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
         │
         ▼
   ┌──────────────────┐
   │   MongoDB        │
   │   Database       │
   └──────────────────┘
```

---

## 2.1 Component-Based HLD Diagram

```
╔═════════════════════════════════════════════════════════════════════════════╗
║                      LEARNAVAULT COMPONENT ARCHITECTURE                     ║
╚═════════════════════════════════════════════════════════════════════════════╝

                          ┌──────────────────────────┐
                          │   CLIENT TIER (FRONTEND) │
                          └────────────┬─────────────┘
                                       │
                  ┌────────────────────┼────────────────────┐
                  │                    │                    │
         ┌────────▼────────┐  ┌───────▼────────┐  ┌────────▼────────┐
         │  Student Portal │  │ Instructor Hub │  │   Admin Panel   │
         │                 │  │                │  │                 │
         │ • Browse Courses│  │ • Create Course│  │ • Dashboard     │
         │ • Course Player │  │ • Manage Lesson│ │ • User Mgmt     │
         │ • My Learning   │  │ • Earnings     │  │ • Verification  │
         │ • Certificates  │  │ • Analytics    │  │ • Moderation    │
         └────────┬────────┘  └────────┬───────┘  └────────┬────────┘
                  │                    │                    │
                  └────────────────────┼────────────────────┘
                                       │ (HTTP/HTTPS + JWT)
                          ┌────────────▼─────────────┐
                          │   EXPRESS API GATEWAY    │
                          │  ┌────────────────────┐  │
                          │  │ • CORS              │  │
                          │  │ • Auth Middleware   │  │
                          │  │ • Rate Limiter      │  │
                          │  │ • Error Handler     │  │
                          │  └────────────────────┘  │
                          └────────────┬─────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
        ▼                              ▼                              ▼
   ┌────────────┐              ┌──────────────┐             ┌────────────┐
   │   AUTH     │              │  CORE DOMAIN │             │ INTEGRATION│
   │ COMPONENT  │              │  COMPONENTS  │             │ COMPONENTS │
   ├────────────┤              ├──────────────┤             ├────────────┤
   │            │              │              │             │            │
   │ • Register │              │ ┌──────────┐ │             │ ┌────────┐ │
   │ • Login    │◄────┬────────┤ │ COURSE   │ │◄────────────┤ │ PAYMENT│ │
   │ • Verify   │     │        │ │ COMPONENT│ │             │ │SERVICE │ │
   │ • JWT Mgmt │     │        │ └──────────┘ │             │ └────────┘ │
   │ • Roles    │     │        │              │             │            │
   │            │     │        │ ┌──────────┐ │             │ ┌────────┐ │
   └────────────┘     │        │ │ LESSON   │ │             │ │ STORAGE│ │
                      │        │ │ COMPONENT│◄┼─────────────┤ │SERVICE │ │
                      │        │ └──────────┘ │             │ │(S3)    │ │
                      │        │              │             │ └────────┘ │
                      │        │ ┌──────────┐ │             │            │
                      │        │ │ENROLLMENT│ │             │ ┌────────┐ │
                      │◄───────┤ │COMPONENT │◄┼─────────────┤ │ EMAIL  │ │
                      │        │ └──────────┘ │             │ │SERVICE │ │
                      │        │              │             │ └────────┘ │
                      │        │ ┌──────────┐ │             │            │
                      │        │ │PROGRESS  │ │             └────────────┘
                      │        │ │COMPONENT │ │
                      │        │ └──────────┘ │
                      │        │              │
                      │        │ ┌──────────┐ │
                      │        │ │ANALYTICS │ │
                      │        │ │COMPONENT │ │
                      │        │ └──────────┘ │
                      │        │              │
                      │        │ ┌──────────┐ │
                      │        │ │  ADMIN   │ │
                      │        │ │COMPONENT │ │
                      │        │ └──────────┘ │
                      │        └──────────────┘
                      │               │
                      └───────┬───────┘
                              │
                ┌─────────────▼──────────────┐
                │   PERSISTENCE LAYER        │
                ├────────────────────────────┤
                │                            │
                │  ┌──────────────────────┐  │
                │  │  DATABASE MODELS     │  │
                │  │  ┌────────────────┐  │  │
                │  │  │ • Users         │  │  │
                │  │  │ • Courses       │  │  │
                │  │  │ • Enrollments   │  │  │
                │  │  │ • LessonProgress│  │  │
                │  │  │ • Wallets       │  │  │
                │  │  │ • Sections      │  │  │
                │  │  │ • Lessons       │  │  │
                │  │  └────────────────┘  │  │
                │  └──────────────────────┘  │
                └────────────┬─────────────┘
                             │
                  ┌──────────▼──────────┐
                  │   MONGODB DATABASE  │
                  │  (Production DB)    │
                  └─────────────────────┘
```

---

## 2.2 Component Interaction Matrix

| Component | Depends On | Used By | Purpose |
|-----------|-----------|---------|---------|
| **Auth** | User Model | All Controllers | JWT authentication, role verification |
| **Course** | User, Section, Lesson | Enrollment, Analytics | Course CRUD, publishing |
| **Lesson** | Section, Course | Progress, Course Player | Lesson management, video serving |
| **Enrollment** | User, Course, Payment | Progress, Analytics | Student enrollment tracking |
| **Payment** | Enrollment, Wallet | External: Razorpay | Payment processing, fee distribution |
| **Progress** | User, Lesson, Course | Analytics | Track student learning |
| **Analytics** | Course, Progress, Enrollment | Admin Dashboard | Generate reports & insights |
| **Admin** | User, Course, Enrollment | Dashboard | User management, moderation |
| **Storage** | Lesson, Course | All Components | File upload/retrieval (S3) |
| **Email** | User, Enrollment, Progress | All Services | Transactional notifications |

---

## 3. Core Components & Responsibilities

### 3.1 Frontend Components

#### **Landing Page & Authentication**
- Public landing page with platform overview
- Student signup/login
- Instructor registration with verification
- OAuth integration ready

#### **Student Module**
- **Browse Courses**: Search, filter by category, view course details
- **Course Player**: Video streaming with lesson navigation
- **My Learning**: Track enrolled courses and progress
- **Progress Tracking**: View completion percentage per course
- **Certificates**: Download course completion certificates

#### **Instructor Module**
- **Dashboard**: Overview of course performance
- **Course Builder**: Create/edit courses with drag-and-drop sections
- **Lesson Management**: Add video lessons to sections
- **Video Upload**: Upload videos to AWS S3
- **Earnings Dashboard**: View revenue, platform fees, earnings
- **Analytics**: Student completion rates, engagement metrics
- **Profile**: Manage instructor information

#### **Admin Module**
- **Dashboard**: Platform statistics and overview
- **User Management**: Manage students and instructors
- **Instructor Verification**: Approve/reject instructor applications
- **Course Management**: Monitor all courses, publish/unpublish
- **Pending Applications**: Review instructor verification requests

### 3.2 Backend Components

#### **Authentication System**
- JWT token-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Instructor verification workflow

#### **Course Management**
- Course creation and publishing
- Versioning and updates
- Category-based organization
- Thumbnail management

#### **Video Management**
- Video upload to AWS S3
- Video metadata storage
- Video streaming integration
- Progress tracking per video

#### **Payment Processing**
- Razorpay integration for payment gateway
- Order creation and verification
- Refund management
- Revenue distribution (instructor vs platform)

#### **Enrollment System**
- Track student enrollments
- Manage free and paid enrollments
- Generate enrollment records with payment details
- Handle cancellations

#### **Progress Tracking**
- Track lesson completion per student
- Store time spent on lessons
- Overall course progress calculation
- Completion status management

#### **Analytics & Reporting**
- Instructor earnings tracking
- Course performance metrics
- Student engagement reports
- Platform statistics

#### **Admin Management**
- Instructor verification workflow
- User management (promote/demote roles)
- Content moderation
- Platform configuration

#### **Email Service**
- Welcome emails
- Enrollment confirmation
- Course completion notifications
- Instructor verification status updates

---

## 4. Database Schema & Relationships

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │
├─────────────┤
│ _id         │◄──────────┐
│ name        │           │
│ email       │           │
│ password    │           │ 1:Many
│ role        │           │
│ isVerified  │           │
└─────────────┘           │
        ▲                  │
        │ 1:Many           │
        │                  │
        └──────────────┐───┴────────┐
                       │            │
                ┌──────▼────┐  ┌────▼──────┐
                │  Course   │  │ Enrollment│
                ├───────────┤  ├───────────┤
                │ _id       │  │ _id       │
                │ title     │  │ user      │
                │ price     │  │ course    │
                │ instructor   │ status    │
                │ sections  │  │ amountPaid│
                │ students  │  │ paymentId │
                └───────────┘  └───────────┘
                     │
                     │ 1:Many
                     │
                ┌────▼────────┐
                │   Section   │
                ├─────────────┤
                │ _id         │
                │ course      │
                │ title       │
                │ lessons     │
                └─────────────┘
                     │
                     │ 1:Many
                     │
                ┌────▼────────┐          ┌──────────────┐
                │   Lesson    │◄─────────┤LessonProgress│
                ├─────────────┤ 1:Many   ├──────────────┤
                │ _id         │          │ _id          │
                │ section     │          │ user         │
                │ title       │          │ lesson       │
                │ videoUrl    │          │ completed    │
                │ duration    │          │ timeSpent    │
                └─────────────┘          └──────────────┘

┌──────────────┐
│   Wallet     │
├──────────────┤
│ _id          │
│ instructor   │
│ balance      │
│ totalEarnings│
└──────────────┘
```

### Core Models

#### **User**
```
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['student', 'instructor', 'admin'],
  isVerified: Boolean (for instructors),
  documents: String (Cloudinary URL),
  appliedAsInstructor: Boolean,
  applicationDate: Date,
  documentStatus: ['pending', 'approved', 'rejected'],
  timestamps: true
}
```

#### **Course**
```
{
  title: String,
  description: String,
  price: Number,
  category: String,
  thumbnail: String,
  instructor: ObjectId (ref: User),
  published: Boolean,
  students: [ObjectId] (ref: User),
  sections: [ObjectId] (ref: Section),
  timestamps: true
}
```

#### **Section**
```
{
  course: ObjectId (ref: Course),
  title: String,
  lessons: [ObjectId] (ref: Lesson),
  timestamps: true
}
```

#### **Lesson**
```
{
  section: ObjectId (ref: Section),
  title: String,
  videoUrl: String,
  duration: Number,
  description: String,
  timestamps: true
}
```

#### **Enrollment**
```
{
  user: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  status: ['free', 'paid'],
  amountPaid: Number,
  paymentId: String (Razorpay),
  orderId: String (Razorpay),
  platformFees: Number,
  instructorEarnings: Number,
  enrolledAt: Date,
  timestamps: true
}
```

#### **LessonProgress**
```
{
  user: ObjectId (ref: User),
  lesson: ObjectId (ref: Lesson),
  completed: Boolean,
  timeSpent: Number (minutes),
  lastAccessed: Date,
  timestamps: true
}
```

#### **Wallet**
```
{
  instructor: ObjectId (ref: User),
  balance: Number,
  totalEarnings: Number,
  transactions: [Object],
  timestamps: true
}
```

---

## 5. API Architecture & Endpoints

### API Routes Structure

```
/api
├── /auth                          # Authentication & Authorization
│   ├── POST /register             # Register new user
│   ├── POST /login                # User login
│   ├── POST /instructor-apply     # Apply as instructor
│   └── GET /profile               # Get current user profile
│
├── /course                        # Course Management
│   ├── GET /                      # Get all courses (with filters)
│   ├── GET /:id                   # Get course details
│   ├── POST /                     # Create course (instructor)
│   ├── PUT /:id                   # Update course (instructor)
│   ├── DELETE /:id                # Delete course (instructor)
│   └── GET /instructor/:id        # Get instructor's courses
│
├── /sections                      # Section Management
│   ├── POST /                     # Create section
│   ├── PUT /:id                   # Update section
│   └── DELETE /:id                # Delete section
│
├── /lessons                       # Lesson Management
│   ├── POST /                     # Create lesson
│   ├── PUT /:id                   # Update lesson
│   ├── DELETE /:id                # Delete lesson
│   └── GET /:id                   # Get lesson details
│
├── /videos                        # Video Management
│   ├── POST /upload               # Upload video to S3
│   ├── GET /:id                   # Get video streaming URL
│   └── DELETE /:id                # Delete video
│
├── /enrollment                    # Enrollment Management
│   ├── POST /                     # Enroll in course
│   ├── GET /my-courses            # Get enrolled courses
│   ├── GET /:id                   # Get enrollment details
│   └── DELETE /:id                # Cancel enrollment
│
├── /payment                       # Payment Processing
│   ├── POST /create-order         # Create Razorpay order
│   ├── POST /verify-payment       # Verify payment
│   └── GET /transactions          # Get payment history
│
├── /progress                      # Progress Tracking
│   ├── POST /                     # Mark lesson complete
│   ├── GET /course/:courseId      # Get course progress
│   ├── GET /lesson/:lessonId      # Get lesson progress
│   └── PUT /:id                   # Update progress
│
├── /instructor                    # Analytics & Earnings
│   ├── GET /earnings              # Get instructor earnings
│   ├── GET /analytics             # Get course analytics
│   ├── GET /students              # Get enrolled students
│   └── GET /reports               # Get detailed reports
│
└── /admin                         # Admin Management
    ├── GET /users                 # Get all users
    ├── PUT /users/:id             # Update user
    ├── POST /verify-instructor    # Approve/reject instructor
    ├── GET /applications          # Get pending applications
    ├── GET /courses               # Get all courses
    ├── POST /courses/:id/publish  # Publish course
    └── GET /statistics            # Platform statistics
```

---

## 6. Component Interactions & Data Flow

### 6.1 Course Creation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ INSTRUCTOR INITIATES COURSE CREATION                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Frontend: CourseForm Component Collects Data                     │
│  - Title, Description, Category, Price, Thumbnail Upload       │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ API: POST /api/course                                            │
│  - Validates JWT Token (Auth Middleware)                        │
│  - Checks User Role is 'instructor' (isInstructor Middleware)   │
│  - Uploads thumbnail to AWS S3                                  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Backend: courseController.createCourse()                        │
│  - Validates input data                                         │
│  - Creates Course record in MongoDB                             │
│  - Sets instructor reference                                    │
│  - Returns course with ID                                       │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Frontend: Instructor Adds Sections & Lessons                    │
│  - Each section contains multiple lessons                       │
│  - Each lesson can have video upload                            │
└──────────────────────────────────────────────────────────────────┘
```

### 6.2 Student Enrollment & Payment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ STUDENT VIEWS COURSE & CLICKS "ENROLL"                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Frontend: Check if Course is Free or Paid                       │
│  - IF Free → Directly enroll student                            │
│  - IF Paid → Show Razorpay payment form                         │
└──────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
                    ▼ (FREE)             ▼ (PAID)
        ┌──────────────────┐    ┌──────────────────────────┐
        │ POST /enrollment │    │ POST /payment/create-order│
        │ (Direct Enroll)  │    │ (Create Razorpay Order)  │
        └────────┬─────────┘    └────────┬─────────────────┘
                 │                       │
                 │              ┌────────▼────────────┐
                 │              │ Razorpay Gateway   │
                 │              │ - User enters card │
                 │              │ - Payment processed│
                 │              │ - Payment ID sent  │
                 │              └────────┬────────────┘
                 │                       │
                 │              ┌────────▼───────────────────┐
                 │              │POST /payment/verify-payment│
                 │              │ - Verify with Razorpay    │
                 │              │ - Create Enrollment       │
                 │              │ - Update Wallet (Instructor)
                 │              └────────┬───────────────────┘
                 └────────┬──────────────┘
                          │
                          ▼
        ┌──────────────────────────────────────────┐
        │ Backend: Enrollment Record Created       │
        │  - Record student in Course.students[]   │
        │  - Calculate fees (Platform vs Instructor)
        │  - Send enrollment confirmation email    │
        └──────────────────────────────────────────┘
                          │
                          ▼
        ┌──────────────────────────────────────────┐
        │ Frontend: Redirect to Course Player      │
        │  - Student can now view lessons          │
        │  - Progress tracking begins              │
        └──────────────────────────────────────────┘
```

### 6.3 Lesson Viewing & Progress Tracking Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ STUDENT OPENS COURSE PLAYER & CLICKS ON LESSON                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Frontend: VideoPlayer Component                                 │
│  - Loads lesson details with video URL                          │
│  - Initializes video player (HLS streaming)                     │
│  - Sets up progress tracking listeners                          │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Student Watches Video                                           │
│  - Video plays from AWS S3 via CloudFront (CDN)                 │
│  - Time tracking in progress                                    │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Student Completes Lesson (or exits)                             │
│  - Frontend calculates time watched                              │
│  - Sends: POST /api/progress                                    │
│    { userId, lessonId, completed, timeSpent }                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Backend: progressController.updateProgress()                    │
│  - Updates LessonProgress record                                │
│  - Marks lesson as completed if 90%+ watched                    │
│  - Calculates course overall progress                           │
│  - Triggers certificate generation if course complete          │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Frontend: Updates UI                                            │
│  - Shows progress bar update                                    │
│  - Marks lesson as completed in sidebar                         │
│  - Enables next lesson (if sequential)                          │
└──────────────────────────────────────────────────────────────────┘
```

### 6.4 Admin Instructor Verification Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ INSTRUCTOR APPLIES TO BECOME VERIFIED INSTRUCTOR                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Frontend: InstructorRegister Form                               │
│  - User provides credentials & uploads documents                │
│  - Documents uploaded to Cloudinary                             │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Backend: authController.applyAsInstructor()                     │
│  - Creates User with role='instructor'                          │
│  - Sets isVerified=false, documentStatus='pending'              │
│  - Stores document URL                                          │
│  - Sends notification email to admins                           │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Admin Dashboard: Reviews Pending Applications                   │
│  - Sees list of pending instructor verifications                │
│  - Can download & review documents                              │
│  - Makes approve/reject decision                                │
└──────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
                    ▼ (APPROVE)          ▼ (REJECT)
        ┌──────────────────┐    ┌──────────────────────┐
        │POST /admin/      │    │POST /admin/          │
        │verify-instructor │    │verify-instructor     │
        │{ approved: true }│    │{ approved: false,    │
        │                 │    │  reason: '...' }     │
        └────────┬────────┘    └─────────┬────────────┘
                 │                       │
                 ▼                       ▼
        ┌───────────────────┐   ┌──────────────────┐
        │Update User:       │   │Update User:      │
        │isVerified=true    │   │isVerified=false  │
        │documentStatus     │   │documentStatus    │
        │='approved'        │   │='rejected'       │
        │                   │   │rejectionReason   │
        │Send approval email│   │Send rejection    │
        └───────────────────┘   │email with reason │
                                └──────────────────┘
                                      │
                                      ▼
                              Instructor can reapply
```

---

## 7. External Integrations

### 7.1 Payment Gateway - Razorpay

**Purpose**: Process payments for paid course enrollments

**Flow**:
1. Student initiates purchase → Create Razorpay Order
2. Order sent to Razorpay → Payment Gateway displayed
3. User completes payment → Payment ID received
4. Backend verifies payment with Razorpay API
5. Create enrollment record with payment details
6. Calculate & distribute fees

**Key Parameters**:
- Amount (course price)
- Currency (INR)
- Customer email
- Order notes (course ID, student ID)

---

### 7.2 Cloud Storage - AWS S3

**Purpose**: Store and serve course videos, thumbnails, and documents

**Stored Items**:
- Course thumbnails
- Lesson videos (HLS streaming)
- Instructor verification documents
- Course materials (PDFs, etc.)

**URL Format**: `https://s3.amazonaws.com/bucket-name/key`

**CDN Integration**: CloudFront for fast video delivery globally

---

### 7.3 Email Service - Gmail SMTP

**Purpose**: Send transactional emails

**Email Types**:
- Welcome email (new user)
- Enrollment confirmation
- Payment receipt
- Course completion certificate
- Instructor verification status
- Admin notifications

**Service Used**: Nodemailer with Gmail SMTP

---

### 7.4 Video Hosting - AWS S3 + CloudFront

**Purpose**: Stream videos efficiently to students

**Technology**: HLS (HTTP Live Streaming)

**Benefits**:
- Adaptive bitrate streaming
- Global CDN distribution
- Bandwidth optimization

---

## 8. Security Architecture

### Authentication & Authorization

```
┌──────────────────┐
│  User Credentials│
│  (Email, Pwd)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│ Backend: Verify credentials  │
│ Compare with hashed password │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Generate JWT Token           │
│ Payload: userId, role        │
│ Secret: JWT_SECRET (env)     │
│ Expiry: 7 days               │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Send token to frontend       │
│ Store in localStorage        │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Subsequent requests include  │
│ Authorization: Bearer TOKEN  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Auth Middleware verifies:    │
│ 1. Token exists              │
│ 2. Token is valid            │
│ 3. Token is not expired      │
│ 4. Signature is correct      │
└────────┬─────────────────────┘
         │
         ├─ VALID → Proceed
         └─ INVALID → 401 Unauthorized
```

### Role-Based Access Control (RBAC)

Each route is protected by role-specific middleware:

```javascript
// Example: Only instructors can create courses
POST /api/course
├─ Auth Middleware (verify token)
├─ isInstructor Middleware (check role === 'instructor')
└─ isVerifiedInstructor Middleware (check isVerified === true)
    └─ courseController.createCourse()

// Example: Only admins can approve instructors
POST /api/admin/verify-instructor
├─ Auth Middleware
├─ isAdmin Middleware (check role === 'admin')
└─ adminController.verifyInstructor()
```

### Data Protection

- **Passwords**: Hashed with bcrypt (cost: 10)
- **API Keys**: Stored in environment variables
- **Sensitive Data**: Never logged or exposed
- **HTTPS**: Used in production
- **CORS**: Restricted to frontend URL

---

## 9. Scalability & Performance Considerations

### Frontend Optimization
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Compress thumbnails
- **Caching**: Cache static assets and API responses
- **CDN**: Serve assets globally via CloudFront

### Backend Optimization
- **Database Indexing**: Index frequently queried fields
- **Connection Pooling**: MongoDB connection pool
- **API Rate Limiting**: Prevent abuse
- **Pagination**: Limit results per request
- **Caching**: Redis for session/data caching (future)

### Video Streaming
- **HLS Streaming**: Adaptive bitrate
- **CloudFront CDN**: Global edge locations
- **Compression**: H.264 video codec
- **Bitrate Options**: Multiple quality levels

---

## 10. Future Enhancements

- [ ] Live classes / real-time streaming
- [ ] Discussion forums per course
- [ ] Quiz & assessments
- [ ] Student rating & reviews
- [ ] Bulk student enrollment
- [ ] Course bundling & bundles
- [ ] Advanced analytics & ML recommendations
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Gamification (badges, leaderboards)
- [ ] Two-factor authentication (2FA)
- [ ] Email & SMS notifications
- [ ] Admin dashboard with detailed analytics

---

## 11. Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | UI and user interactions |
| **Styling** | Tailwind CSS + PostCSS | Responsive design |
| **State Management** | Context API | Global state (auth, theme) |
| **HTTP Client** | Axios | API requests |
| **Backend** | Node.js + Express | REST API server |
| **Database** | MongoDB | Data persistence |
| **Authentication** | JWT | Session management |
| **File Storage** | AWS S3 | Videos, images, documents |
| **Payment** | Razorpay | Payment processing |
| **Email** | Gmail SMTP | Transactional emails |
| **Deployment** | Vercel (Frontend), Docker (Backend) | Production hosting |

---

## 12. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                         │
└─────────────────────────────────────────────────────────────┘

Frontend Deployment (Vercel)
├─ Automatic CI/CD from GitHub
├─ Global CDN for static assets
├─ Environment variables for API URL
└─ HTTPS with SSL certificate

Backend Deployment (Docker)
├─ Containerized Node.js app
├─ Environment variables from .env
├─ MongoDB Atlas (Cloud)
├─ AWS S3 for file storage
└─ Reverse proxy (Nginx)

Database
├─ MongoDB Atlas Cluster
├─ Automated backups
└─ Connection pooling

External Services
├─ Razorpay API keys
├─ AWS credentials (IAM)
├─ Gmail SMTP credentials
└─ Cloudinary (future)
```

---

## 13. API Request/Response Example

### Example 1: Create Course

**Request:**
```http
POST /api/course HTTP/1.1
Host: api.learnavault.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Advanced React Patterns",
  "description": "Learn advanced patterns in React",
  "category": "Web Development",
  "price": 2999,
  "thumbnail": "data:image/jpeg;base64,..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "_id": "64f7e8d9c2a1b4f5e6g7h8i9",
    "title": "Advanced React Patterns",
    "description": "Learn advanced patterns in React",
    "category": "Web Development",
    "price": 2999,
    "instructor": "64f7e8d9c2a1b4f5e6g7h8i0",
    "thumbnail": "https://s3.amazonaws.com/bucket/thumbnail.jpg",
    "published": false,
    "students": [],
    "sections": [],
    "createdAt": "2024-05-01T10:30:00Z",
    "updatedAt": "2024-05-01T10:30:00Z"
  }
}
```

### Example 2: Enroll in Course (Paid)

**Request:**
```http
POST /api/payment/create-order HTTP/1.1
Host: api.learnavault.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "courseId": "64f7e8d9c2a1b4f5e6g7h8i9",
  "amount": 2999
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "order_1A2B3C4D5E6F7G8H",
    "amount": 2999,
    "currency": "INR",
    "key": "razorpay_key_id",
    "studentName": "John Doe",
    "studentEmail": "john@example.com"
  }
}
```

---

## 14. Conclusion

LearnVault is a comprehensive learning platform built on modern, scalable technology. It provides:

✅ **Multi-role support** (Student, Instructor, Admin)
✅ **Secure payment processing** (Razorpay)
✅ **Efficient video streaming** (AWS S3 + CloudFront)
✅ **Progress tracking** for personalized learning
✅ **Email notifications** for user engagement
✅ **Analytics & reporting** for instructors
✅ **Admin dashboard** for platform management
✅ **Scalable architecture** for future growth

The system is designed to support millions of users while maintaining performance, security, and reliability.

