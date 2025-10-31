import mongoose, { Document, Schema, Types } from "mongoose";

export interface IService extends Document {
  title: string;
  category:
    | "Photography"
    | "Catering"
    | "Decor"
    | "Entertainment"
    | "Venue"
    | "Other";
  description: string;
  price: number;
  location: string;
  image?: string;
  provider: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Photography",
        "Catering",
        "Decor",
        "Entertainment",
        "Venue",
        "Other",
      ],
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    image: { type: String },
    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IService>("Service", serviceSchema);
