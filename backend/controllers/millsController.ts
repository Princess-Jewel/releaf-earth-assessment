import { type Request, type Response } from "express";
import Mills from "../models/Mills";
import mongoose from "mongoose";

// Retrieve all markers/mills
export const getMills = async (req: Request, res: Response) => {
  try {
    const mills = await Mills.find();
    // Respond with a success message and the retrieved mill(s) data
    res.status(200).json({
      message: "Mill retrieved successfully!",
      data: mills,
    });
  } catch (error) {
    // Assert the error type to be an instance of Error
    const err = error as Error;
    res.status(500).json({
      message: "Error fetching mills",
      error,
    });
  }
};

// Add a new marker/mill
export const addMill = async (req: Request, res: Response) => {
  const { millName, latitude, longitude, capacity, status } = req.body;

  try {
    // Create a new mill instance
    const newMill = new Mills({
      millName,
      latitude,
      longitude,
      capacity,
      status,
    });

    // Save the new mill to the database
    await newMill.save();

    // Respond with a success message and the new mill data
    res.status(201).json({
      message: "Mill successfully added!",
      data: newMill,
    });
  } catch (error) {
    // Assert the error type to be an instance of Error
    const err = error as Error;
    res.status(400).json({
      message: "Invalid data provided",
      error: err.message || "An error occurred",
    });
  }
};

// Update an existing mill
export const updateMill = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params; // Extract the id from params


  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid Mill ID" });
    return; // Return here to exit the function early
  }


  try {
    // Update the mill using the provided ID and data from req.body
    const mill = await Mills.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!mill) {
      res.status(404).json({ message: "Mill not found" });
      return; // Return here to exit the function early
    }

    // Respond with a success message and the updated mill data
    res.status(200).json({
      message: "Mill updated successfully!",
      data: mill,
    });
  } catch (error) {
    // Handle any errors that occur during the update process
    const err = error as Error;
    res.status(400).json({
      message: "Invalid data provided",
      error: err.message || "An error occurred",
    });
  }
};
