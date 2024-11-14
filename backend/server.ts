import express from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './config/db';  // Import MongoDB connection function

dotenv.config();

const app = express();

// Connect to MongoDB
connectToDatabase();

app.use(express.json());



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
