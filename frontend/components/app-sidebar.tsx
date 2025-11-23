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
  MessageCircle,
  User,
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
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import styles from "./app-sidebar.module.css";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();
  const { state } = useSidebar();

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
          { title: "Messages", url: "/client/messages", icon: MessageCircle },
          { title: "Favorites", url: "/client/favorites", icon: Heart },
          { title: "Payments", url: "/client/payments", icon: DollarSign },
        ],
      };
    }

    if (role === "vendor") {
      return {
        main: [
          { title: "Dashboard", url: "/vendor", icon: LayoutDashboard },
          { title: "Services", url: "/vendor/services", icon: Package },
          { title: "Bookings", url: "/vendor/bookings", icon: Calendar },
          { title: "Messages", url: "/vendor/messages", icon: Users },
          { title: "Reviews", url: "/vendor/reviews", icon: Star },
          { title: "Profile", url: "/vendor/profile", icon: User },
          { title: "Analytics", url: "/vendor/analytics", icon: BarChart3 },
        ],
      };
    }

    return { main: [] };
  };

  const navigation = getNavigation();

  const secondaryNav: any[] = [];

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      {...props}
      className="relative bg-slate-950 overflow-hidden !fixed !left-0 !top-0 !h-screen !border-r border-green-500/30 shadow-2xl shadow-black/50"
    >
      {/* Background Image */}
      <div className={styles.sidebarBackground} />
      {/* Gradient Overlay - Lighter to show bg image */}
      <div className="absolute inset-0 z-0 bg-linear-to-br from-slate-900/60 via-slate-950/70 to-black/65" />
      {/* Green accent glow */}
      <div className="absolute inset-0 z-0 bg-linear-to-r from-green-600/15 via-green-500/5 to-transparent" />
      {/* Bottom green fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 z-0 bg-linear-to-t from-green-500/20 via-green-500/5 to-transparent" />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col h-full overflow-y-auto">
        <SidebarHeader className="sticky top-0 z-20">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="lg"
                className="h-12 rounded-lg border border-green-500/20 hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300"
              >
                <a
                  href="/"
                  className={cn(
                    "flex items-center transition-all",
                    state === "collapsed"
                      ? "justify-center px-2"
                      : "justify-start gap-3 px-2"
                  )}
                >
                  <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-lg">
                    <Calendar className="size-5" />
                  </div>
                  {state !== "collapsed" && (
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-bold text-lg text-white">
                        PlanIt
                      </span>
                      <span className="truncate text-xs capitalize text-green-300 font-medium">
                        {user?.role || "Dashboard"}
                      </span>
                    </div>
                  )}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="gap-0 py-4 flex-1">
          <NavMain items={navigation.main} />
          <div className="flex-1" />
          <NavSecondary items={secondaryNav} />
        </SidebarContent>
        <SidebarFooter className="  sticky bottom-0 z-20">
          <NavUser
            user={{
              name: user?.name || "User",
              email: user?.email || "",
              avatar: "/avatars/default.jpg",
            }}
          />
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
