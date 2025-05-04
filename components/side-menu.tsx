"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart, Settings, LogOut, ListMusic, Users, CreditCard, Building2, FolderKanban } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useSidebarContext } from "@/components/ui/sidebar-context"

export function SideMenu() {
  const pathname = usePathname()
  const { sidebarVisible } = useSidebarContext()

  if (!sidebarVisible) {
    return null
  }

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-black">Artist Promo</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-black",
                  pathname === "/dashboard" && "bg-gray-50 text-black font-medium",
                )}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/dashboard/campaigns"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-black",
                  pathname === "/dashboard/campaigns" && "bg-gray-50 text-black font-medium",
                )}
              >
                <ListMusic className="h-4 w-4" />
                <span>Campaigns</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/dashboard/analytics"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-black",
                  pathname === "/dashboard/analytics" && "bg-gray-50 text-black font-medium",
                )}
              >
                <BarChart className="h-4 w-4" />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/dashboard/organization"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-black",
                  pathname === "/dashboard/organization" && "bg-gray-50 text-black font-medium",
                )}
              >
                <Building2 className="h-4 w-4" />
                <span>Organization</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/dashboard/projects"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-black",
                  pathname === "/dashboard/projects" && "bg-gray-50 text-black font-medium",
                )}
              >
                <FolderKanban className="h-4 w-4" />
                <span>Projects</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/dashboard/audience"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-black",
                  pathname === "/dashboard/audience" && "bg-gray-50 text-black font-medium",
                )}
              >
                <Users className="h-4 w-4" />
                <span>Audience</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/dashboard/payments"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-black",
                  pathname === "/dashboard/payments" && "bg-gray-50 text-black font-medium",
                )}
              >
                <CreditCard className="h-4 w-4" />
                <span>Payments</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/dashboard/settings"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-black",
                  pathname === "/dashboard/settings" && "bg-gray-50 text-black font-medium",
                )}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500">Artist</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-black">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
