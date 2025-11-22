// backend/src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import process from 'process';

import connectDB from './db';
import { errorHandler } from './middleware/errorHandler';
import TestDefinition from './models/TestDefinition';
import { allTestDefinitions } from './seedData';
import User from './models/User';

// Load environment variables
dotenv.config();

// --- START: Environment Variable Validation ---
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'GEMINI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(
    'FATAL ERROR: Missing required environment variables in your backend/.env file:'
  );
  console.error(missingEnvVars.join(', '));
  console.error('Please create or update the .env file in the /backend directory.');
  process.exit(1);
}
// --- END: Environment Variable Validation ---

// Import routes
import authRoutes from './routes/auth';
import aiRoutes from './routes/ai';
import adminRoutes from './routes/admin';
import usersRoutes from './routes/users';
import testsRoutes from './routes/tests';

const app = express();

const seedDatabase = async () => {
  try {
    const count = await TestDefinition.countDocuments();
    if (count === 0) {
      console.log('No test definitions found. Seeding database...');
      await TestDefinition.insertMany(allTestDefinitions);
      console.log('Database seeded successfully with test definitions.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

const seedAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ isAdmin: true });
    if (!adminExists) {
      console.log('No admin user found. Creating default admin...');
      await User.create({
        fullName: 'Admin User',
        username: 'admin',
        email: 'admin@refreshkid.com',
        password: 'Refreshkid@2025',
        avatarId: 0,
        isAdmin: true,
      });
      console.log('Default admin user created successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

// Connect to Database and Seed, then start server
const startServer = async () => {
  await connectDB();
  await seedDatabase();
  await seedAdminUser();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true })); // For form data

  // 🌐 API Rate Limiting
  // Dev mode me disable, production me enable.
  if (process.env.NODE_ENV === 'production') {
    const apiLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 200,                 // Limit each IP to 200 requests per window
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use('/api/', apiLimiter);
    console.log('✅ API rate limiting ENABLED (production)');
  } else {
    console.log('⚠️ API rate limiting is DISABLED in development mode.');
  }

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/tests', testsRoutes);

  // Centralized Error Handler
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || 'undefined'})`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
