var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Mills from '../models/Mills';
// Retrieve all markers/mills
export const getMills = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mills = yield Mills.find();
        res.json(mills);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching mills', error });
    }
});
// Add a new marker/mill
export const addMill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { millName, latitude, longitude, capacity, status } = req.body;
    console.log('millName', millName);
    try {
        console.log('millName', millName);
        const newMill = new Mills({ millName, latitude, longitude, capacity, status });
        console.log(newMill);
        yield newMill.save();
        res.status(201).json(newMill);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid data provided' });
    }
});
