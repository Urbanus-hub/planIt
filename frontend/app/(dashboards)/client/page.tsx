"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";


export default function ClientDashboard() {
    const {user}=useAuth();
    console.log("user data",user)
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <h1>client data: {user?user.email:"No user data"}</h1>
      </div>
    </ProtectedRoute>
  );
}
