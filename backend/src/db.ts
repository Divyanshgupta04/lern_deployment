// backend/src/db.ts
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.DATABASE_URL;
    if (!uri) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    await mongoose.connect(uri);
    console.log('✅ MongoDB connected:', uri);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
