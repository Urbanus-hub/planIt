"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("client" | "vendor" | "admin")[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!loading && !hasRedirected.current) {
      // Not authenticated
      if (!user) {
        hasRedirected.current = true;
        router.replace(redirectTo);
        return;
      }

      // Check if user role is allowed
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        hasRedirected.current = true;
        // Redirect based on role
        switch (user.role) {
          case "admin":
            router.replace("/admin");
            break;
          case "vendor":
            router.replace("/vendors");
            break;
          case "client":
            router.replace("/clients");
            break;
          default:
            router.replace("/");
        }
      }
    }
  }, [user, loading, allowedRoles, router, redirectTo]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Not authorized for this route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
