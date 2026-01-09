import { ProtectedRoute } from "@/components/ProtectedRoute";
export default function VendorLayout({
  children,
}: {  children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <div className="w-full max-w-full overflow-x-hidden">
        {children}
      </div>
    </ProtectedRoute>
  );
}
