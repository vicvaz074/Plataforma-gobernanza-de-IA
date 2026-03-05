"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/LanguageContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { translations } from "@/lib/translations"
import { Upload, Download, FileText, Shield, Lock, Server, Eye, EyeOff, Search } from "lucide-react"
import jsPDF from "jspdf"
<<<<<<< HEAD
import * as XLSX from "xlsx"
=======
import ExcelJS from "exceljs"
>>>>>>> be37263 (fix: modify EIA module and upgrade it)

interface SecurityControl {
  id: string
  name: string
  category: "technical" | "administrative" | "physical"
  status?: "has" | "notApplicable"
  evidence?: File
  evidenceUrl?: string
  justification?: string
}

interface SecurityControlsData {
  controls: SecurityControl[]
  lastUpdated: string
}

const technicalControls = [
  "mfaMinimumPrivilege",
  "securePasswordsLocking",
  "encryptionInTransit",
  "encryptionAtRest",
  "periodicBackups",
  "restorationTests",
  "logsMonitoring",
  "siemIdsIps",
  "updatedAntiMalware",
  "patchManagement",
  "vulnerabilityScans",
  "periodicPentests",
  "secureSDLC",
  "continuityPlanDRP",
  "networkMonitoring",
  "emailProtection",
  "changeManagement",
  "configurationManagement",
  "databaseAccessControl",
  "identityManagement",
]

const administrativeControls = [
  "personalDataPolicyActive",
  "confidentialityAgreementsSigned",
  "incidentManagementDocumented",
  "supplierEvaluation",
  "personnelOnboardingOffboarding",
  "registeredTraining",
  "informationClassificationLabeling",
  "documentManagement",
  "contractsPrivacyClauses",
  "incidentResponsePlan",
  "periodicPolicyReview",
  "processingActivitiesRegistry",
  "arcoProcedures",
  "thirdPartyContractReview",
  "legalRiskManagement",
  "businessImpactAnalysis",
  "securityCommittee",
  "incidentCommunicationPlan",
  "organizationalChangeManagement",
  "scheduledInternalAudits",
]

const physicalControls = [
  "physicalAccessControl",
  "cctvRetention",
  "environmentalMeasuresCPD",
  "secureAreas",
  "visitorLogs",
  "documentSafeguarding",
  "equipmentProtection",
  "secureCabling",
  "facilitiesSecurityPlan",
  "physicalIntrusionDetection",
  "surveillance24x7",
  "portableHardwareLocking",
  "restrictedZoneSignage",
  "keyControl",
  "facilitiesMaintenance",
  "mobileDeviceControl",
  "secureMediaDestruction",
  "electricalRedundancy",
  "fireControl",
  "perimeterSecurity",
]

