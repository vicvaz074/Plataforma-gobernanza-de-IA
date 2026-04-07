"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
import { GeneralTabShell, type GeneralTabShellBadge, type GeneralTabShellNavItem } from "@/components/general-tab-shell"
import { Trash2, Download, Edit, Eye, FileText } from "lucide-react"
import jsPDF from "jspdf"
import { Badge } from "@/components/ui/badge"
import {
  sectionDefinitions,
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

interface AlgorithmicAssessmentData {
  id: string
  createdAt: string
  updatedAt: string
  version: string
  assessmentDate: string
  systemName: string
  systemResponsible: string
  projectName: string
  processOwner: string
  lifecyclePhase: string
  deploymentScope: string
  directInteraction: string
  interactionType: string
  interactionTypeOther: string
  mainPurpose: string
  useCases: string[]
  useCasesOther: string
  affectedPopulations: string[]
  affectedPopulationsOther: string
  significantEffects: string
  effectsDescription: string
  personalData: string
  personalDataCategories: string[]
  personalDataCategoriesOther: string
  dataOrigin: string[]
  dataOriginOther: string
  dataMinimization: string
  pseudonymization: string
  multipleSources: string
  sourcesDescription: string
  legalBasis: string
  legalBasisOther: string
  transparency: string
  rightsMechanisms: string
  automatedDecisions: string
  appealChannels: string
  systemType: string
  systemTypeOther: string
  performanceObjectives: string
  trainingDocumentation: string
  biasEvaluations: string
  explainability: string[]
  explainabilityOther: string
  robustnessTests: string
  autonomyLevel: string
  humanSupervision: string
  designatedResponsibles: string
  decisionLogging: string
  securityControls: string[]
  securityControlsOther: string
  vulnerabilityManagement: string
  leakageRisks: string
  thirdParties: string
  thirdPartyRole: string[]
  thirdPartyRoleOther: string
  contractClauses: string
  kpis: string
  reviewFrequency: string
  committeeReports: string
  incidentRegistry: string
  transparencyRegistry: string
  registryContent: string[]
  registryContentOther: string
  impactLevel: string
  impactReasons: string[]
  impactReasonsOther: string
  mitigationActions: string[]
  mitigationActionsOther: string
  availableDocumentation: string[]
  availableDocumentationOther: string
  evidenceRepository: string
  evidenceRepositoryOther: string
  evidenceFiles: { [key: string]: File }
}

const initialFormData: AlgorithmicAssessmentData = {
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
    <div className="border-b border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/45 px-6 py-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))]/12 text-sm font-semibold text-[hsl(var(--brand-deep))]">
          {number}
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{subtitle}</p>
        </div>
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
export default function AlgorithmicImpactAssessment() {
  const [activeCard, setActiveCard] = useState<"register" | "view">("register")
  const [formData, setFormData] = useState<AlgorithmicAssessmentData>(initialFormData)
  const [savedAssessments, setSavedAssessments] = useState<AlgorithmicAssessmentData[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState(0)
  const { toast } = useToast()
  const { language } = useLanguage()
  const t = translations[language]

  useEffect(() => {
    const saved = localStorage.getItem("algorithmicAssessments")
    if (saved) setSavedAssessments(JSON.parse(saved))
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

  const getRiskLevel = (score: number): { level: string; badgeClass: string; dotClass: string; textClass: string } => {
    if (score <= 10) {
      return {
        level: "Bajo riesgo",
        badgeClass: "border-transparent bg-[hsl(var(--primary))]/12 text-[hsl(var(--brand-deep))]",
        dotClass: "bg-[hsl(var(--primary))]",
        textClass: "text-[hsl(var(--brand-deep))]",
      }
    }
    if (score <= 25) {
      return {
        level: "Riesgo medio",
        badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
        dotClass: "bg-amber-500",
        textClass: "text-amber-700",
      }
    }
    return {
      level: "Alto riesgo",
      badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
      dotClass: "bg-rose-500",
      textClass: "text-rose-700",
    }
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

    saveToLocalStorage(
      editingId
        ? savedAssessments.map(a => (a.id === editingId ? assessmentData : a))
        : [...savedAssessments, assessmentData]
    )

    setEditingId(null)
    setFormData(initialFormData)
    setActiveCard("view")

    toast({
      title: t.success || "Éxito",
      description: editingId
        ? t.algorithmicAssessmentUpdated || "Evaluación algorítmica actualizada correctamente"
        : t.algorithmicAssessmentSaved || "Evaluación algorítmica guardada correctamente"
    })
  }

  const handleEdit = (a: AlgorithmicAssessmentData) => { setFormData(a); setEditingId(a.id); setActiveCard("register") }
  const handleDelete = (id: string) => {
    saveToLocalStorage(savedAssessments.filter((a) => a.id !== id))
    toast({ title: "Éxito", description: "Evaluación eliminada correctamente" })
  }

  const generatePDFReport = (assessment: AlgorithmicAssessmentData) => {
    const doc = new jsPDF()
    const score = calculateScore(assessment)
    const riskLevel = getRiskLevel(score)
    let yPosition = 20

    const addSection = (title: string, content: string | string[]) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }
      doc.setFontSize(12)
      doc.setTextColor(1, 167, 158)
      doc.text(title, 20, yPosition)
      yPosition += 10
      doc.setFontSize(10)
      doc.setTextColor(31, 41, 55)
      const text = Array.isArray(content) ? content.join(", ") : (content || "No especificado")
      const splitText = doc.splitTextToSize(text, 170)
      doc.text(splitText, 20, yPosition)
      yPosition += splitText.length * 5 + 10
    }

    // Header
    doc.setFontSize(18)
    doc.setTextColor(1, 139, 132)
    doc.text("Evaluación de Impacto Algorítmico (EIA)", 20, yPosition)
    yPosition += 15

    doc.setFontSize(10)
    doc.setTextColor(107, 114, 128) // Gray-500
    doc.text(`ID: ${assessment.id} | Fecha: ${new Date(assessment.updatedAt).toLocaleDateString()}`, 20, yPosition)
    yPosition += 15

    // Risk Summary Box
    doc.setDrawColor(209, 213, 219)
    doc.setFillColor(243, 244, 246)
    doc.rect(20, yPosition, 170, 30, "FD")
    doc.setFontSize(11)
    doc.setTextColor(31, 41, 55)
    doc.text(`Puntuación de Riesgo: ${score}`, 30, yPosition + 12)
    doc.setFontSize(14)
    doc.text(`Nivel de Riesgo: ${riskLevel.level}`, 30, yPosition + 22)
    yPosition += 45

    // Sections
    addSection("A. Identificación", [
      `Nombre: ${assessment.systemName}`,
      `Versión: ${assessment.version}`,
      `Responsable: ${assessment.systemResponsible}`,
      `Proyecto: ${assessment.projectName}`,
      `Propietario: ${assessment.processOwner}`
    ])

    addSection("B. Propósito y Alcance", [
      `Fase: ${assessment.lifecyclePhase}`,
      `Alcance: ${assessment.deploymentScope}`,
      `Interacción directa: ${assessment.directInteraction}`,
      `Propósito: ${assessment.mainPurpose}`,
      `Casos de uso: ${assessment.useCases.join(", ")}`
    ])

    addSection("C. Datos", [
      `Procesa datos personales: ${assessment.personalData}`,
      `Categorías: ${assessment.personalDataCategories.join(", ")}`,
      `Minimización: ${assessment.dataMinimization}`,
      `Pseudonimización: ${assessment.pseudonymization}`
    ])

    addSection("D. Legitimación y Derechos", [
      `Base jurídica: ${assessment.legalBasis}`,
      `Transparencia: ${assessment.transparency}`,
      `Mecanismos derechos: ${assessment.rightsMechanisms}`,
      `Decisiones automatizadas: ${assessment.automatedDecisions}`
    ])

    addSection("E. Modelo y Calidad", [
      `Tipo: ${assessment.systemType}`,
      `Objetivos rendimiento: ${assessment.performanceObjectives}`,
      `Sesgos: ${assessment.biasEvaluations}`,
      `Explicabilidad: ${assessment.explainability.join(", ")}`
    ])

    addSection("F. Supervisión y Gobernanza", [
      `Autonomía: ${assessment.autonomyLevel}`,
      `Supervisión humana: ${assessment.humanSupervision}`,
      `Responsables: ${assessment.designatedResponsibles}`
    ])

    addSection("G. Seguridad", [
      `Controles: ${assessment.securityControls.join(", ")}`,
      `Vulnerabilidades: ${assessment.vulnerabilityManagement}`,
      `Fugas: ${assessment.leakageRisks}`
    ])

    addSection("H. Terceros", [
      `Participan terceros: ${assessment.thirdParties}`,
      `Roles: ${assessment.thirdPartyRole.join(", ")}`,
      `Cláusulas: ${assessment.contractClauses}`
    ])

    addSection("I. Monitoreo", [
      `Frecuencia: ${assessment.reviewFrequency}`,
      `Informes: ${assessment.committeeReports}`,
      `Incidentes: ${assessment.incidentRegistry}`
    ])

    addSection("J. Transparencia", [
      `Registro público: ${assessment.transparencyRegistry}`,
      `Contenido: ${assessment.registryContent.join(", ")}`
    ])

    addSection("K. Impacto", [
      `Nivel estimado: ${assessment.impactLevel}`,
      `Razones: ${assessment.impactReasons.join(", ")}`,
      `Mitigación: ${assessment.mitigationActions.join(", ")}`
    ])

    doc.save(`EIA-Reporte-${assessment.projectName}-${new Date().toISOString().split("T")[0]}.pdf`)
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
  const navItems: GeneralTabShellNavItem[] = [
    { id: "register", label: editingId ? "Editar evaluación" : "Registrar evaluación", mobileLabel: "Registrar", icon: FileText },
    { id: "view", label: "Evaluaciones registradas", mobileLabel: "Guardadas", icon: Eye, badge: savedAssessments.length || undefined },
  ]
  const headerBadges: GeneralTabShellBadge[] = [
    { label: `${sectionDefinitions.length} secciones`, tone: "neutral" },
    { label: `${savedAssessments.length} evaluaciones`, tone: "primary" },
  ]
  const primaryButtonClass = "bg-[#01A79E] text-white hover:bg-[#018b84]"
  const outlineButtonClass = "border-[hsl(var(--brand-border))] text-[hsl(var(--brand-deep))]"

  if (editingId) {
    headerBadges.push({ label: "Edición activa", tone: "warning" })
  }

  return (
    <GeneralTabShell
      moduleLabel="Gobernanza IA"
      moduleTitle="Evaluación de impacto algorítmico"
      moduleDescription="Análisis estructurado de riesgos éticos, legales, sociales y técnicos asociados al uso de sistemas de IA y decisiones automatizadas."
      pageLabel={activeCard === "register" ? "Registrar evaluación" : "Evaluaciones registradas"}
      pageTitle={activeCard === "register" ? (editingId ? "Editar evaluación algorítmica" : "Nueva evaluación algorítmica") : "Evaluaciones registradas"}
      pageDescription={
        activeCard === "register"
          ? "Cuestionario guiado con puntuación automática, evidencia y seguimiento por secciones."
          : "Consulta, edita y exporta las evaluaciones algorítmicas guardadas."
      }
      navItems={navItems}
      activeNavId={activeCard}
      onNavSelect={(itemId) => setActiveCard(itemId as "register" | "view")}
      headerBadges={headerBadges}
      backHref="/dashboard"
      backLabel="Volver al panel"
    >
      {activeCard === "register" && (
        <div className="grid gap-6 lg:grid-cols-[208px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <div className="sticky top-24 rounded-[28px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/55 p-3 shadow-sm">
              <p className="px-2 pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--brand-deep))]/55">
                Secciones
              </p>
              <div className="space-y-1.5">
                {sectionDefinitions.map((sec, i) => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(i)}
                    className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition-all ${
                      activeSection === i
                        ? "bg-white text-[hsl(var(--brand-deep))] shadow-sm"
                        : "text-slate-500 hover:bg-white/80 hover:text-slate-900"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                        activeSection === i
                          ? "bg-[hsl(var(--primary))]/12 text-[hsl(var(--brand-deep))]"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {sec.number}
                    </span>
                    <span className="min-w-0 flex-1 whitespace-normal text-[12px] leading-4">{sec.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="lg:hidden">
              <div className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/45 p-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--brand-deep))]/55">
                  Sección actual
                </p>
                <Select value={String(activeSection)} onValueChange={(v) => setActiveSection(Number(v))}>
                  <SelectTrigger className="border-[hsl(var(--brand-border))] bg-white">
                    <SelectValue placeholder="Seleccione sección" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionDefinitions.map((sec, i) => (
                      <SelectItem key={sec.id} value={String(i)}>
                        {sec.number}. {sec.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="overflow-hidden rounded-[28px] border border-[hsl(var(--brand-border))] shadow-sm">
              <SectionHeader number={currentSectionDef.number} title={currentSectionDef.title} subtitle={currentSectionDef.subtitle} />
              <CardContent className="p-0">
                {sectionContent[activeSection]}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/30 px-6 py-4">
                  <Button
                    variant="outline"
                    disabled={activeSection === 0}
                    onClick={() => setActiveSection((s) => s - 1)}
                    className={outlineButtonClass}
                  >
                    ← Anterior
                  </Button>
                  <span className="text-sm font-medium text-slate-500">
                    Sección {activeSection + 1} de {sectionDefinitions.length}
                  </span>
                  {activeSection < sectionDefinitions.length - 1 ? (
                    <Button onClick={() => setActiveSection((s) => s + 1)} className={primaryButtonClass}>
                      Siguiente →
                    </Button>
                  ) : (
                    <Button onClick={handleSave} className={primaryButtonClass}>
                      {editingId ? "Actualizar" : "Guardar evaluación"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeCard === "view" && (
        <Card className="rounded-[28px] border border-[hsl(var(--brand-border))] shadow-sm">
          <CardHeader className="border-b border-[hsl(var(--brand-border))]">
            <CardTitle className="text-[hsl(var(--brand-deep))]">Evaluaciones registradas</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {savedAssessments.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                <p className="text-lg text-slate-600">No se encontraron evaluaciones registradas</p>
                <p className="mt-1 text-sm text-slate-400">Cree una nueva evaluación para comenzar</p>
                <Button className={`mt-4 ${primaryButtonClass}`} onClick={() => setActiveCard("register")}>
                  Nueva evaluación
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedAssessments.map((a) => {
                  const score = calculateScore(a)
                  const risk = getRiskLevel(score)
                  return (
                    <div
                      key={a.id}
                      className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="text-lg font-semibold text-slate-950">{a.projectName}</h4>
                            <Badge className={`border ${risk.badgeClass}`}>{risk.level}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-slate-600">
                            Sistema: {a.systemName || "—"} • Versión: {a.version}
                          </p>
                          <p className="text-sm text-slate-500">
                            Creado: {new Date(a.createdAt).toLocaleDateString()} • Actualizado:{" "}
                            {new Date(a.updatedAt).toLocaleDateString()}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-4">
                            <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                              <span className={`h-2.5 w-2.5 rounded-full ${risk.dotClass}`} />
                              Puntuación: {score}
                            </span>
                            <span className={`text-sm font-semibold ${risk.textClass}`}>Nivel de riesgo: {risk.level}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 xl:ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(a)}
                            title="Editar"
                            className={outlineButtonClass}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generatePDFReport(a)}
                            title="Descargar PDF"
                            className={outlineButtonClass}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(a.id)}
                            title="Eliminar"
                            className="hover:border-red-200 hover:bg-red-50"
                          >
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
    </GeneralTabShell>
  )
}
