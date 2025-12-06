"use server";

import { cookies } from "next/headers";
import apiClient from "@/lib/instances/axios.instance";

// Helper function to get auth headers from server-side cookies
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
}

// Gallery Actions
export async function uploadGalleryImage(
  vendorId: string,
  url: string,
  title?: string,
  description?: string,
  mediaType?: "image" | "video"
) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.post(
      `/gallery/upload/${vendorId}`,
      {
        url,
        title,
        description,
        mediaType: mediaType || "image",
      },
      { headers }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to upload image");
  }
}

export async function getGalleryImages(
  vendorId: string,
  limit: number = 12,
  page: number = 1
) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get(`/gallery/${vendorId}`, {
      params: { limit, page },
      headers,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get gallery images");
  }
}

export async function deleteGalleryImage(vendorId: string, imageId: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.delete(`/gallery/${vendorId}/${imageId}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete image");
  }
}

export async function updateGalleryImage(
  vendorId: string,
  imageId: string,
  title?: string,
  description?: string
) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.put(
      `/gallery/${vendorId}/${imageId}`,
      { title, description },
      { headers }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update image");
  }
}

export async function clearGallery(vendorId: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.delete(`/gallery/clear/${vendorId}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to clear gallery");
  }
}
