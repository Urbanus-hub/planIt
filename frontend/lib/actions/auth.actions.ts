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

// Auth Actions
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role?: "client" | "vendor" | "admin";
  phone?: string;
  businessName?: string;
}) {
  try {
    const response = await apiClient.post("/users/register", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
}

export async function loginUser(data: { email: string; password: string }) {
  try {
    const response = await apiClient.post("/users/login", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
}

export async function logoutUser() {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.post("/users/logout", {}, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Logout failed");
  }
}

export async function getCurrentUser() {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get("/users/me", { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get user");
  }
}

export async function getAllUsers() {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get("/users", { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get users");
  }
}

export async function getUserById(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get(`/users/${id}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get user");
  }
}

export async function updateUserProfile(id: string, data: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.patch(`/users/${id}`, data, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update profile");
  }
}

export async function deleteUser(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.delete(`/users/${id}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
}

export async function toggleUserActiveness(id: string, active: any) {
  try {
    const body =
      active && typeof active === "object" && "active" in active
        ? active.active
        : active;

    const headers = await getAuthHeaders();
    const response = await apiClient.patch(`/users/${id}/toggle-active`, body, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to toggle user status");
  }
}

export async function verifyVendor(id: string, verify: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.patch(`/users/${id}/verify-vendor`, verify, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to verify vendor");
  }
}

export async function getVendors(params?: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get("/users/vendors", { params, headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get vendors");
  }
}

export async function getVendorById(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.get(`/users/vendors/${id}`, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get vendor");
  }
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.put("/users/password", data, { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to change password");
  }
}

export async function verifyOTP(data: { email: string; otp: string }) {
  try {
    const response = await apiClient.post("/users/verify-otp", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "OTP verification failed");
  }
}

export async function resendOTP(data: { email: string }) {
  try {
    const response = await apiClient.post("/users/resend-otp", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to resend OTP");
  }
}

export async function forgotPassword(data: { email: string }) {
  try {
    const response = await apiClient.post("/users/forgot-password", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to send reset email");
  }
}

export async function resetPassword(data: { token: string; password: string }) {
  try {
    const response = await apiClient.post("/users/reset-password", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to reset password");
  }
}
