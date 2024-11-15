import express, { Application } from "express";
import dotenv from "dotenv";
import connectToDatabase from "./config/db"; // Import MongoDB connection function
import millsRoutes from "./routes/millsRoutes";
import cors from 'cors';

dotenv.config();

const app: Application = express();
// JSON body parsing middleware
app.use(express.json());


// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB
connectToDatabase();

app.use("/api", millsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
