"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
import { Trash2, Download, Edit, Eye, FileText } from "lucide-react"
import jsPDF from "jspdf"

interface AlgorithmicAssessmentData {
  id: string
  createdAt: string
  updatedAt: string

  // Section A: Identificación
  projectName: string
  processOwner: string
  lifecyclePhase: string
  deploymentScope: string
  directInteraction: string
  interactionType: string
  interactionTypeOther: string

  // Section B: Propósito y alcance
  mainPurpose: string
  useCases: string[]
  useCasesOther: string
  affectedPopulations: string[]
  affectedPopulationsOther: string
  significantEffects: string
  effectsDescription: string

  // Section C: Datos
  personalData: string
  personalDataCategories: string[]
  personalDataCategoriesOther: string
  dataOrigin: string[]
  dataOriginOther: string
  dataMinimization: string
  pseudonymization: string
  multipleSources: string
  sourcesDescription: string

  // Section D: Legitimación y derechos
  legalBasis: string
  legalBasisOther: string
  transparency: string
  rightsMechanisms: string
  automatedDecisions: string
  appealChannels: string

  // Section E: Modelo y calidad
  systemType: string
  systemTypeOther: string
  performanceObjectives: string
  trainingDocumentation: string
  biasEvaluations: string
  explainability: string[]
  explainabilityOther: string
  robustnessTests: string

  // Section F: Supervisión y gobernanza
  autonomyLevel: string
  humanSupervision: string
  designatedResponsibles: string
  decisionLogging: string

  // Section G: Seguridad
  securityControls: string[]
  securityControlsOther: string
  vulnerabilityManagement: string
  leakageRisks: string

  // Section H: Terceros
  thirdParties: string
  thirdPartyRole: string[]
  thirdPartyRoleOther: string
  contractClauses: string

  // Section I: Monitoreo y reporting
  kpis: string
  reviewFrequency: string
  committeeReports: string
  incidentRegistry: string

  // Section J: Transparencia
  transparencyRegistry: string
  registryContent: string[]
  registryContentOther: string

  // Section K: Impacto
  impactLevel: string
  impactReasons: string[]
  impactReasonsOther: string
  mitigationActions: string[]
  mitigationActionsOther: string

  // Section L: Evidencias
  availableDocumentation: string[]
  availableDocumentationOther: string
  evidenceRepository: string
  evidenceRepositoryOther: string

  // Evidence files
  evidenceFiles: { [key: string]: File }
}

const initialFormData: AlgorithmicAssessmentData = {
  id: "",
  createdAt: "",
  updatedAt: "",
  projectName: "",
  processOwner: "",
  lifecyclePhase: "",
  deploymentScope: "",
  directInteraction: "",
  interactionType: "",
  interactionTypeOther: "",
  mainPurpose: "",
  useCases: [],
  useCasesOther: "",
  affectedPopulations: [],
  affectedPopulationsOther: "",
  significantEffects: "",
  effectsDescription: "",
  personalData: "",
  personalDataCategories: [],
  personalDataCategoriesOther: "",
  dataOrigin: [],
  dataOriginOther: "",
  dataMinimization: "",
  pseudonymization: "",
  multipleSources: "",
  sourcesDescription: "",
  legalBasis: "",
  legalBasisOther: "",
  transparency: "",
  rightsMechanisms: "",
  automatedDecisions: "",
  appealChannels: "",
  systemType: "",
  systemTypeOther: "",
  performanceObjectives: "",
  trainingDocumentation: "",
  biasEvaluations: "",
  explainability: [],
  explainabilityOther: "",
  robustnessTests: "",
  autonomyLevel: "",
  humanSupervision: "",
  designatedResponsibles: "",
  decisionLogging: "",
  securityControls: [],
  securityControlsOther: "",
  vulnerabilityManagement: "",
  leakageRisks: "",
  thirdParties: "",
  thirdPartyRole: [],
  thirdPartyRoleOther: "",
  contractClauses: "",
  kpis: "",
  reviewFrequency: "",
  committeeReports: "",
  incidentRegistry: "",
  transparencyRegistry: "",
  registryContent: [],
  registryContentOther: "",
  impactLevel: "",
  impactReasons: [],
  impactReasonsOther: "",
  mitigationActions: [],
  mitigationActionsOther: "",
  availableDocumentation: [],
  availableDocumentationOther: "",
  evidenceRepository: "",
  evidenceRepositoryOther: "",
  evidenceFiles: {},
}

