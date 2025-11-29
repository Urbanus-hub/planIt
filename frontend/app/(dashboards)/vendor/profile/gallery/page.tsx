"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  X,
  Loader2,
  Grid3x3,
  Trash2,
  Download,
  ZoomIn,
  Plus,
  ArrowLeft,
  Check,
  Film,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadToCloudinary, batchUploadToCloudinary } from "@/lib/cloudinary";
import { galleryAPI } from "@/lib/api";
import { GalleryImage } from "@/lib/types";
import Link from "next/link";

export default function VendorGalleryPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imageTitle, setImageTitle] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showMediaTypeDialog, setShowMediaTypeDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [batchProgress, setBatchProgress] = useState({ uploaded: 0, total: 0 });
  const [uploadedUrls, setUploadedUrls] = useState<
    Array<{ url: string; file: File; mediaType: "image" | "video" }>
  >([]);

  // Load gallery images
  useEffect(() => {
    if (user?._id) {
      loadGalleryImages();
    }
  }, [user?._id]);

  const loadGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await galleryAPI.getImages(user?._id || "", 100, 1);
      setImages(response.data.data.images);
    } catch (error) {
      toast.error("Failed to load gallery images");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate each file
    const validFiles: File[] = [];
    for (const file of files) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        toast.error(`${file.name} is not a supported file type`);
        continue;
      }

      // Validate file size (100MB for videos, 10MB for images)
      const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(
          `${file.name} is too large (max ${isVideo ? "100MB" : "10MB"})`
        );
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Store valid files and show upload dialog
    setSelectedFiles(validFiles);
    setShowUploadModal(true);
    uploadFiles(validFiles);
  };

  const uploadFiles = async (files: File[]) => {
    if (!user?._id) {
      toast.error("User not found");
      return;
    }

    setUploading(true);
    setBatchProgress({ uploaded: 0, total: files.length });

    try {
      const urls = await batchUploadToCloudinary(files, (uploaded, total) => {
        setBatchProgress({ uploaded, total });
        setUploadProgress((uploaded / total) * 100);
      });

      // Store uploaded URLs for later use with titles/descriptions
      const mappedUploadedUrls = urls.map((url, index) => ({
        url,
        file: files[index],
        mediaType: files[index].type.startsWith("video/")
          ? ("video" as const)
          : ("image" as const),
      }));

      // Set state for adding metadata
      setUploadProgress(100);
      setUploadedUrls(mappedUploadedUrls);

      toast.success(
        `Successfully uploaded ${files.length} file${
          files.length > 1 ? "s" : ""
        }! Add titles and descriptions below.`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload files";
      toast.error(errorMessage);
      console.error("Batch upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const finalizeUploads = async () => {
    if (!user?._id || !uploadedUrls.length) return;

    try {
      // Add each uploaded file to gallery with metadata
      const uploadPromises = uploadedUrls.map((item, index) => {
        const title =
          imageTitle ||
          `${item.mediaType === "video" ? "Video" : "Image"} ${index + 1}`;
        const description = imageDescription || "";

        return galleryAPI.uploadImage(
          user._id,
          item.url,
          title,
          description,
          item.mediaType
        );
      });

      const results = await Promise.all(uploadPromises);

      // Get the latest images from the last successful upload
      const lastResult = results[results.length - 1];
      if (lastResult?.data?.data?.images) {
        setImages(lastResult.data.data.images);
      }

      // Reset modal state
      setShowUploadModal(false);
      setUploadProgress(0);
      setBatchProgress({ uploaded: 0, total: 0 });
      setSelectedFiles([]);
      setUploadedUrls([]);
      setImageTitle("");
      setImageDescription("");

      toast.success("All files added to gallery successfully!");
    } catch (error) {
      toast.error("Failed to add files to gallery");
      console.error("Finalize upload error:", error);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!user?._id) return;

    try {
      const response = await galleryAPI.deleteImage(user._id, imageId);
      setImages(response.data.data.images);
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
      console.error(error);
    }
  };

  const handleUpdateImage = async (imageId: string) => {
    if (!user?._id || !selectedImage) return;

    try {
      const response = await galleryAPI.updateImage(
        user._id,
        imageId,
        imageTitle,
        imageDescription
      );
      setImages(response.data.data.images);
      toast.success("Image updated successfully");
      setIsPreviewOpen(false);
      setSelectedImage(null);
      setImageTitle("");
      setImageDescription("");
    } catch (error) {
      toast.error("Failed to update image");
      console.error(error);
    }
  };

  const openImagePreview = (image: GalleryImage) => {
    setSelectedImage(image);
    setImageTitle(image.title || "");
    setImageDescription(image.description || "");
    setIsPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Link href="/vendor/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-emerald-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Portfolio Gallery
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Showcase your best work and projects
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
              Add Media
            </motion.button>
          </div>
        </motion.div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          title="Upload gallery images or videos (multiple files supported)"
        />

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white border-0 shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50">
                    <Grid3x3 className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Total Images
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {images.length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {images.length > 0
                      ? "Great portfolio! Keep adding more"
                      : "Start building your portfolio"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-20"
          >
            <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && images.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 p-6">
                <Upload className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No images yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your portfolio by uploading your best work. Click
              the "Add Media" button to get started.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all"
            >
              Upload First Image
            </motion.button>
          </motion.div>
        )}

        {/* Gallery Grid */}
        {!loading && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image._id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative"
                >
                  <Card className="overflow-hidden bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-0 relative">
                      {/* Media Container */}
                      <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                        {image.mediaType === "video" ? (
                          // Video Player with enhanced styling
                          <div className="relative w-full h-full bg-black">
                            <video
                              src={image.url}
                              controls
                              preload="metadata"
                              className="w-full h-full object-contain"
                              playsInline
                              onLoadedMetadata={(e) => {
                                // Set video to show first frame
                                e.currentTarget.currentTime = 0.1;
                              }}
                            />
                            {/* Video overlay indicator */}
                            <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm pointer-events-none z-10">
                              <Film className="h-3 w-3 inline mr-1" />
                              VIDEO
                            </div>
                          </div>
                        ) : (
                          // Image
                          <img
                            src={image.url}
                            alt={image.title || "Gallery image"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                          {/* Action Buttons */}
                          <div className="flex justify-end gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openImagePreview(image)}
                              className="bg-white/90 hover:bg-white p-2 rounded-lg transition-all shadow-md"
                              title="View details"
                            >
                              <ZoomIn className="h-4 w-4 text-gray-800" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                if (image._id) {
                                  handleDeleteImage(image._id);
                                }
                              }}
                              className="bg-red-500/90 hover:bg-red-600 p-2 rounded-lg transition-all shadow-md"
                              title="Delete media"
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </motion.button>
                          </div>

                          {/* Title */}
                          <div className="text-white">
                            {image.title && (
                              <p className="font-semibold text-sm line-clamp-2">
                                {image.title}
                              </p>
                            )}
                            {image.description && (
                              <p className="text-xs text-white/80 line-clamp-1 mt-1">
                                {image.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="p-4">
                        <p className="font-semibold text-gray-900 line-clamp-1">
                          {image.title || "Untitled"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(image.uploadedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedFiles.length > 1
                  ? `Uploading ${selectedFiles.length} Files`
                  : "Uploading File"}
              </h2>

              {selectedFiles.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Files to upload:</p>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs bg-gray-50 p-2 rounded"
                      >
                        {file.type.startsWith("video/") ? (
                          <Film className="h-4 w-4 text-purple-500" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-blue-500" />
                        )}
                        <span className="flex-1 truncate">{file.name}</span>
                        <span className="text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(1)}MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <motion.div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-600">
                      {selectedFiles.length > 1
                        ? `Uploading ${batchProgress.uploaded}/${batchProgress.total} files...`
                        : "Uploading..."}
                    </p>
                    <p className="text-sm font-semibold text-emerald-600">
                      {Math.round(uploadProgress)}%
                    </p>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="h-full bg-linear-to-r from-emerald-500 to-emerald-600"
                    />
                  </div>
                  {selectedFiles.length > 1 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {batchProgress.uploaded} of {batchProgress.total} files
                      completed
                    </p>
                  )}
                </motion.div>
              )}

              {uploadProgress === 100 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-3"
                >
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-emerald-800">
                    {selectedFiles.length > 1
                      ? `All ${selectedFiles.length} files uploaded successfully!`
                      : "Upload complete!"}
                  </p>
                </motion.div>
              )}

              {/* Add metadata form after successful upload */}
              {!uploading &&
                uploadProgress === 100 &&
                uploadedUrls.length > 0 && (
                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-800 mb-2">
                        📝 Add details to your uploaded files
                      </p>
                      <p className="text-xs text-blue-600">
                        These details will be applied to all{" "}
                        {uploadedUrls.length} uploaded file
                        {uploadedUrls.length > 1 ? "s" : ""}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title (optional)
                      </label>
                      <Input
                        placeholder="e.g., Wedding Photography, Event Setup"
                        value={imageTitle}
                        onChange={(e) => setImageTitle(e.target.value)}
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (optional)
                      </label>
                      <Input
                        placeholder="Tell clients about this work..."
                        value={imageDescription}
                        onChange={(e) => setImageDescription(e.target.value)}
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {/* Cancel Button - show while uploading or after upload */}
                <Button
                  onClick={() => {
                    if (uploadedUrls.length > 0) {
                      // If files are uploaded but not finalized, finalize without metadata
                      finalizeUploads();
                    } else {
                      // Cancel upload
                      setShowUploadModal(false);
                      setUploadProgress(0);
                      setBatchProgress({ uploaded: 0, total: 0 });
                      setSelectedFiles([]);
                      setUploadedUrls([]);
                      setImageTitle("");
                      setImageDescription("");
                      setUploading(false);
                    }
                  }}
                  disabled={uploading}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  {uploadedUrls.length > 0
                    ? "Skip Details"
                    : uploading
                    ? "Cancel Upload"
                    : "Cancel"}
                </Button>

                {/* Finalize Button - show after successful upload */}
                {!uploading &&
                  uploadProgress === 100 &&
                  uploadedUrls.length > 0 && (
                    <Button
                      onClick={finalizeUploads}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      Add to Gallery
                    </Button>
                  )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit {selectedImage?.mediaType === "video" ? "Video" : "Image"}{" "}
              Details
            </DialogTitle>
          </DialogHeader>

          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Media Preview */}
              <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-100">
                {selectedImage.mediaType === "video" ? (
                  <video
                    src={selectedImage.url}
                    controls
                    preload="metadata"
                    className="w-full h-full max-h-96 object-contain bg-black rounded-lg"
                    playsInline
                  />
                ) : (
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Edit Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Input
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                    placeholder={`${
                      selectedImage?.mediaType === "video" ? "Video" : "Image"
                    } title`}
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Input
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                    placeholder={`${
                      selectedImage?.mediaType === "video" ? "Video" : "Image"
                    } description`}
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                {/* Upload Date */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Upload Date
                  </p>
                  <p className="text-gray-900 font-semibold mt-1">
                    {new Date(selectedImage.uploadedAt).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => setIsPreviewOpen(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedImage._id) {
                      handleUpdateImage(selectedImage._id);
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
