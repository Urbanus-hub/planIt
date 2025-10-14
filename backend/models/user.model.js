import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please add a name"], unique:true, trim: true },
  email: { type: String, required: [true, "Please add an email"], trim:true, unique:true, lowercase: true },
  password: { type: String, required: [true, "Please add a password"], minLength: [6, "Password must be at least 6 characters"] },
  role: { type: String, enum: ["client", "vendor", "admin"], default: "client" },
  // Add profile fields later: phone, location, bio, verified, portfolio, etc.
}, { timestamps: true });

export default mongoose.model("User", userSchema);
