import mongoose, { Schema } from "mongoose";
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
    mediaType: {
        type: String,
        enum: ["image", "video"],
        default: "image",
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
const GallerySchema = new Schema({
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    images: [GalleryImageSchema],
}, {
    timestamps: true,
});
// Indexes for fast queries
GallerySchema.index({ vendorId: 1 });
GallerySchema.index({ "images.uploadedAt": -1 });
const Gallery = mongoose.model("Gallery", GallerySchema);
export default Gallery;
//# sourceMappingURL=gallery.model.js.map