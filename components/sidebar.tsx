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
  Sparkles,
  Eye,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { translations } from "@/lib/translations"
import { aliciaTranslations } from "@/lib/alicia-translations"

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
  { key: "alicia", icon: Sparkles, href: "https://asistentelegal02.azurewebsites.net/", external: true },
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

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onCloseMobile}
      />
      <div
        className={`fixed left-0 top-0 z-50 flex h-screen flex-shrink-0 flex-col overflow-hidden border-r border-white/10 bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } w-72 lg:z-40 lg:translate-x-0 ${collapsed ? "lg:w-[72px]" : "lg:w-64 xl:w-72"}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_35%)]" />
        <div
          className={`relative flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
            collapsed ? "lg:h-16 lg:justify-center lg:px-2" : "h-[100px] px-4 pt-4"
          }`}
        >
          {(!collapsed || mobileOpen) && (
            <Link href="/" className="flex items-center gap-2" onClick={onCloseMobile}>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KCMkMWJluvEnrZ7kiJcIZwOaH63W1s.png"
                alt="Davara Governance"
                width={280}
                height={100}
                style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
                priority
              />
            </Link>
          )}
        </div>

        <div className={`relative mb-2 hidden lg:flex ${collapsed ? "justify-center" : "justify-end pr-3"}`}>
          <button
            onClick={onToggle}
            className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-white/80 transition-colors hover:bg-white/12 hover:text-white"
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <nav className="relative flex-grow space-y-1 overflow-y-auto px-2 pb-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            const Icon = item.icon
            const displayText = item.key === "alicia" ? aliciaT[item.key] : t[item.key]
            const compactDesktop = collapsed && !mobileOpen

            const linkClasses = `relative flex items-center gap-3 rounded-2xl py-3 text-sm transition-all duration-200 ${
              compactDesktop ? "justify-center px-2" : "px-3"
            } ${
              isActive
                ? "bg-white text-[hsl(var(--brand-deep))] font-semibold shadow-[0_14px_28px_rgba(0,0,0,0.14)]"
                : "text-white/88 hover:bg-white/10 hover:text-white"
            }`

            const content = (
              <>
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!compactDesktop && <span className="truncate">{displayText}</span>}
                {isActive && !compactDesktop ? (
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
                  className={`group ${linkClasses}`}
                  title={compactDesktop ? String(displayText) : undefined}
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
