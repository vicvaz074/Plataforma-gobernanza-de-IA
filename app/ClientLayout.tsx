"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { LanguageProvider } from "@/lib/LanguageContext"
import { AppProvider } from "@/lib/AppContext"
import { Toaster } from "@/components/ui/toaster"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
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

  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed")
    if (saved !== null) {
      setSidebarCollapsed(saved === "true")
    }
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      localStorage.setItem("sidebarCollapsed", String(next))
      return next
    })
  }

  const isLoginPage = pathname === "/login"

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AppProvider>
        <LanguageProvider>
          {isLoginPage ? (
            children
          ) : (
            <div className="flex min-h-screen">
              {isAuthenticated && (
                <Sidebar
                  collapsed={sidebarCollapsed}
                  onToggle={toggleSidebar}
                  mobileOpen={mobileSidebarOpen}
                  onCloseMobile={() => setMobileSidebarOpen(false)}
                />
              )}
              <div
                className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
                  isAuthenticated ? (sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-64 xl:ml-72") : ""
                }`}
              >
                {isAuthenticated && (
                  <Header
                    sidebarCollapsed={sidebarCollapsed}
                    onOpenSidebar={() => setMobileSidebarOpen(true)}
                  />
                )}
                <main className={`flex-1 bg-background p-4 sm:p-6 lg:p-8 ${isAuthenticated ? "mt-16" : ""}`}>{children}</main>
              </div>
            </div>
          )
          }
          <Toaster />
        </LanguageProvider >
      </AppProvider >
    </ThemeProvider >
  )
}
