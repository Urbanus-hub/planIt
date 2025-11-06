import { ProtectedRoute } from "@/components/ProtectedRoute";
export default function ClientLayout({
  children,
}: {  children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
