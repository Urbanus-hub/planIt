import axios from "axios";
import { Gallery, GalleryImage } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const galleryAPI = {
  // Upload image to gallery
  uploadImage: async (
    vendorId: string,
    url: string,
    title?: string,
    description?: string
  ): Promise<Gallery> => {
    const response = await axios.post(
      `${API_BASE_URL}/gallery/upload/${vendorId}`,
      {
        url,
        title,
        description,
      }
    );
    return response.data.data;
  },

  // Get gallery images for a vendor
  getImages: async (
    vendorId: string,
    limit: number = 12,
    page: number = 1
  ): Promise<{
    images: GalleryImage[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const response = await axios.get(`${API_BASE_URL}/gallery/${vendorId}`, {
      params: { limit, page },
    });
    return response.data.data;
  },

  // Delete image from gallery
  deleteImage: async (vendorId: string, imageId: string): Promise<Gallery> => {
    const response = await axios.delete(
      `${API_BASE_URL}/gallery/${vendorId}/${imageId}`
    );
    return response.data.data;
  },

  // Update image info (title, description)
  updateImage: async (
    vendorId: string,
    imageId: string,
    title?: string,
    description?: string
  ): Promise<Gallery> => {
    const response = await axios.put(
      `${API_BASE_URL}/gallery/${vendorId}/${imageId}`,
      { title, description }
    );
    return response.data.data;
  },

  // Clear entire gallery
  clearGallery: async (vendorId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/gallery/clear/${vendorId}`);
  },
};
