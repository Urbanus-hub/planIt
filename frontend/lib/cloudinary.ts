export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    // Validate environment variables
    if (!cloudName) {
      console.error("Missing: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
      throw new Error(
        "Cloudinary Cloud Name is not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to your .env.local"
      );
    }

    if (!uploadPreset) {
      console.error("Missing: NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
      throw new Error(
        "Cloudinary Upload Preset is not configured. Please add NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your .env.local"
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    // Determine file type (image or video)
    const fileType = file.type.startsWith("video") ? "video" : "image";

    // Note: Advanced optimization parameters like quality, format, and eager transformations
    // should be configured in your Cloudinary Upload Preset settings at:
    // https://console.cloudinary.com/settings/upload
    //
    // Alternatively, use the getOptimizedImageUrl() helper function when displaying images
    // to apply transformations on-the-fly without affecting the original upload.

    // Use appropriate endpoint based on file type
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${fileType}/upload`;

    console.log(`Uploading ${fileType} directly to Cloudinary:`, {
      cloudName,
      endpoint,
      fileSize: file.size,
      fileType: file.type,
    });

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage =
        data.error?.message ||
        data.message ||
        `Upload failed: ${res.statusText}`;
      console.error("Cloudinary error response:", data);
      throw new Error(errorMessage);
    }

    // Check for errors in response
    if (data.error) {
      console.error("Cloudinary error in response:", data.error);
      throw new Error(data.error.message || "Cloudinary upload failed");
    }

    if (!data.secure_url) {
      console.error("No secure_url in response:", data);
      throw new Error("Upload succeeded but no URL was returned");
    }

    console.log("Upload successful:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to upload to Cloudinary. Check your internet connection and Cloudinary credentials.";
    console.error("Cloudinary upload error:", errorMessage, error);
    throw new Error(errorMessage);
  }
};

// Batch upload function for multiple files
export const batchUploadToCloudinary = async (
  files: File[],
  onProgress?: (uploaded: number, total: number) => void
): Promise<string[]> => {
  const uploadPromises: Promise<string>[] = [];
  const results: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const uploadPromise = uploadToCloudinary(file).then((url) => {
      results.push(url);
      onProgress?.(results.length, files.length);
      return url;
    });
    uploadPromises.push(uploadPromise);
  }

  try {
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Batch upload error:", error);
    throw error;
  }
};

// Helper function to get optimized image URL with transformations
export const getOptimizedImageUrl = (
  publicUrl: string,
  options?: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "limit" | "scale" | "thumb";
    quality?:
      | "auto"
      | "auto:best"
      | "auto:good"
      | "auto:eco"
      | "auto:low"
      | number;
    format?: "auto" | "webp" | "avif" | "jpg" | "png";
    gravity?: "auto" | "face" | "center" | "north" | "south" | "east" | "west";
  }
): string => {
  try {
    // Return original if not a string or empty
    if (!publicUrl || typeof publicUrl !== "string") {
      console.warn("getOptimizedImageUrl: Invalid URL provided", publicUrl);
      return publicUrl || "";
    }

    // Default options
    const {
      width,
      height,
      crop = "limit",
      quality = "auto:good",
      format = "auto",
      gravity = "auto",
    } = options || {};

    // Extract cloud name and public ID from URL - support both res.cloudinary.com and cloudinary.com
    // Also handle existing transformations in the URL
    const urlParts = publicUrl.match(
      /(?:res\.)?cloudinary\.com\/([^/]+)\/(image|video)\/upload\/(?:[^/]+\/)*(.+?)(?:\.[^.]+)?$/
    );

    if (!urlParts) {
      // Debug: log non-Cloudinary URLs
      console.log(
        "getOptimizedImageUrl: Not a Cloudinary URL, returning original:",
        publicUrl.substring(0, 100)
      );
      return publicUrl;
    }

    let [, cloudName, resourceType, publicId] = urlParts;

    // Extract file extension from original URL if present
    const extensionMatch = publicUrl.match(/\.([a-z0-9]+)$/i);
    const extension = extensionMatch ? `.${extensionMatch[1]}` : ".jpg";

    // Remove any existing transformations from publicId
    publicId = publicId.replace(/^v\d+\//, ""); // Remove version prefix
    const publicIdWithExtension = publicId.includes(".")
      ? publicId
      : `${publicId}${extension}`;

    // Build transformation string
    const transformations: string[] = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);
    if (gravity && (crop === "fill" || crop === "thumb"))
      transformations.push(`g_${gravity}`);

    // Add dpr_auto for automatic device pixel ratio
    transformations.push("dpr_auto");

    const transformString = transformations.join(",");

    // Construct optimized URL
    const optimizedUrl = `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformString}/${publicIdWithExtension}`;

    // Debug: log successful optimization
    console.log("✓ Optimized URL:", {
      original: publicUrl.substring(0, 80),
      optimized: optimizedUrl.substring(0, 80),
      transformations: transformString,
    });

    return optimizedUrl;
  } catch (error) {
    console.error("Error generating optimized image URL:", error, publicUrl);
    return publicUrl; // Return original URL if optimization fails
  }
};

// Helper to get responsive srcset for images
export const getResponsiveSrcSet = (
  publicUrl: string,
  widths: number[] = [400, 800, 1200, 1600]
): string => {
  return widths
    .map((width) => {
      const optimizedUrl = getOptimizedImageUrl(publicUrl, {
        width,
        quality: "auto:good",
        format: "auto",
      });
      return `${optimizedUrl} ${width}w`;
    })
    .join(", ");
};