export default function SeguridadEntorno() {
  const { language } = useLanguage()
  const t = translations[language]
  const { toast } = useToast()

  const [activeCard, setActiveCard] = useState<"register" | "manage">("register")
  const [securityData, setSecurityData] = useState<SecurityControlsData>({
    controls: [],
    lastUpdated: new Date().toISOString(),
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<"all" | "technical" | "administrative" | "physical">("all")
  const [showEvidence, setShowEvidence] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const savedData = localStorage.getItem("securityControlsData")
    if (savedData) {
      const parsed = JSON.parse(savedData) as SecurityControlsData
      const upgradedControls = parsed.controls.map((c: any) => {
        if (c.status) return c
        return {
          id: c.id,
          name: c.name,
          category: c.category,
          status: c.implemented ? "has" : undefined,
          evidence: c.evidence,
          evidenceUrl: c.evidenceUrl,
          justification: c.justification,
        }
      })
      setSecurityData({ controls: upgradedControls, lastUpdated: parsed.lastUpdated })
    } else {
      // Initialize with all controls
      const allControls: SecurityControl[] = [
        ...technicalControls.map((id) => ({ id, name: id, category: "technical" as const })),
        ...administrativeControls.map((id) => ({ id, name: id, category: "administrative" as const })),
        ...physicalControls.map((id) => ({ id, name: id, category: "physical" as const })),
      ]
      const initialData = { controls: allControls, lastUpdated: new Date().toISOString() }
      setSecurityData(initialData)
      localStorage.setItem("securityControlsData", JSON.stringify(initialData))
    }
  }, [])

  const saveData = (data: SecurityControlsData) => {
    const updatedData = { ...data, lastUpdated: new Date().toISOString() }
    setSecurityData(updatedData)
    localStorage.setItem("securityControlsData", JSON.stringify(updatedData))
  }

  const handleStatusChange = (controlId: string, status: "has" | "notApplicable") => {
    const updatedControls = securityData.controls.map((control) =>
      control.id === controlId
        ? {
<<<<<<< HEAD
            ...control,
            status,
            evidence: status === "has" ? control.evidence : undefined,
            evidenceUrl: status === "has" ? control.evidenceUrl : undefined,
            justification: status === "notApplicable" ? control.justification : undefined,
          }
=======
          ...control,
          status,
          evidence: status === "has" ? control.evidence : undefined,
          evidenceUrl: status === "has" ? control.evidenceUrl : undefined,
          justification: status === "notApplicable" ? control.justification : undefined,
        }
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
        : control,
    )
    saveData({ ...securityData, controls: updatedControls })

    toast({
      title: "Estado actualizado",
      description: `${t[controlId]} ${status === "has" ? "marcado como se tiene" : "marcado como no aplica"}`,
    })
  }

  const handleEvidenceUpload = (controlId: string, file: File) => {
    const updatedControls = securityData.controls.map((control) =>
      control.id === controlId ? { ...control, evidence: file, evidenceUrl: URL.createObjectURL(file) } : control,
    )
    saveData({ ...securityData, controls: updatedControls })

    toast({
      title: "Evidencia subida",
      description: `Evidencia para ${t[controlId]} subida correctamente`,
    })
  }

  const handleJustificationChange = (controlId: string, justification: string) => {
    const updatedControls = securityData.controls.map((control) =>
      control.id === controlId ? { ...control, justification } : control,
    )
    saveData({ ...securityData, controls: updatedControls })
  }

  const isCompleted = (control: SecurityControl) =>
    (control.status === "has" && control.evidence) ||
    (control.status === "notApplicable" && control.justification)

  const calculateCompleteness = () => {
    const completedControls = securityData.controls.filter((c) => isCompleted(c)).length
    const totalControls = securityData.controls.length
    return totalControls > 0 ? Math.round((completedControls / totalControls) * 100) : 0
  }

  const getCompletenessByCategory = (category: string) => {
    const categoryControls = securityData.controls.filter((c) => c.category === category)
    const completedControls = categoryControls.filter((c) => isCompleted(c)).length
    return categoryControls.length > 0 ? Math.round((completedControls / categoryControls.length) * 100) : 0
  }

  const generatePDFReport = () => {
    const doc = new jsPDF()
    const compliance = calculateCompleteness()

    doc.setFontSize(20)
    doc.text("Reporte de Seguridad de entorno", 20, 30)

    doc.setFontSize(12)
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 50)
    doc.text(`Grado de completitud: ${compliance}%`, 20, 60)

    let yPosition = 80

    const categories = [
      { key: "technical", name: "Controles Técnicos", controls: technicalControls },
      { key: "administrative", name: "Controles Administrativos", controls: administrativeControls },
      { key: "physical", name: "Controles Físicos", controls: physicalControls },
    ]

    categories.forEach((category) => {
      doc.setFontSize(14)
      doc.text(`${category.name} (${getCompletenessByCategory(category.key)}%)`, 20, yPosition)
      yPosition += 10

      category.controls.forEach((controlId) => {
        const control = securityData.controls.find((c) => c.id === controlId)
        if (control) {
          doc.setFontSize(10)
          const completed = isCompleted(control)
          const status = completed ? "✓" : "✗"
          let detail = ""
          if (control.status === "has") {
            detail = control.evidence ? " (Con evidencia)" : " (Sin evidencia)"
          } else if (control.status === "notApplicable") {
            detail = control.justification ? " (No aplica)" : " (No aplica sin justificación)"
          }
          doc.text(`${status} ${t[controlId]}${detail}`, 25, yPosition)
          yPosition += 6

          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }
        }
      })
      yPosition += 5
    })

    doc.save("reporte-seguridad-entorno.pdf")

    toast({
      title: "Reporte PDF generado",
      description: "El reporte se ha descargado correctamente",
    })
  }

