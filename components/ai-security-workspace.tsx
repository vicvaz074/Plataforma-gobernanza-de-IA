"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  BookMarked,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Download,
  FileSpreadsheet,
  Lock,
  Plus,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react"

import { GeneralTabShell, type GeneralTabShellBadge, type GeneralTabShellNavItem } from "@/components/general-tab-shell"
import { ModuleSubnav } from "@/components/module-subnav"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  AI_SECURITY_CROSS_REFERENCE,
  AI_SECURITY_DOMAINS,
  AI_SECURITY_SEEDED_CONTROLS,
  type AISecurityAssessmentDraft,
  type AISecurityAssessmentSnapshot,
  type AISecurityAssessmentStore,
  type AISecurityControl,
  type AISecurityControlResponse,
  type AISecurityControlWeight,
  type AISecurityCrossReferenceRow,
  type AISecurityDomainId,
  type AISecurityEvidenceKind,
  type AISecurityEvidenceRef,
  type AISecurityRemediationItem,
  archiveDraft,
  buildRemediationPlan,
  calculateAssessmentSummary,
  createAssessmentId,
  createEmptyDraft,
  formatScore,
  getApplicableControls,
  getAssessmentStore,
  getControlCatalog,
  getDomainById,
  getLevelMeta,
  getSelectedSystemId,
  saveAssessmentStore,
  saveControlCatalog,
  saveSelectedSystemId,
  withNormalizedResponses,
} from "@/lib/ai-security"
import { useLanguage } from "@/lib/LanguageContext"
import { cn } from "@/lib/utils"

type WorkspaceTab = "dashboard" | "assessment" | "catalog" | "report"
type CatalogView = "controls" | "cross-reference"

type RegistrySystemSummary = {
  id: string
  systemName: string
  systemVersion?: string
  systemStage?: string
  globalRiskLevel?: string
  internalOwner?: string
  responsibleArea?: string
  companyName?: string
  systemDescription?: string
}

type CustomControlForm = {
  controlId: string
  title: string
  question: string
  description: string
  domainId: AISecurityDomainId
  requiredLevel: number
  weight: AISecurityControlWeight
  implementationType: AISecurityControl["implementationType"]
  frameworks: string
  evidence: string
  guide: string
}

const STORAGE_EVENT = "ai-security-storage-updated"

const moduleCopy = {
  es: {
    moduleLabel: "Gobernanza IA",
    moduleTitle: "Seguridad de sistemas de IA",
    moduleDescription:
      "Evalúa la madurez de seguridad de cada sistema de IA, prioriza brechas críticas y genera evidencia para auditoría.",
    pageMeta: {
      dashboard: {
        label: "Resumen de seguridad",
        title: "Dashboard de madurez y alertas",
        description: "Supervisa score global, dominios, alertas y últimas evaluaciones del sistema seleccionado.",
      },
      assessment: {
        label: "Evaluación guiada",
        title: "Cuestionario de madurez por dominio",
        description: "Evalúa niveles 0-4, registra notas y evidencia requerida, y actualiza el score en tiempo real.",
      },
      catalog: {
        label: "Controles y marcos",
        title: "Catálogo maestro y cross-reference",
        description: "Consulta controles sembrados, filtra por estándar y administra controles personalizados.",
      },
      report: {
        label: "Plan y comparación",
        title: "Reporte ejecutivo y seguimiento",
        description: "Revisa alertas, plan de remediación, evolución histórica y comparación entre evaluaciones.",
      },
    },
    tabs: {
      dashboard: "Dashboard",
      assessment: "Evaluación",
      catalog: "Catálogo",
      report: "Reporte",
    },
    actions: {
      archive: "Archivar evaluación",
      exportPdf: "Exportar PDF",
      exportXlsx: "Exportar XLSX",
      backHome: "Volver al inicio",
      goRegistry: "Ir al registro de sistemas",
      addControl: "Nuevo control",
      addEvidence: "Agregar referencia",
      quickMode: "Modo rápido",
      completeMode: "Modo completo",
      previousDomain: "Dominio anterior",
      nextDomain: "Siguiente dominio",
      compareSnapshots: "Comparar snapshots",
    },
    empty: {
      title: "No hay sistemas de IA registrados",
      description:
        "El módulo necesita al menos un sistema en el registro para asociar la evaluación, el histórico y los reportes.",
    },
    labels: {
      selectedSystem: "Sistema evaluado",
      responsibleOwner: "Responsable",
      stage: "Etapa",
      risk: "Riesgo",
      score: "Score global",
      evaluatedControls: "Controles evaluados",
      criticalAlerts: "Alertas críticas",
      target: "Objetivo",
      maturityProfile: "Perfil de madurez",
      scoreByDomain: "Score por dominio",
      latestSnapshots: "Últimas evaluaciones archivadas",
      selectedDomains: "Dominios incluidos",
      currentDomain: "Dominio actual",
      requiredLevel: "Nivel requerido",
      currentLevel: "Nivel actual",
      notes: "Notas de evaluación",
      requiredEvidence: "Evidencia requerida",
      registeredEvidence: "Referencias de evidencia",
      implementationGuide: "Guía de implementación",
      suggestedTools: "Herramientas sugeridas",
      references: "Referencias",
      threatCoverage: "Amenazas cubiertas",
      filters: "Filtros",
      search: "Buscar",
      onlyCritical: "Solo críticos",
      allControls: "Todos los controles",
      crossReference: "Cross-reference",
      seededControls: "Controles sembrados",
      customControls: "Controles personalizados",
      remediationPlan: "Plan de remediación prioritario",
      trend: "Evolución del score global",
      comparison: "Comparativa entre evaluaciones",
      status: "Estado",
      dueDate: "Fecha objetivo",
      frameworkMap: "Mapeo normativo",
      controlsVisible: "Controles visibles",
      evaluationMode: "Modo de evaluación",
      draftStatus: "Borrador activo",
      lastSaved: "Último guardado",
      benchmark: "Benchmark recomendado",
      comparisonLeft: "Evaluación A",
      comparisonRight: "Evaluación B",
      noSnapshots: "Aún no hay evaluaciones archivadas para comparar.",
      mobileReadOnly: "En móvil la evaluación se muestra en solo lectura para reducir carga cognitiva.",
      evidenceName: "Nombre de referencia",
      evidenceNote: "Nota o ubicación",
      evidenceKind: "Tipo",
      customControlForm: "Alta de control personalizado",
      customControlHint: "Disponible solo para usuarios con rol local admin.",
    },
    placeholders: {
      selectSystem: "Selecciona un sistema",
      searchControls: "Buscar por id, título o amenaza",
      notes: "Resume evidencia, responsables o brechas detectadas",
      evidenceName: "Ej. Informe de pentest Q1",
      evidenceNote: "Ej. Carpeta SharePoint / sección 4.2",
      controlId: "Ej. D4-CUS-001",
      controlTitle: "Nombre del control",
      controlQuestion: "Pregunta operativa que verá el evaluador",
      controlDescription: "Describe el objetivo técnico y el riesgo que mitiga",
      frameworks: "NSA/CISA, ISO 42001, EU AI Act",
      evidence: "Acta aprobada, logs del SIEM, configuración exportada",
      guide: "Pasos sugeridos para implementar o endurecer el control",
      owner: "Responsable",
    },
    messages: {
      draftSaved: "Evaluación guardada",
      draftSavedDescription: "El borrador quedó actualizado en esta estación de trabajo.",
      snapshotSaved: "Evaluación archivada",
      snapshotSavedDescription: "Se guardó un snapshot histórico para comparación y reportes.",
      exportReady: "Exportación lista",
      pdfReady: "Se generó el reporte PDF del sistema seleccionado.",
      xlsxReady: "Se generó el reporte XLSX del sistema seleccionado.",
      controlCreated: "Control personalizado creado",
      controlCreatedDescription: "El nuevo control ya aparece en el catálogo y en la evaluación completa.",
      evidenceAdded: "Referencia agregada",
      evidenceAddedDescription: "La evidencia queda ligada al control dentro del borrador actual.",
      evidenceRemoved: "Referencia eliminada",
      evidenceRemovedDescription: "La referencia se retiró del control seleccionado.",
      selectSystemFirst: "Selecciona primero un sistema para continuar.",
      keepOneDomain: "Debe permanecer al menos un dominio activo.",
    },
    misc: {
      current: "Actual",
      quickScope: "Solo controles críticos",
      completeScope: "Catálogo completo",
      noEvidence: "Sin referencias cargadas",
      noOwner: "Equipo responsable",
      noCustomControls: "No hay controles personalizados todavía.",
      noResults: "No hay controles que coincidan con los filtros actuales.",
      allDomains: "Todos",
      pending: "Pendiente",
      inProgress: "En curso",
      completed: "Completada",
      document: "Documento",
      log: "Log",
      config: "Configuración",
      link: "Enlace",
      note: "Nota",
      adminOnly: "Se requiere rol admin local para dar de alta controles.",
    },
  },
  en: {
    moduleLabel: "AI Governance",
    moduleTitle: "AI systems security",
    moduleDescription:
      "Assess security maturity per AI system, prioritize critical gaps, and generate audit-ready evidence.",
    pageMeta: {
      dashboard: {
        label: "Security overview",
        title: "Maturity and alert dashboard",
        description: "Monitor global score, domain status, critical alerts, and recent archived evaluations.",
      },
      assessment: {
        label: "Guided assessment",
        title: "Domain-based maturity questionnaire",
        description: "Score controls 0-4, capture notes and evidence expectations, and update the score in real time.",
      },
      catalog: {
        label: "Controls and frameworks",
        title: "Master catalog and cross-reference",
        description: "Browse seeded controls, filter by standard, and manage custom controls.",
      },
      report: {
        label: "Plan and comparison",
        title: "Executive report and follow-up",
        description: "Review alerts, remediation timeline, historical trend, and side-by-side comparisons.",
      },
    },
    tabs: {
      dashboard: "Dashboard",
      assessment: "Assessment",
      catalog: "Catalog",
      report: "Report",
    },
    actions: {
      archive: "Archive assessment",
      exportPdf: "Export PDF",
      exportXlsx: "Export XLSX",
      backHome: "Back to home",
      goRegistry: "Open AI registry",
      addControl: "New control",
      addEvidence: "Add reference",
      quickMode: "Quick mode",
      completeMode: "Complete mode",
      previousDomain: "Previous domain",
      nextDomain: "Next domain",
      compareSnapshots: "Compare snapshots",
    },
    empty: {
      title: "No AI systems are registered yet",
      description:
        "This module needs at least one AI system in the registry to attach assessments, history, and reports.",
    },
    labels: {
      selectedSystem: "Selected system",
      responsibleOwner: "Owner",
      stage: "Stage",
      risk: "Risk",
      score: "Global score",
      evaluatedControls: "Evaluated controls",
      criticalAlerts: "Critical alerts",
      target: "Target",
      maturityProfile: "Maturity profile",
      scoreByDomain: "Score by domain",
      latestSnapshots: "Latest archived evaluations",
      selectedDomains: "Included domains",
      currentDomain: "Current domain",
      requiredLevel: "Required level",
      currentLevel: "Current level",
      notes: "Assessment notes",
      requiredEvidence: "Required evidence",
      registeredEvidence: "Evidence references",
      implementationGuide: "Implementation guide",
      suggestedTools: "Suggested tools",
      references: "References",
      threatCoverage: "Covered threats",
      filters: "Filters",
      search: "Search",
      onlyCritical: "Critical only",
      allControls: "All controls",
      crossReference: "Cross-reference",
      seededControls: "Seeded controls",
      customControls: "Custom controls",
      remediationPlan: "Priority remediation plan",
      trend: "Global score trend",
      comparison: "Evaluation comparison",
      status: "Status",
      dueDate: "Due date",
      frameworkMap: "Framework mapping",
      controlsVisible: "Visible controls",
      evaluationMode: "Assessment mode",
      draftStatus: "Active draft",
      lastSaved: "Last saved",
      benchmark: "Recommended benchmark",
      comparisonLeft: "Evaluation A",
      comparisonRight: "Evaluation B",
      noSnapshots: "There are no archived evaluations to compare yet.",
      mobileReadOnly: "On mobile, the assessment stays read-only to reduce cognitive load.",
      evidenceName: "Reference name",
      evidenceNote: "Note or location",
      evidenceKind: "Type",
      customControlForm: "Custom control form",
      customControlHint: "Only available for local admin users.",
    },
    placeholders: {
      selectSystem: "Select a system",
      searchControls: "Search by id, title, or threat",
      notes: "Summarize evidence, owners, or identified gaps",
      evidenceName: "Example: Q1 pentest report",
      evidenceNote: "Example: SharePoint folder / section 4.2",
      controlId: "Example: D4-CUS-001",
      controlTitle: "Control title",
      controlQuestion: "Operational question shown to the assessor",
      controlDescription: "Describe the technical objective and mitigated risk",
      frameworks: "NSA/CISA, ISO 42001, EU AI Act",
      evidence: "Approved minutes, SIEM logs, exported configuration",
      guide: "Suggested steps to implement or harden the control",
      owner: "Owner",
    },
    messages: {
      draftSaved: "Assessment saved",
      draftSavedDescription: "The active draft was updated in this workstation.",
      snapshotSaved: "Assessment archived",
      snapshotSavedDescription: "A historical snapshot is now available for comparison and reporting.",
      exportReady: "Export ready",
      pdfReady: "The PDF report for the selected system was generated.",
      xlsxReady: "The XLSX report for the selected system was generated.",
      controlCreated: "Custom control created",
      controlCreatedDescription: "The new control is now available in the catalog and complete assessment mode.",
      evidenceAdded: "Reference added",
      evidenceAddedDescription: "The evidence reference is now linked to the selected control.",
      evidenceRemoved: "Reference removed",
      evidenceRemovedDescription: "The evidence reference was removed from the selected control.",
      selectSystemFirst: "Select a system before continuing.",
      keepOneDomain: "At least one domain must stay active.",
    },
    misc: {
      current: "Current",
      quickScope: "Critical controls only",
      completeScope: "Full catalog",
      noEvidence: "No references added",
      noOwner: "Responsible team",
      noCustomControls: "No custom controls yet.",
      noResults: "No controls match the current filters.",
      allDomains: "All",
      pending: "Pending",
      inProgress: "In progress",
      completed: "Completed",
      document: "Document",
      log: "Log",
      config: "Config",
      link: "Link",
      note: "Note",
      adminOnly: "Local admin role required to create controls.",
    },
  },
} as const

