import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('MONGO_URI is not defined in environment variables');
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

export default connectToDatabase;
