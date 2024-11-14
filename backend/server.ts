import express, { Application } from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './config/db';  // Import MongoDB connection function
import millsRoutes from './routes/millsRoutes';

dotenv.config();

const app: Application = express();

// Connect to MongoDB
connectToDatabase();

app.use('/api', millsRoutes);

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



