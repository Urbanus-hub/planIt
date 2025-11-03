// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "client" | "vendor" | "admin";
  phone?: string;
  businessName?: string;
  joinedDate: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: string;
}

// Auth Types
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: "client" | "vendor" | "admin";
  phone?: string;
  businessName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Service Types
export interface Service {
  _id: string;
  vendorId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration?: number;
  location?: string;
  images?: string[];
  availability?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Booking Types
export interface Booking {
  _id: string;
  clientId: string;
  vendorId: string;
  serviceId: string;
  bookingDate: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Error Types
export interface ApiError {
  success: false;
  message: string;
  errors?: any;
}
