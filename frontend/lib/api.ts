import axios from "axios";
import { User } from "./types";
import { toast } from "sonner";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Important: This allows cookies to be sent
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || "An error occurred";

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          // Only show "session expired" and redirect if:
          // 1. Not already on auth pages
          // 2. Not on public pages (home, landing)
          // 3. User was actually trying to access protected content
          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            const isAuthPage =
              currentPath.includes("/login") ||
              currentPath.includes("/register");
            const isPublicPage =
              currentPath === "/" || currentPath.includes("/home");
            const isCheckAuthRequest = error.config?.url?.includes("/users/me");

            // Don't show error for initial auth check on public pages
            if (isAuthPage || (isPublicPage && isCheckAuthRequest)) {
              // Silent fail - don't show toast or redirect
              break;
            }

            // Only show session expired for actual protected route access
            if (!isPublicPage) {
              toast.error("Session expired", {
                description: "Please log in again to continue",
              });
              window.location.href = "/login";
            }
          }
          break;
        case 403:
          // Forbidden - insufficient permissions
          toast.error("Access denied", {
            description:
              message || "You don't have permission to access this resource",
          });
          break;
        case 404:
          // Not found
          toast.error("Not found", {
            description: message || "The requested resource was not found",
          });
          break;
        case 500:
          // Server error
          toast.error("Server error", {
            description:
              message ||
              "Something went wrong on our end. Please try again later.",
          });
          break;
        default:
          // Other errors
          if (status >= 400) {
            toast.error("Error", {
              description: message,
            });
          }
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error("Network error", {
        description:
          "Unable to connect to the server. Please check your internet connection.",
      });
    } else {
      // Something else happened
      toast.error("Error", {
        description: error.message || "An unexpected error occurred",
      });
    }

    return Promise.reject(error);
  }
);

// API methods for authentication
export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: "client" | "vendor" | "admin";
    phone?: string;
    businessName?: string;
  }) => api.post("/users/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/users/login", data),

  logout: () => api.post("/users/logout"),

  getCurrentUser: () => api.get("/users/me"),

  getAllUser: () => api.get("/users"),

  getUserById: (id: string) => api.get(`/users/${id}`),

  updateProfile: (id: string, data: any) => api.patch(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  toggleUserActiveness: (id: string, active: any) => {
    // backend expects the raw boolean in the body (req.body === true/false)
    // callers sometimes pass an object like { active: boolean } — normalize here
    const body =
      active && typeof active === "object" && "active" in active
        ? active.active
        : active;
    return api.patch(`/users/${id}/toggle-active`, body);
  },
  verifyVendor: (id: string, verify: any) =>
    api.patch(`/users/${id}/verify-vendor`, verify),
  getVendors: (params?: any) => api.get("/users/vendors", { params }),

  getVendorById: (id: string) => api.get(`/users/vendors/${id}`),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/users/password", data),
};

// API methods for services
export const servicesAPI = {
  getAll: (params?: any) => api.get("/services", { params }),

  getById: (id: string) => api.get(`/services/${id}`),

  getByProvider: (providerId: string) =>
    api.get(`/services/provider/${providerId}`),

  create: (data: any) => api.post("/services", data),

  update: (id: string, data: any) => api.put(`/services/${id}`, data),

  delete: (id: string) => api.delete(`/services/${id}`),
};

// API methods for bookings
export const bookingsAPI = {
  getAll: (params?: any) => api.get("/bookings", { params }),

  getById: (id: string) => api.get(`/bookings/${id}`),
  getUserBookings: (userId: string) => api.get(`/bookings/user/${userId}`),
  getForVendor: (id: string) => api.get(`/bookings/provider/${id}/bookings`),
  create: (data: any) => api.post("/bookings", data),

  update: (id: string, data: any) => api.patch(`/bookings/${id}`, data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/bookings/${id}/status`, { status }),

  cancel: (id: string) => api.delete(`/bookings/${id}`),

  delete: (id: string) => api.delete(`/bookings/${id}`),
};

// API methods for conversations and messages
export const conversationAPI = {
  // Get user's conversations
  getUserConversations: async (userId: string) => {
    return api.get(`/conversations/user/${userId}`);
  },

  // Get or create conversation between two users
  getOrCreateConversation: async (participantId: string) => {
    return api.post(`/conversations/create`, { participantId });
  },

  // Get messages in a conversation
  getConversationMessages: async (
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ) => {
    return api.get(`/conversations/${conversationId}/messages`, {
      params: { page, limit },
    });
  },

  // Mark messages as read
  markMessagesAsRead: async (conversationId: string) => {
    return api.patch(`/conversations/${conversationId}/read`);
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
    return api.post(`/gallery/upload/${vendorId}`, {
      url,
      title,
      description,
      mediaType: mediaType || "image",
    });
  },

  // Get gallery images for a vendor
  getImages: async (vendorId: string, limit: number = 12, page: number = 1) => {
    return api.get(`/gallery/${vendorId}`, {
      params: { limit, page },
    });
  },

  // Delete image from gallery
  deleteImage: async (vendorId: string, imageId: string) => {
    return api.delete(`/gallery/${vendorId}/${imageId}`);
  },

  // Update image info (title, description)
  updateImage: async (
    vendorId: string,
    imageId: string,
    title?: string,
    description?: string
  ) => {
    return api.put(`/gallery/${vendorId}/${imageId}`, { title, description });
  },

  // Clear entire gallery
  clearGallery: async (vendorId: string) => {
    return api.delete(`/gallery/clear/${vendorId}`);
  },
};

export default api;
