// models/Service.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the user model
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
