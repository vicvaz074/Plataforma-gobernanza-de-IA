"use client"

import { useState, useEffect } from "react"
<<<<<<< HEAD
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
=======
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
<<<<<<< HEAD
import { Trash2, Download, Edit, Eye, FileText } from "lucide-react"
import jsPDF from "jspdf"
import { Badge } from "@/components/ui/badge"
=======
import { Trash2, Download, Edit, Eye, FileText, CheckCircle2, Info, BookOpen, Shield } from "lucide-react"
import jsPDF from "jspdf"
import { Badge } from "@/components/ui/badge"
import {
  sectionDefinitions,
  standardsBadges,
  usageInstructions,
  useCaseOptions,
  populationOptions,
  personalDataCategoryOptions,
  dataOriginOptions,
  explainabilityOptions,
  securityControlOptions,
  thirdPartyRoleOptions,
  registryContentOptions,
  impactReasonOptions,
  mitigationActionOptions,
  documentationOptions,
} from "./eia-config"
>>>>>>> be37263 (fix: modify EIA module and upgrade it)

interface AlgorithmicAssessmentData {
  id: string
  createdAt: string
  updatedAt: string
<<<<<<< HEAD

  // Section A: Identificación
=======
  version: string
  assessmentDate: string
  systemName: string
  systemResponsible: string
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  projectName: string
  processOwner: string
  lifecyclePhase: string
  deploymentScope: string
  directInteraction: string
  interactionType: string
  interactionTypeOther: string
<<<<<<< HEAD

  // Section B: Propósito y alcance
=======
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  mainPurpose: string
  useCases: string[]
  useCasesOther: string
  affectedPopulations: string[]
  affectedPopulationsOther: string
  significantEffects: string
  effectsDescription: string
<<<<<<< HEAD

  // Section C: Datos
=======
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  personalData: string
  personalDataCategories: string[]
  personalDataCategoriesOther: string
  dataOrigin: string[]
  dataOriginOther: string
  dataMinimization: string
  pseudonymization: string
  multipleSources: string
  sourcesDescription: string
<<<<<<< HEAD

  // Section D: Legitimación y derechos
=======
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  legalBasis: string
  legalBasisOther: string
  transparency: string
  rightsMechanisms: string
  automatedDecisions: string
  appealChannels: string
<<<<<<< HEAD

  // Section E: Modelo y calidad
=======
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  systemType: string
  systemTypeOther: string
  performanceObjectives: string
  trainingDocumentation: string
  biasEvaluations: string
  explainability: string[]
  explainabilityOther: string
  robustnessTests: string
<<<<<<< HEAD

  // Section F: Supervisión y gobernanza
=======
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  autonomyLevel: string
  humanSupervision: string
  designatedResponsibles: string
  decisionLogging: string
<<<<<<< HEAD

  // Section G: Seguridad
=======
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  securityControls: string[]
  securityControlsOther: string
  vulnerabilityManagement: string
  leakageRisks: string
<<<<<<< HEAD

  // Section H: Terceros
=======
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  thirdParties: string
  thirdPartyRole: string[]
  thirdPartyRoleOther: string
  contractClauses: string
<<<<<<< HEAD

  // Section I: Monitoreo y reporting
=======
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  kpis: string
  reviewFrequency: string
  committeeReports: string
  incidentRegistry: string
<<<<<<< HEAD

  // Section J: Transparencia
  transparencyRegistry: string
  registryContent: string[]
  registryContentOther: string

  // Section K: Impacto
=======
  transparencyRegistry: string
  registryContent: string[]
  registryContentOther: string
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  impactLevel: string
  impactReasons: string[]
  impactReasonsOther: string
  mitigationActions: string[]
  mitigationActionsOther: string
<<<<<<< HEAD

  // Section L: Evidencias
=======
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  availableDocumentation: string[]
  availableDocumentationOther: string
  evidenceRepository: string
  evidenceRepositoryOther: string
<<<<<<< HEAD

  // Evidence files
=======
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  evidenceFiles: { [key: string]: File }
}

const initialFormData: AlgorithmicAssessmentData = {
<<<<<<< HEAD
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

=======
  id: "", createdAt: "", updatedAt: "",
  version: "1.0", assessmentDate: new Date().toISOString().split("T")[0],
  systemName: "", systemResponsible: "",
  projectName: "", processOwner: "", lifecyclePhase: "", deploymentScope: "",
  directInteraction: "", interactionType: "", interactionTypeOther: "",
  mainPurpose: "", useCases: [], useCasesOther: "",
  affectedPopulations: [], affectedPopulationsOther: "",
  significantEffects: "", effectsDescription: "",
  personalData: "", personalDataCategories: [], personalDataCategoriesOther: "",
  dataOrigin: [], dataOriginOther: "", dataMinimization: "", pseudonymization: "",
  multipleSources: "", sourcesDescription: "",
  legalBasis: "", legalBasisOther: "", transparency: "", rightsMechanisms: "",
  automatedDecisions: "", appealChannels: "",
  systemType: "", systemTypeOther: "", performanceObjectives: "",
  trainingDocumentation: "", biasEvaluations: "", explainability: [],
  explainabilityOther: "", robustnessTests: "",
  autonomyLevel: "", humanSupervision: "", designatedResponsibles: "", decisionLogging: "",
  securityControls: [], securityControlsOther: "", vulnerabilityManagement: "", leakageRisks: "",
  thirdParties: "", thirdPartyRole: [], thirdPartyRoleOther: "", contractClauses: "",
  kpis: "", reviewFrequency: "", committeeReports: "", incidentRegistry: "",
  transparencyRegistry: "", registryContent: [], registryContentOther: "",
  impactLevel: "", impactReasons: [], impactReasonsOther: "",
  mitigationActions: [], mitigationActionsOther: "",
  availableDocumentation: [], availableDocumentationOther: "",
  evidenceRepository: "", evidenceRepositoryOther: "", evidenceFiles: {},
}

