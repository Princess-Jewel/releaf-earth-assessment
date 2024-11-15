import { Request, Response } from 'express';
import Mills from '../models/Mills';

// Retrieve all markers/mills
export const getMills = async (req: Request, res: Response) => {
  try {
    const mills = await Mills.find();
    res.json(mills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mills', error });
  }
};

// Add a new marker/mill
export const addMill = async (req: Request, res: Response) => {
  const { millName, latitude, longitude, capacity, status } = req.body;
 
  try {
    const newMill = new Mills({ millName, latitude, longitude, capacity, status });
    await newMill.save();
    res.status(201).json(newMill);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data provided' });
  }
};
