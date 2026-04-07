"use client"

import type { CSSProperties } from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/LanguageContext"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  Bot,
  Calculator,
  Shield,
  Copyright,
  Users,
  FileText,
  GraduationCap,
  UserCheck,
  Search,
  LayoutDashboard,
  Eye,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Lock,
  type LucideIcon,
} from "lucide-react"
import { translations } from "@/lib/translations"
import { aliciaTranslations } from "@/lib/alicia-translations"
import {
  DESKTOP_SIDEBAR_COLLAPSED_WIDTH,
  DESKTOP_SIDEBAR_EXPANDED_WIDTH,
  useSidebar,
} from "@/lib/SidebarContext"
import { cn } from "@/lib/utils"

const moduleAccessConfig = {
  registro: { restricted: true },
  evaluaciones: { restricted: true },
  comite: { restricted: true },
  indicadores: { restricted: true },
  politicas: { restricted: false },
} as const

type ModuleAccessKey = keyof typeof moduleAccessConfig

interface NavigationItem {
  key: string
  icon: LucideIcon
  href: string
  permissionKey?: ModuleAccessKey
  featured?: boolean
}

const navigationItems: NavigationItem[] = [
  { key: "dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { key: "aiSystemRegistry", icon: Bot, href: "/registro-sistemas-ia", permissionKey: "registro" },
  { key: "highRiskIncidentReports", icon: AlertTriangle, href: "/incidentes-alto-riesgo", permissionKey: "evaluaciones" },
  { key: "algorithmicImpactAssessment", icon: Calculator, href: "/evaluacion-impacto-algoritmico", permissionKey: "evaluaciones" },
  { key: "dataProtectionRiskAssessment", icon: Shield, href: "/evaluacion-riesgos-pdp", permissionKey: "evaluaciones" },
  { key: "intellectualPropertyImpactAssessment", icon: Copyright, href: "/evaluacion-impacto-pi", permissionKey: "evaluaciones" },
  { key: "supplierProtectionRiskAssessment", icon: Users, href: "/evaluacion-riesgos-proveedores", permissionKey: "evaluaciones" },
  { key: "governancePoliciesProcesses", icon: FileText, href: "/politicas-procesos-gobernanza", permissionKey: "politicas" },
  { key: "transparencyExplainability", icon: Eye, href: "/transparencia-explicabilidad", permissionKey: "politicas" },
  { key: "aiAwarenessTraining", icon: GraduationCap, href: "/concientizacion-entrenamiento-ia", permissionKey: "politicas" },
  { key: "aiGovernanceCommittee", icon: UserCheck, href: "/comite-gobernanza-ia", permissionKey: "comite" },
  { key: "securityMeasuresDrawer", icon: Lock, href: "/seguridad-entorno", permissionKey: "indicadores" },
  { key: "audit", icon: Search, href: "/auditoria", permissionKey: "indicadores" },
  { key: "alicia", icon: LayoutDashboard, href: "/alicia", featured: true },
]

export function Sidebar() {
  const { language } = useLanguage()
  const { collapsed, mobileOpen, setMobileOpen, toggleCollapsed } = useSidebar()
  const pathname = usePathname()
  const t = translations[language]
  const aliciaT = aliciaTranslations[language]
  const [hasPrivilegeMatrix, setHasPrivilegeMatrix] = useState(false)
  const [moduleAccess, setModuleAccess] = useState<Partial<Record<ModuleAccessKey, boolean>>>({})
  const compactDesktop = collapsed && !mobileOpen
  const desktopWidth = collapsed ? DESKTOP_SIDEBAR_COLLAPSED_WIDTH : DESKTOP_SIDEBAR_EXPANDED_WIDTH

  useEffect(() => {
    const currentUserEmail = localStorage.getItem("userEmail")
    const currentUserRole = localStorage.getItem("userRole")

    if (!currentUserEmail || currentUserRole === "admin") {
      setHasPrivilegeMatrix(false)
      setModuleAccess({})
      return
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const currentUser = users.find((user: any) => user.email === currentUserEmail)
    const privileges = currentUser?.privileges

    if (!privileges || Object.keys(privileges).length === 0) {
      setHasPrivilegeMatrix(false)
      setModuleAccess({})
      return
    }

    setHasPrivilegeMatrix(true)
    setModuleAccess({
      registro: privileges.registro?.status === "green",
      evaluaciones: privileges.evaluaciones?.status === "green",
      comite: privileges.comite?.status === "green",
      indicadores: privileges.indicadores?.status === "green",
      politicas: true,
    })
  }, [pathname])

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={`fixed left-0 top-0 z-50 flex h-screen max-w-[86vw] flex-shrink-0 flex-col overflow-hidden border-r border-white/10 bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } w-[260px] lg:z-40 lg:w-[var(--sidebar-width)] lg:translate-x-0`}
        style={{ "--sidebar-width": `${desktopWidth}px` } as CSSProperties}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_35%)]" />

        <div
          className={cn(
            "relative border-b border-white/10 transition-all duration-300 ease-in-out",
            compactDesktop ? "px-2 py-4" : "px-4 py-5",
          )}
        >
          <div className={cn("flex items-center", compactDesktop ? "flex-col gap-3" : "justify-between gap-3")}>
            {!compactDesktop ? (
              <Link href="/" className="min-w-0 flex-1" onClick={() => setMobileOpen(false)}>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KCMkMWJluvEnrZ7kiJcIZwOaH63W1s.png"
                  alt="Davara Governance"
                  width={220}
                  height={58}
                  style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
                  priority
                />
              </Link>
            ) : (
              <div className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-xs font-semibold tracking-[0.18em] text-white lg:flex">
                DG
              </div>
            )}

            <button
              onClick={toggleCollapsed}
              className="hidden rounded-xl border border-white/10 bg-white/5 p-1.5 text-white/80 transition-colors hover:bg-white/12 hover:text-white lg:inline-flex"
              aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <nav className="relative flex-grow space-y-2 overflow-y-auto px-2 py-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            const Icon = item.icon
            const isAlicia = item.featured
            const displayText = item.key === "alicia" ? aliciaT[item.key] : t[item.key]
            const isEnabled = !item.permissionKey
              ? true
              : !hasPrivilegeMatrix
                ? true
                : moduleAccess[item.permissionKey] ?? !moduleAccessConfig[item.permissionKey].restricted

            const itemClasses = cn(
              "group relative overflow-visible rounded-2xl text-sm transition-all duration-200",
              isAlicia && !compactDesktop ? "flex min-h-[88px] items-center justify-center px-4 py-4" : "",
              !isAlicia && compactDesktop ? "flex items-center justify-center px-2 py-3" : "",
              !isAlicia && !compactDesktop ? "flex items-start gap-3 px-3 py-3" : "",
              isActive
                ? "bg-white font-semibold text-[hsl(var(--brand-deep))] shadow-[0_16px_30px_rgba(0,0,0,0.18)]"
                : isEnabled
                  ? "text-white/88 hover:bg-white/10 hover:text-white"
                  : "cursor-not-allowed bg-white/[0.04] text-white/45",
            )

            const content = (
              <>
                {isAlicia ? (
                  <div
                    className={cn(
                      "relative flex items-center justify-center overflow-hidden rounded-[20px] transition-all",
                      compactDesktop ? "h-11 w-11 p-2" : "h-14 w-full max-w-[170px] p-3",
                      isActive ? "bg-[hsl(var(--brand-soft))]" : "bg-white/10",
                    )}
                  >
                    <div className={cn("relative w-full", compactDesktop ? "h-7" : "h-8")}>
                      <Image
                        src="/images/Alicia_Sin_Despachos.png"
                        alt="Alicia"
                        fill
                        sizes={compactDesktop ? "44px" : "170px"}
                        className="object-contain"
                      />
                    </div>
                    <span className="sr-only">{displayText}</span>
                  </div>
                ) : (
                  <Icon className={`h-5 w-5 flex-shrink-0 ${compactDesktop ? "" : "mt-0.5"}`} />
                )}

                {!compactDesktop && !isAlicia && (
                  <span className="min-w-0 flex-1 whitespace-normal break-words pr-6 text-[13px] leading-5">
                    {displayText}
                  </span>
                )}

                {!isEnabled ? (
                  <div
                    className={cn(
                      "absolute flex items-center justify-center rounded-full border border-white/15 bg-slate-950/20 text-white/85 backdrop-blur-sm",
                      compactDesktop ? "-right-0.5 -top-0.5 h-5 w-5" : "right-3 top-3 h-6 w-6",
                    )}
                  >
                    <Lock className="h-3 w-3" />
                  </div>
                ) : null}

                {isActive && !compactDesktop ? (
                  <div
                    className="absolute -right-2 top-1/2 h-0 w-0 -translate-y-1/2 lg:block"
                    style={{
                      borderTop: "9px solid transparent",
                      borderBottom: "9px solid transparent",
                      borderRight: "9px solid hsl(var(--background))",
                    }}
                  />
                ) : null}

                {compactDesktop ? (
                  <div className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {displayText}
                  </div>
                ) : null}
              </>
            )

            if (!isEnabled) {
              return (
                <div
                  key={item.key}
                  className={itemClasses}
                  title={compactDesktop ? String(displayText) : undefined}
                  aria-disabled="true"
                >
                  {content}
                </div>
              )
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                className={itemClasses}
                title={compactDesktop ? String(displayText) : undefined}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
              >
                {content}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