/* ─── Reusable UI helpers ──────────────────────────────────── */
function SectionHeader({ number, title, subtitle }: { number: number; title: string; subtitle: string }) {
  return (
    <div className="rounded-t-xl overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {number}
          </span>
          {title}
        </h3>
        <p className="text-emerald-100 text-sm mt-1 ml-10">{subtitle}</p>
      </div>
    </div>
  )
}

function YesNoSelect({ value, onChange, label, id }: { value: string; onChange: (v: string) => void; label: string; id: string }) {
  const { language } = useLanguage()
  const t = translations[language]
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue placeholder={t.select} /></SelectTrigger>
        <SelectContent>
          <SelectItem value="si">{t.yes}</SelectItem>
          <SelectItem value="no">{t.no}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

function YesPartialNoSelect({ value, onChange, label, id }: { value: string; onChange: (v: string) => void; label: string; id: string }) {
  const { language } = useLanguage()
  const t = translations[language]
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue placeholder={t.select} /></SelectTrigger>
        <SelectContent>
          <SelectItem value="si">{t.yes}</SelectItem>
          <SelectItem value="parcial">{t.partial}</SelectItem>
          <SelectItem value="no">{t.no}</SelectItem>
          <SelectItem value="no-aplica">{t.notApplicable}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

function CheckboxGroup({ options, selected, onChange, idPrefix }: {
  options: { value: string; label: string }[]; selected: string[];
  onChange: (updated: string[]) => void; idPrefix: string
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
      {options.map((opt) => (
        <div key={opt.value} className="flex items-center space-x-2">
          <Checkbox
            id={`${idPrefix}-${opt.value}`}
            checked={selected.includes(opt.value)}
            onCheckedChange={(checked) => {
              if (checked) onChange([...selected, opt.value])
              else onChange(selected.filter((v) => v !== opt.value))
            }}
          />
          <Label htmlFor={`${idPrefix}-${opt.value}`} className="text-sm">{opt.label}</Label>
        </div>
      ))}
    </div>
  )
}

/* ─── Main component ──────────────────────────────────────── */
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
export default function AlgorithmicImpactAssessment() {
  const [activeCard, setActiveCard] = useState<"register" | "view">("register")
  const [formData, setFormData] = useState<AlgorithmicAssessmentData>(initialFormData)
  const [savedAssessments, setSavedAssessments] = useState<AlgorithmicAssessmentData[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
<<<<<<< HEAD
=======
  const [activeSection, setActiveSection] = useState(0)
  const [showInfo, setShowInfo] = useState(true)
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  const { toast } = useToast()
  const { language } = useLanguage()
  const t = translations[language]

  useEffect(() => {
    const saved = localStorage.getItem("algorithmicAssessments")
<<<<<<< HEAD
    if (saved) {
      setSavedAssessments(JSON.parse(saved))
    }
=======
    if (saved) setSavedAssessments(JSON.parse(saved))
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  }, [])

  const saveToLocalStorage = (assessments: AlgorithmicAssessmentData[]) => {
    localStorage.setItem("algorithmicAssessments", JSON.stringify(assessments))
    setSavedAssessments(assessments)
  }

  const calculateScore = (data: AlgorithmicAssessmentData): number => {
    let score = 0
<<<<<<< HEAD

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
=======
    const scoreMap: Record<string, number> = {
      si: 0, yes: 0, parcial: 1, partial: 1, no: 2,
      "no aplica": 0, "not applicable": 0, desconocido: 1, unknown: 1,
      "en evaluacion": 1, "under evaluation": 1,
    }
    const fields = [
      data.personalData, data.dataMinimization, data.pseudonymization, data.multipleSources,
      data.transparency, data.rightsMechanisms, data.performanceObjectives,
      data.trainingDocumentation, data.biasEvaluations, data.robustnessTests,
      data.humanSupervision, data.designatedResponsibles, data.decisionLogging,
      data.vulnerabilityManagement, data.leakageRisks, data.contractClauses,
      data.kpis, data.committeeReports, data.incidentRegistry, data.transparencyRegistry,
    ]
    fields.forEach((f) => { if (f && scoreMap[f.toLowerCase()] !== undefined) score += scoreMap[f.toLowerCase()] })
    return score
  }

  const getRiskLevel = (score: number) => {
    if (score <= 10) return { level: "Bajo", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" }
    if (score <= 25) return { level: "Medio", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" }
    return { level: "Alto", color: "text-red-600", bg: "bg-red-50 border-red-200" }
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  }

  const handleSave = () => {
    if (!formData.projectName.trim()) {
<<<<<<< HEAD
      toast({
        title: t.error || "Error",
        description: t.fillRequiredFields || "Por favor complete los campos requeridos",
        variant: "destructive",
      })
      return
    }

=======
      toast({ title: "Error", description: "Por favor complete los campos requeridos", variant: "destructive" })
      return
    }
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
    const now = new Date().toISOString()
    const assessmentData: AlgorithmicAssessmentData = {
      ...formData,
      id: editingId || Date.now().toString(),
      createdAt: editingId ? formData.createdAt : now,
      updatedAt: now,
    }
<<<<<<< HEAD

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
=======
    let updated: AlgorithmicAssessmentData[]
    if (editingId) {
      updated = savedAssessments.map((a) => (a.id === editingId ? assessmentData : a))
      setEditingId(null)
      toast({ title: "Éxito", description: "Evaluación algorítmica actualizada correctamente" })
    } else {
      updated = [...savedAssessments, assessmentData]
      toast({ title: "Éxito", description: "Evaluación algorítmica guardada correctamente" })
    }
    saveToLocalStorage(updated)
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
    setFormData(initialFormData)
    setActiveCard("view")
  }

<<<<<<< HEAD
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
=======
  const handleEdit = (a: AlgorithmicAssessmentData) => { setFormData(a); setEditingId(a.id); setActiveCard("register") }
  const handleDelete = (id: string) => {
    saveToLocalStorage(savedAssessments.filter((a) => a.id !== id))
    toast({ title: "Éxito", description: "Evaluación eliminada correctamente" })
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
  }

  const generatePDFReport = (assessment: AlgorithmicAssessmentData) => {
    const doc = new jsPDF()
    const score = calculateScore(assessment)
<<<<<<< HEAD
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
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.algorithmicImpactAssessment}</h1>
          <p className="text-gray-600 mt-1">
            Evalúa el impacto algorítmico de tus sistemas de IA con metodología avanzada
          </p>
        </div>
      </div>

      {/* Main Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Register Card */}
        <Card
          className={`cursor-pointer transition-all duration-200 ${
            activeCard === "register" ? "ring-2 ring-green-500 shadow-lg" : "hover:shadow-md"
          }`}
          onClick={() => setActiveCard("register")}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl text-green-700">{t.algorithmicRegisterCard}</CardTitle>
            <CardDescription className="text-sm">
              {t.algorithmicRegisterDescription}
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                <Badge variant="outline" className="text-xs">
                  12 secciones
                </Badge>
                <Badge variant="outline" className="text-xs">
                  50+ preguntas
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Puntuación automática
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Evidencias
                </Badge>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* View Card */}
        <Card
          className={`cursor-pointer transition-all duration-200 ${
            activeCard === "view" ? "ring-2 ring-green-500 shadow-lg" : "hover:shadow-md"
          }`}
          onClick={() => setActiveCard("view")}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl text-green-700">{t.algorithmicViewCard}</CardTitle>
            <CardDescription className="text-sm">
              {t.algorithmicViewDescription}
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                <Badge variant="outline" className="text-xs">
                  {savedAssessments.length} evaluaciones
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Editar
                </Badge>
                <Badge variant="outline" className="text-xs">
                  PDF detallado
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Análisis
                </Badge>
              </div>
            </CardDescription>
=======
    const risk = getRiskLevel(score)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Evaluación de Impacto Algorítmico (EIA)", 20, 20)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Versión: ${assessment.version}`, 20, 30)
    doc.text(`Fecha: ${assessment.assessmentDate}`, 20, 36)
    doc.text(`Proyecto: ${assessment.projectName}`, 20, 42)
    doc.text(`Sistema: ${assessment.systemName}`, 20, 48)
    doc.text(`Responsable: ${assessment.systemResponsible}`, 20, 54)
    doc.text(`Puntuación: ${score} — Nivel de riesgo: ${risk.level}`, 20, 64)
    let y = 80
    const addSection = (title: string, content: string) => {
      if (y > 260) { doc.addPage(); y = 20 }
      doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text(title, 20, y); y += 8
      doc.setFont("helvetica", "normal"); doc.setFontSize(9)
      const lines = doc.splitTextToSize(content || "No especificado", 170)
      doc.text(lines, 20, y); y += lines.length * 5 + 8
    }
    addSection("1. Descripción", `${assessment.projectName} — ${assessment.systemName}`)
    addSection("2. Identificación", `Fase: ${assessment.lifecyclePhase}, Alcance: ${assessment.deploymentScope}`)
    addSection("3. Propósito", assessment.mainPurpose)
    addSection("4. Datos", `Datos personales: ${assessment.personalData}`)
    addSection("5. Legitimación", `Base jurídica: ${assessment.legalBasis}`)
    addSection("6. Modelo", `Tipo: ${assessment.systemType}`)
    addSection("7. Supervisión", `Autonomía: ${assessment.autonomyLevel}`)
    addSection("8. Seguridad", `Vulnerabilidades: ${assessment.vulnerabilityManagement}`)
    addSection("9. Terceros", `Participan: ${assessment.thirdParties}`)
    addSection("10. Monitoreo", `Frecuencia: ${assessment.reviewFrequency}`)
    addSection("11. Transparencia", `Registro: ${assessment.transparencyRegistry}`)
    addSection("12. Impacto", `Nivel: ${assessment.impactLevel}`)
    doc.save(`EIA-${assessment.projectName}-${assessment.assessmentDate}.pdf`)
  }

  const set = (field: keyof AlgorithmicAssessmentData, value: string | string[]) =>
    setFormData((prev) => ({ ...prev, [field]: value } as AlgorithmicAssessmentData))

  const sectionContent = [
    /* ─── Section 1: Descripción ─────────────────────────── */
    <div key="s1" className="space-y-4 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label>Versión *</Label>
          <Input value={formData.version} onChange={(e) => set("version", e.target.value)} placeholder="1.0" />
        </div>
        <div>
          <Label>Fecha *</Label>
          <Input type="date" value={formData.assessmentDate} onChange={(e) => set("assessmentDate", e.target.value)} />
        </div>
        <div>
          <Label>Sistema de IA evaluado *</Label>
          <Input value={formData.systemName} onChange={(e) => set("systemName", e.target.value)} placeholder="Nombre del sistema" />
        </div>
        <div>
          <Label>Responsable del sistema *</Label>
          <Input value={formData.systemResponsible} onChange={(e) => set("systemResponsible", e.target.value)} placeholder="Nombre del responsable" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Nombre del proyecto *</Label>
          <Input value={formData.projectName} onChange={(e) => set("projectName", e.target.value)} placeholder="Nombre del proyecto" />
        </div>
        <div>
          <Label>Propietario del proceso</Label>
          <Input value={formData.processOwner} onChange={(e) => set("processOwner", e.target.value)} placeholder="Propietario del proceso" />
        </div>
      </div>
      <div>
        <Label>Propósito principal del sistema *</Label>
        <Textarea value={formData.mainPurpose} onChange={(e) => set("mainPurpose", e.target.value)} placeholder="Describa el propósito principal y objetivo del sistema de IA" rows={3} />
      </div>
    </div>,

    /* ─── Section 2: Identificación ──────────────────────── */
    <div key="s2" className="space-y-4 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Fase del ciclo de vida</Label>
          <Select value={formData.lifecyclePhase} onValueChange={(v) => set("lifecyclePhase", v)}>
            <SelectTrigger><SelectValue placeholder={t.select} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="descubrimiento">Descubrimiento</SelectItem>
              <SelectItem value="desarrollo">Desarrollo</SelectItem>
              <SelectItem value="prueba-piloto">Prueba piloto</SelectItem>
              <SelectItem value="produccion">Producción</SelectItem>
              <SelectItem value="retiro">Retiro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Alcance de despliegue</Label>
          <Select value={formData.deploymentScope} onValueChange={(v) => set("deploymentScope", v)}>
            <SelectTrigger><SelectValue placeholder={t.select} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="interno">Interno</SelectItem>
              <SelectItem value="externo">Externo</SelectItem>
              <SelectItem value="mixto">Mixto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <YesNoSelect value={formData.directInteraction} onChange={(v) => set("directInteraction", v)} label="¿Interacción directa con personas?" id="directInteraction" />
      </div>
      {formData.directInteraction === "si" && (
        <div>
          <Label>Tipo de interacción</Label>
          <Select value={formData.interactionType} onValueChange={(v) => set("interactionType", v)}>
            <SelectTrigger><SelectValue placeholder={t.select} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="texto-chat">Texto / Chat</SelectItem>
              <SelectItem value="voz">Voz</SelectItem>
              <SelectItem value="imagen-video">Imagen / Video</SelectItem>
              <SelectItem value="formulario-web">Formulario web</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
          {formData.interactionType === "otro" && (
            <Input className="mt-2" value={formData.interactionTypeOther} onChange={(e) => set("interactionTypeOther", e.target.value)} placeholder="Especifique" />
          )}
        </div>
      )}
    </div>,

    /* ─── Section 3: Propósito y alcance ─────────────────── */
    <div key="s3" className="space-y-4 p-6">
      <div>
        <Label>Casos de uso</Label>
        <CheckboxGroup options={useCaseOptions} selected={formData.useCases} onChange={(v) => set("useCases", v)} idPrefix="useCase" />
        {formData.useCases.includes("otro") && (
          <Input className="mt-2" value={formData.useCasesOther} onChange={(e) => set("useCasesOther", e.target.value)} placeholder="Especifique" />
        )}
      </div>
      <div>
        <Label>Poblaciones afectadas</Label>
        <CheckboxGroup options={populationOptions} selected={formData.affectedPopulations} onChange={(v) => set("affectedPopulations", v)} idPrefix="pop" />
        {formData.affectedPopulations.includes("otro") && (
          <Input className="mt-2" value={formData.affectedPopulationsOther} onChange={(e) => set("affectedPopulationsOther", e.target.value)} placeholder="Especifique" />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>¿Efectos significativos sobre personas?</Label>
          <Select value={formData.significantEffects} onValueChange={(v) => set("significantEffects", v)}>
            <SelectTrigger><SelectValue placeholder={t.select} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="si">{t.yes}</SelectItem>
              <SelectItem value="no">{t.no}</SelectItem>
              <SelectItem value="en-evaluacion">En evaluación</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {formData.significantEffects === "si" && (
        <div>
          <Label>Descripción de efectos</Label>
          <Textarea value={formData.effectsDescription} onChange={(e) => set("effectsDescription", e.target.value)} placeholder="Describa los efectos significativos" rows={3} />
        </div>
      )}
    </div>,

    /* ─── Section 4: Datos ───────────────────────────────── */
    <div key="s4" className="space-y-4 p-6">
      <YesNoSelect value={formData.personalData} onChange={(v) => set("personalData", v)} label="¿El sistema procesa datos personales?" id="personalData" />
      {formData.personalData === "si" && (
        <>
          <div>
            <Label>Categorías de datos personales</Label>
            <CheckboxGroup options={personalDataCategoryOptions} selected={formData.personalDataCategories} onChange={(v) => set("personalDataCategories", v)} idPrefix="pdCat" />
            {formData.personalDataCategories.includes("otro") && (
              <Input className="mt-2" value={formData.personalDataCategoriesOther} onChange={(e) => set("personalDataCategoriesOther", e.target.value)} placeholder="Especifique" />
            )}
          </div>
          <div>
            <Label>Origen de los datos</Label>
            <CheckboxGroup options={dataOriginOptions} selected={formData.dataOrigin} onChange={(v) => set("dataOrigin", v)} idPrefix="dataOrig" />
            {formData.dataOrigin.includes("otro") && (
              <Input className="mt-2" value={formData.dataOriginOther} onChange={(e) => set("dataOriginOther", e.target.value)} placeholder="Especifique" />
            )}
          </div>
        </>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <YesPartialNoSelect value={formData.dataMinimization} onChange={(v) => set("dataMinimization", v)} label="¿Se aplica minimización de datos?" id="dataMin" />
        <YesPartialNoSelect value={formData.pseudonymization} onChange={(v) => set("pseudonymization", v)} label="¿Se aplica pseudonimización/anonimización?" id="pseudo" />
      </div>
      <YesNoSelect value={formData.multipleSources} onChange={(v) => set("multipleSources", v)} label="¿Se combinan múltiples fuentes de datos?" id="multiSrc" />
      {formData.multipleSources === "si" && (
        <div><Label>Descripción de fuentes</Label><Textarea value={formData.sourcesDescription} onChange={(e) => set("sourcesDescription", e.target.value)} placeholder="Describa las fuentes" rows={3} /></div>
      )}
    </div>,

    /* ─── Section 5: Legitimación ────────────────────────── */
    <div key="s5" className="space-y-4 p-6">
      <div>
        <Label>Base jurídica del tratamiento</Label>
        <Select value={formData.legalBasis} onValueChange={(v) => set("legalBasis", v)}>
          <SelectTrigger><SelectValue placeholder={t.select} /></SelectTrigger>
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
          <Input className="mt-2" value={formData.legalBasisOther} onChange={(e) => set("legalBasisOther", e.target.value)} placeholder="Especifique" />
        )}
      </div>
      <YesPartialNoSelect value={formData.transparency} onChange={(v) => set("transparency", v)} label="¿Se informa a los interesados sobre el uso de IA?" id="transp" />
      <YesPartialNoSelect value={formData.rightsMechanisms} onChange={(v) => set("rightsMechanisms", v)} label="¿Existen mecanismos para ejercer derechos?" id="rights" />
      <div>
        <Label>¿Se toman decisiones automatizadas con efectos legales?</Label>
        <Select value={formData.automatedDecisions} onValueChange={(v) => set("automatedDecisions", v)}>
          <SelectTrigger><SelectValue placeholder={t.select} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="no">{t.no}</SelectItem>
            <SelectItem value="si-con-revision">Sí, con revisión humana</SelectItem>
            <SelectItem value="si-sin-revision">Sí, sin revisión humana</SelectItem>
            <SelectItem value="en-evaluacion">En evaluación</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Canales de apelación / impugnación</Label>
        <Textarea value={formData.appealChannels} onChange={(e) => set("appealChannels", e.target.value)} placeholder="Describa los canales disponibles" rows={2} />
      </div>
    </div>,

    /* ─── Section 6: Modelo ──────────────────────────────── */
    <div key="s6" className="space-y-4 p-6">
      <div>
        <Label>Tipo de sistema / modelo</Label>
        <Select value={formData.systemType} onValueChange={(v) => set("systemType", v)}>
          <SelectTrigger><SelectValue placeholder={t.select} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ml-supervisado">ML supervisado</SelectItem>
            <SelectItem value="ml-no-supervisado">ML no supervisado</SelectItem>
            <SelectItem value="deep-learning">Deep learning</SelectItem>
            <SelectItem value="llm">LLM / IA generativa</SelectItem>
            <SelectItem value="reglas-experto">Sistema de reglas / experto</SelectItem>
            <SelectItem value="hibrido">Híbrido</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
        {formData.systemType === "otro" && (
          <Input className="mt-2" value={formData.systemTypeOther} onChange={(e) => set("systemTypeOther", e.target.value)} placeholder="Especifique" />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <YesPartialNoSelect value={formData.performanceObjectives} onChange={(v) => set("performanceObjectives", v)} label="¿Se definieron objetivos de rendimiento?" id="perfObj" />
        <YesPartialNoSelect value={formData.trainingDocumentation} onChange={(v) => set("trainingDocumentation", v)} label="¿Existe documentación de entrenamiento?" id="trainDoc" />
      </div>
      <YesPartialNoSelect value={formData.biasEvaluations} onChange={(v) => set("biasEvaluations", v)} label="¿Se realizaron evaluaciones de sesgo?" id="biasEval" />
      <div>
        <Label>Técnicas de explicabilidad utilizadas</Label>
        <CheckboxGroup options={explainabilityOptions} selected={formData.explainability} onChange={(v) => set("explainability", v)} idPrefix="explain" />
        {formData.explainability.includes("otro") && (
          <Input className="mt-2" value={formData.explainabilityOther} onChange={(e) => set("explainabilityOther", e.target.value)} placeholder="Especifique" />
        )}
      </div>
      <YesPartialNoSelect value={formData.robustnessTests} onChange={(v) => set("robustnessTests", v)} label="¿Se realizaron pruebas de robustez?" id="robust" />
    </div>,

    /* ─── Section 7: Supervisión ─────────────────────────── */
    <div key="s7" className="space-y-4 p-6">
      <div>
        <Label>Nivel de autonomía del sistema</Label>
        <Select value={formData.autonomyLevel} onValueChange={(v) => set("autonomyLevel", v)}>
          <SelectTrigger><SelectValue placeholder={t.select} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="asistencia">Asistencia (recomendación)</SelectItem>
            <SelectItem value="semi-autonomo">Semi-autónomo (con aprobación humana)</SelectItem>
            <SelectItem value="autonomo">Autónomo (sin intervención)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <YesPartialNoSelect value={formData.humanSupervision} onChange={(v) => set("humanSupervision", v)} label="¿Existe supervisión humana efectiva?" id="humanSup" />
        <YesPartialNoSelect value={formData.designatedResponsibles} onChange={(v) => set("designatedResponsibles", v)} label="¿Hay responsables designados?" id="desResp" />
      </div>
      <YesPartialNoSelect value={formData.decisionLogging} onChange={(v) => set("decisionLogging", v)} label="¿Se registran las decisiones del sistema?" id="decLog" />
    </div>,

    /* ─── Section 8: Seguridad ───────────────────────────── */
    <div key="s8" className="space-y-4 p-6">
      <div>
        <Label>Controles de seguridad implementados</Label>
        <CheckboxGroup options={securityControlOptions} selected={formData.securityControls} onChange={(v) => set("securityControls", v)} idPrefix="secCtrl" />
        {formData.securityControls.includes("otro") && (
          <Input className="mt-2" value={formData.securityControlsOther} onChange={(e) => set("securityControlsOther", e.target.value)} placeholder="Especifique" />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <YesPartialNoSelect value={formData.vulnerabilityManagement} onChange={(v) => set("vulnerabilityManagement", v)} label="¿Gestión de vulnerabilidades?" id="vulnMgmt" />
        <YesPartialNoSelect value={formData.leakageRisks} onChange={(v) => set("leakageRisks", v)} label="¿Se evaluaron riesgos de fuga de datos?" id="leakRisk" />
      </div>
    </div>,

    /* ─── Section 9: Terceros ────────────────────────────── */
    <div key="s9" className="space-y-4 p-6">
      <YesNoSelect value={formData.thirdParties} onChange={(v) => set("thirdParties", v)} label="¿Participan terceros en el sistema?" id="thirdP" />
      {formData.thirdParties === "si" && (
        <>
          <div>
            <Label>Rol de los terceros</Label>
            <CheckboxGroup options={thirdPartyRoleOptions} selected={formData.thirdPartyRole} onChange={(v) => set("thirdPartyRole", v)} idPrefix="tpRole" />
            {formData.thirdPartyRole.includes("otro") && (
              <Input className="mt-2" value={formData.thirdPartyRoleOther} onChange={(e) => set("thirdPartyRoleOther", e.target.value)} placeholder="Especifique" />
            )}
          </div>
          <YesPartialNoSelect value={formData.contractClauses} onChange={(v) => set("contractClauses", v)} label="¿Existen cláusulas contractuales sobre IA?" id="contract" />
        </>
      )}
    </div>,

    /* ─── Section 10: Monitoreo ──────────────────────────── */
    <div key="s10" className="space-y-4 p-6">
      <YesPartialNoSelect value={formData.kpis} onChange={(v) => set("kpis", v)} label="¿Se definieron KPIs del sistema?" id="kpis" />
      <div>
        <Label>Frecuencia de revisión</Label>
        <Select value={formData.reviewFrequency} onValueChange={(v) => set("reviewFrequency", v)}>
          <SelectTrigger><SelectValue placeholder={t.select} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="mensual">Mensual</SelectItem>
            <SelectItem value="trimestral">Trimestral</SelectItem>
            <SelectItem value="semestral">Semestral</SelectItem>
            <SelectItem value="anual">Anual</SelectItem>
            <SelectItem value="ad-hoc">Ad-hoc</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <YesPartialNoSelect value={formData.committeeReports} onChange={(v) => set("committeeReports", v)} label="¿Se generan informes al comité?" id="comReports" />
        <YesPartialNoSelect value={formData.incidentRegistry} onChange={(v) => set("incidentRegistry", v)} label="¿Existe registro de incidentes?" id="incReg" />
      </div>
    </div>,

    /* ─── Section 11: Transparencia ──────────────────────── */
    <div key="s11" className="space-y-4 p-6">
      <YesPartialNoSelect value={formData.transparencyRegistry} onChange={(v) => set("transparencyRegistry", v)} label="¿Existe un registro público de transparencia?" id="transpReg" />
      {formData.transparencyRegistry === "si" && (
        <div>
          <Label>Contenido del registro</Label>
          <CheckboxGroup options={registryContentOptions} selected={formData.registryContent} onChange={(v) => set("registryContent", v)} idPrefix="regContent" />
          {formData.registryContent.includes("otro") && (
            <Input className="mt-2" value={formData.registryContentOther} onChange={(e) => set("registryContentOther", e.target.value)} placeholder="Especifique" />
          )}
        </div>
      )}
    </div>,

    /* ─── Section 12: Impacto y evidencias ───────────────── */
    <div key="s12" className="space-y-4 p-6">
      <div>
        <Label>Nivel de impacto estimado</Label>
        <Select value={formData.impactLevel} onValueChange={(v) => set("impactLevel", v)}>
          <SelectTrigger><SelectValue placeholder={t.select} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="bajo">Bajo</SelectItem>
            <SelectItem value="medio">Medio</SelectItem>
            <SelectItem value="alto">Alto</SelectItem>
            <SelectItem value="critico">Crítico</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Razones del nivel de impacto</Label>
        <CheckboxGroup options={impactReasonOptions} selected={formData.impactReasons} onChange={(v) => set("impactReasons", v)} idPrefix="impReason" />
        {formData.impactReasons.includes("otro") && (
          <Input className="mt-2" value={formData.impactReasonsOther} onChange={(e) => set("impactReasonsOther", e.target.value)} placeholder="Especifique" />
        )}
      </div>
      <div>
        <Label>Acciones de mitigación</Label>
        <CheckboxGroup options={mitigationActionOptions} selected={formData.mitigationActions} onChange={(v) => set("mitigationActions", v)} idPrefix="mitAction" />
        {formData.mitigationActions.includes("otro") && (
          <Input className="mt-2" value={formData.mitigationActionsOther} onChange={(e) => set("mitigationActionsOther", e.target.value)} placeholder="Especifique" />
        )}
      </div>
      <div>
        <Label>Documentación disponible</Label>
        <CheckboxGroup options={documentationOptions} selected={formData.availableDocumentation} onChange={(v) => set("availableDocumentation", v)} idPrefix="docAvail" />
        {formData.availableDocumentation.includes("otro") && (
          <Input className="mt-2" value={formData.availableDocumentationOther} onChange={(e) => set("availableDocumentationOther", e.target.value)} placeholder="Especifique" />
        )}
      </div>
      <div>
        <Label>Repositorio de evidencias</Label>
        <Select value={formData.evidenceRepository} onValueChange={(v) => set("evidenceRepository", v)}>
          <SelectTrigger><SelectValue placeholder={t.select} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="gestor-documental">Gestor documental interno</SelectItem>
            <SelectItem value="repositorio-codigo">Repositorio código</SelectItem>
            <SelectItem value="servicio-nube">Servicio en la nube</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
        {formData.evidenceRepository === "otro" && (
          <Input className="mt-2" value={formData.evidenceRepositoryOther} onChange={(e) => set("evidenceRepositoryOther", e.target.value)} placeholder="Especifique" />
        )}
      </div>
    </div>,
  ]

  const currentSectionDef = sectionDefinitions[activeSection]

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      {/* ─── Module Header ─────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 p-8 text-white shadow-xl">
        <div className="flex items-start gap-4">
          <div className="bg-white/10 rounded-xl p-3">
            <Shield className="h-10 w-10" />
          </div>
          <div className="flex-1">
            <p className="text-emerald-200 text-sm font-medium tracking-wider uppercase">Plataforma de Gobernanza de Inteligencia Artificial</p>
            <h1 className="text-3xl font-bold mt-1">EVALUACIÓN DE IMPACTO ALGORÍTMICO (EIA)</h1>
            <p className="text-emerald-100 mt-2 text-base">Sistemas de IA y Procesos de Toma de Decisiones Automatizadas</p>
          </div>
        </div>
        {/* Standards badges */}
        <div className="flex flex-wrap gap-3 mt-6">
          {standardsBadges.map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 border border-white/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <div>
                <p className="text-xs font-semibold">{s.label}</p>
                <p className="text-[10px] text-emerald-200">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── About & Instructions (collapsible) ────────────── */}
      {showInfo && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-800">
                <Info className="w-5 h-5" /> Sobre la EIA
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 space-y-2">
              <p>La <strong>Evaluación de Impacto Algorítmico (EIA)</strong> es un proceso estructurado de análisis —previo a la implementación y a lo largo del ciclo de vida del sistema— cuyo objetivo es identificar, evaluar y mitigar los riesgos éticos, legales, sociales y técnicos asociados al uso de <strong>sistemas de inteligencia artificial</strong> y de toma de decisiones automatizadas.</p>
              <p>Este cuestionario forma parte del módulo de <strong>Evaluación de Impacto Algorítmico</strong> de la plataforma Davara Governance, y ha sido diseñado con base en los principales estándares y marcos regulatorios internacionales vigentes.</p>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                <BookOpen className="w-5 h-5" /> Instrucciones de uso
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              <ol className="space-y-1.5 list-decimal list-inside">
                {usageInstructions.map((inst, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: inst }} />
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => setShowInfo(!showInfo)} className="text-gray-500 text-xs">
          {showInfo ? "Ocultar información" : "Mostrar información"}
        </Button>
      </div>

      {/* ─── Mode Selection Cards ──────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className={`cursor-pointer transition-all duration-200 ${activeCard === "register" ? "ring-2 ring-emerald-500 shadow-lg" : "hover:shadow-md"}`} onClick={() => setActiveCard("register")}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center mb-3"><FileText className="h-7 w-7 text-white" /></div>
            <CardTitle className="text-lg text-emerald-700">{editingId ? "Editar evaluación" : "Nueva evaluación"}</CardTitle>
            <div className="flex flex-wrap gap-1.5 justify-center mt-2">
              <Badge variant="outline" className="text-xs">12 secciones</Badge>
              <Badge variant="outline" className="text-xs">50+ preguntas</Badge>
              <Badge variant="outline" className="text-xs">Puntuación automática</Badge>
            </div>
          </CardHeader>
        </Card>
        <Card className={`cursor-pointer transition-all duration-200 ${activeCard === "view" ? "ring-2 ring-emerald-500 shadow-lg" : "hover:shadow-md"}`} onClick={() => setActiveCard("view")}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center mb-3"><Eye className="h-7 w-7 text-white" /></div>
            <CardTitle className="text-lg text-emerald-700">Evaluaciones registradas</CardTitle>
            <div className="flex flex-wrap gap-1.5 justify-center mt-2">
              <Badge variant="outline" className="text-xs">{savedAssessments.length} evaluaciones</Badge>
              <Badge variant="outline" className="text-xs">PDF detallado</Badge>
              <Badge variant="outline" className="text-xs">Análisis de riesgo</Badge>
            </div>
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
          </CardHeader>
        </Card>
      </div>

<<<<<<< HEAD
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
=======
      {/* ─── Register Form ─────────────────────────────────── */}
      {activeCard === "register" && (
        <div className="grid lg:grid-cols-[220px_1fr] gap-6">
          {/* Stepper */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3 px-2">Secciones</p>
              {sectionDefinitions.map((sec, i) => (
                <button key={sec.id} onClick={() => setActiveSection(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2 ${activeSection === i ? "bg-emerald-100 text-emerald-800 font-semibold" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${activeSection === i ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"
                    }`}>{sec.number}</span>
                  <span className="truncate">{sec.title.split(" ").slice(0, 3).join(" ")}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile section selector */}
          <div className="lg:hidden">
            <Select value={String(activeSection)} onValueChange={(v) => setActiveSection(Number(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione sección" />
              </SelectTrigger>
              <SelectContent>
                {sectionDefinitions.map((sec, i) => (
                  <SelectItem key={sec.id} value={String(i)}>{sec.number}. {sec.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active section content */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <SectionHeader number={currentSectionDef.number} title={currentSectionDef.title} subtitle={currentSectionDef.subtitle} />
            <CardContent className="p-0">
              {sectionContent[activeSection]}
              {/* Section navigation */}
              <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
                <Button variant="outline" disabled={activeSection === 0} onClick={() => setActiveSection((s) => s - 1)}>
                  ← Anterior
                </Button>
                <span className="text-sm text-gray-500">{activeSection + 1} / {sectionDefinitions.length}</span>
                {activeSection < sectionDefinitions.length - 1 ? (
                  <Button onClick={() => setActiveSection((s) => s + 1)} className="bg-emerald-600 hover:bg-emerald-700">
                    Siguiente →
                  </Button>
                ) : (
                  <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                    {editingId ? "Actualizar" : "Guardar evaluación"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── View Assessments ──────────────────────────────── */}
      {activeCard === "view" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-700">Evaluaciones registradas</CardTitle>
          </CardHeader>
          <CardContent>
            {savedAssessments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No se encontraron evaluaciones registradas</p>
                <p className="text-gray-400 text-sm mt-1">Cree una nueva evaluación para comenzar</p>
                <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700" onClick={() => setActiveCard("register")}>Nueva evaluación</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedAssessments.map((a) => {
                  const score = calculateScore(a)
                  const risk = getRiskLevel(score)
                  return (
                    <div key={a.id} className={`rounded-xl border-2 p-5 ${risk.bg}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-lg">{a.projectName}</h4>
                            <Badge className={`${risk.color} bg-white border`}>{risk.level}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Sistema: {a.systemName || "—"} • Versión: {a.version}</p>
                          <p className="text-sm text-gray-500">Creado: {new Date(a.createdAt).toLocaleDateString()} • Actualizado: {new Date(a.updatedAt).toLocaleDateString()}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-sm font-medium">Puntuación: {score}</span>
                            <span className={`text-sm font-bold ${risk.color}`}>Nivel de riesgo: {risk.level}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(a)} title="Editar"><Edit className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => generatePDFReport(a)} title="Descargar PDF"><Download className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(a.id)} title="Eliminar" className="hover:bg-red-50 hover:border-red-200"><Trash2 className="h-4 w-4" /></Button>
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
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
