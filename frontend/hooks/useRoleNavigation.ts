"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Custom hook for role-based navigation
 * Redirects users to their appropriate dashboard based on role
 */
export function useRoleBasedRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const redirectToDashboard = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    switch (user.role) {
      case "admin":
        router.push("/admin");
        break;
      case "vendor":
        router.push("/vendor");
        break;
      case "client":
        router.push("/client");
        break;
      default:
        router.push("/");
    }
  };

  return { redirectToDashboard, user, loading };
}

/**
 * Get dashboard path based on user role
 */
export function getDashboardPath(role: "client" | "vendor" | "admin"): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "vendor":
      return "/vendor";
    case "client":
      return "/client";
    default:
      return "/";
  }
}

/**
 * Check if user has required role
 */
export function hasRole(
  userRole: "client" | "vendor" | "admin",
  allowedRoles: ("client" | "vendor" | "admin")[]
): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Hook to check if user is authenticated
 */
export function useRequireAuth(redirectTo: string = "/login") {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
}
