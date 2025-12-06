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

// Bookings Actions
export async function getAllBookings(params?: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get("/bookings", { params, headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get bookings");
  }
}

export async function getBookingById(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get(`/bookings/${id}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get booking");
  }
}

export async function getUserBookings(userId: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get(`/bookings/user/${userId}`, {
      headers,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to get user bookings"
    );
  }
}

export async function getVendorBookings(vendorId: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get(
      `/bookings/provider/${vendorId}/bookings`,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to get vendor bookings"
    );
  }
}

export async function createBooking(data: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.post("/bookings", data, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create booking"
    );
  }
}

export async function updateBooking(id: string, data: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.patch(`/bookings/${id}`, data, {
      headers,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update booking"
    );
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.patch(
      `/bookings/${id}/status`,
      { status },
      { headers }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update booking status"
    );
  }
}

export async function cancelBooking(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.delete(`/bookings/${id}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to cancel booking"
    );
  }
}

export async function deleteBooking(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.delete(`/bookings/${id}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete booking"
    );
  }
}
