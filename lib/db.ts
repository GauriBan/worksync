import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/worksync";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("⚡ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
};
