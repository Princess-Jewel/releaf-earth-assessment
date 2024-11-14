import express from "express";
import { addMill } from "../controllers/millsController";
import fs from "fs";
import path from "path";
const router = express.Router();
// Route to get initial mills data from JSON
router.get("/mills", (req, res) => {
    const dataPath = path.join(__dirname, "../data/milljson.json");
    fs.readFile(dataPath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error reading mills data" });
        }
        res.json(JSON.parse(data));
    });
});
router.post("/mills", addMill);
export default router;
