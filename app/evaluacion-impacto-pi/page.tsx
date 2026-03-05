"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
import { FileText, Download, Edit, Trash2, Plus, Eye, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import jsPDF from "jspdf"

interface IPAssessmentData {
  id: string
  timestamp: string
  projectName: string
  responsibleArea: string
  lifecyclePhase: string
  aiType: string
  aiTypeOther?: string
  usageType: string
  copyrightData: string
  contentType?: string[]
  licensesDocumented?: string
  risksExplanation?: string
  scrapingData: string
  extractionRights?: string
  protectedOutput: string
  typeProtection?: string[]
  explicitLicense?: string
  outputOwnership: string
  contentTraceability: string
  infringementRisk: string
  riskDescription?: string
  patentMonitoring: string
  technicalControls: string[]
  defensibilityEvaluations: string
  legalAdvice: string
  termsOfUse: string
  publicReport: string
  reportIncludes?: string[]
  riskLevel: string
  recommendedActions: string[]
  recommendedActionsOther?: string
  score: number
  riskCategory: "low" | "medium" | "high"
}

export default function IPImpactAssessmentPage() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const t = translations[language]

  const [activeCard, setActiveCard] = useState<"register" | "view">("register")
  const [assessments, setAssessments] = useState<IPAssessmentData[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<IPAssessmentData>>({
    projectName: "",
    responsibleArea: "",
    lifecyclePhase: "",
    aiType: "",
    usageType: "",
    copyrightData: "",
    scrapingData: "",
    protectedOutput: "",
    outputOwnership: "",
    contentTraceability: "",
    infringementRisk: "",
    patentMonitoring: "",
    technicalControls: [],
    defensibilityEvaluations: "",
    legalAdvice: "",
    termsOfUse: "",
    publicReport: "",
    riskLevel: "",
    recommendedActions: [],
  })

  useEffect(() => {
    const saved = localStorage.getItem("ipAssessments")
    if (saved) {
      setAssessments(JSON.parse(saved))
    }
  }, [])

  const saveToLocalStorage = (data: IPAssessmentData[]) => {
    localStorage.setItem("ipAssessments", JSON.stringify(data))
    setAssessments(data)
  }

  const calculateScore = (data: Partial<IPAssessmentData>): { score: number; category: "low" | "medium" | "high" } => {
    let score = 0

    // Scoring logic: Sí = 0, Parcial = 1, No = 2, Desconocido = 1
    const scoreMap: { [key: string]: number } = {
      si: 0,
      yes: 0,
      parcial: 1,
      partial: 1,
      no: 2,
      desconocido: 1,
      unknown: 1,
      "en-evaluacion": 1,
      "in-evaluation": 1,
    }

    // Section B scoring
    score += scoreMap[data.copyrightData?.toLowerCase() || ""] || 0
    score += scoreMap[data.licensesDocumented?.toLowerCase() || ""] || 0
    score += scoreMap[data.scrapingData?.toLowerCase() || ""] || 0
    score += scoreMap[data.extractionRights?.toLowerCase() || ""] || 0

    // Section C scoring
    score += scoreMap[data.protectedOutput?.toLowerCase() || ""] || 0
    score += scoreMap[data.explicitLicense?.toLowerCase() || ""] || 0
    score += scoreMap[data.outputOwnership?.toLowerCase() || ""] || 0
    score += scoreMap[data.contentTraceability?.toLowerCase() || ""] || 0

    // Section D scoring (risk assessment)
    const riskScore: { [key: string]: number } = {
      bajo: 0,
      low: 0,
      medio: 1,
      medium: 1,
      alto: 2,
      high: 2,
      desconocido: 1,
      unknown: 1,
    }
    score += riskScore[data.infringementRisk?.toLowerCase() || ""] || 0
    score += scoreMap[data.patentMonitoring?.toLowerCase() || ""] || 0

    // Section E scoring
    score += scoreMap[data.defensibilityEvaluations?.toLowerCase() || ""] || 0
    score += scoreMap[data.legalAdvice?.toLowerCase() || ""] || 0
    score += scoreMap[data.termsOfUse?.toLowerCase() || ""] || 0

    // Section F scoring
    score += scoreMap[data.publicReport?.toLowerCase() || ""] || 0

    // Determine category
    let category: "low" | "medium" | "high"
    if (score <= 5) category = "low"
    else if (score <= 10) category = "medium"
    else category = "high"

    return { score, category }
  }

  const handleSubmit = () => {
    // Validation
    const requiredFields = ["projectName", "responsibleArea", "lifecyclePhase", "aiType", "usageType"]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof IPAssessmentData])

    if (missingFields.length > 0) {
      toast({
        title: language === "es" ? "Campos requeridos" : "Required fields",
        description:
          language === "es"
            ? "Por favor complete todos los campos obligatorios"
            : "Please complete all required fields",
        variant: "destructive",
      })
      return
    }

    const { score, category } = calculateScore(formData)

    const assessmentData: IPAssessmentData = {
      ...(formData as IPAssessmentData),
      id: editingId || Date.now().toString(),
      timestamp: new Date().toISOString(),
      score,
      riskCategory: category,
    }

    let updatedAssessments
    if (editingId) {
      updatedAssessments = assessments.map((a) => (a.id === editingId ? assessmentData : a))
      setEditingId(null)
    } else {
      updatedAssessments = [...assessments, assessmentData]
    }

    saveToLocalStorage(updatedAssessments)

    // Reset form
    setFormData({
      projectName: "",
      responsibleArea: "",
      lifecyclePhase: "",
      aiType: "",
      usageType: "",
      copyrightData: "",
      scrapingData: "",
      protectedOutput: "",
      outputOwnership: "",
      contentTraceability: "",
      infringementRisk: "",
      patentMonitoring: "",
      technicalControls: [],
      defensibilityEvaluations: "",
      legalAdvice: "",
      termsOfUse: "",
      publicReport: "",
      riskLevel: "",
      recommendedActions: [],
    })

    toast({
      title: language === "es" ? "Evaluación guardada" : "Assessment saved",
      description:
        language === "es" ? "La evaluación se ha guardado correctamente" : "Assessment has been saved successfully",
    })

    setActiveCard("view")
  }

  const handleEdit = (assessment: IPAssessmentData) => {
    setFormData(assessment)
    setEditingId(assessment.id)
    setActiveCard("register")
  }

  const handleDelete = (id: string) => {
    const updatedAssessments = assessments.filter((a) => a.id !== id)
    saveToLocalStorage(updatedAssessments)
    toast({
      title: language === "es" ? "Evaluación eliminada" : "Assessment deleted",
      description:
        language === "es" ? "La evaluación se ha eliminado correctamente" : "Assessment has been deleted successfully",
    })
  }

  const generatePDFReport = (assessment: IPAssessmentData) => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    let yPosition = 20

    // Header
    doc.setFontSize(18)
    doc.setTextColor(27, 182, 126) // Corporate green
    doc.text("Reporte de Evaluación de Impacto en Propiedad Intelectual", pageWidth / 2, yPosition, { align: "center" })

    yPosition += 20
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Fecha: ${new Date(assessment.timestamp).toLocaleDateString()}`, 20, yPosition)
    doc.text(`Puntuación: ${assessment.score}/28`, pageWidth - 60, yPosition)

    yPosition += 10
    const riskColor =
      assessment.riskCategory === "low"
<<<<<<< HEAD
        ? [34, 197, 94]
        : assessment.riskCategory === "medium"
          ? [251, 191, 36]
          : [239, 68, 68]
=======
        ? [34, 197, 94] as [number, number, number]
        : assessment.riskCategory === "medium"
          ? [251, 191, 36] as [number, number, number]
          : [239, 68, 68] as [number, number, number]
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
    doc.setTextColor(...riskColor)
    const riskText =
      assessment.riskCategory === "low"
        ? "RIESGO BAJO"
        : assessment.riskCategory === "medium"
          ? "RIESGO MEDIO"
          : "RIESGO ALTO"
    doc.text(`Nivel de Riesgo: ${riskText}`, 20, yPosition)

    yPosition += 20
    doc.setTextColor(0, 0, 0)

    // Section A
    doc.setFontSize(14)
    doc.text("A. Identificación y Contexto", 20, yPosition)
    yPosition += 10
    doc.setFontSize(10)
    doc.text(`Proyecto: ${assessment.projectName}`, 20, yPosition)
    yPosition += 5
    doc.text(`Área responsable: ${assessment.responsibleArea}`, 20, yPosition)
    yPosition += 5
    doc.text(`Fase: ${assessment.lifecyclePhase}`, 20, yPosition)
    yPosition += 5
    doc.text(
      `Tipo de IA: ${assessment.aiType}${assessment.aiTypeOther ? ` (${assessment.aiTypeOther})` : ""}`,
      20,
      yPosition,
    )
    yPosition += 5
    doc.text(`Uso: ${assessment.usageType}`, 20, yPosition)

    yPosition += 15

    // Section B
    doc.setFontSize(14)
    doc.text("B. Entrenamiento y Datos Usados", 20, yPosition)
    yPosition += 10
    doc.setFontSize(10)
    doc.text(`Datos con derechos: ${assessment.copyrightData}`, 20, yPosition)
    yPosition += 5
    if (assessment.contentType?.length) {
      doc.text(`Tipo de contenido: ${assessment.contentType.join(", ")}`, 20, yPosition)
      yPosition += 5
    }
    if (assessment.licensesDocumented) {
      doc.text(`Licencias documentadas: ${assessment.licensesDocumented}`, 20, yPosition)
      yPosition += 5
    }
    doc.text(`Scraping de datos: ${assessment.scrapingData}`, 20, yPosition)
    yPosition += 5
    if (assessment.extractionRights) {
      doc.text(`Derechos de extracción: ${assessment.extractionRights}`, 20, yPosition)
      yPosition += 5
    }

    // Add new page if needed
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    yPosition += 10

    // Section C
    doc.setFontSize(14)
    doc.text("C. Titularidad y Licencias de Output", 20, yPosition)
    yPosition += 10
    doc.setFontSize(10)
    doc.text(`Contenido protegido en output: ${assessment.protectedOutput}`, 20, yPosition)
    yPosition += 5
    if (assessment.typeProtection?.length) {
      doc.text(`Tipo de IP: ${assessment.typeProtection.join(", ")}`, 20, yPosition)
      yPosition += 5
    }
    if (assessment.explicitLicense) {
      doc.text(`Licencia explícita: ${assessment.explicitLicense}`, 20, yPosition)
      yPosition += 5
    }
    doc.text(`Propiedad de outputs: ${assessment.outputOwnership}`, 20, yPosition)
    yPosition += 5
    doc.text(`Trazabilidad de contenido: ${assessment.contentTraceability}`, 20, yPosition)

    yPosition += 15

    // Section D
    doc.setFontSize(14)
    doc.text("D. Riesgo Comercial y Conflictos", 20, yPosition)
    yPosition += 10
    doc.setFontSize(10)
    doc.text(`Riesgo de infracción: ${assessment.infringementRisk}`, 20, yPosition)
    yPosition += 5
    if (assessment.riskDescription) {
      doc.text(`Descripción del riesgo: ${assessment.riskDescription}`, 20, yPosition)
      yPosition += 5
    }
    doc.text(`Monitoreo de patentes: ${assessment.patentMonitoring}`, 20, yPosition)

    yPosition += 15

    // Section E
    doc.setFontSize(14)
    doc.text("E. Mitigaciones Implementadas", 20, yPosition)
    yPosition += 10
    doc.setFontSize(10)
    if (assessment.technicalControls?.length) {
      doc.text(`Controles técnicos: ${assessment.technicalControls.join(", ")}`, 20, yPosition)
      yPosition += 5
    }
    doc.text(`Evaluaciones de defensibilidad: ${assessment.defensibilityEvaluations}`, 20, yPosition)
    yPosition += 5
    doc.text(`Asesoría legal: ${assessment.legalAdvice}`, 20, yPosition)
    yPosition += 5
    doc.text(`Términos de uso publicados: ${assessment.termsOfUse}`, 20, yPosition)

    yPosition += 15

    // Section F
    doc.setFontSize(14)
    doc.text("F. Transparencia y Documentación", 20, yPosition)
    yPosition += 10
    doc.setFontSize(10)
    doc.text(`Informe público: ${assessment.publicReport}`, 20, yPosition)
    yPosition += 5
    if (assessment.reportIncludes?.length) {
      doc.text(`Incluye: ${assessment.reportIncludes.join(", ")}`, 20, yPosition)
      yPosition += 5
    }

    yPosition += 15

    // Section G
    doc.setFontSize(14)
    doc.text("G. Evaluación de Impacto y Medición", 20, yPosition)
    yPosition += 10
    doc.setFontSize(10)
    doc.text(`Nivel de riesgo estimado: ${assessment.riskLevel}`, 20, yPosition)
    yPosition += 5
    if (assessment.recommendedActions?.length) {
      doc.text(`Acciones recomendadas: ${assessment.recommendedActions.join(", ")}`, 20, yPosition)
      yPosition += 5
    }

    // Footer
    yPosition += 20
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text("Generado por DavaraGovernance AI", pageWidth / 2, yPosition, { align: "center" })

    doc.save(`evaluacion-impacto-pi-${assessment.projectName.replace(/\s+/g, "-")}.pdf`)
  }

  const getRiskBadgeColor = (category: string) => {
    switch (category) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskIcon = (category: string) => {
    switch (category) {
      case "low":
        return <CheckCircle className="h-4 w-4" />
      case "medium":
        return <AlertTriangle className="h-4 w-4" />
      case "high":
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{t.ipImpactAssessment}</h1>
        <p className="text-gray-600">
          {language === "es"
            ? "Evalúe el impacto en propiedad intelectual de sus sistemas de IA"
            : "Assess the intellectual property impact of your AI systems"}
        </p>
      </div>

      {/* Main Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Register Card */}
        <Card
<<<<<<< HEAD
          className={`cursor-pointer transition-all duration-200 ${
            activeCard === "register" ? "ring-2 ring-[#1bb67e] shadow-lg" : "hover:shadow-md"
          }`}
=======
          className={`cursor-pointer transition-all duration-200 ${activeCard === "register" ? "ring-2 ring-[#1bb67e] shadow-lg" : "hover:shadow-md"
            }`}
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
          onClick={() => setActiveCard("register")}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-[#1bb67e] rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-xl">{t.ipRegisterCard}</CardTitle>
            <CardDescription className="text-sm">{t.ipRegisterDescription}</CardDescription>
          </CardHeader>
        </Card>

        {/* View Card */}
        <Card
<<<<<<< HEAD
          className={`cursor-pointer transition-all duration-200 ${
            activeCard === "view" ? "ring-2 ring-[#1bb67e] shadow-lg" : "hover:shadow-md"
          }`}
=======
          className={`cursor-pointer transition-all duration-200 ${activeCard === "view" ? "ring-2 ring-[#1bb67e] shadow-lg" : "hover:shadow-md"
            }`}
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
          onClick={() => setActiveCard("view")}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-[#1bb67e] rounded-full flex items-center justify-center mb-4">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-xl">{t.ipViewCard}</CardTitle>
            <CardDescription className="text-sm">
              {t.ipViewDescription}
              {assessments.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {assessments.length}
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Content based on active card */}
      {activeCard === "register" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {editingId
                ? language === "es"
                  ? "Editar Evaluación"
                  : "Edit Assessment"
                : language === "es"
                  ? "Nueva Evaluación"
                  : "New Assessment"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Section A: Identificación y Contexto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1bb67e] border-b border-gray-200 pb-2">{t.ipSectionA}</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName">{t.ipProjectName} *</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName || ""}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    placeholder={language === "es" ? "Nombre del proyecto" : "Project name"}
                  />
                </div>

                <div>
                  <Label htmlFor="responsibleArea">{t.ipResponsibleArea} *</Label>
                  <Input
                    id="responsibleArea"
                    value={formData.responsibleArea || ""}
                    onChange={(e) => setFormData({ ...formData, responsibleArea: e.target.value })}
                    placeholder={language === "es" ? "Área y contacto" : "Area and contact"}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="lifecyclePhase">{t.ipLifecyclePhase} *</Label>
                  <Select
                    value={formData.lifecyclePhase || ""}
                    onValueChange={(value) => setFormData({ ...formData, lifecyclePhase: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "es" ? "Seleccionar fase" : "Select phase"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diseno">{t.ipDesign}</SelectItem>
                      <SelectItem value="desarrollo">{t.ipDevelopment}</SelectItem>
                      <SelectItem value="piloto">{t.ipPilot}</SelectItem>
                      <SelectItem value="produccion">{t.ipProduction}</SelectItem>
                      <SelectItem value="retiro">{t.ipRetirement}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="aiType">{t.ipAiType} *</Label>
                  <Select
                    value={formData.aiType || ""}
                    onValueChange={(value) => setFormData({ ...formData, aiType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "es" ? "Seleccionar tipo" : "Select type"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="generativa">{t.ipGenerativeAI}</SelectItem>
                      <SelectItem value="nlp">{t.ipNLP}</SelectItem>
                      <SelectItem value="vision">{t.ipVision}</SelectItem>
                      <SelectItem value="reglas">{t.ipRules}</SelectItem>
                      <SelectItem value="otro">{t.other}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="usageType">{t.ipUsageType} *</Label>
                  <Select
                    value={formData.usageType || ""}
                    onValueChange={(value) => setFormData({ ...formData, usageType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "es" ? "Seleccionar uso" : "Select usage"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interno">{t.ipInternal}</SelectItem>
                      <SelectItem value="publico">{t.ipPublic}</SelectItem>
                      <SelectItem value="mixto">{t.ipMixed}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.aiType === "otro" && (
                <div>
                  <Label htmlFor="aiTypeOther">
                    {language === "es" ? "Especificar tipo de IA" : "Specify AI type"}
                  </Label>
                  <Input
                    id="aiTypeOther"
                    value={formData.aiTypeOther || ""}
                    onChange={(e) => setFormData({ ...formData, aiTypeOther: e.target.value })}
                    placeholder={language === "es" ? "Especificar..." : "Specify..."}
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* Section B: Entrenamiento y Datos Usados */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1bb67e] border-b border-gray-200 pb-2">{t.ipSectionB}</h3>

              <div>
                <Label htmlFor="copyrightData">{t.ipCopyrightData}</Label>
                <Select
                  value={formData.copyrightData || ""}
                  onValueChange={(value) => setFormData({ ...formData, copyrightData: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === "es" ? "Seleccionar respuesta" : "Select answer"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="desconocido">{t.ipUnknown}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.copyrightData === "si" && (
                <div className="space-y-4 ml-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label>{t.ipContentType}</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        { value: "texto", label: t.ipText },
                        { value: "imagen", label: t.ipImage },
                        { value: "video", label: t.ipVideo },
                        { value: "codigo", label: t.ipCode },
                        { value: "otro", label: t.other },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`contentType-${option.value}`}
                            checked={formData.contentType?.includes(option.value) || false}
                            onCheckedChange={(checked) => {
                              const current = formData.contentType || []
                              if (checked) {
                                setFormData({ ...formData, contentType: [...current, option.value] })
                              } else {
                                setFormData({ ...formData, contentType: current.filter((t) => t !== option.value) })
                              }
                            }}
                          />
                          <Label htmlFor={`contentType-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="licensesDocumented">{t.ipLicensesDocumented}</Label>
                    <Select
                      value={formData.licensesDocumented || ""}
                      onValueChange={(value) => setFormData({ ...formData, licensesDocumented: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === "es" ? "Seleccionar respuesta" : "Select answer"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completos">{t.ipComplete}</SelectItem>
                        <SelectItem value="parcial">{t.ipPartial}</SelectItem>
                        <SelectItem value="no">{t.no}</SelectItem>
                        <SelectItem value="en-evaluacion">{t.ipInEvaluation}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="risksExplanation">{t.ipRisksExplanation}</Label>
                    <Textarea
                      id="risksExplanation"
                      value={formData.risksExplanation || ""}
                      onChange={(e) => setFormData({ ...formData, risksExplanation: e.target.value })}
                      placeholder={
                        language === "es" ? "Describir riesgos identificados..." : "Describe identified risks..."
                      }
                      rows={3}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="scrapingData">{t.ipScrapingData}</Label>
                <Select
                  value={formData.scrapingData || ""}
                  onValueChange={(value) => setFormData({ ...formData, scrapingData: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === "es" ? "Seleccionar respuesta" : "Select answer"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.scrapingData === "si" && (
                <div className="ml-4">
                  <Label htmlFor="extractionRights">{t.ipExtractionRights}</Label>
                  <Select
                    value={formData.extractionRights || ""}
                    onValueChange={(value) => setFormData({ ...formData, extractionRights: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "es" ? "Seleccionar respuesta" : "Select answer"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">{t.yes}</SelectItem>
                      <SelectItem value="parcial">{t.ipPartial}</SelectItem>
                      <SelectItem value="no">{t.no}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Separator />

            {/* Section C: Titularidad y Licencias de Output */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1bb67e] border-b border-gray-200 pb-2">{t.ipSectionC}</h3>

              <div>
                <Label htmlFor="protectedOutput">{t.ipProtectedOutput}</Label>
                <Select
                  value={formData.protectedOutput || ""}
                  onValueChange={(value) => setFormData({ ...formData, protectedOutput: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === "es" ? "Seleccionar respuesta" : "Select answer"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="desconocido">{t.ipUnknown}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.protectedOutput === "si" && (
                <div className="space-y-4 ml-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label>{t.ipTypeProtection}</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        { value: "copyright", label: t.ipCopyright },
                        { value: "references", label: t.ipReferences },
                        { value: "patentes", label: t.ipPatents },
                        { value: "marcas", label: t.ipTrademarks },
                        { value: "otro", label: t.other },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`typeProtection-${option.value}`}
                            checked={formData.typeProtection?.includes(option.value) || false}
                            onCheckedChange={(checked) => {
                              const current = formData.typeProtection || []
                              if (checked) {
                                setFormData({ ...formData, typeProtection: [...current, option.value] })
                              } else {
                                setFormData({ ...formData, typeProtection: current.filter((t) => t !== option.value) })
                              }
                            }}
                          />
                          <Label htmlFor={`typeProtection-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="explicitLicense">{t.ipExplicitLicense}</Label>
                    <Select
                      value={formData.explicitLicense || ""}
                      onValueChange={(value) => setFormData({ ...formData, explicitLicense: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === "es" ? "Seleccionar respuesta" : "Select answer"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="si">{t.yes}</SelectItem>
                        <SelectItem value="parcial">{t.ipPartial}</SelectItem>
                        <SelectItem value="no">{t.no}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="outputOwnership">{t.ipOutputOwnership}</Label>
                  <Select
                    value={formData.outputOwnership || ""}
                    onValueChange={(value) => setFormData({ ...formData, outputOwnership: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "es" ? "Seleccionar respuesta" : "Select answer"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">{t.yes}</SelectItem>
                      <SelectItem value="parcial">{t.ipPartial}</SelectItem>
                      <SelectItem value="no">{t.no}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contentTraceability">{t.ipContentTraceability}</Label>
                  <Select
                    value={formData.contentTraceability || ""}
                    onValueChange={(value) => setFormData({ ...formData, contentTraceability: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "es" ? "Seleccionar respuesta" : "Select answer"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">{t.yes}</SelectItem>
                      <SelectItem value="parcial">{t.ipPartial}</SelectItem>
                      <SelectItem value="no">{t.no}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Section D: Riesgo Comercial y Conflictos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1bb67e] border-b border-gray-200 pb-2">{t.ipSectionD}</h3>

              <div>
                <Label htmlFor="infringementRisk">{t.ipInfringementRisk}</Label>
                <Select
                  value={formData.infringementRisk || ""}
                  onValueChange={(value) => setFormData({ ...formData, infringementRisk: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === "es" ? "Seleccionar nivel" : "Select level"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alto">{t.ipHighRisk}</SelectItem>
                    <SelectItem value="medio">{t.ipMediumRisk}</SelectItem>
                    <SelectItem value="bajo">{t.ipLowRisk}</SelectItem>
                    <SelectItem value="desconocido">{t.ipUnknown}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.infringementRisk === "alto" || formData.infringementRisk === "medio") && (
                <div>
                  <Label htmlFor="riskDescription">{t.ipRiskDescription}</Label>
                  <Textarea
                    id="riskDescription"
                    value={formData.riskDescription || ""}
                    onChange={(e) => setFormData({ ...formData, riskDescription: e.target.value })}
                    placeholder={
                      language === "es" ? "Describir riesgos y mitigaciones..." : "Describe risks and mitigations..."
                    }
                    rows={3}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="patentMonitoring">{t.ipPatentMonitoring}</Label>
                <Select
                  value={formData.patentMonitoring || ""}
                  onValueChange={(value) => setFormData({ ...formData, patentMonitoring: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === "es" ? "Seleccionar respuesta" : "Select answer"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="parcial">{t.ipPartial}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Section E: Mitigaciones Implementadas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1bb67e] border-b border-gray-200 pb-2">{t.ipSectionE}</h3>

              <div>
                <Label>{t.ipTechnicalControls}</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { value: "filtro-contenido", label: t.ipContentFilter },
                    { value: "post-process", label: t.ipPostProcess },
                    { value: "control-manual", label: t.ipManualControl },
                    { value: "otro", label: t.other },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`technicalControls-${option.value}`}
                        checked={formData.technicalControls?.includes(option.value) || false}
                        onCheckedChange={(checked) => {
                          const current = formData.technicalControls || []
                          if (checked) {
                            setFormData({ ...formData, technicalControls: [...current, option.value] })
                          } else {
                            setFormData({ ...formData, technicalControls: current.filter((t) => t !== option.value) })
                          }
                        }}
                      />
                      <Label htmlFor={`technicalControls-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="defensibilityEvaluations">{t.ipDefensibilityEvaluations}</Label>
                  <Select
                    value={formData.defensibilityEvaluations || ""}
                    onValueChange={(value) => setFormData({ ...formData, defensibilityEvaluations: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "es" ? "Seleccionar respuesta" : "Select answer"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formales">{t.ipFormalEvaluations}</SelectItem>
                      <SelectItem value="parciales">{t.ipPartial}</SelectItem>
                      <SelectItem value="no">{t.no}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="legalAdvice">{t.ipLegalAdvice}</Label>
                  <Select
                    value={formData.legalAdvice || ""}
                    onValueChange={(value) => setFormData({ ...formData, legalAdvice: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "es" ? "Seleccionar respuesta" : "Select answer"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interna">{t.ipInternalAdvice}</SelectItem>
                      <SelectItem value="externa">{t.ipExternalAdvice}</SelectItem>
                      <SelectItem value="no">{t.no}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="termsOfUse">{t.ipTermsOfUse}</Label>
                  <Select
                    value={formData.termsOfUse || ""}
                    onValueChange={(value) => setFormData({ ...formData, termsOfUse: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "es" ? "Seleccionar respuesta" : "Select answer"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">{t.yes}</SelectItem>
                      <SelectItem value="parcial">{t.ipPartial}</SelectItem>
                      <SelectItem value="no">{t.no}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Section F: Transparencia y Documentación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1bb67e] border-b border-gray-200 pb-2">{t.ipSectionF}</h3>

              <div>
                <Label htmlFor="publicReport">{t.ipPublicReport}</Label>
                <Select
                  value={formData.publicReport || ""}
                  onValueChange={(value) => setFormData({ ...formData, publicReport: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === "es" ? "Seleccionar respuesta" : "Select answer"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="parcial">{t.ipPartial}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.publicReport === "si" || formData.publicReport === "parcial") && (
                <div>
                  <Label>{t.ipReportIncludes}</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {[
                      { value: "proposito", label: t.ipPurposeOfUse },
                      { value: "tipos-datos", label: t.ipDataTypesUsed },
                      { value: "licencias", label: t.ipLicenses },
                      { value: "mitigacion", label: t.ipMitigationPoints },
                      { value: "contacto", label: t.ipResponsibleContact },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`reportIncludes-${option.value}`}
                          checked={formData.reportIncludes?.includes(option.value) || false}
                          onCheckedChange={(checked) => {
                            const current = formData.reportIncludes || []
                            if (checked) {
                              setFormData({ ...formData, reportIncludes: [...current, option.value] })
                            } else {
                              setFormData({ ...formData, reportIncludes: current.filter((t) => t !== option.value) })
                            }
                          }}
                        />
                        <Label htmlFor={`reportIncludes-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Section G: Evaluación de Impacto y Medición */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1bb67e] border-b border-gray-200 pb-2">{t.ipSectionG}</h3>

              <div>
                <Label htmlFor="riskLevel">{t.ipRiskLevel}</Label>
                <Select
                  value={formData.riskLevel || ""}
                  onValueChange={(value) => setFormData({ ...formData, riskLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === "es" ? "Seleccionar nivel" : "Select level"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bajo">{t.ipPublicContent}</SelectItem>
                    <SelectItem value="medio">{t.ipSomeDoubts}</SelectItem>
                    <SelectItem value="alto">{t.ipHighConflict}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t.ipRecommendedActions}</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {[
                    { value: "evaluacion-legal", label: t.ipAdditionalLegal },
                    { value: "refuerzo-filtros", label: t.ipFilterReinforcement },
                    { value: "auditoria-post", label: t.ipPostAudit },
                    { value: "terminos-explicitos", label: t.ipExplicitTerms },
                    { value: "publicacion-politica", label: t.ipPolicyPublication },
                    { value: "otro", label: t.other },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`recommendedActions-${option.value}`}
                        checked={formData.recommendedActions?.includes(option.value) || false}
                        onCheckedChange={(checked) => {
                          const current = formData.recommendedActions || []
                          if (checked) {
                            setFormData({ ...formData, recommendedActions: [...current, option.value] })
                          } else {
                            setFormData({ ...formData, recommendedActions: current.filter((t) => t !== option.value) })
                          }
                        }}
                      />
                      <Label htmlFor={`recommendedActions-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {formData.recommendedActions?.includes("otro") && (
                <div>
                  <Label htmlFor="recommendedActionsOther">
                    {language === "es" ? "Especificar otras acciones" : "Specify other actions"}
                  </Label>
                  <Input
                    id="recommendedActionsOther"
                    value={formData.recommendedActionsOther || ""}
                    onChange={(e) => setFormData({ ...formData, recommendedActionsOther: e.target.value })}
                    placeholder={language === "es" ? "Especificar..." : "Specify..."}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              {editingId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    setFormData({
                      projectName: "",
                      responsibleArea: "",
                      lifecyclePhase: "",
                      aiType: "",
                      usageType: "",
                      copyrightData: "",
                      scrapingData: "",
                      protectedOutput: "",
                      outputOwnership: "",
                      contentTraceability: "",
                      infringementRisk: "",
                      patentMonitoring: "",
                      technicalControls: [],
                      defensibilityEvaluations: "",
                      legalAdvice: "",
                      termsOfUse: "",
                      publicReport: "",
                      riskLevel: "",
                      recommendedActions: [],
                    })
                  }}
                >
                  {language === "es" ? "Cancelar" : "Cancel"}
                </Button>
              )}
              <Button onClick={handleSubmit} className="bg-[#1bb67e] hover:bg-[#159f6e]">
                {editingId
                  ? language === "es"
                    ? "Actualizar Evaluación"
                    : "Update Assessment"
                  : language === "es"
                    ? "Guardar Evaluación"
                    : "Save Assessment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeCard === "view" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {language === "es" ? "Evaluaciones Registradas" : "Registered Assessments"}
              <Badge variant="secondary">{assessments.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assessments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {language === "es" ? "No hay evaluaciones registradas" : "No assessments registered"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div key={assessment.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-lg">{assessment.projectName}</h4>
                        <p className="text-sm text-gray-600">{assessment.responsibleArea}</p>
                        <p className="text-xs text-gray-500">{new Date(assessment.timestamp).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRiskBadgeColor(assessment.riskCategory)}>
                          {getRiskIcon(assessment.riskCategory)}
                          <span className="ml-1">
                            {assessment.riskCategory === "low"
                              ? language === "es"
                                ? "Bajo"
                                : "Low"
                              : assessment.riskCategory === "medium"
                                ? language === "es"
                                  ? "Medio"
                                  : "Medium"
                                : language === "es"
                                  ? "Alto"
                                  : "High"}
                          </span>
                        </Badge>
                        <span className="text-sm text-gray-500">{assessment.score}/28</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">{language === "es" ? "Fase:" : "Phase:"}</span>
                        <p className="text-gray-600">{assessment.lifecyclePhase}</p>
                      </div>
                      <div>
                        <span className="font-medium">{language === "es" ? "Tipo IA:" : "AI Type:"}</span>
                        <p className="text-gray-600">{assessment.aiType}</p>
                      </div>
                      <div>
                        <span className="font-medium">{language === "es" ? "Uso:" : "Usage:"}</span>
                        <p className="text-gray-600">{assessment.usageType}</p>
                      </div>
                      <div>
                        <span className="font-medium">{language === "es" ? "Riesgo IP:" : "IP Risk:"}</span>
                        <p className="text-gray-600">{assessment.riskLevel}</p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(assessment)}>
                        <Edit className="h-4 w-4 mr-1" />
                        {language === "es" ? "Editar" : "Edit"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => generatePDFReport(assessment)}>
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(assessment.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        {language === "es" ? "Eliminar" : "Delete"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
