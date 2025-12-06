import axios from "axios";
import { toast } from "sonner";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Important: This allows cookies to be sent
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token from localStorage (for client-side)
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only show toasts on the client side
    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || "An error occurred";

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
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
          break;
        case 403:
          // Forbidden - insufficient permissions
          toast.error("Access denied", {
            description:
              message || "You don't have permission to access this resource",
          });
          break;
        case 404:
          // Not found - Only show for non-auth checks
          if (!error.config?.url?.includes("/users/me")) {
            toast.error("Not found", {
              description: message || "The requested resource was not found",
            });
          }
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
          // Other errors - be selective about showing toasts
          if (status >= 400 && !error.config?.url?.includes("/users/me")) {
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
    }

    return Promise.reject(error);
  }
);

export default apiClient;
