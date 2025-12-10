"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, Settings, HelpCircle, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Get page title based on route
  const getPageTitle = () => {
    if (pathname === "/admin") return "Admin Dashboard";
    if (pathname === "/client") return "My Dashboard";
    if (pathname === "/vendor") return "Vendor Dashboard";
    if (pathname.includes("/admin/"))
      return pathname.split("/").pop()?.replaceAll("-", " ") || "Admin";
    if (pathname.includes("/client/"))
      return pathname.split("/").pop()?.replaceAll("-", " ") || "Client";
    if (pathname.includes("/vendor/"))
      return pathname.split("/").pop()?.replaceAll("-", " ") || "Vendor";
    return "Dashboard";
  };

  const handleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const handleSettings = () => {
    toast.info("Settings coming soon");
  };

  const handleSupport = () => {
    toast.info("Help & Support coming soon");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Sticky Header */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 px-4 transition-all">
          <SidebarTrigger className="-ml-1" />

          <h1 className="text-xl font-semibold capitalize flex-1">
            {getPageTitle()}
          </h1>

          {/* Top Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotifications}
              className="relative h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSettings}
              className="h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>

            {/* Help & Support */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSupport}
              className="h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
