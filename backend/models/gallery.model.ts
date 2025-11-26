import mongoose, { Schema, Document } from "mongoose";

export interface IGalleryImage extends Document {
  vendorId: string;
  url: string;
  title?: string;
  description?: string;
  uploadedAt: Date;
  updatedAt: Date;
}

export interface IGallery extends Document {
  vendorId: string;
  images: IGalleryImage[];
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema = new Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const GallerySchema = new Schema(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    images: [GalleryImageSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for fast queries
GallerySchema.index({ vendorId: 1 });
GallerySchema.index({ "images.uploadedAt": -1 });

const Gallery = mongoose.model<IGallery>("Gallery", GallerySchema);

export default Gallery;
