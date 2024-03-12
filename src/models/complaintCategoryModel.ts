import mongoose, { Document, Schema } from 'mongoose';

export interface IComplaintCategory extends Document {
  name: string;
  description: string;
}

const complaintCategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});

const ComplaintCategory = mongoose.model<IComplaintCategory>('ComplaintCategory', complaintCategorySchema);

export default ComplaintCategory;
