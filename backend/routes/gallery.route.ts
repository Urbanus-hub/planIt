import express from "express";
import {
  uploadGalleryImage,
  getGalleryImages,
  deleteGalleryImage,
  updateGalleryImage,
  clearGallery,
} from "../controllers/gallery.controller";
import  authorize  from "../middlewares/authorize.middleware";

const router = express.Router();

// Gallery Routes
// Upload image to gallery
router.post("/upload/:vendorId", authorize, uploadGalleryImage);

// Get gallery images for a vendor
router.get("/:vendorId", getGalleryImages);

// Update gallery image info
router.put("/:vendorId/:imageId", authorize, updateGalleryImage);

// Delete image from gallery
router.delete("/:vendorId/:imageId", authorize, deleteGalleryImage);

// Clear entire gallery
router.delete("/clear/:vendorId", authorize, clearGallery);

export default router;
