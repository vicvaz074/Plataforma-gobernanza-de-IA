"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/LanguageContext"

export default function RegistroSistemasIAPage() {
  const { language } = useLanguage()
  // Simple labels, translations can be added if needed
  const labels = {
    es: {
      thirdParty: "Registro de sistemas con terceros",
      own: "Registro de sistemas propio",
    },
    en: {
      thirdParty: "Register systems with third parties",
      own: "Register own systems",
    },
  }
  const t = labels[language as "es" | "en"] || labels.es

  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/registro-sistemas-ia/con-terceros">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold text-center">{t.thirdParty}</h2>
          </Card>
        </Link>
        <Link href="/registro-sistemas-ia/propio">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold text-center">{t.own}</h2>
          </Card>
        </Link>
      </div>
    </div>
  )
}
