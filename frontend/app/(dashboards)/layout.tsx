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
    <div className="w-full max-w-full overflow-x-hidden h-screen flex flex-col">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out">
          {/* Sticky Header - Responsive */}
          <header className="sticky top-0 z-20 flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 px-3 sm:px-4 lg:px-6 transition-all w-full max-w-full">
            <SidebarTrigger className="-ml-1 h-9 w-9 sm:h-10 sm:w-10" />

            <h1 className="text-base sm:text-lg lg:text-xl font-semibold capitalize flex-1 min-w-0 truncate px-2">
              {getPageTitle()}
            </h1>

            {/* Top Right Actions - Responsive */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Theme Toggle - Hidden on small mobile, visible on larger screens */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hidden sm:flex h-9 w-9 sm:h-10 sm:w-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px]"
                title={
                  theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
                )}
              </Button>

              <Separator
                orientation="vertical"
                className="h-4 sm:h-6 hidden sm:block"
              />

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNotifications}
                className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px]"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
              </Button>

              {/* Settings - Hidden on small mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSettings}
                className="hidden sm:flex h-9 w-9 sm:h-10 sm:w-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px]"
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
              </Button>

              {/* Help & Support - Hidden on mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSupport}
                className="hidden lg:flex h-9 w-9 sm:h-10 sm:w-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px]"
              >
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
              </Button>
            </div>
          </header>

          {/* Page Content - Scrollable with no horizontal overflow */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full">
            <div className="w-full max-w-full overflow-x-hidden">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
