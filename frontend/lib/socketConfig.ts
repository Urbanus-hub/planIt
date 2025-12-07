import io, { Socket } from "socket.io-client";

// Extract base URL without /api for Socket.IO connection
const getSocketUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.contuor.app/api";
  // Remove /api suffix if present
  return apiUrl.replace(/\/api$/, "");
};

const SOCKET_URL = getSocketUrl();

let socket: Socket | null = null;

/**
 * Get auth token from cookies (client-side)
 */
const getClientAuthToken = (): string | null => {
  if (typeof document === "undefined") return null;

  // Try both possible cookie names
  const cookies = document.cookie.split("; ");

  const authTokenCookie = cookies.find((row) => row.startsWith("authToken="));
  if (authTokenCookie) {
    return authTokenCookie.split("=")[1];
  }

  const tokenCookie = cookies.find((row) => row.startsWith("token="));
  if (tokenCookie) {
    return tokenCookie.split("=")[1];
  }

  return null;
};

/**
 * Initialize Socket.IO connection
 * Creates a single socket instance for the entire app
 */
export const initSocket = (): Socket => {
  if (socket?.connected) return socket;

  console.log("🔌 Attempting to connect to Socket.IO server at:", SOCKET_URL);

  // Get auth token from cookies synchronously
  const authToken = getClientAuthToken();
  console.log(
    "User auth token found:",
    authToken ? `${authToken.substring(0, 10)}...` : "undefined"
  );

  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 50, // Fastest reconnection
    reconnectionDelayMax: 500, // Minimal max delay
    reconnectionAttempts: 15,
    transports: ["polling"], // Keep polling for stability
    forceNew: false,
    timeout: 5000, // Ultra-fast timeout for instant messaging
    upgrade: false,
    rememberUpgrade: false,
    autoConnect: true,
    auth: {
      token: authToken,
    },
    withCredentials: true,
    forceBase64: false,
  });

  socket.on("connect", () => {
    console.log("✓ Socket connected successfully:", socket?.id);
    console.log("✓ Socket namespace: /");
  });

  socket.on("disconnect", (reason) => {
    console.log("✗ Socket disconnected. Reason:", reason);
  });

  socket.on("connect_error", (error) => {
    // Safely get error message
    const errorMessage = error?.message || error?.toString() || "Unknown error";

    // Filter out transient websocket errors to reduce noise
    const isTransientError =
      errorMessage.includes("websocket error") ||
      errorMessage.includes("transport error") ||
      errorMessage.includes("xhr poll error") ||
      errorMessage.includes("websocket") ||
      errorMessage.includes("transport close");

    if (!isTransientError) {
      console.error("❌ Socket connection error:", errorMessage);

      // Provide specific error messages for common issues
      if (errorMessage.includes("Invalid namespace")) {
        console.error(
          "🔧 Fix: Check if the server is running and the URL is correct"
        );
        console.error("🔧 Current URL:", SOCKET_URL);
      }
    } else {
      // Suppress transient websocket errors completely to reduce console noise
      console.debug("🔄 Socket transport issue (retrying):", errorMessage);
    }
  });

  socket.on("error", (error) => {
    console.error("❌ Socket general error:", error);
  });

  return socket;
};

/**
 * Get the existing Socket instance
 */
export const getSocket = (): Socket | null => socket;

/**
 * Disconnect the socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
