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
} from "lucide-react"
import { translations } from "@/lib/translations"

const navigationItems = [
  { key: "dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { key: "aiSystemRegistry", icon: Bot, href: "/registro-sistemas-ia" },
  { key: "algorithmicImpactAssessment", icon: Calculator, href: "/evaluacion-impacto-algoritmico" },
  { key: "dataProtectionRiskAssessment", icon: Shield, href: "/evaluacion-riesgos-pdp" },
  { key: "intellectualPropertyImpactAssessment", icon: Copyright, href: "/evaluacion-impacto-pi" },
  { key: "supplierProtectionRiskAssessment", icon: Users, href: "/evaluacion-riesgos-proveedores" },
  { key: "governancePoliciesProcesses", icon: FileText, href: "/politicas-procesos-gobernanza" },
  { key: "aiAwarenessTraining", icon: GraduationCap, href: "/concientizacion-entrenamiento-ia" },
  { key: "aiGovernanceCommittee", icon: UserCheck, href: "/comite-gobernanza-ia" },
  { key: "audit", icon: Search, href: "/auditoria" },
]

export function Sidebar() {
  const { language } = useLanguage()
  const pathname = usePathname()
  const t = translations[language]

  return (
    <div className="fixed left-0 top-0 w-64 lg:w-72 h-screen bg-sidebar text-sidebar-foreground p-4 flex flex-col flex-shrink-0 z-40">
      <div className="mb-8 h-[85px]">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KCMkMWJluvEnrZ7kiJcIZwOaH63W1s.png"
            alt="Davara Governance"
            width={250}
            height={85}
            style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
            priority
          />
        </Link>
      </div>

      <nav className="space-y-2 flex-grow overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 transition-colors py-3 px-3 rounded-lg text-sm ${
                isActive ? "bg-white text-gray-900" : "text-white hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{t[item.key]}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
