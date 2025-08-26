"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
import { Section, initialSections } from "@/components/user-progress-dashboard"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { FileText, AlertTriangle } from "lucide-react"
import Link from "next/link"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export function AuditDashboard() {
  const { language } = useLanguage()
  const t = translations[language]
  const [sections, setSections] = useState<Section[]>(initialSections)

  useEffect(() => {
    const savedProgress = localStorage.getItem("userSectionsProgress")
    if (savedProgress) {
      try {
        setSections(JSON.parse(savedProgress))
      } catch (error) {
        console.error("Error loading progress data:", error)
      }
    }
  }, [])

  const pendingSections = sections.filter((s) => s.status !== "completado")

  const generatePdf = () => {
    const doc = new jsPDF()
    doc.text(t.audit, 14, 20)
    autoTable(doc, {
      head: [[t.processingActivityName, t.status]],
      body: sections.map((s) => [s.title, s.status]),
    })
    doc.save("audit-report.pdf")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.audit}</h1>
        <Button onClick={generatePdf}>
          <FileText className="mr-2 h-4 w-4" />
          {t.generatePdfReport}
        </Button>
      </div>

      {pendingSections.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">{t.pendingModules}</h2>
          {pendingSections.map((section) => (
            <Alert key={section.id}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{section.title}</AlertTitle>
              <AlertDescription>
                {t.reviewModule}{" "}
                <Link href={section.path} className="underline">
                  {t.goToModule}
                </Link>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      ) : (
        <p>{t.allModulesComplete}</p>
      )}
    </div>
  )
}

export default AuditDashboard

