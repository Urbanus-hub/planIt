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
          // Redirect to login only if not already on auth pages
          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            if (
              !currentPath.includes("/login") &&
              !currentPath.includes("/register")
            ) {
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

  getAllUser:()=>api.get("/users"),

  getUserById: (id: string) => api.get(`/users/${id}`),

  updateProfile: (data: any) => api.patch("/users/profile", data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  toggleUserActiveness: (id: string, active: any) => {
    // backend expects the raw boolean in the body (req.body === true/false)
    // callers sometimes pass an object like { active: boolean } — normalize here
    const body = active && typeof active === "object" && "active" in active ? active.active : active;
    return api.patch(`/users/${id}/toggle-active`, body);
  },
  verifyVendor: (id: string,verify: any) => api.patch(`/users/${id}/verify-vendor`,verify),


  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/users/password", data),
};

// API methods for services
export const servicesAPI = {
  getAll: (params?: any) => api.get("/services", { params }),

  getById: (id: string) => api.get(`/services/${id}`),

  create: (data: any) => api.post("/services", data),

  update: (id: string, data: any) => api.put(`/services/${id}`, data),

  delete: (id: string) => api.delete(`/services/${id}`),
};

// API methods for bookings
export const bookingsAPI = {
  getAll: (params?: any) => api.get("/bookings", { params }),

  getById: (id: string) => api.get(`/bookings/${id}`),

  create: (data: any) => api.post("/bookings", data),

  update: (id: string, data: any) => api.put(`/bookings/${id}`, data),

  cancel: (id: string) => api.patch(`/bookings/${id}/cancel`),

  delete: (id: string) => api.delete(`/bookings/${id}`),
};

export default api;
