"use client"

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
  Lock,
  Eye,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { translations } from "@/lib/translations"
import { aliciaTranslations } from "@/lib/alicia-translations"
import { DAVARA_GOVERNANCE_LOGO } from "@/lib/brand"

const navigationItems = [
  { key: "dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { key: "aiSystemRegistry", icon: Bot, href: "/registro-sistemas-ia" },
  { key: "highRiskIncidentReports", icon: AlertTriangle, href: "/incidentes-alto-riesgo" },
  { key: "algorithmicImpactAssessment", icon: Calculator, href: "/evaluacion-impacto-algoritmico" },
  { key: "dataProtectionRiskAssessment", icon: Shield, href: "/evaluacion-riesgos-pdp" },
  { key: "intellectualPropertyImpactAssessment", icon: Copyright, href: "/evaluacion-impacto-pi" },
  { key: "supplierProtectionRiskAssessment", icon: Users, href: "/evaluacion-riesgos-proveedores" },
  { key: "governancePoliciesProcesses", icon: FileText, href: "/politicas-procesos-gobernanza" },
  { key: "transparencyExplainability", icon: Eye, href: "/transparencia-explicabilidad" },
  { key: "aiAwarenessTraining", icon: GraduationCap, href: "/concientizacion-entrenamiento-ia" },
  { key: "aiGovernanceCommittee", icon: UserCheck, href: "/comite-gobernanza-ia" },
  { key: "securityMeasuresDrawer", icon: Lock, href: "/seguridad-entorno" },
  { key: "audit", icon: Search, href: "/auditoria" },
  { key: "alicia", href: "https://asistentelegal02.azurewebsites.net/", external: true, variant: "logo" },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }: SidebarProps) {
  const { language } = useLanguage()
  const pathname = usePathname()
  const t = translations[language]
  const aliciaT = aliciaTranslations[language]
  const compactDesktop = collapsed && !mobileOpen
  const showFullSidebarContent = !collapsed || mobileOpen

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onCloseMobile}
      />
      <div
        className={`fixed left-0 top-0 z-50 flex h-[100dvh] max-h-[100dvh] flex-shrink-0 flex-col overflow-hidden border-r border-white/10 bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } w-[264px] lg:z-40 lg:translate-x-0 ${collapsed ? "lg:w-[72px]" : "lg:w-[280px] xl:w-[288px]"}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_35%)]" />
        <div
          className={`relative flex shrink-0 items-center overflow-hidden transition-all duration-300 ease-in-out ${
            compactDesktop ? "min-h-12 justify-center px-2" : "min-h-[68px] justify-center px-4 py-3"
          }`}
        >
          {showFullSidebarContent && (
            <Link href="/" className="flex w-full items-center justify-center" onClick={onCloseMobile}>
              <Image
                src={DAVARA_GOVERNANCE_LOGO.src}
                alt={DAVARA_GOVERNANCE_LOGO.alt}
                width={DAVARA_GOVERNANCE_LOGO.width}
                height={DAVARA_GOVERNANCE_LOGO.height}
                className="h-auto w-full max-w-[176px]"
                style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
                priority
              />
            </Link>
          )}
        </div>

        <div className={`relative mb-1 hidden shrink-0 lg:flex ${collapsed ? "justify-center px-2" : "justify-end px-3"}`}>
          <button
            onClick={onToggle}
            className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-white/80 transition-colors hover:bg-white/12 hover:text-white"
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <nav className="relative flex min-h-0 flex-1 flex-col justify-between overflow-hidden px-2 pb-2">
          {navigationItems.map((item) => {
            const isLogoItem = item.variant === "logo"
            const isActive = !isLogoItem && (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))
            const Icon = item.icon
            const displayText = item.key === "alicia" ? aliciaT.alicia : t[item.key]

            const linkClasses = isLogoItem
              ? `group relative flex shrink-0 rounded-xl transition-all duration-200 ${
                  compactDesktop ? "justify-center px-2 py-2" : "justify-center px-3 py-2"
                } text-white/88 hover:text-white`
              : `relative flex shrink-0 gap-2.5 rounded-xl text-[11px] transition-all duration-200 ${
                  compactDesktop ? "items-center justify-center px-2 py-2" : "items-center px-3 py-2"
                } ${
                  isActive
                    ? "bg-white text-[hsl(var(--brand-deep))] font-semibold shadow-[0_14px_28px_rgba(0,0,0,0.14)]"
                    : "text-white/88 hover:bg-white/10 hover:text-white"
                }`

            const content = isLogoItem ? (
              <>
                <Image
                  src="/Alicia_Sin_Despachos.png"
                  alt={aliciaT.alicia}
                  width={645}
                  height={248}
                  className={`h-auto object-contain opacity-95 transition-all duration-200 group-hover:opacity-100 ${
                    compactDesktop ? "w-full max-w-[24px]" : "w-full max-w-[118px]"
                  }`}
                />
                {compactDesktop ? (
                  <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {displayText}
                  </div>
                ) : null}
              </>
            ) : (
              <>
                {Icon ? <Icon className="h-[18px] w-[18px] flex-shrink-0" /> : null}
                {!compactDesktop && (
                  <span
                    className="min-w-0 flex-1 overflow-hidden pr-5 text-[11px] leading-[1.05rem]"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                    }}
                  >
                    {displayText}
                  </span>
                )}
                {isActive && !compactDesktop && !mobileOpen ? (
                  <div
                    className="absolute -right-2 top-1/2 h-0 w-0 -translate-y-1/2 lg:block"
                    style={{
                      borderTop: "8px solid transparent",
                      borderBottom: "8px solid transparent",
                      borderRight: "8px solid hsl(var(--background))",
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

            if (item.external) {
              return (
                <a
                  key={item.key}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                  title={compactDesktop ? String(displayText) : undefined}
                  aria-label={displayText}
                  onClick={onCloseMobile}
                >
                  {content}
                </a>
              )
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`group ${linkClasses}`}
                title={compactDesktop ? String(displayText) : undefined}
                onClick={onCloseMobile}
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
