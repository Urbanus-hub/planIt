"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Get page title based on route
  const getPageTitle = () => {
    if (pathname === "/admin") return "Admin Dashboard";
    if (pathname === "/client") return "My Dashboard";
    if (pathname === "/vendor") return "Vendor Dashboard";
    if (pathname.includes("/admin/"))
      return pathname.split("/").pop()?.replace("-", " ") || "Admin";
    if (pathname.includes("/client/"))
      return pathname.split("/").pop()?.replace("-", " ") || "Client";
    if (pathname.includes("/vendor/"))
      return pathname.split("/").pop()?.replace("-", " ") || "Vendor";
    return "Dashboard";
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Sticky Header */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 px-4 transition-all">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold capitalize">{getPageTitle()}</h1>
        </header>

        {/* Page Content */}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
