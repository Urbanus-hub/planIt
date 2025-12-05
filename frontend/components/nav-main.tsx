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
                    "h-10 px-4 text-md font-medium rounded-lg transition-all duration-300 relative overflow-visible group",
                    isActive
                      ? "text-green-400 font-semibold"
                      : "text-slate-300 hover:text-green-400"
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
                          "h-5 w-5 shrink-0 transition-all duration-300",
                          isActive
                            ? "text-green-400"
                            : "text-slate-300 group-hover:text-green-400"
                        )}
                      />
                    )}
                    {state !== "collapsed" && (
                      <span
                        className={cn(
                          "whitespace-nowrap font-medium transition-all duration-300",
                          isActive
                            ? "text-green-400"
                            : "text-slate-300 group-hover:text-green-400"
                        )}
                      >
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
