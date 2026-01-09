import { ProtectedRoute } from "@/components/ProtectedRoute";
export default function ClientLayout({
  children,
}: {  children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="w-full max-w-full overflow-x-hidden">
        {children}
      </div>
    </ProtectedRoute>
  );
}
