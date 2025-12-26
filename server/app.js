import dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoute.js';
import sectionRoutere from './routes/sectionRoutes.js';
import lesssonRoutes from './routes/lessonRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import enrollmentRoutes from './routes/enrollRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import lessonRoutes from './routes/lessonProgressRoutes.js';

import cors from 'cors'


const app = express();
app.use(express.json());

app.listen(process.env.PORT || 5000, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  } 
});


// api endpints 
app.use(cors({
  origin: "http://localhost:5173",  // your frontend
  credentials: true,
}));


// auth endpoints
app.use('/api/auth', authRoutes);
// course endpoints 
app.use('/api/course', courseRoutes);
// section endpoints
app.use('/api/sections', sectionRoutere);
// lesson endpoints
app.use('/api/lessons', lesssonRoutes);
// video endpoints\
app.use('/api/videos', videoRoutes);
// enrollment endpoints
app.use('/api/enrollment', enrollmentRoutes);
// payment endpoints
app.use('/api/payment', paymentRoutes);
app.use('/api/instructor', analyticsRoutes);
app.use('/api/progress', lessonRoutes);
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    if (process.env.NODE_ENV !== 'production') {
      console.log('DB CONNECTED');
    }
  } catch (err) {
    console.error('DB CONNECTION FAILED', err);
    process.exit(1);
  }
}

connectDB();

