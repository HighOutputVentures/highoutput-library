import mongoose, { Document, Schema } from 'mongoose';

export default mongoose.model<{
  id: Buffer;
  value: number;
} & Document>('Balance', new Schema({
  _id: {
    type: Buffer,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
}, { _id: false }));
