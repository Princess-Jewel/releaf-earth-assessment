import express, { Router, Request, Response } from "express";
import { addMill, updateMill } from "../controllers/millsController";
import fs from "fs";
import path from "path";

const router: Router = express.Router();

// Route to get initial mills data from JSON
router.get("/mills", async (req: Request, res: Response) => {
  const dataPath = path.join(__dirname, "../data/milljson.json");
  try {
    const data = await fs.promises.readFile(dataPath, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ message: "Error reading mills data", error: err });
  }
});

// Route to add a new mill
router.post("/mills", addMill);

// Route to update a mill
router.put("/mills/:id", updateMill);


export default router;
