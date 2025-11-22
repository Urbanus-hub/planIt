"use client";

import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupContent
        className={cn(
          "py-3 transition-all",
          state === "collapsed" ? "px-1" : "px-2"
        )}
      >
        <SidebarMenu
          className={cn(
            "gap-2 transition-all",
            state === "collapsed" ? "gap-3" : "gap-1.5"
          )}
        >
          {items.map((item) => {
            // Consider a route active when the current pathname starts with the item's url
            // so `/admin/users` keeps `/admin` highlighted.
            const isActive = pathname?.startsWith(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className={cn(
                    "h-10 px-4 text-md font-medium rounded-lg transition-all duration-500 relative overflow-visible group bg-transparent! hover:bg-transparent! active:bg-transparent!",
                    isActive
                      ? "bg-linear-to-r from-green-500 to-green-600 text-white shadow-xl shadow-green-500/50 border border-green-300/60 font-semibold"
                      : "text-slate-200 border border-transparent hover:text-white hover:bg-linear-to-r hover:from-green-500/60 hover:to-green-600/60 hover:border-green-400/40 hover:shadow-lg hover:shadow-green-500/30"
                  )}
                >
                  <Link
                    href={item.url}
                    className={cn(
                      "flex items-center w-full transition-all",
                      state === "collapsed"
                        ? "justify-center px-0 py-1"
                        : "justify-start px-0 gap-3"
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-all duration-300 font-bold",
                          isActive
                            ? "text-white drop-shadow-lg"
                            : "text-white group-hover:text-white group-hover:drop-shadow-md"
                        )}
                      />
                    )}
                    {state !== "collapsed" && (
                      <span className="text-white whitespace-nowrap font-medium">
                        {item.title}
                      </span>
                    )}
                    {state === "collapsed" && (
                      <span className="absolute left-12 bg-green-500/80 text-white px-2 py-1 rounded-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none whitespace-nowrap">
                        {item.title}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
