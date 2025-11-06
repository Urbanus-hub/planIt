"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Admin Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Total Users
              </h3>
              <p className="text-3xl font-bold text-green-600">-</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Total Vendors
              </h3>
              <p className="text-3xl font-bold text-green-600">-</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Total Bookings
              </h3>
              <p className="text-3xl font-bold text-green-600">-</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
