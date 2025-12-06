"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { authAPI } from "@/lib/api";
import { User, LoginData, RegisterData } from "@/lib/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (err) {
      // Silent fail on initial auth check
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData): Promise<User> => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.login(data);
      if (response.data.success) {
        // Store token in localStorage
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
        }
        setUser(response.data.data);
        return response.data.data;
      }
      throw new Error("Login failed");
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<User> => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.register(data);
      if (response.data.success) {
        setUser(response.data.data);
        return response.data.data;
      }
      throw new Error("Registration failed");
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      // Clear token from localStorage
      localStorage.removeItem("authToken");
      setUser(null);
      toast.success("Logged out successfully", {
        description: "You have been signed out of your account",
      });
    } catch (err) {
      // Clear token even if API call fails
      localStorage.removeItem("authToken");
      setUser(null);
      toast.error("Logout failed", {
        description: "There was a problem logging you out. Please try again.",
      });
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
