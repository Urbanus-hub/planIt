"use client";

import * as React from "react";
import {
  Calendar,
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  HelpCircle,
  Heart,
  Package,
  DollarSign,
  Star,
  BarChart3,
  Bell,
  LogOut,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();

  // Role-based navigation
  const getNavigation = () => {
    const role = user?.role;

    if (role === "admin") {
      return {
        main: [
          { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
          { title: "Users", url: "/admin/users", icon: Users },
          { title: "Vendors", url: "/admin/vendors", icon: Briefcase },
          { title: "Bookings", url: "/admin/bookings", icon: Calendar },
          { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
        ],
      };
    }

    if (role === "client") {
      return {
        main: [
          { title: "Dashboard", url: "/client", icon: LayoutDashboard },
          { title: "Browse Vendors", url: "/client/vendors", icon: Briefcase },
          { title: "My Bookings", url: "/client/bookings", icon: Calendar },
          { title: "Favorites", url: "/client/favorites", icon: Heart },
          { title: "Payments", url: "/client/payments", icon: DollarSign },
        ],
      };
    }

    if (role === "vendor") {
      return {
        main: [
          { title: "Dashboard", url: "/vendor", icon: LayoutDashboard },
          { title: "Bookings", url: "/vendor/bookings", icon: Calendar },
          { title: "Services", url: "/vendor/services", icon: Package },
          { title: "Reviews", url: "/vendor/reviews", icon: Star },
          { title: "Analytics", url: "/vendor/analytics", icon: BarChart3 },
        ],
      };
    }

    return { main: [] };
  };

  const navigation = getNavigation();

  const secondaryNav = [
    { title: "Notifications", url: "#", icon: Bell },
    { title: "Settings", url: "#", icon: Settings },
    { title: "Help & Support", url: "#", icon: HelpCircle },
  ];

  return (
    <Sidebar collapsible="icon" variant="sidebar" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="h-12">
              <a href="/" className="flex items-center gap-3 px-2">
                <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white shadow-sm">
                  <Calendar className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-lg">PlanIt</span>
                  <span className="truncate text-xs capitalize text-muted-foreground">
                    {user?.role || "Dashboard"}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0 py-4">
        <NavMain items={navigation.main} />
        <div className="flex-1" />
        <NavSecondary items={secondaryNav} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "User",
            email: user?.email || "",
            avatar: "/avatars/default.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
