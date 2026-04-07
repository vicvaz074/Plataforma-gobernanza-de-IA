"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/LanguageContext"
import { Card } from "@/components/ui/card"
import Link from "next/link"
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
  Lock,
  Sparkles,
  Eye,
} from "lucide-react"
import { motion } from "framer-motion"
import { translations } from "@/lib/translations"
import { aliciaTranslations } from "@/lib/alicia-translations"
import Image from "next/image"

const options = [
  { name: "aiSystemRegistry", icon: Bot, href: "/registro-sistemas-ia" },
  { name: "algorithmicImpactAssessment", icon: Calculator, href: "/evaluacion-impacto-algoritmico" },
  { name: "dataProtectionRiskAssessment", icon: Shield, href: "/evaluacion-riesgos-pdp" },
  { name: "intellectualPropertyImpactAssessment", icon: Copyright, href: "/evaluacion-impacto-pi" },
  { name: "supplierProtectionRiskAssessment", icon: Users, href: "/evaluacion-riesgos-proveedores" },
  { name: "governancePoliciesProcesses", icon: FileText, href: "/politicas-procesos-gobernanza" },
  { name: "transparencyExplainability", icon: Eye, href: "/transparencia-explicabilidad" },
  { name: "aiAwarenessTraining", icon: GraduationCap, href: "/concientizacion-entrenamiento-ia" },
  { name: "aiGovernanceCommittee", icon: UserCheck, href: "/comite-gobernanza-ia" },
  { name: "securityMeasuresDrawer", icon: Lock, href: "/seguridad-entorno" },
  { name: "audit", icon: Search, href: "/auditoria" },
  {
    name: "alicia",
    icon: Sparkles,
    href: "/alicia",
    logoSrc: "/images/Alicia_Sin_Despachos.png",
  },
]

export default function Home() {
  const { language } = useLanguage()
  const t = translations[language]
  const aliciaT = aliciaTranslations[language]
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="container mx-auto py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {options.map((option) => {
            const isAlicia = option.name === "alicia"

            return (
              <Link key={option.name} href={option.href}>
                <Card
                  className={`group relative flex h-[200px] cursor-pointer flex-col items-center justify-center overflow-hidden p-6 transition-shadow hover:shadow-lg ${
                    isAlicia ? "border-transparent shadow-[0_18px_44px_rgba(15,118,110,0.2)]" : ""
                  }`}
                  style={
                    isAlicia
                      ? {
                          background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--brand-deep)) 100%)",
                        }
                      : undefined
                  }
                  onMouseEnter={() => setHoveredCard(option.name)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {isAlicia ? (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_50%)]" />
                      <div className="relative z-10 flex h-full w-full items-center justify-center">
                        <div className="relative h-14 w-[170px] sm:h-16 sm:w-[190px]">
                          <Image
                            src={option.logoSrc ?? "/images/Alicia_Sin_Despachos.png"}
                            alt={aliciaT.alicia}
                            fill
                            sizes="(min-width: 640px) 190px, 170px"
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <span className="sr-only">{aliciaT.alicia}</span>
                    </>
                  ) : (
                    <>
                      <option.icon className="mb-4 h-10 w-10 text-gray-600 transition-colors group-hover:text-gray-800" />
                      <span
                        className="text-base font-medium leading-tight text-gray-700 transition-colors group-hover:text-gray-900"
                        style={{ fontFamily: "Futura PT Medium, sans-serif" }}
                      >
                        {t[option.name]}
                      </span>
                    </>
                  )}

                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 p-4 text-center text-sm text-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: hoveredCard === option.name ? 1 : 0,
                      y: hoveredCard === option.name ? 0 : 20,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ pointerEvents: hoveredCard === option.name ? "auto" : "none" }}
                  >
                    {isAlicia ? aliciaT.aliciaDescription : t[option.name + "Description"]}
                  </motion.div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
