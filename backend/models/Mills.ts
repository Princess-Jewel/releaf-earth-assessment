import mongoose, { Document, Schema } from 'mongoose';

interface IMills extends Document {
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  p1Amount?: number;
  p1PriceTon?: number;
  numTransactions?: number;
  lastTransactionDate?: Date;
  capacity?: number;
  status: string;
}

const millsSchema = new Schema<IMills>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  p1Amount: Number,
  p1PriceTon: Number,
  numTransactions: Number,
  lastTransactionDate: Date,
  capacity: Number,
  status: { type: String, default: 'active' },
});

const Mills = mongoose.model<IMills>('Mills', millsSchema);

export default Mills;
