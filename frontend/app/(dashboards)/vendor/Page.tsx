"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function VendorDashboard() {
  const{user}=useAuth();
  console.log("user data",user)
  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
       <h1>user email:{user?user.email:"No user found"}</h1>
      </div>
    </ProtectedRoute>
  );
}