<<<<<<< HEAD
  const generateExcelReport = () => {
=======
  const generateExcelReport = async () => {
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
    const data = securityData.controls.map((control) => ({
      Control: t[control.name],
      Categoría:
        control.category === "technical"
          ? "Técnico"
          : control.category === "administrative"
            ? "Administrativo"
            : "Físico",
      Estado:
        control.status === "has"
          ? "Se tiene"
          : control.status === "notApplicable"
            ? "No aplica"
            : "Pendiente",
      Evidencia: control.evidence ? "Sí" : "No",
      Justificación: control.justification ? control.justification : "",
    }))

<<<<<<< HEAD
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Controles de Seguridad")

    XLSX.writeFile(wb, "seguridad-entorno.xlsx")
=======
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet("Controles de Seguridad")

    if (data.length > 0) {
      ws.columns = Object.keys(data[0]).map(key => ({ header: key, key }))
      data.forEach(row => ws.addRow(row))
    }

    const buffer = await wb.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = "seguridad-entorno.xlsx"
    a.click()
    window.URL.revokeObjectURL(url)
>>>>>>> be37263 (fix: modify EIA module and upgrade it)

    toast({
      title: "Reporte Excel generado",
      description: "El reporte se ha descargado correctamente",
    })
  }

  const filteredControls = securityData.controls.filter((control) => {
    const matchesSearch = t[control.name].toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || control.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const renderControlsByCategory = (category: "technical" | "administrative" | "physical", controls: string[]) => {
    const categoryIcon = category === "technical" ? Server : category === "administrative" ? FileText : Shield
    const Icon = categoryIcon

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Icon className="h-5 w-5" />
            {t[`${category}Controls`]} ({getCompletenessByCategory(category)}%)
          </CardTitle>
          <Progress value={getCompletenessByCategory(category)} className="w-full" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {controls.map((controlId) => {
              const control = securityData.controls.find((c) => c.id === controlId)
              if (!control) return null

              return (
                <div key={controlId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <Select
                      value={control.status || ""}
                      onValueChange={(value) => handleStatusChange(controlId, value as "has" | "notApplicable")}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder={t.selectOption} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="has">{t.hasOption}</SelectItem>
                        <SelectItem value="notApplicable">{t.notApplicableOption}</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm">{t[controlId]}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {control.status === "has" && (
                      <>
                        {control.evidence ? (
                          <Badge variant="secondary" className="text-green-700">
                            {t.evidenceUploaded}
                          </Badge>
                        ) : (
                          <Badge variant="outline">{t.noEvidenceUploaded}</Badge>
                        )}

                        <Input
                          type="file"
                          className="hidden"
                          id={`evidence-${controlId}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleEvidenceUpload(controlId, file)
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById(`evidence-${controlId}`)?.click()}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>

                        {control.evidence && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setShowEvidence((prev) => ({
                                ...prev,
                                [controlId]: !prev[controlId],
                              }))
                            }
                          >
                            {showEvidence[controlId] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        )}
                      </>
                    )}
                    {control.status === "notApplicable" && (
                      <Input
                        placeholder={t.justification}
                        value={control.justification || ""}
                        onChange={(e) => handleJustificationChange(controlId, e.target.value)}
                        className="w-40 md:w-64"
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-700">{t.securityMeasuresDrawer}</h1>
          <p className="text-gray-600 mt-2">{t.securityMeasuresDrawerDescription}</p>
          <p className="text-gray-600 mt-2 text-sm max-w-3xl">{t.completenessExplanation}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateExcelReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t.generateExcelReport}
          </Button>
          <Button onClick={generatePDFReport} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            {t.generatePDFReport}
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            {t.completenessScore}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{calculateCompleteness()}%</div>
              <div className="text-sm text-gray-600">{t.completenessPercentage}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{securityData.controls.filter((c) => isCompleted(c)).length}</div>
              <div className="text-sm text-gray-600">{t.controlsCompleted}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{securityData.controls.length}</div>
              <div className="text-sm text-gray-600">{t.totalControls}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{securityData.controls.filter((c) => c.evidence).length}</div>
              <div className="text-sm text-gray-600">{t.withEvidence}</div>
            </div>
          </div>
          <Progress value={calculateCompleteness()} className="w-full mt-4" />
        </CardContent>
      </Card>

      {/* Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card
          className={`cursor-pointer transition-all ${activeCard === "register" ? "ring-2 ring-green-500 bg-green-50" : "hover:shadow-md"}`}
          onClick={() => setActiveCard("register")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {t.registerSecurityControls}
            </CardTitle>
            <CardDescription>Registra y gestiona controles de seguridad por categoría</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${activeCard === "manage" ? "ring-2 ring-green-500 bg-green-50" : "hover:shadow-md"}`}
          onClick={() => setActiveCard("manage")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t.manageSecurityControls}
            </CardTitle>
            <CardDescription>Consulta, filtra y gestiona controles implementados</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Register Controls */}
      {activeCard === "register" && (
        <div className="space-y-6">
          <Tabs defaultValue="technical" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="technical">{t.technicalControls}</TabsTrigger>
              <TabsTrigger value="administrative">{t.administrativeControls}</TabsTrigger>
              <TabsTrigger value="physical">{t.physicalControls}</TabsTrigger>
            </TabsList>

            <TabsContent value="technical">{renderControlsByCategory("technical", technicalControls)}</TabsContent>

            <TabsContent value="administrative">
              {renderControlsByCategory("administrative", administrativeControls)}
            </TabsContent>

            <TabsContent value="physical">{renderControlsByCategory("physical", physicalControls)}</TabsContent>
          </Tabs>
        </div>
      )}

      {/* Manage Controls */}
      {activeCard === "manage" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de controles</CardTitle>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar controles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">Todas las categorías</option>
                  <option value="technical">Técnicos</option>
                  <option value="administrative">Administrativos</option>
                  <option value="physical">Físicos</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredControls.map((control) => (
                  <div key={control.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <div>
                        <div className="font-medium">{t[control.name]}</div>
                        <div className="text-sm text-gray-500 capitalize">{control.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        value={control.status || ""}
                        onValueChange={(value) => handleStatusChange(control.id, value as "has" | "notApplicable")}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder={t.selectOption} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="has">{t.hasOption}</SelectItem>
                          <SelectItem value="notApplicable">{t.notApplicableOption}</SelectItem>
                        </SelectContent>
                      </Select>

                      {control.status === "has" && (
                        <>
                          {control.evidence ? (
                            <Badge variant="secondary" className="text-green-700">
                              {t.evidenceUploaded}
                            </Badge>
                          ) : (
                            <Badge variant="outline">{t.noEvidenceUploaded}</Badge>
                          )}
                          <Input
                            type="file"
                            className="hidden"
                            id={`manage-evidence-${control.id}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleEvidenceUpload(control.id, file)
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`manage-evidence-${control.id}`)?.click()}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {control.status === "notApplicable" && (
                        <Input
                          placeholder={t.justification}
                          value={control.justification || ""}
                          onChange={(e) => handleJustificationChange(control.id, e.target.value)}
                          className="w-40 md:w-64"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
