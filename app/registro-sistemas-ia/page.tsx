"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/LanguageContext"
import { Building2, Cpu } from "lucide-react"

export default function RegistroSistemasIAPage() {
  const { language } = useLanguage()
  const labels = {
    es: {
      thirdParty: "Registro de sistemas con terceros",
      thirdPartyDesc: "Registra y gestiona sistemas de IA desarrollados por proveedores externos",
      thirdPartyBadge: "Terceros",
      own: "Registro de sistemas propios",
      ownDesc: "Documenta sistemas de IA desarrollados internamente por tu organización",
      ownBadge: "Interno",
    },
    en: {
      thirdParty: "Register systems with third parties",
      thirdPartyDesc: "Register and manage AI systems developed by external providers",
      thirdPartyBadge: "Third Party",
      own: "Register own systems",
      ownDesc: "Document AI systems developed internally by your organization",
      ownBadge: "Internal",
    },
  }
  const t = labels[language as "es" | "en"] || labels.es

  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Link href="/registro-sistemas-ia/con-terceros">
          <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-[#1bb67e] group">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-[#1bb67e] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-10 h-10 text-white" />
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-[#1bb67e] transition-colors">
                  {t.thirdParty}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{t.thirdPartyDesc}</p>
              </div>

              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {t.thirdPartyBadge}
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/registro-sistemas-ia/propio">
          <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-[#1bb67e] group">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-[#1bb67e] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Cpu className="w-10 h-10 text-white" />
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-[#1bb67e] transition-colors">
                  {t.own}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{t.ownDesc}</p>
              </div>

              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {t.ownBadge}
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}
