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
<<<<<<< HEAD
=======
  ChevronLeft,
  ChevronRight,
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
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

<<<<<<< HEAD
export function Sidebar() {
=======
interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  const { language } = useLanguage()
  const pathname = usePathname()
  const t = translations[language]
  const aliciaT = aliciaTranslations[language]

  return (
<<<<<<< HEAD
    <div className="fixed left-0 top-0 w-64 lg:w-72 h-screen bg-sidebar text-sidebar-foreground p-4 flex flex-col flex-shrink-0 z-40">
      <div className="mb-8 h-[100px]">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KCMkMWJluvEnrZ7kiJcIZwOaH63W1s.png"
            alt="Davara Governance"
            width={280}
            height={100}
            style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
            priority
          />
        </Link>
      </div>

      <nav className="space-y-2 flex-grow overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          const displayText = item.key === "alicia" ? aliciaT[item.key] : t[item.key]

=======
    <div
      className={`fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col flex-shrink-0 z-40 transition-all duration-300 ease-in-out ${collapsed ? "w-[72px]" : "w-64 lg:w-72"
        }`}
    >
      {/* Logo area - only visible when expanded */}
      <div
        className={`flex items-center transition-all duration-300 ease-in-out overflow-hidden ${collapsed ? "h-16 justify-center px-2" : "h-[100px] px-4 pt-4"
          }`}
      >
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
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

      {/* Toggle button */}
      <div className={`flex ${collapsed ? "justify-center" : "justify-end pr-3"} mb-2`}>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-grow overflow-y-auto px-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          const Icon = item.icon
          const displayText = item.key === "alicia" ? aliciaT[item.key] : t[item.key]

          const linkClasses = `relative flex items-center gap-3 transition-all duration-200 py-3 rounded-lg text-sm ${collapsed ? "justify-center px-2" : "px-3"
            } ${isActive ? "bg-white text-gray-900 font-medium" : "text-white hover:text-white hover:bg-white/10"}`

          const content = (
            <>
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{displayText}</span>}
              {/* White triangle indicator for active item */}
              {isActive && (
                <div
                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0"
                  style={{
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                    borderRight: "8px solid hsl(var(--background))",
                  }}
                />
              )}
              {/* Tooltip on collapsed mode */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                  {displayText}
                </div>
              )}
            </>
          )

>>>>>>> be37263 (fix: modify EIA module and upgrade it)
          if (item.external) {
            return (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
<<<<<<< HEAD
                className="flex items-center gap-3 transition-colors py-3 px-3 rounded-lg text-sm text-white hover:text-white hover:bg-white/10"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{displayText}</span>
=======
                className={`group ${linkClasses}`}
                title={collapsed ? String(displayText) : undefined}
              >
                {content}
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
              </a>
            )
          }

          return (
            <Link
              key={item.key}
              href={item.href}
<<<<<<< HEAD
              className={`flex items-center gap-3 transition-colors py-3 px-3 rounded-lg text-sm ${
                isActive ? "bg-white text-gray-900" : "text-white hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{displayText}</span>
=======
              className={`group ${linkClasses}`}
              title={collapsed ? String(displayText) : undefined}
            >
              {content}
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