export default function AlgorithmicImpactAssessment() {
  const [activeCard, setActiveCard] = useState<"register" | "view">("register")
  const [formData, setFormData] = useState<AlgorithmicAssessmentData>(initialFormData)
  const [savedAssessments, setSavedAssessments] = useState<AlgorithmicAssessmentData[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()
  const { language } = useLanguage()
  const t = translations[language]

  useEffect(() => {
    const saved = localStorage.getItem("algorithmicAssessments")
    if (saved) {
      setSavedAssessments(JSON.parse(saved))
    }
  }, [])

  const saveToLocalStorage = (assessments: AlgorithmicAssessmentData[]) => {
    localStorage.setItem("algorithmicAssessments", JSON.stringify(assessments))
    setSavedAssessments(assessments)
  }

  const calculateScore = (data: AlgorithmicAssessmentData): number => {
    let score = 0

    // Scoring logic: Sí=0, Parcial=1, No=2, No aplica=0, Desconocido=1
    const scoreMap: { [key: string]: number } = {
      si: 0,
      yes: 0,
      parcial: 1,
      partial: 1,
      no: 2,
      "no aplica": 0,
      "not applicable": 0,
      desconocido: 1,
      unknown: 1,
      "en evaluacion": 1,
      "under evaluation": 1,
    }

    // Score all relevant fields
    const fieldsToScore = [
      data.personalData,
      data.dataMinimization,
      data.pseudonymization,
      data.multipleSources,
      data.transparency,
      data.rightsMechanisms,
      data.performanceObjectives,
      data.trainingDocumentation,
      data.biasEvaluations,
      data.robustnessTests,
      data.humanSupervision,
      data.designatedResponsibles,
      data.decisionLogging,
      data.vulnerabilityManagement,
      data.leakageRisks,
      data.contractClauses,
      data.kpis,
      data.committeeReports,
      data.incidentRegistry,
      data.transparencyRegistry,
    ]

    fieldsToScore.forEach((field) => {
      if (field && scoreMap[field.toLowerCase()] !== undefined) {
        score += scoreMap[field.toLowerCase()]
      }
    })

    return score
  }

  const getRiskLevel = (score: number): { level: string; color: string } => {
    if (score <= 20) return { level: t.lowRisk || "Bajo", color: "text-green-600" }
    if (score <= 40) return { level: t.mediumRisk || "Medio", color: "text-yellow-600" }
    return { level: t.highRisk || "Alto", color: "text-red-600" }
  }

  const handleSave = () => {
    if (!formData.projectName.trim()) {
      toast({
        title: t.error || "Error",
        description: t.fillRequiredFields || "Por favor complete los campos requeridos",
        variant: "destructive",
      })
      return
    }

    const now = new Date().toISOString()
    const assessmentData: AlgorithmicAssessmentData = {
      ...formData,
      id: editingId || Date.now().toString(),
      createdAt: editingId ? formData.createdAt : now,
      updatedAt: now,
    }

    let updatedAssessments
    if (editingId) {
      updatedAssessments = savedAssessments.map((assessment) =>
        assessment.id === editingId ? assessmentData : assessment,
      )
      setEditingId(null)
      toast({
        title: t.success || "Éxito",
        description: t.algorithmicAssessmentUpdated || "Evaluación algorítmica actualizada correctamente",
      })
    } else {
      updatedAssessments = [...savedAssessments, assessmentData]
      toast({
        title: t.success || "Éxito",
        description: t.algorithmicAssessmentSaved || "Evaluación algorítmica guardada correctamente",
      })
    }

    saveToLocalStorage(updatedAssessments)
    setFormData(initialFormData)
    setActiveCard("view")
  }

  const handleEdit = (assessment: AlgorithmicAssessmentData) => {
    setFormData(assessment)
    setEditingId(assessment.id)
    setActiveCard("register")
  }

  const handleDelete = (id: string) => {
    const updatedAssessments = savedAssessments.filter((assessment) => assessment.id !== id)
    saveToLocalStorage(updatedAssessments)
    toast({
      title: t.success || "Éxito",
      description: t.algorithmicAssessmentDeleted || "Evaluación algorítmica eliminada correctamente",
    })
  }

  const generatePDFReport = (assessment: AlgorithmicAssessmentData) => {
    const doc = new jsPDF()
    const score = calculateScore(assessment)
    const riskLevel = getRiskLevel(score)

    // Title
    doc.setFontSize(16)
    doc.text("Reporte de Evaluación de Impacto Algorítmico", 20, 20)

    // Basic info
    doc.setFontSize(12)
    doc.text(`Proyecto: ${assessment.projectName}`, 20, 40)
    doc.text(`Fecha: ${new Date(assessment.createdAt).toLocaleDateString()}`, 20, 50)
    doc.text(`Puntuación Total: ${score}`, 20, 60)
    doc.text(`Nivel de Riesgo: ${riskLevel.level}`, 20, 70)

    // Sections summary
    let yPosition = 90
    doc.setFontSize(14)
    doc.text("Resumen por Secciones:", 20, yPosition)
    yPosition += 20

    doc.setFontSize(10)
    const sections = [
      { title: "A. Identificación", content: `${assessment.projectName} - ${assessment.lifecyclePhase}` },
      { title: "B. Propósito", content: assessment.mainPurpose },
      { title: "C. Datos", content: `Datos personales: ${assessment.personalData}` },
      { title: "D. Legitimación", content: `Base jurídica: ${assessment.legalBasis}` },
      { title: "E. Modelo", content: `Tipo: ${assessment.systemType}` },
      { title: "F. Supervisión", content: `Autonomía: ${assessment.autonomyLevel}` },
      { title: "G. Seguridad", content: `Gestión vulnerabilidades: ${assessment.vulnerabilityManagement}` },
      { title: "H. Terceros", content: `Participan terceros: ${assessment.thirdParties}` },
      { title: "I. Monitoreo", content: `Frecuencia revisión: ${assessment.reviewFrequency}` },
      { title: "J. Transparencia", content: `Registro transparencia: ${assessment.transparencyRegistry}` },
      { title: "K. Impacto", content: `Nivel: ${assessment.impactLevel}` },
      { title: "L. Evidencias", content: `Repositorio: ${assessment.evidenceRepository}` },
    ]

    sections.forEach((section) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }
      doc.setFontSize(11)
      doc.text(section.title, 20, yPosition)
      doc.setFontSize(9)
      const splitContent = doc.splitTextToSize(section.content || "No especificado", 170)
      doc.text(splitContent, 20, yPosition + 10)
      yPosition += 10 + splitContent.length * 5 + 5
    })

    doc.save(`evaluacion-impacto-algoritmico-${assessment.projectName}-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  const handleFileUpload = (field: string, file: File) => {
    setFormData((prev) => ({
      ...prev,
      evidenceFiles: {
        ...prev.evidenceFiles,
        [field]: file,
      },
    }))
  }

  const removeFile = (field: string) => {
    setFormData((prev) => {
      const newFiles = { ...prev.evidenceFiles }
      delete newFiles[field]
      return {
        ...prev,
        evidenceFiles: newFiles,
      }
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Register Card */}
        <Card
          className={`flex-1 cursor-pointer transition-all duration-200 ${
            activeCard === "register" ? "ring-2 ring-green-500 shadow-lg" : "hover:shadow-md"
          }`}
          onClick={() => setActiveCard("register")}
        >
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <FileText className="h-5 w-5" />
              {t.algorithmicRegisterCard}
            </CardTitle>
            <CardDescription>{t.algorithmicRegisterDescription}</CardDescription>
          </CardHeader>
        </Card>

        {/* View Card */}
        <Card
          className={`flex-1 cursor-pointer transition-all duration-200 ${
            activeCard === "view" ? "ring-2 ring-green-500 shadow-lg" : "hover:shadow-md"
          }`}
          onClick={() => setActiveCard("view")}
        >
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Eye className="h-5 w-5" />
              {t.algorithmicViewCard}
            </CardTitle>
            <CardDescription>{t.algorithmicViewDescription}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Register Form */}
      {activeCard === "register" && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? t.editAssessment : t.algorithmicRegisterCard}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Section A: Identificación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600">{t.algorithmicSectionA}</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName">{t.algorithmicProjectName} *</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, projectName: e.target.value }))}
                    placeholder={t.algorithmicProjectName}
                  />
                </div>

                <div>
                  <Label htmlFor="processOwner">{t.algorithmicProcessOwner}</Label>
                  <Input
                    id="processOwner"
                    value={formData.processOwner}
                    onChange={(e) => setFormData((prev) => ({ ...prev, processOwner: e.target.value }))}
                    placeholder={t.algorithmicProcessOwner}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="lifecyclePhase">{t.algorithmicLifecyclePhase}</Label>
                  <Select
                    value={formData.lifecyclePhase}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, lifecyclePhase: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.select} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="descubrimiento">{t.algorithmicDiscovery}</SelectItem>
                      <SelectItem value="desarrollo">{t.algorithmicDevelopment}</SelectItem>
                      <SelectItem value="prueba-piloto">{t.algorithmicPilotTest}</SelectItem>
                      <SelectItem value="produccion">{t.algorithmicProduction}</SelectItem>
                      <SelectItem value="retiro">{t.algorithmicRetirement}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="deploymentScope">{t.algorithmicDeploymentScope}</Label>
                  <Select
                    value={formData.deploymentScope}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, deploymentScope: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.select} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interno">{t.algorithmicInternal}</SelectItem>
                      <SelectItem value="externo">{t.algorithmicExternal}</SelectItem>
                      <SelectItem value="mixto">{t.algorithmicMixed}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="directInteraction">{t.algorithmicDirectInteraction}</Label>
                  <Select
                    value={formData.directInteraction}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, directInteraction: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.select} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">{t.yes}</SelectItem>
                      <SelectItem value="no">{t.no}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.directInteraction === "si" && (
                <div>
                  <Label htmlFor="interactionType">{t.algorithmicInteractionType}</Label>
                  <Select
                    value={formData.interactionType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, interactionType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.select} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="texto-chat">{t.algorithmicTextChat}</SelectItem>
                      <SelectItem value="voz">{t.algorithmicVoice}</SelectItem>
                      <SelectItem value="imagen-video">{t.algorithmicImageVideo}</SelectItem>
                      <SelectItem value="formulario-web">{t.algorithmicWebForm}</SelectItem>
                      <SelectItem value="otro">{t.other}</SelectItem>
                    </SelectContent>
                  </Select>

                  {formData.interactionType === "otro" && (
                    <Input
                      className="mt-2"
                      value={formData.interactionTypeOther}
                      onChange={(e) => setFormData((prev) => ({ ...prev, interactionTypeOther: e.target.value }))}
                      placeholder={t.specify}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Section B: Propósito y alcance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600">{t.algorithmicSectionB}</h3>

              <div>
                <Label htmlFor="mainPurpose">{t.algorithmicMainPurpose}</Label>
                <Textarea
                  id="mainPurpose"
                  value={formData.mainPurpose}
                  onChange={(e) => setFormData((prev) => ({ ...prev, mainPurpose: e.target.value }))}
                  placeholder={t.algorithmicMainPurpose}
                  rows={3}
                />
              </div>

              <div>
                <Label>{t.algorithmicUseCases}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                  {[
                    { value: "atencion-cliente", label: t.algorithmicCustomerService },
                    { value: "rrhh", label: t.algorithmicHR },
                    { value: "marketing", label: t.algorithmicMarketing },
                    { value: "riesgo-finanzas", label: t.algorithmicRiskFinance },
                    { value: "salud", label: t.algorithmicHealth },
                    { value: "seguridad-fraude", label: t.algorithmicSecurityFraud },
                    { value: "servicios-publicos", label: t.algorithmicPublicServices },
                    { value: "legal-compliance", label: t.algorithmicLegalCompliance },
                    { value: "operaciones-logistica", label: t.algorithmicOperationsLogistics },
                    { value: "otro", label: t.other },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`useCase-${option.value}`}
                        checked={formData.useCases.includes(option.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData((prev) => ({ ...prev, useCases: [...prev.useCases, option.value] }))
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              useCases: prev.useCases.filter((item) => item !== option.value),
                            }))
                          }
                        }}
                      />
                      <Label htmlFor={`useCase-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>

                {formData.useCases.includes("otro") && (
                  <Input
                    className="mt-2"
                    value={formData.useCasesOther}
                    onChange={(e) => setFormData((prev) => ({ ...prev, useCasesOther: e.target.value }))}
                    placeholder={t.specify}
                  />
                )}
              </div>

              <div>
                <Label>{t.algorithmicAffectedPopulations}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                  {[
                    { value: "empleados", label: t.algorithmicEmployees },
                    { value: "clientes-usuarios", label: t.algorithmicCustomersUsers },
                    { value: "publico-general", label: t.algorithmicGeneralPublic },
                    { value: "proveedores", label: t.algorithmicSuppliers },
                    { value: "otro", label: t.other },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`population-${option.value}`}
                        checked={formData.affectedPopulations.includes(option.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData((prev) => ({
                              ...prev,
                              affectedPopulations: [...prev.affectedPopulations, option.value],
                            }))
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              affectedPopulations: prev.affectedPopulations.filter((item) => item !== option.value),
                            }))
                          }
                        }}
                      />
                      <Label htmlFor={`population-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>

                {formData.affectedPopulations.includes("otro") && (
                  <Input
                    className="mt-2"
                    value={formData.affectedPopulationsOther}
                    onChange={(e) => setFormData((prev) => ({ ...prev, affectedPopulationsOther: e.target.value }))}
                    placeholder={t.specify}
                  />
                )}
              </div>

              <div>
                <Label htmlFor="significantEffects">{t.algorithmicSignificantEffects}</Label>
                <Select
                  value={formData.significantEffects}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, significantEffects: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="en-evaluacion">{t.inEvaluation}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.significantEffects === "si" && (
                <div>
                  <Label htmlFor="effectsDescription">{t.algorithmicEffectsDescription}</Label>
                  <Textarea
                    id="effectsDescription"
                    value={formData.effectsDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, effectsDescription: e.target.value }))}
                    placeholder={t.algorithmicEffectsDescription}
                    rows={3}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600">{t.algorithmicSectionC}</h3>

              <div>
                <Label htmlFor="personalData">{t.algorithmicPersonalData}</Label>
                <Select
                  value={formData.personalData}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, personalData: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="no-se-sabe">{t.unknown}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.personalData === "si" && (
                <>
                  <div>
                    <Label>{t.algorithmicPersonalDataCategories}</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                      {[
                        { value: "identificativos", label: "Identificativos" },
                        { value: "contacto", label: "Contacto" },
                        { value: "financieros", label: "Financieros" },
                        { value: "salud", label: "Salud" },
                        { value: "biometricos", label: "Biométricos" },
                        { value: "menores", label: "Menores" },
                        { value: "comportamiento", label: "Comportamiento/uso" },
                        { value: "geolocalizacion", label: "Geolocalización" },
                        { value: "otro", label: t.other },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`personalDataCategory-${option.value}`}
                            checked={formData.personalDataCategories.includes(option.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData((prev) => ({
                                  ...prev,
                                  personalDataCategories: [...prev.personalDataCategories, option.value],
                                }))
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  personalDataCategories: prev.personalDataCategories.filter(
                                    (item) => item !== option.value,
                                  ),
                                }))
                              }
                            }}
                          />
                          <Label htmlFor={`personalDataCategory-${option.value}`} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>

                    {formData.personalDataCategories.includes("otro") && (
                      <Input
                        className="mt-2"
                        value={formData.personalDataCategoriesOther}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, personalDataCategoriesOther: e.target.value }))
                        }
                        placeholder={t.specify}
                      />
                    )}
                  </div>

                  <div>
                    <Label>{t.algorithmicDataOrigin}</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {[
                        { value: "recogidos-interesado", label: "Recogidos del interesado" },
                        { value: "generados-internamente", label: "Generados internamente" },
                        { value: "proveedores-externos", label: "Proveedores externos" },
                        { value: "datos-publicos", label: "Datos públicos/abiertos" },
                        { value: "sinteticos", label: "Sintéticos" },
                        { value: "otro", label: t.other },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dataOrigin-${option.value}`}
                            checked={formData.dataOrigin.includes(option.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData((prev) => ({
                                  ...prev,
                                  dataOrigin: [...prev.dataOrigin, option.value],
                                }))
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  dataOrigin: prev.dataOrigin.filter((item) => item !== option.value),
                                }))
                              }
                            }}
                          />
                          <Label htmlFor={`dataOrigin-${option.value}`} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>

                    {formData.dataOrigin.includes("otro") && (
                      <Input
                        className="mt-2"
                        value={formData.dataOriginOther}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dataOriginOther: e.target.value }))}
                        placeholder={t.specify}
                      />
                    )}
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="dataMinimization">{t.algorithmicDataMinimization}</Label>
                <Select
                  value={formData.dataMinimization}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, dataMinimization: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="parcial">{t.partial}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="en-evaluacion">{t.inEvaluation}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pseudonymization">{t.algorithmicPseudonymization}</Label>
                <Select
                  value={formData.pseudonymization}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, pseudonymization: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="parcial">{t.partial}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="no-aplica">{t.notApplicable}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="multipleSources">{t.algorithmicMultipleSources}</Label>
                <Select
                  value={formData.multipleSources}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, multipleSources: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.multipleSources === "si" && (
                <div>
                  <Label htmlFor="sourcesDescription">{t.algorithmicSourcesDescription}</Label>
                  <Textarea
                    id="sourcesDescription"
                    value={formData.sourcesDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sourcesDescription: e.target.value }))}
                    placeholder={t.algorithmicSourcesDescription}
                    rows={3}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600">{t.algorithmicSectionD}</h3>

              <div>
                <Label htmlFor="legalBasis">{t.algorithmicLegalBasis}</Label>
                <Select
                  value={formData.legalBasis}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, legalBasis: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contrato">Contrato</SelectItem>
                    <SelectItem value="consentimiento">Consentimiento</SelectItem>
                    <SelectItem value="interes-legitimo">Interés legítimo</SelectItem>
                    <SelectItem value="obligacion-legal">Obligación legal</SelectItem>
                    <SelectItem value="mision-interes-publico">Misión de interés público</SelectItem>
                    <SelectItem value="otra">Otra</SelectItem>
                    <SelectItem value="no-aplica">{t.notApplicable}</SelectItem>
                  </SelectContent>
                </Select>

                {formData.legalBasis === "otra" && (
                  <Input
                    className="mt-2"
                    value={formData.legalBasisOther}
                    onChange={(e) => setFormData((prev) => ({ ...prev, legalBasisOther: e.target.value }))}
                    placeholder={t.specify}
                  />
                )}
              </div>

              <div>
                <Label htmlFor="transparency">{t.algorithmicTransparency}</Label>
                <Select
                  value={formData.transparency}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, transparency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si-completa">Sí, completa y accesible</SelectItem>
                    <SelectItem value="parcial">{t.partial}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="no-aplica">{t.notApplicable}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rightsMechanisms">{t.algorithmicRightsMechanisms}</Label>
                <Select
                  value={formData.rightsMechanisms}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, rightsMechanisms: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si-eficaces">Sí, eficaces</SelectItem>
                    <SelectItem value="parciales">Parciales</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="no-aplica">{t.notApplicable}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="automatedDecisions">{t.algorithmicAutomatedDecisions}</Label>
                <Select
                  value={formData.automatedDecisions}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, automatedDecisions: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="si-con-revision">Sí, con revisión humana</SelectItem>
                    <SelectItem value="si-sin-revision">Sí, sin revisión humana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.automatedDecisions === "si-con-revision" ||
                formData.automatedDecisions === "si-sin-revision") && (
                <div>
                  <Label htmlFor="appealChannels">{t.algorithmicAppealChannels}</Label>
                  <Select
                    value={formData.appealChannels}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, appealChannels: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.select} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">{t.yes}</SelectItem>
                      <SelectItem value="parcial">{t.partial}</SelectItem>
                      <SelectItem value="no">{t.no}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600">{t.algorithmicSectionE}</h3>

              <div>
                <Label htmlFor="systemType">{t.algorithmicSystemType}</Label>
                <Select
                  value={formData.systemType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, systemType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reglas">Reglas</SelectItem>
                    <SelectItem value="ml-tradicional">ML tradicional</SelectItem>
                    <SelectItem value="nlp">Procesamiento de lenguaje (NLP)</SelectItem>
                    <SelectItem value="vision-computador">Visión por computador</SelectItem>
                    <SelectItem value="generativo">Generativo (LLM/imagen/audio)</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>

                {formData.systemType === "otro" && (
                  <Input
                    className="mt-2"
                    value={formData.systemTypeOther}
                    onChange={(e) => setFormData((prev) => ({ ...prev, systemTypeOther: e.target.value }))}
                    placeholder={t.specify}
                  />
                )}
              </div>

              <div>
                <Label htmlFor="performanceObjectives">{t.algorithmicPerformanceObjectives}</Label>
                <Select
                  value={formData.performanceObjectives}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, performanceObjectives: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="parcial">{t.partial}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="trainingDocumentation">{t.algorithmicTrainingDocumentation}</Label>
                <Select
                  value={formData.trainingDocumentation}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, trainingDocumentation: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="parcial">{t.partial}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="biasEvaluations">{t.algorithmicBiasEvaluations}</Label>
                <Select
                  value={formData.biasEvaluations}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, biasEvaluations: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si-con-metricas">Sí, con métricas</SelectItem>
                    <SelectItem value="basicas">Básicas</SelectItem>
                    <SelectItem value="minimas">Mínimas</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t.algorithmicExplainability}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    { value: "explicacion-local", label: "Explicación local por decisión" },
                    { value: "explicacion-global", label: "Explicación global del modelo" },
                    { value: "visualizaciones", label: "Visualizaciones" },
                    { value: "no-aplica", label: t.notApplicable },
                    { value: "otro", label: t.other },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`explainability-${option.value}`}
                        checked={formData.explainability.includes(option.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData((prev) => ({
                              ...prev,
                              explainability: [...prev.explainability, option.value],
                            }))
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              explainability: prev.explainability.filter((item) => item !== option.value),
                            }))
                          }
                        }}
                      />
                      <Label htmlFor={`explainability-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>

                {formData.explainability.includes("otro") && (
                  <Input
                    className="mt-2"
                    value={formData.explainabilityOther}
                    onChange={(e) => setFormData((prev) => ({ ...prev, explainabilityOther: e.target.value }))}
                    placeholder={t.specify}
                  />
                )}
              </div>

              <div>
                <Label htmlFor="robustnessTests">{t.algorithmicRobustnessTests}</Label>
                <Select
                  value={formData.robustnessTests}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, robustnessTests: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si-periodicas">Sí, periódicas</SelectItem>
                    <SelectItem value="ocasionales">Ocasionales</SelectItem>
                    <SelectItem value="escasas">Escasas</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600">{t.algorithmicSectionF}</h3>

              <div>
                <Label htmlFor="autonomyLevel">{t.algorithmicAutonomyLevel}</Label>
                <Select
                  value={formData.autonomyLevel}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, autonomyLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asistido">Asistido</SelectItem>
                    <SelectItem value="recomendacion">Recomendación</SelectItem>
                    <SelectItem value="decision-con-revision">Decisión con revisión</SelectItem>
                    <SelectItem value="decision-sin-revision">Decisión sin revisión</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="humanSupervision">{t.algorithmicHumanSupervision}</Label>
                <Select
                  value={formData.humanSupervision}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, humanSupervision: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="parcial">{t.partial}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="no-aplica">{t.notApplicable}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="designatedResponsibles">{t.algorithmicDesignatedResponsibles}</Label>
                <Select
                  value={formData.designatedResponsibles}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, designatedResponsibles: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="parcial">{t.partial}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="decisionLogging">{t.algorithmicDecisionLogging}</Label>
                <Select
                  value={formData.decisionLogging}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, decisionLogging: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completo">Completo</SelectItem>
                    <SelectItem value="parcial">{t.partial}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600">{t.algorithmicSectionG}</h3>

              <div>
                <Label>{t.algorithmicSecurityControls}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                  {[
                    { value: "cifrado", label: "Cifrado" },
                    { value: "control-acceso", label: "Control de acceso" },
                    { value: "segregacion-ambientes", label: "Segregación de ambientes" },
                    { value: "registro-auditoria", label: "Registro/auditoría" },
                    { value: "hardening", label: "Hardening" },
                    { value: "otro", label: t.other },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`securityControl-${option.value}`}
                        checked={formData.securityControls.includes(option.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData((prev) => ({
                              ...prev,
                              securityControls: [...prev.securityControls, option.value],
                            }))
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              securityControls: prev.securityControls.filter((item) => item !== option.value),
                            }))
                          }
                        }}
                      />
                      <Label htmlFor={`securityControl-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>

                {formData.securityControls.includes("otro") && (
                  <Input
                    className="mt-2"
                    value={formData.securityControlsOther}
                    onChange={(e) => setFormData((prev) => ({ ...prev, securityControlsOther: e.target.value }))}
                    placeholder={t.specify}
                  />
                )}
              </div>

              <div>
                <Label htmlFor="vulnerabilityManagement">{t.algorithmicVulnerabilityManagement}</Label>
                <Select
                  value={formData.vulnerabilityManagement}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, vulnerabilityManagement: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal-probada">Formal y probada</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="borrador">Borrador</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="leakageRisks">{t.algorithmicLeakageRisks}</Label>
                <Select
                  value={formData.leakageRisks}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, leakageRisks: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mitigados-controles">Mitigados con controles</SelectItem>
                    <SelectItem value="mitigados-parcialmente">Mitigados parcialmente</SelectItem>
                    <SelectItem value="no-mitigados">No mitigados</SelectItem>
                    <SelectItem value="no-aplica">{t.notApplicable}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600">{t.algorithmicSectionH}</h3>

              <div>
                <Label htmlFor="thirdParties">{t.algorithmicThirdParties}</Label>
                <Select
                  value={formData.thirdParties}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, thirdParties: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.thirdParties === "si" && (
                <>
                  <div>
                    <Label>{t.algorithmicThirdPartyRole}</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {[
                        { value: "desarrollador", label: "Desarrollador" },
                        { value: "proveedor-datos", label: "Proveedor de datos" },
                        { value: "integrador", label: "Integrador" },
                        { value: "hosting-cloud", label: "Hosting/Cloud" },
                        { value: "vector-db-rag", label: "Vector DB/RAG" },
                        { value: "seguridad", label: "Seguridad" },
                        { value: "auditoria", label: "Auditoría" },
                        { value: "otro", label: t.other },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`thirdPartyRole-${option.value}`}
                            checked={formData.thirdPartyRole.includes(option.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData((prev) => ({
                                  ...prev,
                                  thirdPartyRole: [...prev.thirdPartyRole, option.value],
                                }))
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  thirdPartyRole: prev.thirdPartyRole.filter((item) => item !== option.value),
                                }))
                              }
                            }}
                          />
                          <Label htmlFor={`thirdPartyRole-${option.value}`} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>

                    {formData.thirdPartyRole.includes("otro") && (
                      <Input
                        className="mt-2"
                        value={formData.thirdPartyRoleOther}
                        onChange={(e) => setFormData((prev) => ({ ...prev, thirdPartyRoleOther: e.target.value }))}
                        placeholder={t.specify}
                      />
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contractClauses">{t.algorithmicContractClauses}</Label>
                    <Select
                      value={formData.contractClauses}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, contractClauses: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.select} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="si">{t.yes}</SelectItem>
                        <SelectItem value="parcial">{t.partial}</SelectItem>
                        <SelectItem value="no">{t.no}</SelectItem>
                        <SelectItem value="en-negociacion">En negociación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600">{t.algorithmicSectionI}</h3>

              <div>
                <Label htmlFor="kpis">{t.algorithmicKPIs}</Label>
                <Select
                  value={formData.kpis}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, kpis: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="parcial">{t.partial}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reviewFrequency">{t.algorithmicReviewFrequency}</Label>
                <Select
                  value={formData.reviewFrequency}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, reviewFrequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensual">Mensual</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="semestral">Semestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                    <SelectItem value="ad-hoc">Ad hoc</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="committeeReports">{t.algorithmicCommitteeReports}</Label>
                <Select
                  value={formData.committeeReports}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, committeeReports: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si-periodicos">Sí, periódicos</SelectItem>
                    <SelectItem value="ad-hoc">Ad hoc</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="incidentRegistry">{t.algorithmicIncidentRegistry}</Label>
                <Select
                  value={formData.incidentRegistry}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, incidentRegistry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="parcial">{t.partial}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600">{t.algorithmicSectionJ}</h3>

              <div>
                <Label htmlFor="transparencyRegistry">{t.algorithmicTransparencyRegistry}</Label>
                <Select
                  value={formData.transparencyRegistry}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, transparencyRegistry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">{t.yes}</SelectItem>
                    <SelectItem value="parcial">{t.partial}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="no-aplica">{t.notApplicable}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t.algorithmicRegistryContent}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    { value: "proposito", label: "Propósito" },
                    { value: "datos-usados", label: "Datos usados" },
                    { value: "logica-general", label: "Lógica general" },
                    { value: "riesgos-mitigaciones", label: "Riesgos/mitigaciones" },
                    { value: "contacto-responsable", label: "Contacto responsable" },
                    { value: "no-aplica", label: t.notApplicable },
                    { value: "otro", label: t.other },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`registryContent-${option.value}`}
                        checked={formData.registryContent.includes(option.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData((prev) => ({
                              ...prev,
                              registryContent: [...prev.registryContent, option.value],
                            }))
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              registryContent: prev.registryContent.filter((item) => item !== option.value),
                            }))
                          }
                        }}
                      />
                      <Label htmlFor={`registryContent-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>

                {formData.registryContent.includes("otro") && (
                  <Input
                    className="mt-2"
                    value={formData.registryContentOther}
                    onChange={(e) => setFormData((prev) => ({ ...prev, registryContentOther: e.target.value }))}
                    placeholder={t.specify}
                  />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600">{t.algorithmicSectionK}</h3>

              <div>
                <Label htmlFor="impactLevel">{t.algorithmicImpactLevel}</Label>
                <Select
                  value={formData.impactLevel}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, impactLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bajo">Bajo</SelectItem>
                    <SelectItem value="medio">Medio</SelectItem>
                    <SelectItem value="alto">Alto</SelectItem>
                    <SelectItem value="critico">Crítico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t.algorithmicImpactReasons}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    { value: "datos-sensibles", label: "Datos sensibles/biométricos" },
                    { value: "menores-vulnerables", label: "Menores/grupos vulnerables" },
                    { value: "efectos-legales", label: "Decisiones con efectos legales" },
                    { value: "escala", label: "Escala (volumen/frecuencia)" },
                    { value: "entorno-sensible", label: "Entorno sensible (salud/finanzas/empleo/público)" },
                    { value: "otro", label: t.other },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`impactReason-${option.value}`}
                        checked={formData.impactReasons.includes(option.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData((prev) => ({
                              ...prev,
                              impactReasons: [...prev.impactReasons, option.value],
                            }))
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              impactReasons: prev.impactReasons.filter((item) => item !== option.value),
                            }))
                          }
                        }}
                      />
                      <Label htmlFor={`impactReason-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>

                {formData.impactReasons.includes("otro") && (
                  <Input
                    className="mt-2"
                    value={formData.impactReasonsOther}
                    onChange={(e) => setFormData((prev) => ({ ...prev, impactReasonsOther: e.target.value }))}
                    placeholder={t.specify}
                  />
                )}
              </div>

              <div>
                <Label>{t.algorithmicMitigationActions}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    { value: "eipd-dpia", label: "EIPD/DPIA completa" },
                    { value: "pruebas-sesgo", label: "Pruebas de sesgo reforzadas" },
                    { value: "supervision-humana", label: "Aumentar supervisión humana" },
                    { value: "explicabilidad", label: "Mejorar explicabilidad" },
                    { value: "seguridad", label: "Fortalecer seguridad/response" },
                    { value: "contratos", label: "Revisar contratos" },
                    { value: "otro", label: t.other },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mitigationAction-${option.value}`}
                        checked={formData.mitigationActions.includes(option.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData((prev) => ({
                              ...prev,
                              mitigationActions: [...prev.mitigationActions, option.value],
                            }))
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              mitigationActions: prev.mitigationActions.filter((item) => item !== option.value),
                            }))
                          }
                        }}
                      />
                      <Label htmlFor={`mitigationAction-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>

                {formData.mitigationActions.includes("otro") && (
                  <Input
                    className="mt-2"
                    value={formData.mitigationActionsOther}
                    onChange={(e) => setFormData((prev) => ({ ...prev, mitigationActionsOther: e.target.value }))}
                    placeholder={t.specify}
                  />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600">{t.algorithmicSectionL}</h3>

              <div>
                <Label>{t.algorithmicAvailableDocumentation}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    { value: "politicas", label: "Políticas" },
                    { value: "model-dataset-cards", label: "Model/Dataset cards" },
                    { value: "arquitectura", label: "Arquitectura" },
                    { value: "manual-usuario", label: "Manual de usuario" },
                    { value: "resultados-pruebas", label: "Resultados de pruebas (sesgo/robustez)" },
                    { value: "plan-incidentes", label: "Plan de incidentes" },
                    { value: "contratos-dpa", label: "Contratos/DPA" },
                    { value: "otro", label: t.other },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`documentation-${option.value}`}
                        checked={formData.availableDocumentation.includes(option.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData((prev) => ({
                              ...prev,
                              availableDocumentation: [...prev.availableDocumentation, option.value],
                            }))
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              availableDocumentation: prev.availableDocumentation.filter(
                                (item) => item !== option.value,
                              ),
                            }))
                          }
                        }}
                      />
                      <Label htmlFor={`documentation-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>

                {formData.availableDocumentation.includes("otro") && (
                  <Input
                    className="mt-2"
                    value={formData.availableDocumentationOther}
                    onChange={(e) => setFormData((prev) => ({ ...prev, availableDocumentationOther: e.target.value }))}
                    placeholder={t.specify}
                  />
                )}
              </div>

              <div>
                <Label htmlFor="evidenceRepository">{t.algorithmicEvidenceRepository}</Label>
                <Select
                  value={formData.evidenceRepository}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, evidenceRepository: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gestor-documental">Gestor documental interno</SelectItem>
                    <SelectItem value="repositorio-codigo">Repositorio código</SelectItem>
                    <SelectItem value="servicio-nube">Servicio en la nube</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>

                {formData.evidenceRepository === "otro" && (
                  <Input
                    className="mt-2"
                    value={formData.evidenceRepositoryOther}
                    onChange={(e) => setFormData((prev) => ({ ...prev, evidenceRepositoryOther: e.target.value }))}
                    placeholder={t.specify}
                  />
                )}
              </div>
            </div>

            {/* Continue with remaining sections... */}
            {/* For brevity, I'll include the key sections. The full implementation would include all 12 sections */}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleSave} className="flex-1">
                {editingId ? t.update : t.save}
              </Button>
              {editingId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData(initialFormData)
                    setEditingId(null)
                  }}
                  className="flex-1 sm:flex-none"
                >
                  {t.cancel}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Assessments */}
      {activeCard === "view" && (
        <Card>
          <CardHeader>
            <CardTitle>{t.algorithmicViewCard}</CardTitle>
          </CardHeader>
          <CardContent>
            {savedAssessments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {t.noAssessmentsFound || "No se encontraron evaluaciones registradas"}
              </p>
            ) : (
              <div className="space-y-4">
                {savedAssessments.map((assessment) => {
                  const score = calculateScore(assessment)
                  const riskLevel = getRiskLevel(score)

                  return (
                    <div key={assessment.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{assessment.projectName}</h4>
                          <p className="text-sm text-gray-600">
                            {t.created}: {new Date(assessment.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm">
                            {t.lifecyclePhase}: {assessment.lifecyclePhase}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm">
                              {t.score || "Puntuación"}: {score}
                            </span>
                            <span className={`text-sm font-semibold ${riskLevel.color}`}>
                              {t.riskLevel || "Riesgo"}: {riskLevel.level}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(assessment)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => generatePDFReport(assessment)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(assessment.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
