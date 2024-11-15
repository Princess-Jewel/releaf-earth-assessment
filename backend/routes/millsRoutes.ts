import express, { Router, Request, Response } from "express";
import { addMill, updateMill } from "../controllers/millsController";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const router: Router = express.Router();

interface MillData {
  id?: number;
  millName: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  p1Amount?: number;
  numTransactions?: number;
  p1PriceTon?: number;
  lastTransactionDate?: Date;
  status?: string;
}

router.get("/mills", async (req: Request, res: Response) => {
  const dataPath = path.join(__dirname, "../data/milljson.json");

  try {
    const data = await fs.promises.readFile(dataPath, "utf8");
    const mills = JSON.parse(data);

    // Attach UUID as id
    const millsWithId = mills.map((mill: MillData) => ({
      id: uuidv4(), // Using UUID for unique ids
      ...mill,
    }));

    res.json(millsWithId);
  } catch (err) {
    res.status(500).json({ message: "Error reading mills data", error: err });
  }
});

// Route to add a new mill
router.post("/mills", addMill);

// Route to update a mill
router.put("/mills/:id", updateMill);

export default router;
