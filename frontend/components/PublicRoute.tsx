"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute component - redirects authenticated users to their dashboard
 * Use this for login/register pages
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // User is already authenticated, redirect to their dashboard
      switch (user.role) {
        case "admin":
          router.push("/admin");
          break;
        case "vendor":
          router.push("/vendors");
          break;
        case "client":
          router.push("/clients");
          break;
        default:
          router.push("/");
      }
    }
  }, [user, loading, router]);

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

  // User is authenticated, will redirect
  if (user) {
    return null;
  }

  // User is not authenticated, show the page
  return <>{children}</>;
}
