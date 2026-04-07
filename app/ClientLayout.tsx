"use client"

import type React from "react"
import type { CSSProperties } from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { LanguageProvider } from "@/lib/LanguageContext"
import { AppProvider } from "@/lib/AppContext"
import {
  DESKTOP_SIDEBAR_COLLAPSED_WIDTH,
  DESKTOP_SIDEBAR_EXPANDED_WIDTH,
  SidebarProvider,
  useSidebar,
} from "@/lib/SidebarContext"
import { Toaster } from "@/components/ui/toaster"

function AuthenticatedShell({
  children,
  isAuthenticated,
}: {
  children: React.ReactNode
  isAuthenticated: boolean
}) {
  const pathname = usePathname()
  const { collapsed, setMobileOpen } = useSidebar()
  const sidebarOffset = collapsed ? DESKTOP_SIDEBAR_COLLAPSED_WIDTH : DESKTOP_SIDEBAR_EXPANDED_WIDTH

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  return (
    <div className="flex min-h-screen">
      {isAuthenticated && <Sidebar />}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
          isAuthenticated ? "lg:ml-[var(--sidebar-offset)]" : ""
        }`}
        style={
          isAuthenticated
            ? ({ "--sidebar-offset": `${sidebarOffset}px` } as CSSProperties)
            : undefined
        }
      >
        {isAuthenticated && <Header />}
        <main className={`flex-1 bg-background p-4 sm:p-6 lg:p-8 ${isAuthenticated ? "mt-16" : ""}`}>{children}</main>
      </div>
    </div>
  )
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated")
    setIsAuthenticated(authStatus === "true")

    if (!authStatus && pathname !== "/login") {
      router.push("/login")
    } else if (authStatus === "true" && pathname === "/login") {
      router.push("/")
    }
  }, [pathname, router])

  const isLoginPage = pathname === "/login"

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AppProvider>
        <LanguageProvider>
          <SidebarProvider>
            {isLoginPage ? children : <AuthenticatedShell isAuthenticated={isAuthenticated}>{children}</AuthenticatedShell>}
          </SidebarProvider>
          <Toaster />
        </LanguageProvider>
      </AppProvider>
    </ThemeProvider>
  )
}