const emptyCustomControl: CustomControlForm = {
  controlId: "",
  title: "",
  question: "",
  description: "",
  domainId: "D-1",
  requiredLevel: 2,
  weight: "ESTANDAR",
  implementationType: "PROCEDIMENTAL",
  frameworks: "",
  evidence: "",
  guide: "",
}

function formatDateLabel(value: string, language: "es" | "en") {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(language === "en" ? "en-US" : "es-MX", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  })
}

function getSystemDisplayName(system: RegistrySystemSummary | undefined) {
  if (!system) return ""
  return [system.systemName, system.systemVersion ? `v${system.systemVersion}` : ""].filter(Boolean).join(" ")
}

function getWeightLabel(weight: AISecurityControlWeight, language: "es" | "en") {
  if (weight === "CRITICO") return language === "en" ? "Critical" : "Crítico"
  if (weight === "ALTO") return language === "en" ? "High" : "Alto"
  return language === "en" ? "Standard" : "Estándar"
}

function getWeightClasses(weight: AISecurityControlWeight) {
  if (weight === "CRITICO") return "border-red-200 bg-red-50 text-red-700"
  if (weight === "ALTO") return "border-amber-200 bg-amber-50 text-amber-700"
  return "border-emerald-200 bg-emerald-50 text-emerald-700"
}

function getRemediationStatusLabel(status: AISecurityRemediationItem["status"], language: "es" | "en") {
  if (status === "in_progress") return language === "en" ? "In progress" : "En curso"
  if (status === "completed") return language === "en" ? "Completed" : "Completada"
  return language === "en" ? "Pending" : "Pendiente"
}

function getEvidenceKindLabel(kind: AISecurityEvidenceKind, language: "es" | "en") {
  const labels = moduleCopy[language].misc
  if (kind === "document") return labels.document
  if (kind === "log") return labels.log
  if (kind === "config") return labels.config
  if (kind === "link") return labels.link
  return labels.note
}

function getDomainScoreTone(score: number) {
  if (score >= 3) return "bg-emerald-500"
  if (score >= 2) return "bg-amber-500"
  if (score >= 1) return "bg-orange-500"
  return "bg-red-500"
}

function createHistorySummary(snapshot: AISecurityAssessmentSnapshot, catalog: AISecurityControl[]) {
  const draftLike: AISecurityAssessmentDraft = {
    assessmentId: snapshot.snapshotId,
    systemId: snapshot.systemId,
    selectedDomains: snapshot.selectedDomains,
    mode: snapshot.mode,
    responses: snapshot.responses,
    remediationPlan: snapshot.remediationPlan,
    createdAt: snapshot.createdAt,
    lastSavedAt: snapshot.createdAt,
  }

  return calculateAssessmentSummary(draftLike, catalog)
}

function RadarChart({
  points,
  benchmark,
}: {
  points: { label: string; score: number }[]
  benchmark: number
}) {
  const size = 220
  const center = size / 2
  const radius = 78
  const rings = [1, 2, 3, 4]
  const angleStep = (Math.PI * 2) / Math.max(points.length, 1)

  const toPoint = (index: number, score: number) => {
    const angle = -Math.PI / 2 + index * angleStep
    const scale = (score / 4) * radius
    return {
      x: center + Math.cos(angle) * scale,
      y: center + Math.sin(angle) * scale,
    }
  }

  const polygon = points.map((point, index) => toPoint(index, point.score)).map((point) => `${point.x},${point.y}`).join(" ")
  const benchmarkPolygon = points
    .map((_, index) => toPoint(index, benchmark))
    .map((point) => `${point.x},${point.y}`)
    .join(" ")

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-[220px] w-full">
      {rings.map((ring) => {
        const ringPoints = points
          .map((_, index) => toPoint(index, ring))
          .map((point) => `${point.x},${point.y}`)
          .join(" ")

        return <polygon key={ring} points={ringPoints} fill="none" stroke="rgba(15, 59, 102, 0.12)" strokeWidth="1" />
      })}

      {points.map((point, index) => {
        const edge = toPoint(index, 4)
        return (
          <g key={point.label}>
            <line x1={center} y1={center} x2={edge.x} y2={edge.y} stroke="rgba(15, 59, 102, 0.12)" strokeWidth="1" />
            <text
              x={edge.x}
              y={edge.y}
              textAnchor={edge.x < center - 8 ? "end" : edge.x > center + 8 ? "start" : "middle"}
              dominantBaseline={edge.y < center ? "auto" : "hanging"}
              className="fill-slate-500 text-[10px]"
            >
              {point.label}
            </text>
          </g>
        )
      })}

      <polygon points={benchmarkPolygon} fill="rgba(148, 163, 184, 0.06)" stroke="rgba(148, 163, 184, 0.6)" strokeDasharray="4 4" />
      <polygon points={polygon} fill="rgba(13, 148, 136, 0.16)" stroke="rgba(15, 59, 102, 0.9)" strokeWidth="2" />

      {points.map((point, index) => {
        const node = toPoint(index, point.score)
        return <circle key={point.label} cx={node.x} cy={node.y} r="4" fill="rgba(15, 59, 102, 1)" />
      })}
    </svg>
  )
}

function TrendChart({
  points,
  language,
}: {
  points: { label: string; score: number }[]
  language: "es" | "en"
}) {
  if (!points.length) {
    return <div className="h-52 rounded-3xl border border-dashed border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]" />
  }

  const width = 640
  const height = 220
  const paddingX = 32
  const paddingY = 20
  const maxScore = 4
  const stepX = points.length > 1 ? (width - paddingX * 2) / (points.length - 1) : 0

  const chartPoints = points.map((point, index) => {
    const x = paddingX + stepX * index
    const y = height - paddingY - (point.score / maxScore) * (height - paddingY * 2)
    return { ...point, x, y }
  })

  const polyline = chartPoints.map((point) => `${point.x},${point.y}`).join(" ")
  const area = [
    `${chartPoints[0]?.x || paddingX},${height - paddingY}`,
    ...chartPoints.map((point) => `${point.x},${point.y}`),
    `${chartPoints[chartPoints.length - 1]?.x || width - paddingX},${height - paddingY}`,
  ].join(" ")

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full">
      {[0, 1, 2, 3, 4].map((mark) => {
        const y = height - paddingY - (mark / maxScore) * (height - paddingY * 2)
        return (
          <g key={mark}>
            <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="rgba(15,59,102,0.12)" strokeWidth="1" />
            <text x={8} y={y + 4} className="fill-slate-400 text-[10px]">
              {mark}
            </text>
          </g>
        )
      })}

      <line
        x1={paddingX}
        y1={height - paddingY - (3 / maxScore) * (height - paddingY * 2)}
        x2={width - paddingX}
        y2={height - paddingY - (3 / maxScore) * (height - paddingY * 2)}
        stroke="rgba(15,59,102,0.28)"
        strokeDasharray="6 6"
      />

      <polygon points={area} fill="rgba(15, 59, 102, 0.08)" />
      <polyline points={polyline} fill="none" stroke="rgba(15, 59, 102, 1)" strokeWidth="3" />

      {chartPoints.map((point) => (
        <g key={point.label}>
          <circle cx={point.x} cy={point.y} r="4.5" fill="rgba(15, 59, 102, 1)" />
          <text x={point.x} y={height - 4} textAnchor="middle" className="fill-slate-500 text-[10px]">
            {point.label}
          </text>
        </g>
      ))}

      <text x={width - paddingX} y={20} textAnchor="end" className="fill-slate-500 text-[10px]">
        {language === "en" ? "Target level 3" : "Nivel objetivo 3"}
      </text>
    </svg>
  )
}

