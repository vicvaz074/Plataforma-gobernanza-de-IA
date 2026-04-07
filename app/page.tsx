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
    href: "https://asistentelegal02.azurewebsites.net/",
    external: true,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fondo9.png-AqM6pGQFnW7wv6Mud4R4MHeOdJx6s4.jpeg",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {options.map((option) => {
            const title = option.name === "alicia" ? aliciaT.alicia : t[option.name]

            const CardContent = (
              <Card
                className="p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center h-[200px] cursor-pointer group relative overflow-hidden"
                onMouseEnter={() => setHoveredCard(option.name)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {option.image ? (
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={option.image || "/placeholder.svg"}
                      alt={option.name === "alicia" ? aliciaT.alicia : t[option.name]}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20" />
                  </div>
                ) : (
                  <option.icon className="h-10 w-10 mb-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
                )}
                <span
                  className={`text-base font-medium text-center transition-colors leading-tight ${
                    option.image
                      ? `text-white relative z-10 ${option.name === "alicia" ? "group-hover:opacity-0" : ""}`
                      : "text-gray-700 group-hover:text-gray-900"
                  }`}
                  style={{ fontFamily: "Futura PT Medium, sans-serif" }}
                >
                  {option.name === "alicia" ? (
                    <Image
                      src="/Alicia_Sin_Despachos.png"
                      alt="Alicia"
                      width={124}
                      height={38}
                      className="object-contain relative z-10"
                      unoptimized
                    />
                  ) : title}
                </span>
                <motion.div
                  className="absolute inset-0 bg-white bg-opacity-90 p-4 flex items-center justify-center text-sm text-gray-700 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: hoveredCard === option.name ? 1 : 0,
                    y: hoveredCard === option.name ? 0 : 20,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ pointerEvents: hoveredCard === option.name ? "auto" : "none" }}
                >
                  {option.name === "alicia" ? aliciaT.aliciaDescription : t[option.name + "Description"]}
                </motion.div>
              </Card>
            )

            if (option.external) {
              return (
                <a key={option.name} href={option.href} target="_blank" rel="noopener noreferrer">
                  {CardContent}
                </a>
              )
            }

            return (
              <Link key={option.name} href={option.href}>
                {CardContent}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
