"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/LanguageContext"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import {
  Bot,
  AlertTriangle,
  Calculator,
  Shield,
  Copyright,
  Users,
  FileText,
  GraduationCap,
  UserCheck,
  Search,
} from "lucide-react"
import { motion } from "framer-motion"
import { translations } from "@/lib/translations"

const options = [
  { name: "aiSystemRegistry", icon: Bot, href: "/registro-sistemas-ia" },
  { name: "algorithmicImpactAssessment", icon: Calculator, href: "/evaluacion-impacto-algoritmico" },
  { name: "dataProtectionRiskAssessment", icon: Shield, href: "/evaluacion-riesgos-pdp" },
  { name: "intellectualPropertyImpactAssessment", icon: Copyright, href: "/evaluacion-impacto-pi" },
  { name: "supplierProtectionRiskAssessment", icon: Users, href: "/evaluacion-riesgos-proveedores" },
  { name: "governancePoliciesProcesses", icon: FileText, href: "/politicas-procesos-gobernanza" },
  { name: "aiAwarenessTraining", icon: GraduationCap, href: "/concientizacion-entrenamiento-ia" },
  { name: "aiGovernanceCommittee", icon: UserCheck, href: "/comite-gobernanza-ia" },
  { name: "audit", icon: Search, href: "/auditoria" },
]

export default function Home() {
  const { language } = useLanguage()
  const t = translations[language]
  const [userName, setUserName] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName")
    setUserName(storedUserName)
  }, [])

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-medium text-center mb-12" style={{ fontFamily: "Futura PT Medium, sans-serif" }}>
          {userName ? `${t.welcomeMessage}, ${userName}` : t.welcomeMessage}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {options.map((option) => (
            <Link key={option.name} href={option.href}>
              <Card
                className="p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center h-[200px] cursor-pointer group relative overflow-hidden"
                onMouseEnter={() => setHoveredCard(option.name)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <option.icon className="h-10 w-10 mb-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
                <span
                  className="text-base font-medium text-gray-700 text-center group-hover:text-gray-900 transition-colors leading-tight"
                  style={{ fontFamily: "Futura PT Medium, sans-serif" }}
                >
                  {t[option.name]}
                </span>
                <motion.div
                  className="absolute inset-0 bg-white bg-opacity-90 p-4 flex items-center justify-center text-sm text-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: hoveredCard === option.name ? 1 : 0,
                    y: hoveredCard === option.name ? 0 : 20,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {t[option.name + "Description"]}
                </motion.div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
