import mongoose, { Schema } from 'mongoose';
const millsSchema = new Schema({
    millName: { type: String, required: true },
    // type: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    p1Amount: Number,
    p1PriceTon: Number,
    numTransactions: Number,
    lastTransactionDate: Date,
    capacity: Number,
    status: { type: String, default: 'active' },
});
const Mills = mongoose.model('Mills', millsSchema);
export default Mills;
