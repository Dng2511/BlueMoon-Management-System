"use client";

import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface NavSecondaryProps {
  items: {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  className?: string;
  pathname: string;
}

export function NavSecondary({
  items,
  className,
  pathname,
}: NavSecondaryProps) {
  return (
    <SidebarGroup className={className}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={item.url}>
                    <Icon className="!size-4" />
                    <span>{item.title}</span>
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
