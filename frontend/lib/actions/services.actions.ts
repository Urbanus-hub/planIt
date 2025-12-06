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

// Services Actions
export async function getAllServices(params?: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get("/services", { params, headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get services");
  }
}

export async function getServiceById(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get(`/services/${id}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get service");
  }
}

export async function getServicesByProvider(providerId: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get(`/services/provider/${providerId}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get provider services");
  }
}

export async function createService(data: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.post("/services", data, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create service");
  }
}

export async function updateService(id: string, data: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.put(`/services/${id}`, data, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update service");
  }
}

export async function deleteService(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.delete(`/services/${id}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete service");
  }
}
