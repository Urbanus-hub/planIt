import axios from "axios";

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
          console.error("Unauthorized:", message);
          // Redirect to login or refresh token
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          break;
        case 403:
          // Forbidden - insufficient permissions
          console.error("Forbidden:", message);
          break;
        case 404:
          // Not found
          console.error("Not found:", message);
          break;
        case 500:
          // Server error
          console.error("Server error:", message);
          break;
        default:
          console.error("Error:", message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Network error: No response from server");
    } else {
      // Something else happened
      console.error("Error:", error.message);
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

  updateProfile: (data: any) => api.put("/users/profile", data),

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
