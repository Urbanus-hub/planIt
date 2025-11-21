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

  return (
    <SidebarGroup>
      <SidebarGroupContent className="px-2 py-2">
        <SidebarMenu className="gap-1.5">
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
                    "h-10 px-4 text-md font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-green-400 text-white border border-green-400 font-semibold"
                      : "text-slate-200 hover:bg-green-400 hover:text-white hover:border hover:border-green-400"
                  )}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon className="h-5 w-5 mr-2" />}
                    <span className="text-white">{item.title}</span>
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
