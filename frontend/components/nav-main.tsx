"use client";

import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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
            const isActive = pathname?.startsWith(item.url);
            const isHovered = hoveredItem === item.title;

            return (
              <SidebarMenuItem key={item.title}>
                <Link
                  href={item.url}
                  onMouseEnter={() => setHoveredItem(item.title)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    "flex items-center h-10 px-4 text-md font-medium rounded-lg transition-all duration-300 relative overflow-visible group",
                    state === "collapsed"
                      ? "justify-center px-2"
                      : "justify-start gap-3",
                    // Active state
                    isActive && "bg-green-500/20",
                    // Hover state (only for non-active items)
                    !isActive && isHovered && "bg-white/5",
                    // Focus state for accessibility
                    "focus:outline-none"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.icon && (
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-all duration-300",
                        isActive
                          ? "text-green-400"
                          : isHovered
                          ? "text-green-400"
                          : "text-gray-400"
                      )}
                      aria-hidden="true"
                    />
                  )}
                  {state !== "collapsed" && (
                    <span
                      className={cn(
                        "whitespace-nowrap font-medium transition-all duration-300",
                        isActive
                          ? "text-green-400 font-semibold"
                          : isHovered
                          ? "text-green-400"
                          : "text-gray-300"
                      )}
                    >
                      {item.title}
                    </span>
                  )}
                  {/* Tooltip for collapsed state */}
                  {state === "collapsed" && isHovered && (
                    <span className="absolute left-14 bg-gray-900 dark:bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap z-50 shadow-lg border border-gray-700">
                      {item.title}
                      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-800" />
                    </span>
                  )}
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
