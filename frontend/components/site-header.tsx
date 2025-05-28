"use client";

import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  return (
    <header
      data-slot="site-header"
      className="bg-background border-border sticky top-0 z-40 flex h-(--header-height) w-full items-center gap-4 border-b px-4 md:px-6"
    >
      <SidebarTrigger />
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">BlueMoon</h1>
        </div>
      </div>
    </header>
  );
}
