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
import { GeneralTabShell } from "@/components/general-tab-shell"
import { getGeneralModuleFromPath, getGeneralTabNavItems } from "@/lib/general-tab-modules"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
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
  const currentGeneralModule = getGeneralModuleFromPath(pathname)
  const isGeneralTabRoute = Boolean(currentGeneralModule)

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AppProvider>
        <LanguageProvider>
          {isLoginPage ? (
            children
          ) : isGeneralTabRoute && currentGeneralModule ? (
            <GeneralTabShell
              moduleLabel="Módulo oficial de gobernanza de IA"
              moduleTitle="Gobernanza de IA"
              moduleDescription="Vista consolidada de cumplimiento, evaluación y control operativo de IA."
              pageLabel="Overview"
              pageTitle={currentGeneralModule.pageTitle}
              pageDescription={currentGeneralModule.pageDescription}
              navItems={getGeneralTabNavItems()}
              pathname={pathname}
              onNavigate={(href) => router.push(href)}
            >
              {children}
            </GeneralTabShell>
          ) : (
            <div className="flex min-h-screen">
              {isAuthenticated && <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />}
              <div
                className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isAuthenticated ? (sidebarCollapsed ? "ml-[72px]" : "ml-64 lg:ml-72") : ""}`}
              >
                {isAuthenticated && <Header sidebarCollapsed={sidebarCollapsed} />}
                <main className={`flex-1 p-8 bg-background ${isAuthenticated ? "mt-16" : ""}`}>{children}</main>
              </div>
            </div>
          )}
          <Toaster />
        </LanguageProvider>
      </AppProvider>
    </ThemeProvider>
  )
}
