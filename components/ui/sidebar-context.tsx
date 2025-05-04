"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"

type SidebarContextType = {
  sidebarVisible: boolean
  setSidebarVisible: (visible: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const pathname = usePathname()

  // Hide sidebar on specific routes
  useEffect(() => {
    if (pathname === "/dashboard/create-campaign") {
      setSidebarVisible(false)
    } else {
      setSidebarVisible(true)
    }
  }, [pathname])

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev)
  }

  return (
    <SidebarContext.Provider value={{ sidebarVisible, setSidebarVisible, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebarContext() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}
