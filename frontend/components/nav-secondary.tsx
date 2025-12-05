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
  SidebarMenuButton,
  SidebarMenuItem,
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

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent className="px-2 py-2">
        <SidebarMenu className="gap-2">
          {items.map((item) => {
            const isActive = pathname?.startsWith(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    "h-10 px-4 text-md font-medium rounded-lg transition-all duration-300 group",
                    isActive
                      ? "text-green-400 font-semibold"
                      : "text-slate-300 hover:text-green-400"
                  )}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-all duration-300",
                        isActive
                          ? "text-green-400"
                          : "text-slate-300 group-hover:text-green-400"
                      )}
                    />
                    <span
                      className={cn(
                        "font-medium transition-all duration-300",
                        isActive
                          ? "text-green-400"
                          : "text-slate-300 group-hover:text-green-400"
                      )}
                    >
                      {item.title}
                    </span>
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
