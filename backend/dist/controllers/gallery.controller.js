import Gallery from "../models/gallery.model";
// Upload image to gallery
export const uploadGalleryImage = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { url, title, description, mediaType } = req.body;
        if (!url) {
            return res
                .status(400)
                .json({ success: false, message: "Image URL is required" });
        }
        let gallery = await Gallery.findOne({ vendorId });
        if (!gallery) {
            gallery = await Gallery.create({
                vendorId,
                images: [],
            });
        }
        // Detect media type from URL if not provided
        let detectedMediaType = mediaType || "image";
        if (!mediaType) {
            const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
            const urlLower = url.toLowerCase();
            if (videoExtensions.some((ext) => urlLower.includes(ext))) {
                detectedMediaType = "video";
            }
        }
        const newImage = {
            vendorId,
            url,
            title: title || "",
            description: description || "",
            mediaType: detectedMediaType,
            uploadedAt: new Date(),
            updatedAt: new Date(),
        };
        gallery.images.push(newImage);
        await gallery.save();
        res.status(201).json({
            success: true,
            message: "Media uploaded successfully",
            data: gallery,
        });
    }
    catch (error) {
        console.error("Error uploading gallery media:", error);
        res.status(500).json({ success: false, message: "Failed to upload media" });
    }
};
// Get gallery images for a vendor
export const getGalleryImages = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const limit = parseInt(req.query.limit) || 12;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const gallery = await Gallery.findOne({ vendorId });
        if (!gallery) {
            return res.status(200).json({
                success: true,
                data: {
                    images: [],
                    total: 0,
                    page,
                    limit,
                },
            });
        }
        const total = gallery.images.length;
        const images = gallery.images.slice(skip, skip + limit);
        res.status(200).json({
            success: true,
            data: {
                images,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error("Error fetching gallery images:", error);
        res
            .status(500)
            .json({ success: false, message: "Failed to fetch gallery images" });
    }
};
// Delete image from gallery
export const deleteGalleryImage = async (req, res) => {
    try {
        const { vendorId, imageId } = req.params;
        const gallery = await Gallery.findOne({ vendorId });
        if (!gallery) {
            return res
                .status(404)
                .json({ success: false, message: "Gallery not found" });
        }
        gallery.images = gallery.images.filter((img) => img._id?.toString() !== imageId);
        await gallery.save();
        res.status(200).json({
            success: true,
            message: "Image deleted successfully",
            data: gallery,
        });
    }
    catch (error) {
        console.error("Error deleting gallery image:", error);
        res.status(500).json({ success: false, message: "Failed to delete image" });
    }
};
// Update gallery image info
export const updateGalleryImage = async (req, res) => {
    try {
        const { vendorId, imageId } = req.params;
        const { title, description } = req.body;
        const gallery = await Gallery.findOne({ vendorId });
        if (!gallery) {
            return res
                .status(404)
                .json({ success: false, message: "Gallery not found" });
        }
        const image = gallery.images.find((img) => img._id?.toString() === imageId);
        if (!image) {
            return res
                .status(404)
                .json({ success: false, message: "Image not found" });
        }
        image.title = title || image.title;
        image.description = description || image.description;
        image.updatedAt = new Date();
        await gallery.save();
        res.status(200).json({
            success: true,
            message: "Image updated successfully",
            data: gallery,
        });
    }
    catch (error) {
        console.error("Error updating gallery image:", error);
        res.status(500).json({ success: false, message: "Failed to update image" });
    }
};
// Clear entire gallery
export const clearGallery = async (req, res) => {
    try {
        const { vendorId } = req.params;
        await Gallery.findOneAndDelete({ vendorId });
        res.status(200).json({
            success: true,
            message: "Gallery cleared successfully",
        });
    }
    catch (error) {
        console.error("Error clearing gallery:", error);
        res
            .status(500)
            .json({ success: false, message: "Failed to clear gallery" });
    }
};
//# sourceMappingURL=gallery.controller.js.map