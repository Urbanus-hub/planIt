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
