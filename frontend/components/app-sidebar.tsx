"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBuilding,
  IconChartBar,
  IconDashboard,
  IconFileDescription,
  IconHelp,
  IconInnerShadowTop,
  IconMoneybag,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
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

const data = {
  user: {
    name: "Admin",
    email: "admin@bluemoon.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Residents",
      url: "/residents",
      icon: IconUsers,
    },
    {
      title: "Apartments",
      url: "/apartments",
      icon: IconBuilding,
    },
    {
      title: "Fees",
      url: "/fees",
      icon: IconMoneybag,
    },
    {
      title: "Payments",
      url: "/payments",
      icon: IconFileDescription,
    },
  ],
  navDocuments: [
    {
      name: "Reports",
      url: "/reports",
      icon: IconChartBar,
    },
    {
      name: "Documents",
      url: "/documents",
      icon: IconFileDescription,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Help & Support",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconInnerShadowTop className="!size-6" />
                <span className="text-xl font-semibold font-mono">
                  BlueMoon
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} pathname={pathname} />
        <NavDocuments items={data.navDocuments} pathname={pathname} />
        <NavSecondary
          items={data.navSecondary}
          className="mt-auto"
          pathname={pathname}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
