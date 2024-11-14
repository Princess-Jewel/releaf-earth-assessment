
import express from 'express';
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Route to get initial mills data from JSON
router.get('/mills', (req, res) => {
  const dataPath = path.join(__dirname, '../data/milljson.json');
  fs.readFile(dataPath, 'utf8', (err: any, data: string) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading mills data' });
    }
    res.json(JSON.parse(data));
  });
});

export default router;