function MetricCard({
  label,
  value,
  sublabel,
  accentClassName,
}: {
  label: string
  value: string
  sublabel: string
  accentClassName?: string
}) {
  return (
    <div className="rounded-[28px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))] px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className={cn("mt-2 text-4xl font-semibold tracking-tight text-[hsl(var(--brand-deep))]", accentClassName)}>{value}</p>
      <p className="mt-1 text-sm text-slate-500">{sublabel}</p>
    </div>
  )
}

export function AISecurityWorkspace() {
  const { language } = useLanguage()
  const copy = moduleCopy[language]
  const { toast } = useToast()

  const [systems, setSystems] = useState<RegistrySystemSummary[]>([])
  const [catalog, setCatalog] = useState<AISecurityControl[]>(AI_SECURITY_SEEDED_CONTROLS)
  const [assessmentStore, setAssessmentStore] = useState<AISecurityAssessmentStore>({})
  const [selectedSystemId, setSelectedSystemId] = useState("")
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("dashboard")
  const [activeDomainId, setActiveDomainId] = useState<AISecurityDomainId>("D-1")
  const [catalogView, setCatalogView] = useState<CatalogView>("controls")
  const [catalogSearch, setCatalogSearch] = useState("")
  const [catalogDomainFilter, setCatalogDomainFilter] = useState<`${AISecurityDomainId}` | "ALL">("ALL")
  const [catalogWeightFilter, setCatalogWeightFilter] = useState<AISecurityControlWeight | "ALL">("ALL")
  const [catalogFrameworkFilter, setCatalogFrameworkFilter] = useState<string>("ALL")
  const [catalogImplementationFilter, setCatalogImplementationFilter] = useState<AISecurityControl["implementationType"] | "ALL">("ALL")
  const [catalogEnvironmentFilter, setCatalogEnvironmentFilter] = useState<AISecurityControl["applicableEnvironments"][number] | "ALL">("ALL")
  const [catalogCriticalOnly, setCatalogCriticalOnly] = useState(false)
  const [expandedCatalogId, setExpandedCatalogId] = useState<string | null>(null)
  const [expandedAssessmentId, setExpandedAssessmentId] = useState<string | null>(null)
  const [comparisonLeftId, setComparisonLeftId] = useState("")
  const [comparisonRightId, setComparisonRightId] = useState("")
  const [customDialogOpen, setCustomDialogOpen] = useState(false)
  const [customControlForm, setCustomControlForm] = useState<CustomControlForm>(emptyCustomControl)
  const [evidenceDrafts, setEvidenceDrafts] = useState<Record<string, { name: string; note: string; kind: AISecurityEvidenceKind }>>({})
  const [isMobileReadonly, setIsMobileReadonly] = useState(false)
  const [userRole, setUserRole] = useState("user")

  useEffect(() => {
    const syncData = () => {
      const registry = JSON.parse(window.localStorage.getItem("aiSystemsRegistry") || "[]") as Array<Record<string, unknown>>
      const normalizedSystems = registry
        .filter((item) => typeof item.id === "string" && typeof item.systemName === "string")
        .map((item) => ({
          id: String(item.id),
          systemName: String(item.systemName || ""),
          systemVersion: item.systemVersion ? String(item.systemVersion) : "",
          systemStage: item.systemStage ? String(item.systemStage) : "",
          globalRiskLevel: item.globalRiskLevel ? String(item.globalRiskLevel) : "",
          internalOwner: item.internalOwner ? String(item.internalOwner) : "",
          responsibleArea: item.responsibleArea ? String(item.responsibleArea) : "",
          companyName: item.companyName ? String(item.companyName) : "",
          systemDescription: item.systemDescription ? String(item.systemDescription) : "",
        }))

      setSystems(normalizedSystems)
      setCatalog(getControlCatalog())
      setAssessmentStore(getAssessmentStore())
      setUserRole(window.localStorage.getItem("userRole") || "user")

      const storedSelected = getSelectedSystemId()
      const hasStoredSystem = normalizedSystems.some((system) => system.id === storedSelected)
      const nextSelected = hasStoredSystem ? storedSelected : normalizedSystems[0]?.id || ""
      setSelectedSystemId(nextSelected)
    }

    const syncViewport = () => {
      setIsMobileReadonly(window.innerWidth < 768)
    }

    syncData()
    syncViewport()

    window.addEventListener("storage", syncData)
    window.addEventListener("ai-registry-storage-updated", syncData as EventListener)
    window.addEventListener(STORAGE_EVENT, syncData as EventListener)
    window.addEventListener("resize", syncViewport)

    return () => {
      window.removeEventListener("storage", syncData)
      window.removeEventListener("ai-registry-storage-updated", syncData as EventListener)
      window.removeEventListener(STORAGE_EVENT, syncData as EventListener)
      window.removeEventListener("resize", syncViewport)
    }
  }, [])

  useEffect(() => {
    if (!selectedSystemId || !catalog.length) return

    setAssessmentStore((prev) => {
      const existingBucket = prev[selectedSystemId]
      if (existingBucket) {
        const normalizedDraft = withNormalizedResponses(existingBucket.draft, catalog)
        const needsDomains = !normalizedDraft.selectedDomains?.length
        const responsesChanged =
          Object.keys(normalizedDraft.responses).length !== Object.keys(existingBucket.draft.responses || {}).length

        if (!needsDomains && !responsesChanged) return prev

        const nextDraft = {
          ...normalizedDraft,
          selectedDomains: needsDomains ? AI_SECURITY_DOMAINS.map((domain) => domain.id) : normalizedDraft.selectedDomains,
        }
        const nextStore = {
          ...prev,
          [selectedSystemId]: {
            ...existingBucket,
            draft: nextDraft,
          },
        }

        saveAssessmentStore(nextStore)
        return nextStore
      }

      const nextDraft = withNormalizedResponses(createEmptyDraft(selectedSystemId), catalog)
      const nextStore = {
        ...prev,
        [selectedSystemId]: {
          draft: nextDraft,
          snapshots: [],
        },
      }
      saveAssessmentStore(nextStore)
      window.dispatchEvent(new Event(STORAGE_EVENT))
      return nextStore
    })

    saveSelectedSystemId(selectedSystemId)
  }, [catalog, selectedSystemId])

  const selectedSystem = systems.find((system) => system.id === selectedSystemId)
  const rawBucket = selectedSystemId ? assessmentStore[selectedSystemId] : undefined
  const draft =
    selectedSystemId && rawBucket
      ? {
          ...withNormalizedResponses(rawBucket.draft, catalog),
          remediationPlan: buildRemediationPlan(
            withNormalizedResponses(rawBucket.draft, catalog),
            catalog,
            selectedSystem?.internalOwner || selectedSystem?.responsibleArea || copy.misc.noOwner,
          ),
        }
      : null
  const snapshots = rawBucket?.snapshots || []
  const summary = draft ? calculateAssessmentSummary(draft, catalog) : null
  const applicableControls = draft ? getApplicableControls(catalog, draft.mode, draft.selectedDomains) : []
  const currentDomainControls = applicableControls.filter((control) => control.domainId === activeDomainId)
  const frameworks = Array.from(new Set(catalog.flatMap((control) => control.referenceFrameworks))).sort((left, right) => left.localeCompare(right))

  useEffect(() => {
    if (!draft) return
    if (!draft.selectedDomains.includes(activeDomainId)) {
      setActiveDomainId(draft.selectedDomains[0] || "D-1")
    }
  }, [activeDomainId, draft])

  useEffect(() => {
    if (!snapshots.length) {
      setComparisonLeftId("")
      setComparisonRightId("")
      return
    }

    const latest = snapshots[0]?.snapshotId || ""
    const previous = snapshots[1]?.snapshotId || ""

    setComparisonLeftId((current) => (current && snapshots.some((snapshot) => snapshot.snapshotId === current) ? current : latest))
    setComparisonRightId((current) => (current && snapshots.some((snapshot) => snapshot.snapshotId === current) ? current : previous))
  }, [snapshots])

  const persistDraft = (updater: (current: AISecurityAssessmentDraft) => AISecurityAssessmentDraft) => {
    if (!selectedSystemId || !selectedSystem) {
      toast({
        title: copy.messages.selectSystemFirst,
        description: copy.empty.description,
        variant: "destructive",
      })
      return
    }

    setAssessmentStore((prev) => {
      const bucket = prev[selectedSystemId] || { draft: createEmptyDraft(selectedSystemId), snapshots: [] }
      const baseDraft = withNormalizedResponses(bucket.draft, catalog)
      const updatedDraft = updater(baseDraft)
      const draftToSave = {
        ...updatedDraft,
        lastSavedAt: new Date().toISOString(),
      }
      draftToSave.remediationPlan = buildRemediationPlan(
        draftToSave,
        catalog,
        selectedSystem.internalOwner || selectedSystem.responsibleArea || copy.misc.noOwner,
      )

      const nextStore = {
        ...prev,
        [selectedSystemId]: {
          draft: draftToSave,
          snapshots: bucket.snapshots,
        },
      }

      saveAssessmentStore(nextStore)
      window.dispatchEvent(new Event(STORAGE_EVENT))
      return nextStore
    })
  }

  const persistCatalog = (nextCatalog: AISecurityControl[]) => {
    setCatalog(nextCatalog)
    saveControlCatalog(nextCatalog)
    window.dispatchEvent(new Event(STORAGE_EVENT))
  }

  const handleArchive = () => {
    if (!draft || !selectedSystem) return

    setAssessmentStore((prev) => {
      const bucket = prev[selectedSystem.id] || { draft, snapshots: [] }
      const { draft: savedDraft, snapshot } = archiveDraft(
        draft,
        catalog,
        selectedSystem.internalOwner || selectedSystem.responsibleArea || copy.misc.noOwner,
      )
      const nextStore = {
        ...prev,
        [selectedSystem.id]: {
          draft: savedDraft,
          snapshots: [snapshot, ...bucket.snapshots].slice(0, 12),
        },
      }
      saveAssessmentStore(nextStore)
      window.dispatchEvent(new Event(STORAGE_EVENT))
      return nextStore
    })

    toast({
      title: copy.messages.snapshotSaved,
      description: copy.messages.snapshotSavedDescription,
    })
  }

  const updateResponse = (controlId: string, updater: (current: AISecurityControlResponse) => AISecurityControlResponse) => {
    if (!draft) return
    persistDraft((current) => ({
      ...current,
      responses: {
        ...current.responses,
        [controlId]: updater(current.responses[controlId] || { level: null, notes: "", evidences: [], updatedAt: null }),
      },
    }))
  }

  const handleEvidenceAdd = (controlId: string) => {
    const draftEvidence = evidenceDrafts[controlId]
    if (!draftEvidence?.name || !draftEvidence?.note) return

    const evidence: AISecurityEvidenceRef = {
      id: createAssessmentId(`evidence-${controlId}`),
      name: draftEvidence.name,
      note: draftEvidence.note,
      kind: draftEvidence.kind,
    }

    updateResponse(controlId, (current) => ({
      ...current,
      evidences: [...(current.evidences || []), evidence],
      updatedAt: new Date().toISOString(),
    }))

    setEvidenceDrafts((prev) => ({
      ...prev,
      [controlId]: { name: "", note: "", kind: "document" },
    }))

    toast({
      title: copy.messages.evidenceAdded,
      description: copy.messages.evidenceAddedDescription,
    })
  }

  const handleEvidenceRemove = (controlId: string, evidenceId: string) => {
    updateResponse(controlId, (current) => ({
      ...current,
      evidences: (current.evidences || []).filter((evidence) => evidence.id !== evidenceId),
      updatedAt: new Date().toISOString(),
    }))

    toast({
      title: copy.messages.evidenceRemoved,
      description: copy.messages.evidenceRemovedDescription,
    })
  }

  const toggleDomain = (domainId: AISecurityDomainId) => {
    if (!draft) return

    if (draft.selectedDomains.includes(domainId) && draft.selectedDomains.length === 1) {
      toast({
        title: copy.messages.keepOneDomain,
        description: copy.messages.keepOneDomain,
        variant: "destructive",
      })
      return
    }

    persistDraft((current) => ({
      ...current,
      selectedDomains: current.selectedDomains.includes(domainId)
        ? current.selectedDomains.filter((item) => item !== domainId)
        : [...current.selectedDomains, domainId],
    }))
  }

  const handleCustomControlCreate = () => {
    if (userRole !== "admin") {
      toast({
        title: copy.misc.adminOnly,
        description: copy.labels.customControlHint,
        variant: "destructive",
      })
      return
    }

    if (!customControlForm.title || !customControlForm.question || !customControlForm.description) return

    const controlId = customControlForm.controlId || `${customControlForm.domainId.replace("-", "")}-CUS-${Date.now().toString().slice(-4)}`
    const newControl: AISecurityControl = {
      controlId,
      title: customControlForm.title,
      question: customControlForm.question,
      description: customControlForm.description,
      domainId: customControlForm.domainId,
      requiredLevel: Number(customControlForm.requiredLevel),
      weight: customControlForm.weight,
      implementationType: customControlForm.implementationType,
      threatCategories: ["custom_control"],
      referenceFrameworks: customControlForm.frameworks
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      cpgReferences: [],
      applicableEnvironments: ["TODOS"],
      requiredEvidence: customControlForm.evidence
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      implementationGuide: customControlForm.guide,
      suggestedTools: [],
      active: true,
      seeded: false,
    }

    const nextCatalog = [...catalog, newControl]
    persistCatalog(nextCatalog)
    setCustomControlForm(emptyCustomControl)
    setCustomDialogOpen(false)

    toast({
      title: copy.messages.controlCreated,
      description: copy.messages.controlCreatedDescription,
    })
  }

  const exportPdf = async () => {
    if (!draft || !summary || !selectedSystem) return

    const { default: jsPDF } = await import("jspdf")
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 18

    const writeSection = (title: string, lines: string[]) => {
      doc.setFontSize(12)
      doc.setTextColor(15, 59, 102)
      doc.text(title, 16, y)
      y += 6
      doc.setFontSize(10)
      doc.setTextColor(60, 76, 99)
      lines.forEach((line) => {
        const wrapped = doc.splitTextToSize(line, pageWidth - 32)
        doc.text(wrapped, 16, y)
        y += wrapped.length * 5
        if (y > 270) {
          doc.addPage()
          y = 18
        }
      })
      y += 4
    }

    doc.setFillColor(15, 59, 102)
    doc.rect(0, 0, pageWidth, 32, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.text(copy.moduleTitle, 16, 20)
    doc.setFontSize(10)
    doc.text(getSystemDisplayName(selectedSystem), 16, 27)
    y = 42

    writeSection(copy.labels.selectedSystem, [
      `${copy.labels.responsibleOwner}: ${selectedSystem.internalOwner || copy.misc.noOwner}`,
      `${copy.labels.stage}: ${selectedSystem.systemStage || "-"}`,
      `${copy.labels.risk}: ${selectedSystem.globalRiskLevel || "-"}`,
      `${copy.labels.lastSaved}: ${formatDateLabel(draft.lastSavedAt, language)}`,
    ])

    writeSection(copy.labels.score, [
      `${copy.labels.score}: ${formatScore(summary.globalScore)} / 4`,
      `${copy.labels.evaluatedControls}: ${summary.evaluatedControls}/${summary.totalControls}`,
      `${copy.labels.criticalAlerts}: ${summary.alerts.length}`,
    ])

    writeSection(copy.labels.scoreByDomain, summary.domainScores.map((item) => `${item.domain.id} · ${item.domain.name}: ${formatScore(item.score)} / 4`))

    writeSection(copy.labels.frameworkMap, AI_SECURITY_CROSS_REFERENCE.map((row) => `${row.category}: ${row.nsaCisa} | ${row.nistAiRmf} | ${row.owasp}`))

    writeSection(copy.labels.criticalAlerts, summary.alerts.length ? summary.alerts.map((alert) => alert.message) : [copy.misc.noEvidence])

    writeSection(
      copy.labels.remediationPlan,
      draft.remediationPlan.map(
        (item, index) =>
          `${index + 1}. ${item.recommendedWindow}: ${item.title}. ${copy.labels.status}: ${getRemediationStatusLabel(item.status, language)}. ${copy.labels.dueDate}: ${item.dueDate}.`,
      ),
    )

    doc.save(`seguridad-ia-${selectedSystem.systemName.replace(/\s+/g, "-").toLowerCase()}.pdf`)
    toast({
      title: copy.messages.exportReady,
      description: copy.messages.pdfReady,
    })
  }

  const exportXlsx = async () => {
    if (!draft || !summary || !selectedSystem) return

    const { default: ExcelJS } = await import("exceljs")
    const workbook = new ExcelJS.Workbook()
    const overview = workbook.addWorksheet("Resumen")
    overview.columns = [
      { header: "Campo", key: "field", width: 28 },
      { header: "Valor", key: "value", width: 48 },
    ]
    overview.addRows([
      { field: copy.labels.selectedSystem, value: getSystemDisplayName(selectedSystem) },
      { field: copy.labels.responsibleOwner, value: selectedSystem.internalOwner || copy.misc.noOwner },
      { field: copy.labels.score, value: `${formatScore(summary.globalScore)} / 4` },
      { field: copy.labels.evaluatedControls, value: `${summary.evaluatedControls}/${summary.totalControls}` },
      { field: copy.labels.criticalAlerts, value: summary.alerts.length },
      { field: copy.labels.lastSaved, value: formatDateLabel(draft.lastSavedAt, language) },
    ])

    const domainsSheet = workbook.addWorksheet("Dominios")
    domainsSheet.columns = [
      { header: "Dominio", key: "domain", width: 28 },
      { header: "Score", key: "score", width: 14 },
      { header: "Completitud", key: "completion", width: 18 },
      { header: "Referencia", key: "reference", width: 36 },
    ]
    summary.domainScores.forEach((item) => {
      domainsSheet.addRow({
        domain: `${item.domain.id} ${item.domain.name}`,
        score: formatScore(item.score),
        completion: `${item.completion}%`,
        reference: item.domain.reference,
      })
    })

    const alertsSheet = workbook.addWorksheet("Alertas")
    alertsSheet.columns = [
      { header: "Control", key: "control", width: 18 },
      { header: "Mensaje", key: "message", width: 60 },
      { header: "Nivel actual", key: "level", width: 14 },
    ]
    summary.alerts.forEach((alert) => {
      alertsSheet.addRow({
        control: alert.controlId,
        message: alert.message,
        level: alert.currentLevel,
      })
    })

    const remediationSheet = workbook.addWorksheet("Remediación")
    remediationSheet.columns = [
      { header: "Control", key: "control", width: 18 },
      { header: "Prioridad", key: "priority", width: 16 },
      { header: "Responsable", key: "owner", width: 28 },
      { header: "Fecha objetivo", key: "dueDate", width: 18 },
      { header: "Estado", key: "status", width: 16 },
      { header: "Nota", key: "note", width: 54 },
    ]
    draft.remediationPlan.forEach((item) => {
      remediationSheet.addRow({
        control: item.controlId,
        priority: getWeightLabel(item.priority, language),
        owner: item.owner,
        dueDate: item.dueDate,
        status: getRemediationStatusLabel(item.status, language),
        note: item.note,
      })
    })

    const controlsSheet = workbook.addWorksheet("Controles")
    controlsSheet.columns = [
      { header: "Control", key: "control", width: 18 },
      { header: "Título", key: "title", width: 44 },
      { header: "Dominio", key: "domain", width: 16 },
      { header: "Nivel", key: "level", width: 12 },
      { header: "Notas", key: "notes", width: 36 },
      { header: "Evidencias", key: "evidences", width: 46 },
    ]
    applicableControls.forEach((control) => {
      const response = draft.responses[control.controlId]
      controlsSheet.addRow({
        control: control.controlId,
        title: control.title,
        domain: control.domainId,
        level: response?.level ?? "",
        notes: response?.notes || "",
        evidences: (response?.evidences || []).map((item) => `${item.name}: ${item.note}`).join(" | "),
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `seguridad-ia-${selectedSystem.systemName.replace(/\s+/g, "-").toLowerCase()}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: copy.messages.exportReady,
      description: copy.messages.xlsxReady,
    })
  }

  const filteredCatalog = catalog.filter((control) => {
    const matchesSearch =
      !catalogSearch ||
      `${control.controlId} ${control.title} ${control.description} ${control.threatCategories.join(" ")}`
        .toLowerCase()
        .includes(catalogSearch.toLowerCase())
    const matchesDomain = catalogDomainFilter === "ALL" || control.domainId === catalogDomainFilter
    const matchesWeight = catalogWeightFilter === "ALL" || control.weight === catalogWeightFilter
    const matchesFramework = catalogFrameworkFilter === "ALL" || control.referenceFrameworks.includes(catalogFrameworkFilter)
    const matchesImplementation =
      catalogImplementationFilter === "ALL" || control.implementationType === catalogImplementationFilter
    const matchesEnvironment =
      catalogEnvironmentFilter === "ALL" || control.applicableEnvironments.includes(catalogEnvironmentFilter) || control.applicableEnvironments.includes("TODOS")
    const matchesCriticalOnly = !catalogCriticalOnly || control.weight === "CRITICO"

    return matchesSearch && matchesDomain && matchesWeight && matchesFramework && matchesImplementation && matchesEnvironment && matchesCriticalOnly
  })

  const historyPoints = (() => {
    if (!draft) return []
    const snapshotPoints = [...snapshots]
      .sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime())
      .slice(-5)
      .map((snapshot) => ({
        label: formatDateLabel(snapshot.createdAt, language),
        score: createHistorySummary(snapshot, catalog).globalScore,
      }))

    return [
      ...snapshotPoints,
      {
        label: copy.misc.current,
        score: summary?.globalScore || 0,
      },
    ]
  })()

  const comparisonLeft = snapshots.find((snapshot) => snapshot.snapshotId === comparisonLeftId)
  const comparisonRight = snapshots.find((snapshot) => snapshot.snapshotId === comparisonRightId)
  const comparisonLeftSummary = comparisonLeft ? createHistorySummary(comparisonLeft, catalog) : null
  const comparisonRightSummary = comparisonRight ? createHistorySummary(comparisonRight, catalog) : null

  const navItems: GeneralTabShellNavItem[] = [
    { id: "dashboard", label: copy.tabs.dashboard, icon: Shield },
    { id: "assessment", label: copy.tabs.assessment, icon: ClipboardCheck },
    { id: "catalog", label: copy.tabs.catalog, icon: BookMarked, badge: catalog.length },
    { id: "report", label: copy.tabs.report, icon: TrendingUp, badge: summary?.alerts.length || undefined },
  ]

  const shellMeta = copy.pageMeta[activeTab]
  const headerBadges: GeneralTabShellBadge[] = selectedSystem
    ? [
        { label: getSystemDisplayName(selectedSystem), tone: "primary" },
        { label: `${copy.labels.score}: ${formatScore(summary?.globalScore || 0)} / 4`, tone: "neutral" },
        { label: `${copy.labels.criticalAlerts}: ${summary?.alerts.length || 0}`, tone: summary?.alerts.length ? "critical" : "positive" },
      ]
    : [{ label: copy.empty.title, tone: "warning" }]

  const availableDomainIds = draft?.selectedDomains || AI_SECURITY_DOMAINS.map((domain) => domain.id)

  return (
    <GeneralTabShell
      moduleLabel={copy.moduleLabel}
      moduleTitle={copy.moduleTitle}
      moduleDescription={copy.moduleDescription}
      pageLabel={shellMeta.label}
      pageTitle={shellMeta.title}
      pageDescription={shellMeta.description}
      navItems={navItems}
      activeNavId={activeTab}
      onNavSelect={(value) => setActiveTab(value as WorkspaceTab)}
      headerBadges={headerBadges}
      backHref="/"
      backLabel={copy.actions.backHome}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleArchive} disabled={!draft}>
            <Sparkles className="h-4 w-4" />
            {copy.actions.archive}
          </Button>
          <Button variant="outline" size="sm" onClick={exportXlsx} disabled={!draft}>
            <FileSpreadsheet className="h-4 w-4" />
            {copy.actions.exportXlsx}
          </Button>
          <Button size="sm" onClick={exportPdf} disabled={!draft}>
            <Download className="h-4 w-4" />
            {copy.actions.exportPdf}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {!systems.length ? (
          <Card className="border-brand bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--brand-deep))]">
                <Lock className="h-5 w-5 text-[hsl(var(--primary))]" />
                {copy.empty.title}
              </CardTitle>
              <CardDescription>{copy.empty.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/registro-sistemas-ia">
                  {copy.actions.goRegistry}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="rounded-[30px] border border-[hsl(var(--brand-border))] bg-white px-5 py-4 shadow-[0_18px_40px_rgba(2,48,46,0.08)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{copy.labels.selectedSystem}</p>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <select
                      value={selectedSystemId}
                      onChange={(event) => setSelectedSystemId(event.target.value)}
                      className="h-11 w-full rounded-2xl border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))] px-4 text-sm text-[hsl(var(--brand-deep))] outline-none transition focus:border-[hsl(var(--primary))]"
                    >
                      <option value="">{copy.placeholders.selectSystem}</option>
                      {systems.map((system) => (
                        <option key={system.id} value={system.id}>
                          {getSystemDisplayName(system)}
                        </option>
                      ))}
                    </select>
                    <Button asChild variant="outline" className="rounded-2xl">
                      <Link href="/registro-sistemas-ia">
                        <Plus className="h-4 w-4" />
                        {copy.actions.goRegistry}
                      </Link>
                    </Button>
                  </div>
                </div>

                {selectedSystem ? (
                  <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                    <div className="rounded-2xl bg-[hsl(var(--brand-muted))] px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{copy.labels.stage}</p>
                      <p className="mt-1 font-medium text-[hsl(var(--brand-deep))]">{selectedSystem.systemStage || "-"}</p>
                    </div>
                    <div className="rounded-2xl bg-[hsl(var(--brand-muted))] px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{copy.labels.risk}</p>
                      <p className="mt-1 font-medium text-[hsl(var(--brand-deep))]">{selectedSystem.globalRiskLevel || "-"}</p>
                    </div>
                    <div className="rounded-2xl bg-[hsl(var(--brand-muted))] px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{copy.labels.responsibleOwner}</p>
                      <p className="mt-1 font-medium text-[hsl(var(--brand-deep))]">{selectedSystem.internalOwner || copy.misc.noOwner}</p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-4">
                <ModuleSubnav
                  items={navItems.map((item) => ({
                    id: item.id || item.label,
                    label: item.label,
                    icon: item.icon,
                    badge: item.badge,
                  }))}
                  activeId={activeTab}
                  onChange={(id) => setActiveTab(id as WorkspaceTab)}
                />
              </div>
            </div>

            {activeTab === "dashboard" && draft && summary ? (
              <div className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-3">
                  <MetricCard
                    label={copy.labels.score}
                    value={formatScore(summary.globalScore)}
                    sublabel={`${copy.labels.target}: 3 / 4`}
                    accentClassName={summary.globalScore >= 3 ? "text-emerald-600" : summary.globalScore >= 2 ? "text-amber-600" : "text-orange-600"}
                  />
                  <MetricCard
                    label={copy.labels.evaluatedControls}
                    value={`${summary.evaluatedControls}/${summary.totalControls}`}
                    sublabel={`${summary.completion}% completado`}
                  />
                  <MetricCard
                    label={copy.labels.criticalAlerts}
                    value={String(summary.alerts.length)}
                    sublabel={summary.alerts.length ? copy.labels.remediationPlan : copy.misc.noEvidence}
                    accentClassName={summary.alerts.length ? "text-red-600" : "text-emerald-600"}
                  />
                </div>

                <div className="grid gap-5 xl:grid-cols-[1.35fr,0.8fr]">
                  <Card className="border-brand bg-white/95">
                    <CardHeader>
                      <CardTitle className="text-[hsl(var(--brand-deep))]">{copy.labels.scoreByDomain}</CardTitle>
                      <CardDescription>{copy.labels.controlsVisible}: {applicableControls.length}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {summary.domainScores.map((item) => (
                        <div key={item.domain.id} className="rounded-[26px] border border-[hsl(var(--brand-border))] bg-white px-4 py-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-lg font-semibold text-[hsl(var(--brand-deep))]">
                                {item.domain.id} · {item.domain.name}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">{item.domain.reference}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-semibold text-[hsl(var(--brand-deep))]">{formatScore(item.score)} / 4</p>
                              <p className="text-sm text-slate-500">{item.evaluatedControls}/{item.totalControls}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="h-2 rounded-full bg-[hsl(var(--brand-muted))]">
                              <div
                                className={cn("h-2 rounded-full transition-all duration-500", getDomainScoreTone(item.score))}
                                style={{ width: `${(item.score / 4) * 100}%` }}
                              />
                            </div>
                            <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                              <span>{copy.labels.evaluatedControls}: {item.evaluatedControls}/{item.totalControls}</span>
                              <span>{copy.labels.benchmark}: {item.domain.benchmarkScore}/4</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <div className="space-y-5">
                    <Card className="border-brand bg-white/95">
                      <CardHeader>
                        <CardTitle className="text-[hsl(var(--brand-deep))]">{copy.labels.maturityProfile}</CardTitle>
                        <CardDescription>{copy.labels.benchmark}: 3 / 4</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RadarChart
                          points={summary.domainScores.map((item) => ({
                            label: item.domain.id,
                            score: item.score,
                          }))}
                          benchmark={3}
                        />
                        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-6 rounded-full bg-[hsl(var(--brand-deep))]" />
                            {copy.misc.current}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-6 rounded-full border border-slate-300 border-dashed" />
                            {copy.labels.target}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-brand bg-white/95">
                      <CardHeader>
                        <CardTitle className="text-[hsl(var(--brand-deep))]">{copy.labels.latestSnapshots}</CardTitle>
                        <CardDescription>{snapshots.length ? `${snapshots.length} snapshots` : copy.labels.noSnapshots}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {snapshots.slice(0, 3).map((snapshot) => {
                          const snapshotSummary = createHistorySummary(snapshot, catalog)
                          return (
                            <div key={snapshot.snapshotId} className="rounded-2xl border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))] px-4 py-3">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-medium text-[hsl(var(--brand-deep))]">{formatDateLabel(snapshot.createdAt, language)}</p>
                                  <p className="text-sm text-slate-500">
                                    {snapshot.mode === "quick" ? copy.misc.quickScope : copy.misc.completeScope}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-[hsl(var(--brand-deep))]">{formatScore(snapshotSummary.globalScore)} / 4</p>
                                  <p className="text-sm text-slate-500">{snapshotSummary.alerts.length} alertas</p>
                                </div>
                              </div>
                            </div>
                          )
                        })}

                        {!snapshots.length ? <p className="text-sm text-slate-500">{copy.labels.noSnapshots}</p> : null}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "assessment" && draft && summary ? (
              <div className="grid gap-5 xl:grid-cols-[1.35fr,0.62fr]">
                <div className="space-y-5">
                  {isMobileReadonly ? (
                    <Alert className="border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))] text-[hsl(var(--brand-deep))]">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>{copy.labels.mobileReadOnly}</AlertTitle>
                      <AlertDescription>{copy.pageMeta.assessment.description}</AlertDescription>
                    </Alert>
                  ) : null}

                  <Card className="border-brand bg-white/95">
                    <CardHeader>
                      <CardTitle className="text-[hsl(var(--brand-deep))]">{copy.labels.evaluationMode}</CardTitle>
                      <CardDescription>{copy.labels.selectedDomains}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => persistDraft((current) => ({ ...current, mode: "complete" }))}
                          className={cn(
                            "rounded-2xl px-4 py-2 text-sm transition-all",
                            draft.mode === "complete" ? "bg-[hsl(var(--brand-deep))] text-white" : "bg-[hsl(var(--brand-muted))] text-[hsl(var(--brand-deep))]",
                          )}
                          disabled={isMobileReadonly}
                        >
                          {copy.actions.completeMode}
                        </button>
                        <button
                          type="button"
                          onClick={() => persistDraft((current) => ({ ...current, mode: "quick" }))}
                          className={cn(
                            "rounded-2xl px-4 py-2 text-sm transition-all",
                            draft.mode === "quick" ? "bg-[hsl(var(--brand-deep))] text-white" : "bg-[hsl(var(--brand-muted))] text-[hsl(var(--brand-deep))]",
                          )}
                          disabled={isMobileReadonly}
                        >
                          {copy.actions.quickMode}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {AI_SECURITY_DOMAINS.map((domain) => {
                          const active = draft.selectedDomains.includes(domain.id)
                          return (
                            <button
                              key={domain.id}
                              type="button"
                              onClick={() => toggleDomain(domain.id)}
                              disabled={isMobileReadonly}
                              className={cn(
                                "rounded-full border px-3 py-1.5 text-sm transition-all",
                                active
                                  ? "border-[hsl(var(--primary))]/30 bg-[hsl(var(--primary))]/10 text-[hsl(var(--brand-deep))]"
                                  : "border-[hsl(var(--brand-border))] bg-white text-slate-500",
                              )}
                            >
                              {domain.id}
                            </button>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-brand bg-white/95">
                    <CardHeader className="space-y-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <CardTitle className="text-[hsl(var(--brand-deep))]">{copy.labels.currentDomain}</CardTitle>
                          <CardDescription>{getDomainById(activeDomainId).description}</CardDescription>
                        </div>
                        <div className="inline-flex rounded-full bg-[hsl(var(--brand-muted))] p-1">
                          {availableDomainIds.map((domainId) => (
                            <button
                              key={domainId}
                              type="button"
                              onClick={() => setActiveDomainId(domainId)}
                              className={cn(
                                "rounded-full px-3 py-1.5 text-sm transition-all",
                                activeDomainId === domainId ? "bg-white text-[hsl(var(--brand-deep))] shadow-sm" : "text-slate-500",
                              )}
                            >
                              {domainId}
                            </button>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {currentDomainControls.map((control) => {
                        const response = draft.responses[control.controlId] || { level: null, notes: "", evidences: [], updatedAt: null }
                        const evidenceDraft = evidenceDrafts[control.controlId] || { name: "", note: "", kind: "document" as AISecurityEvidenceKind }
                        return (
                          <div key={control.controlId} className="rounded-[28px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))] p-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-sm font-semibold text-[hsl(var(--primary))]">{control.controlId}</span>
                                  <span className={cn("rounded-full border px-2 py-1 text-[11px] font-semibold", getWeightClasses(control.weight))}>
                                    {getWeightLabel(control.weight, language)}
                                  </span>
                                  <span className={cn("rounded-full border px-2 py-1 text-[11px] font-semibold", getLevelMeta(control.requiredLevel).color)}>
                                    {copy.labels.requiredLevel}: {control.requiredLevel}
                                  </span>
                                </div>
                                <p className="text-2xl font-semibold leading-tight text-[hsl(var(--brand-deep))]">{control.question}</p>
                                <p className="text-sm leading-6 text-slate-600">{control.description}</p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {[0, 1, 2, 3, 4].map((level) => {
                                  const active = response.level === level
                                  return (
                                    <button
                                      key={level}
                                      type="button"
                                      onClick={() =>
                                        updateResponse(control.controlId, (current) => ({
                                          ...current,
                                          level,
                                          updatedAt: new Date().toISOString(),
                                        }))
                                      }
                                      disabled={isMobileReadonly}
                                      className={cn(
                                        "h-11 w-11 rounded-2xl border text-base font-semibold transition-all",
                                        active
                                          ? getLevelMeta(level).color
                                          : "border-[hsl(var(--brand-border))] bg-white text-slate-500 hover:border-[hsl(var(--primary))]/50",
                                      )}
                                    >
                                      {level}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                              <span className={cn("rounded-full border px-3 py-1", getLevelMeta(response.level).color)}>
                                {copy.labels.currentLevel}: {response.level ?? "-"} · {getLevelMeta(response.level).label}
                              </span>
                              <span>{copy.labels.references}: {control.referenceFrameworks.join(", ")}</span>
                            </div>

                            <div className="mt-5 grid gap-4 xl:grid-cols-[1fr,0.92fr]">
                              <div className="space-y-4">
                                <div>
                                  <p className="mb-2 text-sm font-semibold text-[hsl(var(--brand-deep))]">{copy.labels.notes}</p>
                                  <Textarea
                                    value={response.notes}
                                    onChange={(event) =>
                                      updateResponse(control.controlId, (current) => ({
                                        ...current,
                                        notes: event.target.value,
                                        updatedAt: new Date().toISOString(),
                                      }))
                                    }
                                    placeholder={copy.placeholders.notes}
                                    className="min-h-[112px] rounded-2xl border-[hsl(var(--brand-border))] bg-white"
                                    disabled={isMobileReadonly}
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setExpandedAssessmentId((current) => (current === control.controlId ? null : control.controlId))}
                                  className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--brand-deep))]"
                                >
                                  {expandedAssessmentId === control.controlId ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                  {copy.labels.requiredEvidence}
                                </button>
                              </div>

                              <div className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-white px-4 py-4">
                                <p className="text-sm font-semibold text-[hsl(var(--brand-deep))]">{copy.labels.implementationGuide}</p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{control.implementationGuide}</p>
                                <div className="mt-4 space-y-3">
                                  <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{copy.labels.suggestedTools}</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {control.suggestedTools.map((tool) => (
                                        <span key={tool} className="rounded-full bg-[hsl(var(--brand-muted))] px-3 py-1 text-xs text-[hsl(var(--brand-deep))]">
                                          {tool}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{copy.labels.threatCoverage}</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {control.threatCategories.map((threat) => (
                                        <span key={threat} className="rounded-full border border-[hsl(var(--brand-border))] px-3 py-1 text-xs text-slate-500">
                                          {threat}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {expandedAssessmentId === control.controlId ? (
                              <div className="mt-5 rounded-[24px] border border-[hsl(var(--brand-border))] bg-white p-4">
                                <div className="grid gap-5 xl:grid-cols-[0.9fr,1.1fr]">
                                  <div>
                                    <p className="text-sm font-semibold text-[hsl(var(--brand-deep))]">{copy.labels.requiredEvidence}</p>
                                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                      {control.requiredEvidence.map((item) => (
                                        <li key={item} className="flex gap-2">
                                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
                                          <span>{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div>
                                    <p className="text-sm font-semibold text-[hsl(var(--brand-deep))]">{copy.labels.registeredEvidence}</p>
                                    <div className="mt-3 space-y-2">
                                      {(response.evidences || []).map((evidence) => (
                                        <div key={evidence.id} className="flex items-start justify-between gap-3 rounded-2xl border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))] px-3 py-3">
                                          <div>
                                            <p className="font-medium text-[hsl(var(--brand-deep))]">{evidence.name}</p>
                                            <p className="mt-1 text-sm text-slate-500">{evidence.note}</p>
                                            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
                                              {getEvidenceKindLabel(evidence.kind, language)}
                                            </p>
                                          </div>
                                          {!isMobileReadonly ? (
                                            <Button variant="ghost" size="sm" onClick={() => handleEvidenceRemove(control.controlId, evidence.id)}>
                                              {language === "en" ? "Remove" : "Quitar"}
                                            </Button>
                                          ) : null}
                                        </div>
                                      ))}

                                      {!response.evidences?.length ? (
                                        <p className="rounded-2xl border border-dashed border-[hsl(var(--brand-border))] px-3 py-4 text-sm text-slate-500">
                                          {copy.misc.noEvidence}
                                        </p>
                                      ) : null}
                                    </div>

                                    {!isMobileReadonly ? (
                                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                                        <Input
                                          value={evidenceDraft.name}
                                          onChange={(event) =>
                                            setEvidenceDrafts((prev) => ({
                                              ...prev,
                                              [control.controlId]: { ...evidenceDraft, name: event.target.value },
                                            }))
                                          }
                                          placeholder={copy.placeholders.evidenceName}
                                          className="rounded-2xl border-[hsl(var(--brand-border))]"
                                        />
                                        <select
                                          value={evidenceDraft.kind}
                                          onChange={(event) =>
                                            setEvidenceDrafts((prev) => ({
                                              ...prev,
                                              [control.controlId]: { ...evidenceDraft, kind: event.target.value as AISecurityEvidenceKind },
                                            }))
                                          }
                                          className="h-10 rounded-2xl border border-[hsl(var(--brand-border))] bg-white px-3 text-sm text-[hsl(var(--brand-deep))]"
                                        >
                                          <option value="document">{copy.misc.document}</option>
                                          <option value="log">{copy.misc.log}</option>
                                          <option value="config">{copy.misc.config}</option>
                                          <option value="link">{copy.misc.link}</option>
                                          <option value="note">{copy.misc.note}</option>
                                        </select>
                                        <Textarea
                                          value={evidenceDraft.note}
                                          onChange={(event) =>
                                            setEvidenceDrafts((prev) => ({
                                              ...prev,
                                              [control.controlId]: { ...evidenceDraft, note: event.target.value },
                                            }))
                                          }
                                          placeholder={copy.placeholders.evidenceNote}
                                          className="md:col-span-2 rounded-2xl border-[hsl(var(--brand-border))]"
                                        />
                                        <Button onClick={() => handleEvidenceAdd(control.controlId)} className="md:w-fit">
                                          <Plus className="h-4 w-4" />
                                          {copy.actions.addEvidence}
                                        </Button>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        )
                      })}

                      {!currentDomainControls.length ? (
                        <p className="rounded-[24px] border border-dashed border-[hsl(var(--brand-border))] px-4 py-8 text-center text-sm text-slate-500">
                          {copy.misc.noResults}
                        </p>
                      ) : null}

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const index = availableDomainIds.indexOf(activeDomainId)
                            if (index > 0) setActiveDomainId(availableDomainIds[index - 1])
                          }}
                          disabled={availableDomainIds.indexOf(activeDomainId) <= 0}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          {copy.actions.previousDomain}
                        </Button>
                        <Button
                          onClick={() => {
                            const index = availableDomainIds.indexOf(activeDomainId)
                            if (index < availableDomainIds.length - 1) setActiveDomainId(availableDomainIds[index + 1])
                          }}
                          disabled={availableDomainIds.indexOf(activeDomainId) === availableDomainIds.length - 1}
                        >
                          {copy.actions.nextDomain}
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-5 xl:sticky xl:top-24 xl:self-start">
                  <Card className="border-brand bg-white/95">
                    <CardHeader>
                      <CardTitle className="text-[hsl(var(--brand-deep))]">{copy.labels.score}</CardTitle>
                      <CardDescription>{copy.labels.draftStatus}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="rounded-[24px] bg-[hsl(var(--brand-muted))] px-4 py-4">
                        <p className="text-4xl font-semibold text-[hsl(var(--brand-deep))]">{formatScore(summary.globalScore)} / 4</p>
                        <p className="mt-1 text-sm text-slate-500">{copy.labels.lastSaved}: {formatDateLabel(draft.lastSavedAt, language)}</p>
                      </div>
                      {summary.domainScores.map((item) => (
                        <div key={item.domain.id}>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-medium text-[hsl(var(--brand-deep))]">{item.domain.id}</span>
                            <span className="text-slate-500">{formatScore(item.score)}</span>
                          </div>
                          <Progress value={(item.score / 4) * 100} className="h-2 [&>div]:bg-[hsl(var(--brand-deep))]" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-brand bg-white/95">
                    <CardHeader>
                      <CardTitle className="text-[hsl(var(--brand-deep))]">{copy.labels.criticalAlerts}</CardTitle>
                      <CardDescription>{summary.alerts.length ? copy.labels.remediationPlan : copy.misc.noEvidence}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {summary.alerts.slice(0, 4).map((alert) => (
                        <div key={alert.id} className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                          {alert.message}
                        </div>
                      ))}
                      {!summary.alerts.length ? <p className="text-sm text-slate-500">{copy.misc.noEvidence}</p> : null}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : null}

            {activeTab === "catalog" && draft ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex rounded-full bg-[hsl(var(--brand-muted))] p-1">
                    <button
                      type="button"
                      onClick={() => setCatalogView("controls")}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm transition-all",
                        catalogView === "controls" ? "bg-white text-[hsl(var(--brand-deep))] shadow-sm" : "text-slate-500",
                      )}
                    >
                      {copy.labels.allControls}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCatalogView("cross-reference")}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm transition-all",
                        catalogView === "cross-reference" ? "bg-white text-[hsl(var(--brand-deep))] shadow-sm" : "text-slate-500",
                      )}
                    >
                      {copy.labels.crossReference}
                    </button>
                  </div>

                  {userRole === "admin" ? (
                    <Button variant="outline" onClick={() => setCustomDialogOpen(true)}>
                      <Plus className="h-4 w-4" />
                      {copy.actions.addControl}
                    </Button>
                  ) : null}
                </div>

                {catalogView === "controls" ? (
                  <>
                    <Card className="border-brand bg-white/95">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-[hsl(var(--brand-deep))]">
                          <Search className="h-5 w-5 text-[hsl(var(--primary))]" />
                          {copy.labels.filters}
                        </CardTitle>
                        <CardDescription>{copy.labels.controlsVisible}: {filteredCatalog.length}</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-3 lg:grid-cols-6">
                        <Input
                          value={catalogSearch}
                          onChange={(event) => setCatalogSearch(event.target.value)}
                          placeholder={copy.placeholders.searchControls}
                          className="rounded-2xl border-[hsl(var(--brand-border))] lg:col-span-2"
                        />
                        <select
                          value={catalogDomainFilter}
                          onChange={(event) => setCatalogDomainFilter(event.target.value as typeof catalogDomainFilter)}
                          className="h-10 rounded-2xl border border-[hsl(var(--brand-border))] bg-white px-3 text-sm text-[hsl(var(--brand-deep))]"
                        >
                          <option value="ALL">{copy.misc.allDomains}</option>
                          {AI_SECURITY_DOMAINS.map((domain) => (
                            <option key={domain.id} value={domain.id}>
                              {domain.id}
                            </option>
                          ))}
                        </select>
                        <select
                          value={catalogWeightFilter}
                          onChange={(event) => setCatalogWeightFilter(event.target.value as typeof catalogWeightFilter)}
                          className="h-10 rounded-2xl border border-[hsl(var(--brand-border))] bg-white px-3 text-sm text-[hsl(var(--brand-deep))]"
                        >
                          <option value="ALL">{copy.labels.onlyCritical}</option>
                          <option value="CRITICO">{getWeightLabel("CRITICO", language)}</option>
                          <option value="ALTO">{getWeightLabel("ALTO", language)}</option>
                          <option value="ESTANDAR">{getWeightLabel("ESTANDAR", language)}</option>
                        </select>
                        <select
                          value={catalogFrameworkFilter}
                          onChange={(event) => setCatalogFrameworkFilter(event.target.value)}
                          className="h-10 rounded-2xl border border-[hsl(var(--brand-border))] bg-white px-3 text-sm text-[hsl(var(--brand-deep))]"
                        >
                          <option value="ALL">Framework</option>
                          {frameworks.map((framework) => (
                            <option key={framework} value={framework}>
                              {framework}
                            </option>
                          ))}
                        </select>
                        <label className="flex items-center gap-2 rounded-2xl border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))] px-3 text-sm text-[hsl(var(--brand-deep))]">
                          <input
                            type="checkbox"
                            checked={catalogCriticalOnly}
                            onChange={(event) => setCatalogCriticalOnly(event.target.checked)}
                          />
                          {copy.labels.onlyCritical}
                        </label>

                        <select
                          value={catalogImplementationFilter}
                          onChange={(event) => setCatalogImplementationFilter(event.target.value as typeof catalogImplementationFilter)}
                          className="h-10 rounded-2xl border border-[hsl(var(--brand-border))] bg-white px-3 text-sm text-[hsl(var(--brand-deep))]"
                        >
                          <option value="ALL">Implementación</option>
                          <option value="TECNICO">Técnico</option>
                          <option value="ORGANIZACIONAL">Organizacional</option>
                          <option value="PROCEDIMENTAL">Procedimental</option>
                          <option value="CONTRACTUAL">Contractual</option>
                        </select>
                        <select
                          value={catalogEnvironmentFilter}
                          onChange={(event) => setCatalogEnvironmentFilter(event.target.value as typeof catalogEnvironmentFilter)}
                          className="h-10 rounded-2xl border border-[hsl(var(--brand-border))] bg-white px-3 text-sm text-[hsl(var(--brand-deep))]"
                        >
                          <option value="ALL">Entorno</option>
                          <option value="TODOS">Todos</option>
                          <option value="ON_PREMISES">On premises</option>
                          <option value="CLOUD_PRIVADO">Cloud privado</option>
                          <option value="HIBRIDO">Híbrido</option>
                        </select>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      {filteredCatalog.map((control) => (
                        <Card key={control.controlId} className="border-brand bg-white/95">
                          <CardContent className="p-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-sm font-semibold text-[hsl(var(--primary))]">{control.controlId}</span>
                                  <span className={cn("rounded-full border px-2 py-1 text-[11px] font-semibold", getWeightClasses(control.weight))}>
                                    {getWeightLabel(control.weight, language)}
                                  </span>
                                  <span className="rounded-full border border-[hsl(var(--brand-border))] px-2 py-1 text-[11px] font-semibold text-slate-500">
                                    {control.seeded ? copy.labels.seededControls : copy.labels.customControls}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-xl font-semibold text-[hsl(var(--brand-deep))]">{control.title}</p>
                                  <p className="mt-2 text-sm leading-6 text-slate-600">{control.description}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                                  {control.referenceFrameworks.map((reference) => (
                                    <span key={reference} className="rounded-full bg-[hsl(var(--brand-muted))] px-3 py-1">
                                      {reference}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <Button variant="outline" onClick={() => setExpandedCatalogId((current) => (current === control.controlId ? null : control.controlId))}>
                                {expandedCatalogId === control.controlId ? (language === "en" ? "Hide detail" : "Ocultar detalle") : (language === "en" ? "View detail" : "Ver detalle")}
                              </Button>
                            </div>

                            {expandedCatalogId === control.controlId ? (
                              <div className="mt-5 grid gap-5 border-t border-[hsl(var(--brand-border))] pt-5 lg:grid-cols-[1fr,1fr]">
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm font-semibold text-[hsl(var(--brand-deep))]">{copy.labels.references}</p>
                                    <p className="mt-2 text-sm text-slate-600">
                                      {[...control.referenceFrameworks, ...control.cpgReferences].join(" · ")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-[hsl(var(--brand-deep))]">{copy.labels.requiredEvidence}</p>
                                    <ul className="mt-2 space-y-2 text-sm text-slate-600">
                                      {control.requiredEvidence.map((item) => (
                                        <li key={item} className="flex gap-2">
                                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
                                          <span>{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm font-semibold text-[hsl(var(--brand-deep))]">{copy.labels.implementationGuide}</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{control.implementationGuide}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-[hsl(var(--brand-deep))]">{copy.labels.threatCoverage}</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {control.threatCategories.map((threat) => (
                                        <span key={threat} className="rounded-full border border-[hsl(var(--brand-border))] px-3 py-1 text-xs text-slate-500">
                                          {threat}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {!filteredCatalog.length ? (
                      <Card className="border-brand bg-white/95">
                        <CardContent className="px-5 py-10 text-center text-sm text-slate-500">{copy.misc.noResults}</CardContent>
                      </Card>
                    ) : null}
                  </>
                ) : (
                  <Card className="border-brand bg-white/95">
                    <CardHeader>
                      <CardTitle className="text-[hsl(var(--brand-deep))]">{copy.labels.frameworkMap}</CardTitle>
                      <CardDescription>{AI_SECURITY_CROSS_REFERENCE.length} categorías de equivalencia</CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                      <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-[hsl(var(--brand-border))] text-slate-500">
                            <th className="px-3 py-3">{language === "en" ? "Category" : "Categoría"}</th>
                            <th className="px-3 py-3">NSA/CISA</th>
                            <th className="px-3 py-3">NIST AI RMF</th>
                            <th className="px-3 py-3">OWASP</th>
                            <th className="px-3 py-3">EU AI Act</th>
                            <th className="px-3 py-3">ISO 42001</th>
                          </tr>
                        </thead>
                        <tbody>
                          {AI_SECURITY_CROSS_REFERENCE.map((row: AISecurityCrossReferenceRow) => (
                            <tr key={row.category} className="border-b border-[hsl(var(--brand-border))] last:border-none">
                              <td className="px-3 py-4 font-medium text-[hsl(var(--brand-deep))]">{row.category}</td>
                              <td className="px-3 py-4 text-slate-600">{row.nsaCisa}</td>
                              <td className="px-3 py-4 text-slate-600">{row.nistAiRmf}</td>
                              <td className="px-3 py-4 text-slate-600">{row.owasp}</td>
                              <td className="px-3 py-4 text-slate-600">{row.euAiAct}</td>
                              <td className="px-3 py-4 text-slate-600">{row.iso42001}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : null}

            {activeTab === "report" && draft && summary ? (
              <div className="space-y-5">
                <div className="grid gap-5 xl:grid-cols-[1fr,1fr]">
                  <Card className="border-brand bg-white/95">
                    <CardHeader>
                      <CardTitle className="text-[hsl(var(--brand-deep))]">{copy.labels.criticalAlerts}</CardTitle>
                      <CardDescription>{summary.alerts.length ? `${summary.alerts.length} activas` : copy.misc.noEvidence}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {summary.alerts.map((alert) => (
                        <div key={alert.id} className="rounded-[22px] border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                          {alert.message}
                        </div>
                      ))}
                      {!summary.alerts.length ? <p className="text-sm text-slate-500">{copy.misc.noEvidence}</p> : null}
                    </CardContent>
                  </Card>

                  <Card className="border-brand bg-white/95">
                    <CardHeader>
                      <CardTitle className="text-[hsl(var(--brand-deep))]">{copy.labels.remediationPlan}</CardTitle>
                      <CardDescription>{draft.remediationPlan.length} acciones priorizadas</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {draft.remediationPlan.map((item, index) => (
                        <div key={item.id} className="rounded-[22px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))] px-4 py-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--brand-deep))] text-sm text-white">
                              {index + 1}
                            </div>
                            <div className="flex-1 space-y-3">
                              <div>
                                <p className="font-semibold text-[hsl(var(--brand-deep))]">{item.recommendedWindow}: {item.title}</p>
                                <p className="mt-1 text-sm text-slate-600">{item.reference}</p>
                              </div>
                              <div className="grid gap-3 md:grid-cols-3">
                                <Input
                                  value={item.owner}
                                  onChange={(event) =>
                                    persistDraft((current) => ({
                                      ...current,
                                      remediationPlan: current.remediationPlan.map((entry) =>
                                        entry.id === item.id ? { ...entry, owner: event.target.value } : entry,
                                      ),
                                    }))
                                  }
                                  placeholder={copy.placeholders.owner}
                                  className="rounded-2xl border-[hsl(var(--brand-border))] bg-white"
                                />
                                <Input
                                  type="date"
                                  value={item.dueDate}
                                  onChange={(event) =>
                                    persistDraft((current) => ({
                                      ...current,
                                      remediationPlan: current.remediationPlan.map((entry) =>
                                        entry.id === item.id ? { ...entry, dueDate: event.target.value } : entry,
                                      ),
                                    }))
                                  }
                                  className="rounded-2xl border-[hsl(var(--brand-border))] bg-white"
                                />
                                <select
                                  value={item.status}
                                  onChange={(event) =>
                                    persistDraft((current) => ({
                                      ...current,
                                      remediationPlan: current.remediationPlan.map((entry) =>
                                        entry.id === item.id ? { ...entry, status: event.target.value as AISecurityRemediationItem["status"] } : entry,
                                      ),
                                    }))
                                  }
                                  className="h-10 rounded-2xl border border-[hsl(var(--brand-border))] bg-white px-3 text-sm text-[hsl(var(--brand-deep))]"
                                >
                                  <option value="pending">{copy.misc.pending}</option>
                                  <option value="in_progress">{copy.misc.inProgress}</option>
                                  <option value="completed">{copy.misc.completed}</option>
                                </select>
                              </div>
                              <Textarea
                                value={item.note}
                                onChange={(event) =>
                                  persistDraft((current) => ({
                                    ...current,
                                    remediationPlan: current.remediationPlan.map((entry) =>
                                      entry.id === item.id ? { ...entry, note: event.target.value } : entry,
                                    ),
                                  }))
                                }
                                className="rounded-2xl border-[hsl(var(--brand-border))] bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-brand bg-white/95">
                  <CardHeader>
                    <CardTitle className="text-[hsl(var(--brand-deep))]">{copy.labels.trend}</CardTitle>
                    <CardDescription>{historyPoints.length} puntos visibles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TrendChart points={historyPoints} language={language} />
                  </CardContent>
                </Card>

                <Card className="border-brand bg-white/95">
                  <CardHeader>
                    <CardTitle className="text-[hsl(var(--brand-deep))]">{copy.labels.comparison}</CardTitle>
                    <CardDescription>{copy.actions.compareSnapshots}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-3 md:grid-cols-2">
                      <select
                        value={comparisonLeftId}
                        onChange={(event) => setComparisonLeftId(event.target.value)}
                        className="h-10 rounded-2xl border border-[hsl(var(--brand-border))] bg-white px-3 text-sm text-[hsl(var(--brand-deep))]"
                      >
                        <option value="">{copy.labels.comparisonLeft}</option>
                        {snapshots.map((snapshot) => (
                          <option key={snapshot.snapshotId} value={snapshot.snapshotId}>
                            {formatDateLabel(snapshot.createdAt, language)}
                          </option>
                        ))}
                      </select>
                      <select
                        value={comparisonRightId}
                        onChange={(event) => setComparisonRightId(event.target.value)}
                        className="h-10 rounded-2xl border border-[hsl(var(--brand-border))] bg-white px-3 text-sm text-[hsl(var(--brand-deep))]"
                      >
                        <option value="">{copy.labels.comparisonRight}</option>
                        {snapshots.map((snapshot) => (
                          <option key={snapshot.snapshotId} value={snapshot.snapshotId}>
                            {formatDateLabel(snapshot.createdAt, language)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {comparisonLeft && comparisonRight && comparisonLeftSummary && comparisonRightSummary ? (
                      <div className="space-y-3">
                        {AI_SECURITY_DOMAINS.map((domain) => {
                          const leftScore = comparisonLeftSummary.domainScores.find((item) => item.domain.id === domain.id)?.score || 0
                          const rightScore = comparisonRightSummary.domainScores.find((item) => item.domain.id === domain.id)?.score || 0
                          const delta = rightScore - leftScore
                          return (
                            <div key={domain.id} className="rounded-[22px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))] px-4 py-4">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-[hsl(var(--brand-deep))]">{domain.id} · {domain.name}</p>
                                  <p className="text-sm text-slate-500">
                                    {formatScore(leftScore)} → {formatScore(rightScore)}
                                  </p>
                                </div>
                                <span
                                  className={cn(
                                    "rounded-full px-3 py-1 text-sm font-semibold",
                                    delta > 0 ? "bg-emerald-100 text-emerald-700" : delta < 0 ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600",
                                  )}
                                >
                                  {delta > 0 ? "+" : ""}
                                  {formatScore(delta)}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">{copy.labels.noSnapshots}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </>
        )}
      </div>

      <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{copy.labels.customControlForm}</DialogTitle>
            <DialogDescription>{copy.labels.customControlHint}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              value={customControlForm.controlId}
              onChange={(event) => setCustomControlForm((prev) => ({ ...prev, controlId: event.target.value }))}
              placeholder={copy.placeholders.controlId}
            />
            <select
              value={customControlForm.domainId}
              onChange={(event) => setCustomControlForm((prev) => ({ ...prev, domainId: event.target.value as AISecurityDomainId }))}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-[hsl(var(--brand-deep))]"
            >
              {AI_SECURITY_DOMAINS.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.id} · {domain.shortName}
                </option>
              ))}
            </select>
            <Input
              value={customControlForm.title}
              onChange={(event) => setCustomControlForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder={copy.placeholders.controlTitle}
              className="md:col-span-2"
            />
            <Input
              value={customControlForm.question}
              onChange={(event) => setCustomControlForm((prev) => ({ ...prev, question: event.target.value }))}
              placeholder={copy.placeholders.controlQuestion}
              className="md:col-span-2"
            />
            <Textarea
              value={customControlForm.description}
              onChange={(event) => setCustomControlForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder={copy.placeholders.controlDescription}
              className="md:col-span-2"
            />
            <select
              value={customControlForm.weight}
              onChange={(event) => setCustomControlForm((prev) => ({ ...prev, weight: event.target.value as AISecurityControlWeight }))}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-[hsl(var(--brand-deep))]"
            >
              <option value="CRITICO">{getWeightLabel("CRITICO", language)}</option>
              <option value="ALTO">{getWeightLabel("ALTO", language)}</option>
              <option value="ESTANDAR">{getWeightLabel("ESTANDAR", language)}</option>
            </select>
            <select
              value={String(customControlForm.requiredLevel)}
              onChange={(event) => setCustomControlForm((prev) => ({ ...prev, requiredLevel: Number(event.target.value) }))}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-[hsl(var(--brand-deep))]"
            >
              {[0, 1, 2, 3, 4].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <select
              value={customControlForm.implementationType}
              onChange={(event) =>
                setCustomControlForm((prev) => ({
                  ...prev,
                  implementationType: event.target.value as AISecurityControl["implementationType"],
                }))
              }
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-[hsl(var(--brand-deep))]"
            >
              <option value="TECNICO">Técnico</option>
              <option value="ORGANIZACIONAL">Organizacional</option>
              <option value="PROCEDIMENTAL">Procedimental</option>
              <option value="CONTRACTUAL">Contractual</option>
            </select>
            <Input
              value={customControlForm.frameworks}
              onChange={(event) => setCustomControlForm((prev) => ({ ...prev, frameworks: event.target.value }))}
              placeholder={copy.placeholders.frameworks}
            />
            <Input
              value={customControlForm.evidence}
              onChange={(event) => setCustomControlForm((prev) => ({ ...prev, evidence: event.target.value }))}
              placeholder={copy.placeholders.evidence}
            />
            <Textarea
              value={customControlForm.guide}
              onChange={(event) => setCustomControlForm((prev) => ({ ...prev, guide: event.target.value }))}
              placeholder={copy.placeholders.guide}
              className="md:col-span-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomDialogOpen(false)}>
              {language === "en" ? "Cancel" : "Cancelar"}
            </Button>
            <Button onClick={handleCustomControlCreate}>
              {copy.actions.addControl}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </GeneralTabShell>
  )
}
