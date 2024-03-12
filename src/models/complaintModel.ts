import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userModel';

export interface IComplaint extends Document {
  title: string;
  body: string;
  categories: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  user: IUser['_id'];
  
}

const complaintSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  categories: [{ type: String, required: true }],
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'],
    default: 'PENDING',
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Complaint = mongoose.model<IComplaint>('Complaint', complaintSchema);

export default Complaint;
