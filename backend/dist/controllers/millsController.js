"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMill = exports.addMill = exports.getMills = void 0;
const Mills_1 = __importDefault(require("../models/Mills"));
const mongoose_1 = __importDefault(require("mongoose"));
// Retrieve all markers/mills
const getMills = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mills = yield Mills_1.default.find();
        // Respond with a success message and the retrieved mill(s) data
        res.status(200).json({
            message: "Mill retrieved successfully!",
            data: mills,
        });
    }
    catch (error) {
        // Assert the error type to be an instance of Error
        const err = error;
        res.status(500).json({
            message: "Error fetching mills",
            error,
        });
    }
});
exports.getMills = getMills;
// Add a new marker/mill
const addMill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { millName, latitude, longitude, capacity, status } = req.body;
    try {
        // Create a new mill instance
        const newMill = new Mills_1.default({
            millName,
            latitude,
            longitude,
            capacity,
            status,
        });
        // Save the new mill to the database
        yield newMill.save();
        // Respond with a success message and the new mill data
        res.status(201).json({
            message: "Mill successfully added!",
            data: newMill,
        });
    }
    catch (error) {
        // Assert the error type to be an instance of Error
        const err = error;
        res.status(400).json({
            message: "Invalid data provided",
            error: err.message || "An error occurred",
        });
    }
});
exports.addMill = addMill;
// Update an existing mill
const updateMill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Extract the id from params
    // Check if the ID is valid
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid Mill ID" });
        return; // Return here to exit the function early
    }
    try {
        // Update the mill using the provided ID and data from req.body
        const mill = yield Mills_1.default.findByIdAndUpdate(id, req.body, {
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
    }
    catch (error) {
        // Handle any errors that occur during the update process
        const err = error;
        res.status(400).json({
            message: "Invalid data provided",
            error: err.message || "An error occurred",
        });
    }
});
exports.updateMill = updateMill;
