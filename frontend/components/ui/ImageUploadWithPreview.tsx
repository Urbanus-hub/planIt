"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Camera, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface ImageUploadWithPreviewProps {
  currentImage?: string;
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: Error) => void;
  maxSizeMB?: number;
  className?: string;
  shape?: "circle" | "square" | "rounded";
}

export function ImageUploadWithPreview({
  currentImage,
  onUploadSuccess,
  onUploadError,
  maxSizeMB = 5,
  className = "",
  shape = "circle",
}: ImageUploadWithPreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-none",
    rounded: "rounded-2xl",
  };

  // Compress and optimize image before upload
  const compressImage = useCallback((file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error("Compression failed"));
              }
            },
            "image/jpeg",
            0.85
          );
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error(`Image size should be less than ${maxSizeMB}MB`);
      return;
    }

    try {
      // Compress image
      const compressedFile = await compressImage(selectedFile);
      setFile(compressedFile);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress (Cloudinary doesn't provide real-time progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const url = await uploadToCloudinary(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!url) {
        throw new Error("Upload failed - no URL returned");
      }

      // Success!
      setTimeout(() => {
        onUploadSuccess(url);
        setPreview(null);
        setFile(null);
        setUploadProgress(0);
        toast.success("Image uploaded successfully!");
      }, 500);
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      toast.error(errorMessage);
      if (onUploadError) {
        onUploadError(error as Error);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayImage = preview || currentImage;

  return (
    <div className={`relative ${className}`}>
      {/* Image Display */}
      <div
        className={`relative w-32 h-32 mx-auto ${shapeClasses[shape]} overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-4 border-white dark:border-gray-700 shadow-xl`}
      >
        {displayImage ? (
          <Image
            src={displayImage}
            alt="Profile"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="w-12 h-12 text-gray-400 dark:text-gray-600" />
          </div>
        )}

        {/* Upload Progress Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
            <span className="text-white text-sm font-medium">
              {uploadProgress}%
            </span>
          </div>
        )}

        {/* Upload Button */}
        {!preview && !uploading && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center group"
          >
            <div className="text-center">
              <Upload className="w-8 h-8 text-white mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-white text-xs font-medium">
                Change Photo
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Preview Actions */}
      {preview && !uploading && (
        <div className="mt-4 flex gap-2 justify-center">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <Check size={16} />
            Upload
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
