
import { AuthProvider } from "@/contexts/AuthContext";
export default function RootLayout({
  children,
}: {  children: React.ReactNode }) {
  return (

<div>
    <AuthProvider>
    {children}
    </AuthProvider>
</div>
    );
}