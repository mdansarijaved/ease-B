"use client";

import {
  Award,
  BarChart,
  Calendar,
  ChevronsUpDown,
  Home,
  Phone,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

const menuItems = [
  {
    group: "Manage",
    items: [
      {
        href: "/dashboard/mentor",
        label: "Home",
        icon: Home,
      },
      {
        href: "/dashboard/mentor/bookings",
        label: "Bookings",
        icon: Phone,
      },
      {
        href: "/dashboard/mentor/availability",
        label: "Availability",
        icon: Calendar,
      },
    ],
  },
  {
    group: "Your Page",
    items: [
      {
        href: "/dashboard/mentor/community",
        label: "community",
        icon: BarChart,
      },
      {
        href: "/dashboard/mentor/webinar",
        label: "Webinar",
        icon: Award,
      },
    ],
  },
  {
    group: "Advance",
    items: [
      {
        href: "/dashboard/mentor/webinar",
        label: "Webinar",
        icon: Award,
      },
    ],
  },
];

export function MentorSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="bg-muted/20 h-screen max-h-screen border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/join.jpg" alt="Logo" />
            <AvatarFallback>E</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Creator Dashboard</span>
            <span className="text-muted-foreground text-sm">
              javed_ansari13
            </span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="default" className="mt-4 w-full justify-center gap-2">
          <Rocket className="h-4 w-4" />
          Publish on Socials
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-0">
        {menuItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel className="text-muted-foreground text-xs uppercase">
              {group.group}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.label}>
                    {/* @ts-expect-error something */}
                    <Link href={item.href}>
                      <SidebarMenuButton
                        className={cn(
                          "justify-start gap-3 rounded-none border-l-4 border-transparent px-6 text-base font-normal",
                          isActive &&
                            "border-primary text-primary font-semibold",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/join.jpg" alt="Javed Ansari" />
            <AvatarFallback>JA</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold">Javed Ansari</span>
            <span className="text-muted-foreground truncate text-xs">
              javedans2003@gmail.com
            </span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
