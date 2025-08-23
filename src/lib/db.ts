import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDB() {
  if (isConnected) return;
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('DB connection failed');
  }
}