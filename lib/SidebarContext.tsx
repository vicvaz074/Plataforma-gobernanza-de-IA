"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

const SIDEBAR_STORAGE_KEY = "sidebarCollapsed"

export const DESKTOP_SIDEBAR_EXPANDED_WIDTH = 260
export const DESKTOP_SIDEBAR_COLLAPSED_WIDTH = 70

interface SidebarContextValue {
  collapsed: boolean
  mobileOpen: boolean
  isMobile: boolean
  setCollapsed: (next: boolean) => void
  toggleCollapsed: () => void
  setMobileOpen: (next: boolean) => void
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

function readStoredSidebarState() {
  if (typeof window === "undefined") {
    return false
  }

  return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true"
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsedState] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const mediaQuery = window.matchMedia("(max-width: 1023px)")

    const syncSidebarState = () => {
      const nextIsMobile = mediaQuery.matches

      setIsMobile(nextIsMobile)
      setMobileOpen(false)
      setCollapsedState(nextIsMobile ? true : readStoredSidebarState())
    }

    syncSidebarState()

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncSidebarState)

      return () => {
        mediaQuery.removeEventListener("change", syncSidebarState)
      }
    }

    mediaQuery.addListener(syncSidebarState)

    return () => {
      mediaQuery.removeListener(syncSidebarState)
    }
  }, [])

  const setCollapsed = (next: boolean) => {
    setCollapsedState(next)

    if (typeof window !== "undefined") {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next))
    }
  }

  const toggleCollapsed = () => {
    setCollapsedState((previous) => {
      const next = !previous

      if (typeof window !== "undefined") {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next))
      }

      return next
    })
  }

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        mobileOpen,
        isMobile,
        setCollapsed,
        toggleCollapsed,
        setMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar debe usarse dentro de SidebarProvider")
  }

  return context
}
