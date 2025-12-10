"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent className="px-2 py-2">
        <SidebarMenu className="gap-2">
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
                  {state !== "collapsed" && (
                    <span
                      className={cn(
                        "font-medium transition-all duration-300",
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
