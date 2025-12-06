import apiClient from "./instances/axios.instance";
import { User } from "./types";
import { toast } from "sonner";

// Export the axios instance as default for backward compatibility
export default apiClient;

// API methods for authentication
export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: "client" | "vendor" | "admin";
    phone?: string;
    businessName?: string;
  }) => apiClient.post("/users/register", data),

  login: (data: { email: string; password: string }) =>
    apiClient.post("/users/login", data),

  logout: () => apiClient.post("/users/logout"),

  getCurrentUser: () => apiClient.get("/users/me"),

  getAllUser: () => apiClient.get("/users"),

  getUserById: (id: string) => apiClient.get(`/users/${id}`),

  updateProfile: (id: string, data: any) => apiClient.patch(`/users/${id}`, data),
  deleteUser: (id: string) => apiClient.delete(`/users/${id}`),
  toggleUserActiveness: (id: string, active: any) => {
    // backend expects the raw boolean in the body (req.body === true/false)
    // callers sometimes pass an object like { active: boolean } — normalize here
    const body =
      active && typeof active === "object" && "active" in active
        ? active.active
        : active;
    return apiClient.patch(`/users/${id}/toggle-active`, body);
  },
  verifyVendor: (id: string, verify: any) =>
    apiClient.patch(`/users/${id}/verify-vendor`, verify),
  getVendors: (params?: any) => apiClient.get("/users/vendors", { params }),

  getVendorById: (id: string) => apiClient.get(`/users/vendors/${id}`),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.put("/users/password", data),

  verifyOTP: (data: { email: string; otp: string }) =>
    apiClient.post("/users/verify-otp", data),

  resendOTP: (data: { email: string }) => apiClient.post("/users/resend-otp", data),

  forgotPassword: (data: { email: string }) =>
    apiClient.post("/users/forgot-password", data),

  resetPassword: (data: { token: string; password: string }) =>
    apiClient.post("/users/reset-password", data),
};

// API methods for services
export const servicesAPI = {
  getAll: (params?: any) => apiClient.get("/services", { params }),

  getById: (id: string) => apiClient.get(`/services/${id}`),

  getByProvider: (providerId: string) =>
    apiClient.get(`/services/provider/${providerId}`),

  create: (data: any) => apiClient.post("/services", data),

  update: (id: string, data: any) => apiClient.put(`/services/${id}`, data),

  delete: (id: string) => apiClient.delete(`/services/${id}`),
};

// API methods for bookings
export const bookingsAPI = {
  getAll: (params?: any) => apiClient.get("/bookings", { params }),

  getById: (id: string) => apiClient.get(`/bookings/${id}`),
  getUserBookings: (userId: string) => apiClient.get(`/bookings/user/${userId}`),
  getForVendor: (id: string) => apiClient.get(`/bookings/provider/${id}/bookings`),
  create: (data: any) => apiClient.post("/bookings", data),

  update: (id: string, data: any) => apiClient.patch(`/bookings/${id}`, data),
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/bookings/${id}/status`, { status }),

  cancel: (id: string) => apiClient.delete(`/bookings/${id}`),

  delete: (id: string) => apiClient.delete(`/bookings/${id}`),
};

// API methods for conversations and messages
export const conversationAPI = {
  // Get user's conversations
  getUserConversations: async (userId: string) => {
    return apiClient.get(`/conversations/user/${userId}`);
  },

  // Get or create conversation between two users
  getOrCreateConversation: async (participantId: string) => {
    return apiClient.post(`/conversations/create`, { participantId });
  },

  // Get messages in a conversation
  getConversationMessages: async (
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ) => {
    return apiClient.get(`/conversations/${conversationId}/messages`, {
      params: { page, limit },
    });
  },

  // Mark messages as read
  markMessagesAsRead: async (conversationId: string) => {
    return apiClient.patch(`/conversations/${conversationId}/read`);
  },
};

// API methods for gallery
export const galleryAPI = {
  // Upload image/video to gallery
  uploadImage: async (
    vendorId: string,
    url: string,
    title?: string,
    description?: string,
    mediaType?: "image" | "video"
  ) => {
    return apiClient.post(`/gallery/upload/${vendorId}`, {
      url,
      title,
      description,
      mediaType: mediaType || "image",
    });
  },

  // Get gallery images for a vendor
  getImages: async (vendorId: string, limit: number = 12, page: number = 1) => {
    return apiClient.get(`/gallery/${vendorId}`, {
      params: { limit, page },
    });
  },

  // Delete image from gallery
  deleteImage: async (vendorId: string, imageId: string) => {
    return apiClient.delete(`/gallery/${vendorId}/${imageId}`);
  },

  // Update image info (title, description)
  updateImage: async (
    vendorId: string,
    imageId: string,
    title?: string,
    description?: string
  ) => {
    return apiClient.put(`/gallery/${vendorId}/${imageId}`, { title, description });
  },

  // Clear entire gallery
  clearGallery: async (vendorId: string) => {
    return apiClient.delete(`/gallery/clear/${vendorId}`);
  },
};
