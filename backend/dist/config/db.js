var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const uri = process.env.MONGO_URI;
if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
}
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose.connect(uri);
        console.log('MongoDB connected');
    }
    catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
});
export default connectToDatabase;
