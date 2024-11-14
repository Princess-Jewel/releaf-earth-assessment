import { Request, Response } from 'express';
import Mills from '../models/Mills';

export const getMills = async (req: Request, res: Response) => {
  try {
    const mills = await Mills.find();
    res.json(mills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mills', error });
  }
};


