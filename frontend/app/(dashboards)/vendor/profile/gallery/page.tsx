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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-50 dark:from-gray-950 dark:via-emerald-950/20 dark:to-gray-950">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <Link href="/vendor/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Portfolio Gallery
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Showcase your best work and attract more clients
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
                    <Grid3x3 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Media Items
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {images.length}
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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
              <div className="rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 p-8">
                <Upload className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              No media yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start building your portfolio by uploading your best work. Click
              the "Add Media" button to get started.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-emerald-200 transition-all"
            >
              Upload First Media
            </motion.button>
          </motion.div>
        )}

        {/* Gallery Grid */}
        {!loading && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image._id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  <div className="h-full flex flex-col">
                    {/* Image Container - Separate, no borders */}
                    <div className="relative w-full aspect-square overflow-hidden rounded-t-xl bg-gray-100 dark:bg-gray-800">
                      {image.mediaType === "video" ? (
                        <div className="relative w-full h-full bg-black">
                          <video
                            src={image.url}
                            preload="metadata"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            playsInline
                            muted
                            onLoadedMetadata={(e) => {
                              e.currentTarget.currentTime = 0.1;
                            }}
                          />
                          {/* Video Badge */}
                          <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm flex items-center gap-1 shadow-lg">
                            <Film className="h-3 w-3" />
                            VIDEO
                          </div>
                        </div>
                      ) : (
                        <img
                          src={image.url}
                          alt={image.title || "Gallery image"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}

                      {/* Hover Overlay with Actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openImagePreview(image)}
                          className="bg-white hover:bg-emerald-50 p-3 rounded-xl transition-all shadow-lg"
                          title="View details"
                        >
                          <ZoomIn className="h-5 w-5 text-emerald-600" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (image._id) {
                              handleDeleteImage(image._id);
                            }
                          }}
                          className="bg-white hover:bg-red-50 p-3 rounded-xl transition-all shadow-lg"
                          title="Delete media"
                        >
                          <Trash2 className="h-5 w-5 text-red-600" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Card with Text Content - Below Image */}
                    <Card className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all duration-300 rounded-t-none rounded-b-xl">
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base line-clamp-2 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {image.title || "Untitled"}
                          </h3>
                          {image.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                              {image.description}
                            </p>
                          )}
                        </div>

                        {/* Footer Info */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <ImageIcon className="h-3.5 w-3.5" />
                            <span>
                              {new Date(image.uploadedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          {image.mediaType === "video" && (
                            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              <Film className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedFiles.length > 1
                    ? `Uploading ${selectedFiles.length} Files`
                    : "Uploading File"}
                </h2>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Files to upload:</p>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded"
                      >
                        {file.type.startsWith("video/") ? (
                          <Film className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                        )}
                        <span className="flex-1 truncate text-gray-900 dark:text-gray-100">{file.name}</span>
                        <span className="text-gray-500 dark:text-gray-400">
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
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {selectedFiles.length > 1
                        ? `Uploading ${batchProgress.uploaded}/${batchProgress.total} files...`
                        : "Uploading..."}
                    </p>
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {Math.round(uploadProgress)}%
                    </p>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full"
                    />
                  </div>
                  {selectedFiles.length > 1 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {batchProgress.uploaded} of {batchProgress.total} files
                      completed
                    </p>
                  )}
                </motion.div>
              )}

              {uploadProgress === 100 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3"
                >
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-600 dark:bg-emerald-500">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                      {selectedFiles.length > 1
                        ? `All ${selectedFiles.length} files uploaded successfully!`
                        : "Upload complete!"}
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                      Add details to complete
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Add metadata form after successful upload */}
              {!uploading &&
                uploadProgress === 100 &&
                uploadedUrls.length > 0 && (
                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-1 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Add details to your uploaded files
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        These details will be applied to all{" "}
                        {uploadedUrls.length} uploaded file
                        {uploadedUrls.length > 1 ? "s" : ""}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
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
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
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
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-emerald-200"
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
              <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Upload Date
                  </p>
                  <p className="text-gray-900 dark:text-gray-100 font-semibold mt-1">
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
              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                <Button
                  onClick={() => setIsPreviewOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedImage._id) {
                      handleUpdateImage(selectedImage._id);
                    }
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-emerald-200"
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
