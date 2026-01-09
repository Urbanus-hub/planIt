import { ProtectedRoute } from "@/components/ProtectedRoute";
export default function AdminLayout({
  children,
}: {  children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="w-full max-w-full overflow-x-hidden">
        {children}
      </div>
    </ProtectedRoute>
  );
}
