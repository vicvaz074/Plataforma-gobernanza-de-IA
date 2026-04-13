"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  AlertTriangle,
  BookMarked,
  ChevronRight,
  ClipboardList,
  Copy,
  Eye,
  FileStack,
  LayoutDashboard,
  Network,
  Plus,
  PlusCircle,
  Save,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react"

import { GeneralTabShell, type GeneralTabShellBadge, type GeneralTabShellNavItem } from "@/components/general-tab-shell"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/LanguageContext"
import { AI_REGISTRY_STORAGE_UPDATED_EVENT, ensureAISystemsRegistrySeeded } from "@/lib/ai-registry"
import {
  AI_RISK_ALIGNMENT_ROWS,
  AI_RISK_CATEGORY_DEFINITIONS,
  AI_RISK_INTEGRATIONS,
  AI_RISK_OPERATIONAL_PHASES,
  AI_RISK_ROLES,
  AI_RISK_STORAGE_UPDATED_EVENT,
  buildAIRiskRecord,
  createEmptyAIRiskRecord,
  createSystemOptions,
  duplicateAIRiskRecord,
  getAIRiskAlerts,
  getAIRiskSeverity,
  getAverageResolutionDays,
  getDashboardMetrics,
  getHeatMapMatrix,
  getManagementMaturityIndex,
  getMitigationOnTimeRate,
  getMonthlyTrendLabel,
  getNextReviewDateForSeverity,
  getRecurringRisks,
  getRiskOwnerLoad,
  getSystemDisplayName,
  getSystemRiskProfile,
  normalizeAIRiskRecord,
  persistAIRiskRecords,
  readAIRiskControlCatalog,
  readAIRiskRecords,
  readAIRiskSelectedSystemId,
  readAIRiskSystemSnapshots,
  readStoredIncidentReports,
  readStoredUsers,
  saveAIRiskControlCatalog,
  writeAIRiskSelectedSystemId,
  type AIRiskAttachment,
  type AIRiskCategory,
  type AIRiskControl,
  type AIRiskImpactDimension,
  type AIRiskMitigationAction,
  type AIRiskMitigationStatus,
  type AIRiskRecord,
  type AIRiskSeverity,
  type AIRiskStatus,
  type AIRiskStoredIncidentReport,
  type AIRiskSystemOption,
  type AIRiskTreatmentStrategy,
} from "@/lib/ai-risk"
import { translations } from "@/lib/translations"
import { cn } from "@/lib/utils"

type WorkspaceTab = "dashboard" | "create" | "records" | "catalog" | "framework"
type MatrixMode = "inherent" | "residual"

const probabilityLabels: Record<number, string> = {
  1: "Rara",
  2: "Improbable",
  3: "Posible",
  4: "Probable",
  5: "Casi certeza",
}

const impactLabels: Record<number, string> = {
  1: "Insignificante",
  2: "Menor",
  3: "Moderado",
  4: "Severo",
  5: "Catastrófico",
}

const lifecyclePhases = ["Diseño", "Desarrollo", "Validación", "Despliegue", "Operación", "Retiro"] as const
const riskSources = ["Técnica", "Datos", "Operativa", "Legal", "Externa", "Combinada"] as const
const riskTolerances = ["Inaceptable", "Tolerable con controles", "Aceptable"] as const
const riskStatuses = ["Identificado", "En evaluación", "Mitigación en proceso", "Mitigado", "Aceptado", "Cerrado"] as const
const treatmentStrategies = ["Mitigar", "Transferir", "Aceptar", "Evitar"] as const
const mitigationStatuses = ["Pendiente", "En proceso", "Completada"] as const
const impactDimensions = ["Personas", "Organización", "Legal", "Reputacional", "Financiero", "Operativo"] as const
const controlEffectiveness = ["Alta", "Media", "Baja", "No evaluada"] as const

function formatDate(value?: string) {
  if (!value) return "Sin fecha"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("es-MX")
}

function formatDateTime(value?: string) {
  if (!value) return "Sin fecha"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("es-MX")
}

function daysDifference(value?: string) {
  if (!value) return null
  const end = new Date(`${value}T23:59:59`).getTime()
  const now = Date.now()
  return Math.ceil((end - now) / (24 * 60 * 60 * 1000))
}

function severityClasses(severity: AIRiskSeverity) {
  if (severity === "Crítico") return "bg-red-100 text-red-800 border-red-200"
  if (severity === "Alto") return "bg-amber-100 text-amber-800 border-amber-200"
  if (severity === "Medio") return "bg-cyan-100 text-cyan-800 border-cyan-200"
  return "bg-emerald-100 text-emerald-800 border-emerald-200"
}

function statusClasses(status: AIRiskStatus) {
  if (status === "Mitigado") return "bg-emerald-100 text-emerald-800"
  if (status === "Cerrado") return "bg-slate-200 text-slate-800"
  if (status === "Aceptado") return "bg-cyan-100 text-cyan-800"
  if (status === "Mitigación en proceso") return "bg-amber-100 text-amber-800"
  if (status === "En evaluación") return "bg-indigo-100 text-indigo-800"
  return "bg-rose-100 text-rose-800"
}

function mitigationClasses(status: AIRiskMitigationStatus) {
  if (status === "Completada") return "bg-emerald-100 text-emerald-800"
  if (status === "En proceso") return "bg-amber-100 text-amber-800"
  return "bg-slate-100 text-slate-700"
}

function compactValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Sin registrar"
  return value && value.trim() ? value : "Sin registrar"
}

function createEmptyMitigationAction(): AIRiskMitigationAction {
  return {
    id: `action-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    description: "",
    owner: "",
    dueDate: "",
    status: "Pendiente",
  }
}

function SeverityBadge({ severity }: { severity: AIRiskSeverity }) {
  return <Badge className={cn("border", severityClasses(severity))}>{severity}</Badge>
}

function StatusBadge({ status }: { status: AIRiskStatus }) {
  return <Badge className={statusClasses(status)}>{status}</Badge>
}

function MetricCard({
  title,
  value,
  helper,
  tone = "default",
}: {
  title: string
  value: string | number
  helper?: string
  tone?: "default" | "critical" | "positive" | "warning"
}) {
  const toneClasses =
    tone === "critical"
      ? "border-red-200 bg-red-50/70"
      : tone === "positive"
        ? "border-emerald-200 bg-emerald-50/70"
        : tone === "warning"
          ? "border-amber-200 bg-amber-50/70"
          : "border-[hsl(var(--brand-border))] bg-white"

  return (
    <Card className={toneClasses}>
      <CardContent className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</p>
        <p className="mt-3 text-3xl font-semibold text-[hsl(var(--brand-deep))]">{value}</p>
        {helper ? <p className="mt-2 text-sm text-slate-600">{helper}</p> : null}
      </CardContent>
    </Card>
  )
}

function UserField({
  label,
  value,
  onChange,
  users,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  users: string[]
  placeholder: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {users.length > 0 ? (
        <Select value={value || undefined} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user} value={user}>
                {user}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      )}
    </div>
  )
}

function DetailSection({ title, rows }: { title: string; rows: Array<{ label: string; value: string }> }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((row) => (
          <div key={`${title}-${row.label}`} className="rounded-2xl border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/45 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{row.label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-800">{row.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function AIRiskWorkspace() {
  const { language } = useLanguage()
  const t = translations[language]
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("dashboard")
  const [records, setRecords] = useState<AIRiskRecord[]>([])
  const [catalog, setCatalog] = useState<AIRiskControl[]>([])
  const [systems, setSystems] = useState<AIRiskSystemOption[]>([])
  const [snapshots, setSnapshots] = useState(() => [] as ReturnType<typeof readAIRiskSystemSnapshots>)
  const [incidents, setIncidents] = useState<AIRiskStoredIncidentReport[]>([])
  const [users, setUsers] = useState<string[]>([])
  const [currentActor, setCurrentActor] = useState("Usuario actual")
  const [selectedSystemId, setSelectedSystemId] = useState("")
  const [matrixMode, setMatrixMode] = useState<MatrixMode>("residual")
  const [matrixFilter, setMatrixFilter] = useState<{ probability: number; impact: number; mode: MatrixMode } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [systemFilter, setSystemFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ownerFilter, setOwnerFilter] = useState("all")
  const [onlyOverdue, setOnlyOverdue] = useState(false)
  const [detailRecord, setDetailRecord] = useState<AIRiskRecord | null>(null)
  const [draft, setDraft] = useState<AIRiskRecord>(createEmptyAIRiskRecord())

  useEffect(() => {
    if (typeof window === "undefined") return

    const syncData = () => {
      const storage = window.localStorage
      const registry = ensureAISystemsRegistrySeeded(storage).systems
      const systemOptions = createSystemOptions(registry)
      const nextRecords = readAIRiskRecords(storage)
      const nextCatalog = readAIRiskControlCatalog(storage)
      const nextSnapshots = readAIRiskSystemSnapshots(storage)
      const nextIncidents = readStoredIncidentReports(storage)
      const nextUsers = readStoredUsers(storage)
        .filter((user) => user.approved !== false)
        .map((user) => user.name?.trim() || user.email?.trim() || "")
        .filter(Boolean)

      const storedSelectedSystem = readAIRiskSelectedSystemId(storage)
      const hasStoredSystem = systemOptions.some((system) => system.id === storedSelectedSystem)
      const fallbackSystem = hasStoredSystem ? storedSelectedSystem : systemOptions[0]?.id || ""

      setSystems(systemOptions)
      setRecords(nextRecords)
      setCatalog(nextCatalog)
      setSnapshots(nextSnapshots)
      setIncidents(nextIncidents)
      setUsers(nextUsers)
      setCurrentActor(storage.getItem("userName") || storage.getItem("userEmail") || "Usuario actual")
      setSelectedSystemId((current) => (current && systemOptions.some((system) => system.id === current) ? current : fallbackSystem))
    }

    syncData()

    const handleSync = () => syncData()
    window.addEventListener(AI_RISK_STORAGE_UPDATED_EVENT, handleSync as EventListener)
    window.addEventListener(AI_REGISTRY_STORAGE_UPDATED_EVENT, handleSync as EventListener)
    window.addEventListener("storage", handleSync)

    return () => {
      window.removeEventListener(AI_RISK_STORAGE_UPDATED_EVENT, handleSync as EventListener)
      window.removeEventListener(AI_REGISTRY_STORAGE_UPDATED_EVENT, handleSync as EventListener)
      window.removeEventListener("storage", handleSync)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !selectedSystemId) return
    writeAIRiskSelectedSystemId(window.localStorage, selectedSystemId)
  }, [selectedSystemId])

  useEffect(() => {
    if (!draft.identifiedBy && currentActor) {
      setDraft((previous) => ({
        ...previous,
        identifiedBy: previous.identifiedBy || currentActor,
        evaluatedBy: previous.evaluatedBy || currentActor,
      }))
    }
  }, [currentActor, draft.identifiedBy])

  const selectedSystem = systems.find((system) => system.id === selectedSystemId)
  const dashboardMetrics = getDashboardMetrics(records, systems)
  const alerts = getAIRiskAlerts(records, systems, incidents)
  const matrix = getHeatMapMatrix(records, matrixMode)
  const systemProfile = selectedSystemId ? getSystemRiskProfile(selectedSystemId, records, snapshots) : null
  const ownerLoad = getRiskOwnerLoad(records).slice(0, 4)
  const maturityIndex = getManagementMaturityIndex(records)
  const recurringRisks = getRecurringRisks(records)
  const averageResolutionDays = getAverageResolutionDays(records)
  const mitigationOnTimeRate = getMitigationOnTimeRate(records)

  const selectedCategoryControls = catalog.filter((control) => control.category === draft.category)
  const visibleIncidents = incidents.filter((incident) => {
    if (!draft.systemName) return true
    const incidentSystemName = incident.report?.system?.nombreSistema?.trim().toLowerCase()
    return incidentSystemName === draft.systemName.trim().toLowerCase()
  })

  const filteredRecords = records.filter((record) => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !normalizedSearch ||
      [record.riskId, record.riskName, record.systemName, record.subcategory, record.riskOwner]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    const matchesSystem = systemFilter === "all" || record.systemId === systemFilter
    const matchesCategory = categoryFilter === "all" || record.category === categoryFilter
    const severity = matrixMode === "inherent" ? record.inherentSeverity : record.residualSeverity
    const matchesSeverity = severityFilter === "all" || severity === severityFilter
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesOwner = ownerFilter === "all" || record.riskOwner === ownerFilter
    const matchesOverdue =
      !onlyOverdue ||
      (record.nextReviewDate ? new Date(`${record.nextReviewDate}T23:59:59`).getTime() < Date.now() : false)

    if (matrixFilter) {
      const probability = matrixFilter.mode === "inherent" ? record.inherentProbability : record.residualProbability
      const impact = matrixFilter.mode === "inherent" ? record.inherentImpact : record.residualImpact
      if (probability !== matrixFilter.probability || impact !== matrixFilter.impact) {
        return false
      }
    }

    return matchesSearch && matchesSystem && matchesCategory && matchesSeverity && matchesStatus && matchesOwner && matchesOverdue
  })

  const navItems: GeneralTabShellNavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "create", label: draft.riskId ? "Editar riesgo" : "Nuevo riesgo", icon: PlusCircle },
    { id: "records", label: "Riesgos registrados", icon: ClipboardList, badge: records.length || undefined },
    { id: "catalog", label: "Catálogo", icon: BookMarked, badge: catalog.length || undefined },
    { id: "framework", label: "Marco operativo", icon: Network },
  ]

  const headerBadges: GeneralTabShellBadge[] = [
    { label: `${records.length} riesgos`, tone: "primary" },
    { label: `${dashboardMetrics.totalActiveRisks} activos`, tone: "neutral" },
    {
      label: `${dashboardMetrics.bySeverity.Crítico} críticos`,
      tone: dashboardMetrics.bySeverity.Crítico > 0 ? "critical" : "positive",
    },
  ]

  if (selectedSystem) {
    headerBadges.push({ label: getSystemDisplayName(selectedSystem), tone: "neutral" })
  }

  const pageMeta: Record<WorkspaceTab, { label: string; title: string; description: string }> = {
    dashboard: {
      label: "Panel de riesgos",
      title: "Dashboard de gestión de riesgos IA",
      description: "Supervisa exposición, alertas, matriz de severidad y perfil de riesgo por sistema.",
    },
    create: {
      label: draft.riskId ? "Edición" : "Registro",
      title: draft.riskId ? "Editar riesgo de IA" : "Registrar nuevo riesgo de IA",
      description: "Completa los cuatro bloques del Risk Register con datos claros, compactos y auditables.",
    },
    records: {
      label: "Registro consolidado",
      title: "Riesgos registrados",
      description: "Consulta, filtra y gestiona el registro consolidado de riesgos y su trazabilidad.",
    },
    catalog: {
      label: "Taxonomía y controles",
      title: "Catálogo de riesgos y controles",
      description: "Consulta la taxonomía operativa y los controles semilla disponibles por categoría.",
    },
    framework: {
      label: "Proceso y alineación",
      title: "Marco operativo del módulo",
      description: "Resume fases, roles, integraciones y la alineación normativa del módulo.",
    },
  }

  const shellMeta = pageMeta[activeTab]

  const resetDraft = (systemId = selectedSystemId) => {
    const baseSystem = systems.find((system) => system.id === systemId)
    setDraft(
      createEmptyAIRiskRecord({
        systemId: baseSystem?.id || "",
        systemName: baseSystem?.name || "",
        identifiedBy: currentActor,
        evaluatedBy: currentActor,
      }),
    )
  }

  const updateDraft = <K extends keyof AIRiskRecord>(field: K, value: AIRiskRecord[K]) => {
    setDraft((previous) => normalizeAIRiskRecord({ ...previous, [field]: value }))
  }

  const handleSystemSelection = (systemId: string) => {
    const system = systems.find((item) => item.id === systemId)
    setSelectedSystemId(systemId)
    setDraft((previous) =>
      normalizeAIRiskRecord({
        ...previous,
        systemId,
        systemName: system?.name || "",
      }),
    )
  }

  const handleMitigationActionChange = (actionId: string, field: keyof AIRiskMitigationAction, value: string) => {
    const updated = draft.mitigationActions.map((action) =>
      action.id === actionId ? { ...action, [field]: value } : action,
    )
    updateDraft("mitigationActions", updated)
  }

  const addMitigationAction = () => {
    updateDraft("mitigationActions", [...draft.mitigationActions, createEmptyMitigationAction()])
  }

  const removeMitigationAction = (actionId: string) => {
    updateDraft(
      "mitigationActions",
      draft.mitigationActions.filter((action) => action.id !== actionId),
    )
  }

  const toggleDimension = (dimension: AIRiskImpactDimension) => {
    const exists = draft.impactDimensions.includes(dimension)
    updateDraft(
      "impactDimensions",
      exists ? draft.impactDimensions.filter((item) => item !== dimension) : [...draft.impactDimensions, dimension],
    )
  }

  const toggleControl = (controlId: string) => {
    const exists = draft.selectedControlIds.includes(controlId)
    updateDraft(
      "selectedControlIds",
      exists ? draft.selectedControlIds.filter((item) => item !== controlId) : [...draft.selectedControlIds, controlId],
    )
  }

  const toggleIncident = (incidentId: string) => {
    const exists = draft.linkedIncidentIds.includes(incidentId)
    updateDraft(
      "linkedIncidentIds",
      exists ? draft.linkedIncidentIds.filter((item) => item !== incidentId) : [...draft.linkedIncidentIds, incidentId],
    )
  }

  const handleAttachments = async (files: FileList | null) => {
    if (!files?.length) return
    const attachments: AIRiskAttachment[] = []

    for (const file of Array.from(files)) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Archivo omitido",
          description: `${file.name} supera 2 MB y puede saturar el almacenamiento local.`,
          variant: "destructive",
        })
        continue
      }

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result || ""))
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      attachments.push({
        id: `attachment-${Date.now()}-${file.name}`,
        name: file.name,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        dataUrl,
      })
    }

    if (attachments.length) {
      updateDraft("attachments", [...draft.attachments, ...attachments])
    }
  }

  const removeAttachment = (attachmentId: string) => {
    updateDraft(
      "attachments",
      draft.attachments.filter((attachment) => attachment.id !== attachmentId),
    )
  }

  const validateDraft = () => {
    const missing: string[] = []
    if (!draft.systemId) missing.push("Sistema de IA asociado")
    if (!draft.riskName.trim()) missing.push("Nombre del riesgo")
    if (!draft.description.trim() || draft.description.trim().length < 50) missing.push("Descripción detallada (mín. 50 caracteres)")
    if (!draft.identifiedBy.trim()) missing.push("Identificado por")
    if (!draft.evaluatedBy.trim()) missing.push("Evaluado por")
    if (!draft.riskOwner.trim()) missing.push("Risk Owner")
    if (!draft.planDueDate) missing.push("Fecha límite del plan")
    if (!draft.impactDimensions.length) missing.push("Dimensión de impacto")
    return missing
  }

  const refreshAfterPersist = () => {
    if (typeof window === "undefined") return
    setRecords(readAIRiskRecords(window.localStorage))
    setSnapshots(readAIRiskSystemSnapshots(window.localStorage))
  }

  const handleSaveRisk = () => {
    if (typeof window === "undefined") return
    const errors = validateDraft()
    if (errors.length) {
      toast({
        title: "Faltan campos obligatorios",
        description: errors.slice(0, 4).join(" · "),
        variant: "destructive",
      })
      return
    }

    const previousRecord = records.find((record) => record.id === draft.id) || null
    const nextRecord = buildAIRiskRecord({
      draft,
      existingRecords: records,
      actor: currentActor,
      previousRecord,
    })

    const updatedRecords = previousRecord
      ? records.map((record) => (record.id === previousRecord.id ? nextRecord : record))
      : [...records, nextRecord]

    persistAIRiskRecords(window.localStorage, updatedRecords)
    refreshAfterPersist()
    setSelectedSystemId(nextRecord.systemId || selectedSystemId)
    setActiveTab("records")
    setDraft(
      createEmptyAIRiskRecord({
        systemId: nextRecord.systemId,
        systemName: nextRecord.systemName,
        identifiedBy: currentActor,
        evaluatedBy: currentActor,
      }),
    )
    toast({
      title: previousRecord ? "Riesgo actualizado" : "Riesgo registrado",
      description: previousRecord ? nextRecord.riskId : `${nextRecord.riskId} agregado al registro.`,
    })
  }

  const handleEditRisk = (record: AIRiskRecord) => {
    setDraft(normalizeAIRiskRecord(record))
    setSelectedSystemId(record.systemId)
    setActiveTab("create")
  }

  const handleDuplicateRisk = (record: AIRiskRecord) => {
    if (typeof window === "undefined") return
    const duplicate = duplicateAIRiskRecord(record, records, currentActor)
    persistAIRiskRecords(window.localStorage, [...records, duplicate])
    refreshAfterPersist()
    toast({
      title: "Riesgo duplicado",
      description: `${duplicate.riskId} se creó a partir de ${record.riskId}.`,
    })
  }

  const handleDeleteRisk = (record: AIRiskRecord) => {
    if (typeof window === "undefined") return
    if (!window.confirm(`Eliminar ${record.riskId}? Esta acción no se puede deshacer.`)) return

    const updatedRecords = records
      .filter((item) => item.id !== record.id)
      .map((item) => item)

    persistAIRiskRecords(window.localStorage, updatedRecords)
    refreshAfterPersist()
    setDetailRecord((current) => (current?.id === record.id ? null : current))
    toast({
      title: "Riesgo eliminado",
      description: `${record.riskId} se eliminó del registro.`,
    })
  }

  const severityForDraft = getAIRiskSeverity(draft.inherentProbability * draft.inherentImpact)
  const residualSeverityForDraft = getAIRiskSeverity(draft.residualProbability * draft.residualImpact)
  const residualReviewDate = getNextReviewDateForSeverity(residualSeverityForDraft, draft.evaluationDate || draft.identifiedAt)

  const saveManualCatalogControl = (category: AIRiskCategory) => {
    if (typeof window === "undefined") return
    const title = window.prompt(`Nombre del control manual para ${category}`)
    if (!title?.trim()) return
    const description = window.prompt("Descripción breve del control") || ""
    const evidenceRequired = window.prompt("Evidencia requerida") || "Evidencia definida por el responsable."
    const manualControl: AIRiskControl = {
      controlId: `CTL-${category}-${Date.now()}`,
      category,
      title: title.trim(),
      description: description.trim(),
      type: "Preventivo",
      evidenceRequired,
      seeded: false,
    }
    const nextCatalog = [...catalog, manualControl]
    saveAIRiskControlCatalog(window.localStorage, nextCatalog)
    setCatalog(nextCatalog)
    toast({
      title: "Control agregado",
      description: `${manualControl.controlId} quedó disponible en el catálogo.`,
    })
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {!systems.length ? (
        <Alert className="border-amber-200 bg-amber-50/80">
          <AlertTriangle className="h-4 w-4 text-amber-700" />
          <AlertTitle>No hay sistemas registrados</AlertTitle>
          <AlertDescription className="mt-2 flex flex-wrap items-center gap-3">
            Primero registra sistemas de IA para iniciar evaluaciones de riesgos vinculadas.
            <Button asChild size="sm" variant="outline">
              <Link href="/registro-sistemas-ia">
                Ir al inventario
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard title="Sistemas registrados" value={dashboardMetrics.totalSystems} helper={`${dashboardMetrics.activeEvaluations} con evaluación activa`} />
        <MetricCard title="Riesgos activos" value={dashboardMetrics.totalActiveRisks} helper={`Críticos ${dashboardMetrics.bySeverity.Crítico} · Altos ${dashboardMetrics.bySeverity.Alto}`} tone={dashboardMetrics.bySeverity.Crítico > 0 ? "warning" : "default"} />
        <MetricCard title="Críticos sin plan" value={dashboardMetrics.criticalWithoutPlan} helper="Requieren acción inmediata" tone={dashboardMetrics.criticalWithoutPlan > 0 ? "critical" : "positive"} />
        <MetricCard title="Revisiones vencidas" value={dashboardMetrics.overdueReviews} helper="Listas para revaluación" tone={dashboardMetrics.overdueReviews > 0 ? "warning" : "positive"} />
        <MetricCard title="% mitigado" value={`${dashboardMetrics.mitigatedRate}%`} helper="Indicador de madurez del registro" tone="positive" />
        <MetricCard title="Nuevos en 30 días" value={dashboardMetrics.newRisksLast30Days} helper="Riesgos creados recientemente" />
      </div>

      <Card className="border-[hsl(var(--brand-border))]">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-[hsl(var(--brand-deep))]">Alertas automáticas</CardTitle>
            <CardDescription>Vista consolidada de criticidad, vencimientos, cambios del sistema e incidentes asociados.</CardDescription>
          </div>
          <Badge className="bg-[hsl(var(--primary))]/12 text-[hsl(var(--brand-deep))]">{alerts.length} alertas</Badge>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <p className="text-sm text-slate-600">No hay alertas activas en este momento.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {alerts.slice(0, 6).map((alert) => (
                <div key={alert.id} className="rounded-2xl border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/45 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                      <p className="text-sm leading-6 text-slate-600">{alert.description}</p>
                    </div>
                    <SeverityBadge severity={alert.severity} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="border-[hsl(var(--brand-border))]">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-[hsl(var(--brand-deep))]">Matriz de riesgos 5 x 5</CardTitle>
                <CardDescription>Haz clic en una celda para abrir la vista filtrada del registro.</CardDescription>
              </div>
              <div className="flex rounded-2xl border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))] p-1">
                <button
                  type="button"
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-sm font-medium transition-colors",
                    matrixMode === "inherent" ? "bg-white text-[hsl(var(--brand-deep))] shadow" : "text-slate-600",
                  )}
                  onClick={() => setMatrixMode("inherent")}
                >
                  Inherente
                </button>
                <button
                  type="button"
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-sm font-medium transition-colors",
                    matrixMode === "residual" ? "bg-white text-[hsl(var(--brand-deep))] shadow" : "text-slate-600",
                  )}
                  onClick={() => setMatrixMode("residual")}
                >
                  Residual
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-amber-200 bg-amber-50/60">
              <Sparkles className="h-4 w-4 text-amber-700" />
              <AlertTitle>Matriz visible + regla oficial de clasificación</AlertTitle>
              <AlertDescription>
                El color del dashboard usa la regla oficial del documento: 20-25 Crítico, 10-19 Alto, 5-9 Medio, 1-4 Bajo. Se mantiene visible la matriz 5 x 5 y se señala que algunas celdas del documento no coinciden con esos rangos.
              </AlertDescription>
            </Alert>

            <div className="overflow-x-auto">
              <div className="min-w-[560px]">
                <div className="grid grid-cols-[120px_repeat(5,minmax(0,1fr))] gap-2 text-center">
                  <div />
                  {[1, 2, 3, 4, 5].map((impact) => (
                    <div key={`impact-${impact}`} className="rounded-2xl bg-[hsl(var(--brand-muted))]/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      I{impact} · {impactLabels[impact]}
                    </div>
                  ))}
                  {matrix.map((row) => (
                    <>
                      <div
                        key={`prob-${row[0].probability}`}
                        className="rounded-2xl bg-[hsl(var(--brand-muted))]/70 px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
                      >
                        P{row[0].probability}
                        <div className="mt-1 text-[11px] normal-case tracking-normal text-slate-600">{probabilityLabels[row[0].probability]}</div>
                      </div>
                      {row.map((cell) => (
                        <button
                          key={`cell-${cell.probability}-${cell.impact}`}
                          type="button"
                          onClick={() => {
                            setMatrixFilter({ probability: cell.probability, impact: cell.impact, mode: matrixMode })
                            setActiveTab("records")
                          }}
                          className={cn(
                            "rounded-3xl border px-3 py-5 text-left transition hover:-translate-y-0.5 hover:shadow-md",
                            severityClasses(cell.severity),
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold uppercase tracking-[0.12em]">{cell.severity}</span>
                            <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold">{cell.count}</span>
                          </div>
                          <p className="mt-3 text-sm font-medium">P{cell.probability} x I{cell.impact}</p>
                          <p className="mt-1 text-xs opacity-80">Score {cell.probability * cell.impact}</p>
                        </button>
                      ))}
                    </>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[hsl(var(--brand-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--brand-deep))]">Vista por sistema</CardTitle>
            <CardDescription>Perfil resumido del sistema seleccionado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Sistema de IA</Label>
              <Select value={selectedSystemId || undefined} onValueChange={setSelectedSystemId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un sistema" />
                </SelectTrigger>
                <SelectContent>
                  {systems.map((system) => (
                    <SelectItem key={system.id} value={system.id}>
                      {system.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {systemProfile && selectedSystem ? (
              <div className="space-y-4">
                <div className="rounded-3xl border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{selectedSystem.name}</p>
                      <p className="mt-1 text-sm text-slate-600">Última actualización del inventario: {formatDate(selectedSystem.lastUpdated)}</p>
                    </div>
                    {systemProfile.globalSeverity === "Sin riesgos" ? (
                      <Badge className="bg-slate-100 text-slate-700">Sin riesgos</Badge>
                    ) : (
                      <SeverityBadge severity={systemProfile.globalSeverity} />
                    )}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <MetricCard title="Riesgos activos" value={systemProfile.activeRiskCount} />
                  <MetricCard title="Próximas revisiones" value={systemProfile.nextReviews.length} />
                </div>

                <div className="rounded-3xl border border-[hsl(var(--brand-border))] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Estado de controles</p>
                    <Badge className="bg-[hsl(var(--primary))]/12 text-[hsl(var(--brand-deep))]">
                      {systemProfile.controls.implemented + systemProfile.controls.inProgress + systemProfile.controls.pending} referencias
                    </Badge>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
                      Implementados
                      <div className="mt-1 text-xl font-semibold">{systemProfile.controls.implemented}</div>
                    </div>
                    <div className="rounded-2xl bg-amber-50 px-3 py-3 text-sm text-amber-800">
                      En proceso
                      <div className="mt-1 text-xl font-semibold">{systemProfile.controls.inProgress}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-3 py-3 text-sm text-slate-700">
                      Pendientes
                      <div className="mt-1 text-xl font-semibold">{systemProfile.controls.pending}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-[hsl(var(--brand-border))] p-4">
                  <p className="text-sm font-semibold text-slate-900">Distribución por categoría</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {Object.entries(systemProfile.categoryCounts).map(([category, total]) => (
                      <div key={category} className="rounded-2xl bg-[hsl(var(--brand-muted))]/45 px-3 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">{category}</span>
                          <span className="text-lg font-semibold text-[hsl(var(--brand-deep))]">{total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-[hsl(var(--brand-border))] p-4">
                  <p className="text-sm font-semibold text-slate-900">Tendencia de 12 meses</p>
                  {systemProfile.timeline.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-600">Aún no hay snapshots suficientes para este sistema.</p>
                  ) : (
                    <div className="mt-4 flex items-end gap-3 overflow-x-auto">
                      {systemProfile.timeline.map((point) => {
                        const severityWeight =
                          point.globalSeverity === "Crítico"
                            ? 100
                            : point.globalSeverity === "Alto"
                              ? 75
                              : point.globalSeverity === "Medio"
                                ? 45
                                : point.globalSeverity === "Bajo"
                                  ? 20
                                  : 10
                        return (
                          <div key={point.id} className="flex min-w-[58px] flex-col items-center gap-2">
                            <div className="flex h-28 w-10 items-end rounded-full bg-[hsl(var(--brand-muted))]/60 p-1">
                              <div className={cn("w-full rounded-full", point.globalSeverity === "Sin riesgos" ? "bg-slate-300" : severityClasses(point.globalSeverity).split(" ")[0])} style={{ height: `${severityWeight}%` }} />
                            </div>
                            <div className="text-center text-[11px] text-slate-600">
                              <div>{getMonthlyTrendLabel(point.monthKey)}</div>
                              <div>{point.activeRiskCount} activos</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-600">Selecciona un sistema para ver su perfil individual.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-[hsl(var(--brand-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--brand-deep))]">Métricas de gestión</CardTitle>
            <CardDescription>Indicadores de eficiencia y madurez del proceso.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-[hsl(var(--brand-border))] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Tiempo medio de resolución</p>
              <p className="mt-3 text-2xl font-semibold text-[hsl(var(--brand-deep))]">{averageResolutionDays} días</p>
            </div>
            <div className="rounded-3xl border border-[hsl(var(--brand-border))] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Planes completados en plazo</p>
              <p className="mt-3 text-2xl font-semibold text-[hsl(var(--brand-deep))]">{mitigationOnTimeRate}%</p>
            </div>
            <div className="rounded-3xl border border-[hsl(var(--brand-border))] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Riesgos recurrentes</p>
              <p className="mt-3 text-2xl font-semibold text-[hsl(var(--brand-deep))]">{recurringRisks}</p>
            </div>
            <div className="rounded-3xl border border-[hsl(var(--brand-border))] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Índice de madurez</p>
              <p className="mt-3 text-2xl font-semibold text-[hsl(var(--brand-deep))]">{maturityIndex}%</p>
              <Progress value={maturityIndex} className="mt-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[hsl(var(--brand-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--brand-deep))]">Carga por Risk Owner</CardTitle>
            <CardDescription>Responsables con más riesgos activos o totales asignados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ownerLoad.length === 0 ? (
              <p className="text-sm text-slate-600">Aún no hay responsables asignados en el registro.</p>
            ) : (
              ownerLoad.map((owner) => (
                <div key={owner.owner} className="rounded-3xl border border-[hsl(var(--brand-border))] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{owner.owner}</p>
                      <p className="text-sm text-slate-600">{owner.total} totales · {owner.active} activos</p>
                    </div>
                    <Badge className="bg-[hsl(var(--primary))]/12 text-[hsl(var(--brand-deep))]">{owner.active} activos</Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderCreateForm = () => (
    <div className="space-y-6">
      <Card className="border-[hsl(var(--brand-border))]">
        <CardHeader>
          <CardTitle className="text-[hsl(var(--brand-deep))]">{draft.riskId ? "Edición activa" : "Nuevo riesgo"}</CardTitle>
          <CardDescription>
            Registro individual del riesgo conforme al documento funcional: bloques compactos, cálculos automáticos y trazabilidad.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-[hsl(var(--brand-border))]">
        <CardHeader>
          <CardTitle className="text-base text-[hsl(var(--brand-deep))]">Bloque A · Identificación</CardTitle>
          <CardDescription>Define el sistema, la categoría y la descripción operativa del riesgo.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Sistema de IA asociado *</Label>
            <Select value={draft.systemId || undefined} onValueChange={handleSystemSelection}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un sistema del inventario" />
              </SelectTrigger>
              <SelectContent>
                {systems.map((system) => (
                  <SelectItem key={system.id} value={system.id}>
                    {system.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Categoría del riesgo *</Label>
            <Select
              value={draft.category}
              onValueChange={(value) => {
                setDraft((previous) =>
                  normalizeAIRiskRecord({
                    ...previous,
                    category: value as AIRiskCategory,
                    selectedControlIds: [],
                  }),
                )
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la categoría" />
              </SelectTrigger>
              <SelectContent>
                {AI_RISK_CATEGORY_DEFINITIONS.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.id} · {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subcategoría</Label>
            <Input value={draft.subcategory} onChange={(event) => updateDraft("subcategory", event.target.value)} placeholder="Ej. Prompt injection, drift, copyright" />
          </div>

          <div className="space-y-2">
            <Label>Nombre del riesgo *</Label>
            <Input value={draft.riskName} onChange={(event) => updateDraft("riskName", event.target.value)} placeholder="Etiqueta corta y descriptiva" maxLength={100} />
          </div>

          <div className="space-y-2">
            <Label>Fase del ciclo de vida *</Label>
            <Select value={draft.lifecyclePhase} onValueChange={(value) => updateDraft("lifecyclePhase", value as AIRiskRecord["lifecyclePhase"])}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la fase" />
              </SelectTrigger>
              <SelectContent>
                {lifecyclePhases.map((phase) => (
                  <SelectItem key={phase} value={phase}>
                    {phase}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fuente del riesgo *</Label>
            <Select value={draft.riskSource} onValueChange={(value) => updateDraft("riskSource", value as AIRiskRecord["riskSource"])}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la fuente" />
              </SelectTrigger>
              <SelectContent>
                {riskSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fecha de identificación *</Label>
            <Input type="date" value={draft.identifiedAt} onChange={(event) => updateDraft("identifiedAt", event.target.value)} />
          </div>

          <UserField
            label="Identificado por *"
            value={draft.identifiedBy}
            onChange={(value) => updateDraft("identifiedBy", value)}
            users={users}
            placeholder="Selecciona el usuario"
          />

          <div className="md:col-span-2 space-y-2">
            <Label>Descripción detallada *</Label>
            <Textarea
              value={draft.description}
              onChange={(event) => updateDraft("description", event.target.value)}
              placeholder="Describe el evento de riesgo, su causa y el mecanismo de impacto."
              rows={5}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-[hsl(var(--brand-border))]">
        <CardHeader>
          <CardTitle className="text-base text-[hsl(var(--brand-deep))]">Bloque B · Evaluación</CardTitle>
          <CardDescription>Asigna probabilidad, impacto y criterios para la clasificación inherente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Probabilidad inherente *</Label>
              <Select value={String(draft.inherentProbability)} onValueChange={(value) => updateDraft("inherentProbability", Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona probabilidad" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <SelectItem key={value} value={String(value)}>
                      {value} · {probabilityLabels[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Impacto inherente *</Label>
              <Select value={String(draft.inherentImpact)} onValueChange={(value) => updateDraft("inherentImpact", Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona impacto" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <SelectItem key={value} value={String(value)}>
                      {value} · {impactLabels[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-3xl border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/45 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-slate-900">Severidad inherente</span>
              <SeverityBadge severity={severityForDraft} />
              <Badge className="bg-white text-slate-700">Score {draft.inherentProbability * draft.inherentImpact}</Badge>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Dimensión de impacto *</Label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {impactDimensions.map((dimension) => (
                <label key={dimension} className="flex items-center gap-3 rounded-2xl border border-[hsl(var(--brand-border))] px-3 py-3 text-sm text-slate-700">
                  <Checkbox checked={draft.impactDimensions.includes(dimension)} onCheckedChange={() => toggleDimension(dimension)} />
                  {dimension}
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Tolerancia al riesgo</Label>
              <Select value={draft.riskTolerance} onValueChange={(value) => updateDraft("riskTolerance", value as AIRiskRecord["riskTolerance"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la tolerancia" />
                </SelectTrigger>
                <SelectContent>
                  {riskTolerances.map((tolerance) => (
                    <SelectItem key={tolerance} value={tolerance}>
                      {tolerance}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <UserField
              label="Evaluado por *"
              value={draft.evaluatedBy}
              onChange={(value) => updateDraft("evaluatedBy", value)}
              users={users}
              placeholder="Selecciona el evaluador"
            />

            <div className="space-y-2">
              <Label>Fecha de evaluación *</Label>
              <Input type="date" value={draft.evaluationDate} onChange={(event) => updateDraft("evaluationDate", event.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Justificación de la evaluación</Label>
            <Textarea value={draft.evaluationJustification} onChange={(event) => updateDraft("evaluationJustification", event.target.value)} rows={4} placeholder="Resume supuestos, contexto y criterios usados para la evaluación." />
          </div>
        </CardContent>
      </Card>

      <Card className="border-[hsl(var(--brand-border))]">
        <CardHeader>
          <CardTitle className="text-base text-[hsl(var(--brand-deep))]">Bloque C · Controles y mitigación</CardTitle>
          <CardDescription>Registra controles, acciones, responsables y el nivel residual esperado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Controles existentes</Label>
            <Textarea value={draft.existingControlsDescription} onChange={(event) => updateDraft("existingControlsDescription", event.target.value)} rows={3} placeholder="Describe controles ya implementados antes de este registro." />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label>Efectividad de controles existentes</Label>
              <Select value={draft.existingControlEffectiveness} onValueChange={(value) => updateDraft("existingControlEffectiveness", value as AIRiskRecord["existingControlEffectiveness"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  {controlEffectiveness.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Probabilidad residual</Label>
              <Select value={String(draft.residualProbability)} onValueChange={(value) => updateDraft("residualProbability", Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona probabilidad" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <SelectItem key={value} value={String(value)}>
                      {value} · {probabilityLabels[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Impacto residual</Label>
              <Select value={String(draft.residualImpact)} onValueChange={(value) => updateDraft("residualImpact", Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona impacto" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <SelectItem key={value} value={String(value)}>
                      {value} · {impactLabels[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estrategia de tratamiento *</Label>
              <Select value={draft.treatmentStrategy} onValueChange={(value) => updateDraft("treatmentStrategy", value as AIRiskTreatmentStrategy)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona estrategia" />
                </SelectTrigger>
                <SelectContent>
                  {treatmentStrategies.map((strategy) => (
                    <SelectItem key={strategy} value={strategy}>
                      {strategy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-3xl border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/45 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-slate-900">Severidad residual</span>
              <SeverityBadge severity={residualSeverityForDraft} />
              <Badge className="bg-white text-slate-700">Score {draft.residualProbability * draft.residualImpact}</Badge>
              <Badge className="bg-white text-slate-700">Próxima revisión {formatDate(residualReviewDate)}</Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Label>Controles nuevos a implementar</Label>
                <p className="mt-1 text-sm text-slate-600">Selecciona del catálogo y complementa con controles manuales cuando haga falta.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => saveManualCatalogControl(draft.category)}>
                <Plus className="h-4 w-4" />
                Agregar control manual al catálogo
              </Button>
            </div>

            {selectedCategoryControls.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {selectedCategoryControls.map((control) => (
                  <label key={control.controlId} className="flex items-start gap-3 rounded-2xl border border-[hsl(var(--brand-border))] p-4">
                    <Checkbox checked={draft.selectedControlIds.includes(control.controlId)} onCheckedChange={() => toggleControl(control.controlId)} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{control.controlId}</span>
                        <Badge className="bg-[hsl(var(--brand-muted))] text-slate-700">{control.type}</Badge>
                        {!control.seeded ? <Badge className="bg-cyan-100 text-cyan-800">Manual</Badge> : null}
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{control.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{control.evidenceRequired}</p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <Alert className="border-cyan-200 bg-cyan-50/70">
                <ShieldAlert className="h-4 w-4 text-cyan-700" />
                <AlertTitle>Sin controles semilla para esta categoría</AlertTitle>
                <AlertDescription>
                  Para {draft.category}, el documento base no trae controles precargados. Registra controles manuales en el campo inferior o añádelos al catálogo.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label>Controles manuales</Label>
            <Textarea
              value={draft.customControls.join("\n")}
              onChange={(event) =>
                updateDraft(
                  "customControls",
                  event.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
                )
              }
              rows={3}
              placeholder="Un control por línea cuando no exista en el catálogo."
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Label>Acciones de mitigación *</Label>
                <p className="mt-1 text-sm text-slate-600">Cada acción incluye descripción, responsable, fecha y estado.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addMitigationAction}>
                <PlusCircle className="h-4 w-4" />
                Añadir acción
              </Button>
            </div>

            {draft.mitigationActions.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[hsl(var(--brand-border))] px-4 py-6 text-sm text-slate-600">
                Añade al menos una acción para sustentar el plan de mitigación.
              </div>
            ) : (
              draft.mitigationActions.map((action, index) => (
                <div key={action.id} className="rounded-3xl border border-[hsl(var(--brand-border))] p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">Acción {index + 1}</p>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeMitigationAction(action.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="space-y-2 xl:col-span-2">
                      <Label>Descripción</Label>
                      <Input value={action.description} onChange={(event) => handleMitigationActionChange(action.id, "description", event.target.value)} placeholder="Descripción breve de la acción" />
                    </div>
                    <div className="space-y-2">
                      <Label>Responsable</Label>
                      <Input value={action.owner} onChange={(event) => handleMitigationActionChange(action.id, "owner", event.target.value)} placeholder="Responsable" />
                    </div>
                    <div className="space-y-2">
                      <Label>Plazo</Label>
                      <Input type="date" value={action.dueDate} onChange={(event) => handleMitigationActionChange(action.id, "dueDate", event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Estado</Label>
                      <Select value={action.status} onValueChange={(value) => handleMitigationActionChange(action.id, "status", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {mitigationStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <UserField
              label="Risk Owner *"
              value={draft.riskOwner}
              onChange={(value) => updateDraft("riskOwner", value)}
              users={users}
              placeholder="Selecciona el responsable"
            />

            <div className="space-y-2">
              <Label>Fecha límite del plan *</Label>
              <Input type="date" value={draft.planDueDate} onChange={(event) => updateDraft("planDueDate", event.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Estado del riesgo *</Label>
              <Select value={draft.status} onValueChange={(value) => updateDraft("status", value as AIRiskStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  {riskStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[hsl(var(--brand-border))]">
        <CardHeader>
          <CardTitle className="text-base text-[hsl(var(--brand-deep))]">Bloque D · Trazabilidad y auditoría</CardTitle>
          <CardDescription>Vincula incidentes, evidencia, referencias de auditoría y aprobaciones.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <div>
              <Label>Incidentes vinculados</Label>
              <p className="mt-1 text-sm text-slate-600">Se muestran incidentes del mismo sistema cuando están disponibles.</p>
            </div>
            {visibleIncidents.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[hsl(var(--brand-border))] px-4 py-4 text-sm text-slate-600">
                No hay incidentes disponibles para vincular en este contexto.
              </p>
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {visibleIncidents.map((incident) => (
                  <label key={incident.id} className="flex items-start gap-3 rounded-2xl border border-[hsl(var(--brand-border))] p-4">
                    <Checkbox checked={draft.linkedIncidentIds.includes(incident.id)} onCheckedChange={() => toggleIncident(incident.id)} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{incident.report?.metadata?.folioNumber || incident.id}</p>
                      <p className="mt-1 text-sm text-slate-600">{incident.report?.system?.nombreSistema || "Sistema sin nombre"}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Hallazgos de auditoría vinculados</Label>
              <Textarea
                value={draft.linkedAuditFindings.join("\n")}
                onChange={(event) =>
                  updateDraft(
                    "linkedAuditFindings",
                    event.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean),
                  )
                }
                rows={4}
                placeholder="Referencia o hallazgo por línea."
              />
            </div>

            <div className="space-y-2">
              <Label>Requisito normativo vinculado</Label>
              <Textarea value={draft.linkedRequirement} onChange={(event) => updateDraft("linkedRequirement", event.target.value)} rows={4} placeholder="Ej. NIST AI RMF MANAGE 1.3, ISO 42001 §6.5, EU AI Act Art. 9." />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Comentarios y notas</Label>
              <Textarea value={draft.comments} onChange={(event) => updateDraft("comments", event.target.value)} rows={4} placeholder="Notas operativas, decisiones del equipo o contexto adicional." />
            </div>

            <div className="space-y-2">
              <Label>Archivos adjuntos</Label>
              <Input type="file" multiple onChange={(event) => void handleAttachments(event.target.files)} />
              <p className="text-xs text-slate-500">Para mantener rendimiento con localStorage, cada archivo se limita a 2 MB.</p>
              <div className="space-y-2">
                {draft.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between rounded-2xl border border-[hsl(var(--brand-border))] px-3 py-2 text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{attachment.name}</p>
                      <p className="text-xs text-slate-500">{Math.round(attachment.size / 1024)} KB</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeAttachment(attachment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <UserField
              label="Aprobado por"
              value={draft.approvedBy}
              onChange={(value) => updateDraft("approvedBy", value)}
              users={users}
              placeholder="Opcional"
            />
            <div className="space-y-2">
              <Label>Próxima revisión</Label>
              <Input value={residualReviewDate} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Folio del riesgo</Label>
              <Input value={draft.riskId || "Se generará al guardar"} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => resetDraft()}>
          Reiniciar formulario
        </Button>
        <Button type="button" variant="outline" onClick={() => setActiveTab("records")}>
          Ver registro
        </Button>
        <Button type="button" onClick={handleSaveRisk} className="bg-[#01A79E] text-white hover:bg-[#018b84]">
          <Save className="h-4 w-4" />
          {draft.riskId ? "Guardar cambios" : "Registrar riesgo"}
        </Button>
      </div>
    </div>
  )

  const renderRecords = () => (
    <div className="space-y-6">
      <Card className="border-[hsl(var(--brand-border))]">
        <CardHeader>
          <CardTitle className="text-[hsl(var(--brand-deep))]">Filtros del registro</CardTitle>
          <CardDescription>Combina filtros por sistema, categoría, severidad, estado, responsable y vencimiento.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-10" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Riesgo, folio, sistema o owner" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sistema</Label>
              <Select value={systemFilter} onValueChange={setSystemFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los sistemas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los sistemas</SelectItem>
                  {systems.map((system) => (
                    <SelectItem key={system.id} value={system.id}>
                      {system.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {AI_RISK_CATEGORY_DEFINITIONS.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.id} · {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Severidad</Label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las severidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las severidades</SelectItem>
                  {["Crítico", "Alto", "Medio", "Bajo"].map((severity) => (
                    <SelectItem key={severity} value={severity}>
                      {severity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {riskStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Risk Owner</Label>
              <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los owners" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los owners</SelectItem>
                  {getRiskOwnerLoad(records).map((owner) => (
                    <SelectItem key={owner.owner} value={owner.owner}>
                      {owner.owner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <Checkbox checked={onlyOverdue} onCheckedChange={(checked) => setOnlyOverdue(Boolean(checked))} />
              Mostrar solo revisiones vencidas
            </label>
            <div className="flex flex-wrap gap-2">
              {matrixFilter ? (
                <Badge className="bg-amber-100 text-amber-800">
                  Filtro por matriz: P{matrixFilter.probability} x I{matrixFilter.impact} ({matrixFilter.mode})
                </Badge>
              ) : null}
              <Button type="button" variant="outline" size="sm" onClick={() => {
                setSearchTerm("")
                setSystemFilter("all")
                setCategoryFilter("all")
                setSeverityFilter("all")
                setStatusFilter("all")
                setOwnerFilter("all")
                setOnlyOverdue(false)
                setMatrixFilter(null)
              }}>
                Limpiar filtros
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  resetDraft()
                  setActiveTab("create")
                }}
              >
                <PlusCircle className="h-4 w-4" />
                Nuevo riesgo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[hsl(var(--brand-border))]">
        <CardContent className="p-0">
          {filteredRecords.length === 0 ? (
            <div className="px-6 py-10 text-sm text-slate-600">No hay riesgos que coincidan con los filtros actuales.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {["Folio", "Sistema", "Categoría", "Riesgo", "Severidad residual", "Estado", "Risk Owner", "Próxima revisión", "Acciones"].map((header) => (
                      <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredRecords.map((record) => {
                    const reviewDiff = daysDifference(record.nextReviewDate)
                    return (
                      <tr key={record.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-4 font-medium text-slate-900">{record.riskId}</td>
                        <td className="px-4 py-4 text-slate-700">{record.systemName}</td>
                        <td className="px-4 py-4">
                          <Badge className="bg-[hsl(var(--brand-muted))] text-slate-700">{record.category}</Badge>
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          <div className="max-w-[240px]">
                            <p className="font-medium text-slate-900">{record.riskName}</p>
                            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{record.subcategory || record.description}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <SeverityBadge severity={record.residualSeverity} />
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={record.status} />
                        </td>
                        <td className="px-4 py-4 text-slate-700">{record.riskOwner || "Sin asignar"}</td>
                        <td className="px-4 py-4 text-slate-700">
                          <div>{formatDate(record.nextReviewDate)}</div>
                          {typeof reviewDiff === "number" ? (
                            <div className={cn("mt-1 text-xs", reviewDiff < 0 ? "text-red-600" : reviewDiff <= 7 ? "text-amber-600" : "text-slate-500")}>
                              {reviewDiff < 0 ? `${Math.abs(reviewDiff)} días vencido` : `${reviewDiff} días restantes`}
                            </div>
                          ) : null}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setDetailRecord(record)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditRisk(record)}>
                              <FileStack className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDuplicateRisk(record)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteRisk(record)} className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderCatalog = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {AI_RISK_CATEGORY_DEFINITIONS.map((category) => (
          <Card key={category.id} className="border-[hsl(var(--brand-border))]">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base text-[hsl(var(--brand-deep))]">
                  {category.id} · {category.title}
                </CardTitle>
                <Badge className="bg-[hsl(var(--brand-muted))] text-slate-700">
                  {catalog.filter((control) => control.category === category.id).length} controles
                </Badge>
              </div>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.examples.map((example) => (
                  <div key={example} className="rounded-2xl bg-[hsl(var(--brand-muted))]/45 px-3 py-2 text-sm text-slate-700">
                    {example}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-[hsl(var(--brand-border))]">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-[hsl(var(--brand-deep))]">Catálogo de controles</CardTitle>
              <CardDescription>Controles agrupados por categoría con evidencia requerida y tipo operativo.</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => saveManualCatalogControl("REP")}>
              <PlusCircle className="h-4 w-4" />
              Añadir control manual
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {AI_RISK_CATEGORY_DEFINITIONS.map((category) => {
              const controls = catalog.filter((control) => control.category === category.id)
              return (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-900">{category.id} · {category.title}</span>
                      <Badge className="bg-[hsl(var(--brand-muted))] text-slate-700">{controls.length}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {controls.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[hsl(var(--brand-border))] px-4 py-4 text-sm text-slate-600">
                        Sin controles semilla. Usa controles manuales a nivel de riesgo o agrega uno al catálogo.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                          <thead className="bg-slate-50">
                            <tr>
                              {["Código", "Control", "Tipo", "Evidencia requerida"].map((header) => (
                                <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 bg-white">
                            {controls.map((control) => (
                              <tr key={control.controlId}>
                                <td className="px-4 py-4 font-medium text-slate-900">{control.controlId}</td>
                                <td className="px-4 py-4">
                                  <p className="font-medium text-slate-900">{control.title}</p>
                                  <p className="mt-1 text-xs text-slate-500">{control.description}</p>
                                </td>
                                <td className="px-4 py-4">
                                  <Badge className="bg-[hsl(var(--brand-muted))] text-slate-700">{control.type}</Badge>
                                </td>
                                <td className="px-4 py-4 text-slate-700">{control.evidenceRequired}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )

  const renderFramework = () => (
    <div className="space-y-6">
      <Alert className="border-amber-200 bg-amber-50/70">
        <AlertTriangle className="h-4 w-4 text-amber-700" />
        <AlertTitle>Criterio de severidad aplicado en el módulo</AlertTitle>
        <AlertDescription>
          La clasificación oficial usa los rangos del documento: 20-25 Crítico, 10-19 Alto, 5-9 Medio, 1-4 Bajo. La matriz 5 x 5 se conserva como apoyo visual porque el documento también la incluye, aunque algunas celdas no coincidan con esos rangos.
        </AlertDescription>
      </Alert>

      <Card className="border-[hsl(var(--brand-border))]">
        <CardHeader>
          <CardTitle className="text-[hsl(var(--brand-deep))]">Proceso de gestión de riesgos</CardTitle>
          <CardDescription>Fases operativas del módulo según NIST AI RMF e ISO/IEC 42001.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {AI_RISK_OPERATIONAL_PHASES.map((phase) => (
              <AccordionItem key={phase.id} value={phase.id}>
                <AccordionTrigger>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{phase.id} · {phase.title}</p>
                    <p className="text-xs text-slate-500">{phase.reference}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 rounded-2xl bg-[hsl(var(--brand-muted))]/45 p-4">
                    <p className="text-sm text-slate-700">{phase.summary}</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      {phase.actions.map((action) => (
                        <div key={action} className="rounded-2xl bg-white px-3 py-2 text-sm text-slate-700">
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-[hsl(var(--brand-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--brand-deep))]">Roles y responsabilidades</CardTitle>
            <CardDescription>Resumen operativo de actores y permisos del módulo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {AI_RISK_ROLES.map((role) => (
              <div key={role.title} className="rounded-3xl border border-[hsl(var(--brand-border))] p-4">
                <p className="text-sm font-semibold text-slate-900">{role.title}</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Responsabilidades</p>
                    <div className="mt-2 space-y-2">
                      {role.responsibilities.map((item) => (
                        <div key={item} className="rounded-2xl bg-[hsl(var(--brand-muted))]/45 px-3 py-2 text-sm text-slate-700">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Permisos</p>
                    <div className="mt-2 space-y-2">
                      {role.permissions.map((item) => (
                        <div key={item} className="rounded-2xl bg-[hsl(var(--brand-muted))]/45 px-3 py-2 text-sm text-slate-700">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[hsl(var(--brand-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--brand-deep))]">Integración con otros módulos</CardTitle>
            <CardDescription>Qué consume, qué aporta y qué dispara este módulo en la plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {AI_RISK_INTEGRATIONS.map((integration) => (
              <div key={integration.title} className="rounded-3xl border border-[hsl(var(--brand-border))] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{integration.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{integration.relationship}</p>
                  </div>
                  <Badge className="bg-[hsl(var(--brand-muted))] text-slate-700">{integration.relationship}</Badge>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Recibe</p>
                    <div className="mt-2 space-y-2">
                      {integration.receives.map((item) => (
                        <div key={item} className="rounded-2xl bg-[hsl(var(--brand-muted))]/45 px-3 py-2 text-sm text-slate-700">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Envía</p>
                    <div className="mt-2 space-y-2">
                      {integration.sends.map((item) => (
                        <div key={item} className="rounded-2xl bg-[hsl(var(--brand-muted))]/45 px-3 py-2 text-sm text-slate-700">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  <span className="font-medium text-slate-900">Trigger:</span> {integration.trigger}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-[hsl(var(--brand-border))]">
        <CardHeader>
          <CardTitle className="text-[hsl(var(--brand-deep))]">Alineación normativa</CardTitle>
          <CardDescription>Mapeo resumido entre funcionalidades del módulo, NIST AI RMF e ISO/IEC 42001.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["Funcionalidad", "NIST AI RMF", "ISO/IEC 42001", "Sección"].map((header) => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {AI_RISK_ALIGNMENT_ROWS.map((row) => (
                <tr key={row.functionality}>
                  <td className="px-4 py-4 font-medium text-slate-900">{row.functionality}</td>
                  <td className="px-4 py-4 text-slate-700">{row.nist}</td>
                  <td className="px-4 py-4 text-slate-700">{row.iso}</td>
                  <td className="px-4 py-4 text-slate-700">{row.section}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <>
      <GeneralTabShell
        moduleLabel="Gobernanza IA"
        moduleTitle={t.aiRiskManagementFull || "Gestión de riesgos de IA"}
        moduleDescription={
          t.aiRiskManagementDescription ||
          "Identifica, prioriza, mitiga y monitorea riesgos de IA con trazabilidad y criterio operativo uniforme."
        }
        pageLabel={shellMeta.label}
        pageTitle={shellMeta.title}
        pageDescription={shellMeta.description}
        navItems={navItems}
        activeNavId={activeTab}
        onNavSelect={(value) => setActiveTab(value as WorkspaceTab)}
        headerBadges={headerBadges}
        backHref="/"
        backLabel="Volver al inicio"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveTab("catalog")
              }}
            >
              <BookMarked className="h-4 w-4" />
              Ver catálogo
            </Button>
            <Button
              size="sm"
              onClick={() => {
                resetDraft(selectedSystemId)
                setActiveTab("create")
              }}
            >
              <PlusCircle className="h-4 w-4" />
              Nuevo riesgo
            </Button>
          </div>
        }
      >
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "create" && renderCreateForm()}
        {activeTab === "records" && renderRecords()}
        {activeTab === "catalog" && renderCatalog()}
        {activeTab === "framework" && renderFramework()}
      </GeneralTabShell>

      <Dialog open={!!detailRecord} onOpenChange={(open) => !open && setDetailRecord(null)}>
        {detailRecord ? (
          <DialogContent className="max-h-[88vh] max-w-6xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{detailRecord.riskId} · {detailRecord.riskName}</DialogTitle>
              <DialogDescription>
                {detailRecord.systemName} · {detailRecord.category} · actualizado {formatDateTime(detailRecord.updatedAt)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 text-sm">
              <DetailSection
                title="Identificación"
                rows={[
                  { label: "Sistema", value: detailRecord.systemName },
                  { label: "Categoría", value: `${detailRecord.category} · ${AI_RISK_CATEGORY_DEFINITIONS.find((item) => item.id === detailRecord.category)?.title || ""}` },
                  { label: "Subcategoría", value: compactValue(detailRecord.subcategory) },
                  { label: "Fase", value: detailRecord.lifecyclePhase },
                  { label: "Fuente", value: detailRecord.riskSource },
                  { label: "Identificado por", value: detailRecord.identifiedBy },
                  { label: "Fecha de identificación", value: formatDate(detailRecord.identifiedAt) },
                  { label: "Descripción", value: detailRecord.description },
                ]}
              />

              <DetailSection
                title="Evaluación"
                rows={[
                  { label: "Probabilidad inherente", value: `${detailRecord.inherentProbability} · ${probabilityLabels[detailRecord.inherentProbability]}` },
                  { label: "Impacto inherente", value: `${detailRecord.inherentImpact} · ${impactLabels[detailRecord.inherentImpact]}` },
                  { label: "Severidad inherente", value: `${detailRecord.inherentSeverity} (${detailRecord.inherentScore})` },
                  { label: "Dimensiones", value: compactValue(detailRecord.impactDimensions) },
                  { label: "Tolerancia", value: detailRecord.riskTolerance },
                  { label: "Evaluado por", value: detailRecord.evaluatedBy },
                  { label: "Fecha de evaluación", value: formatDate(detailRecord.evaluationDate) },
                  { label: "Justificación", value: compactValue(detailRecord.evaluationJustification) },
                ]}
              />

              <DetailSection
                title="Controles y mitigación"
                rows={[
                  { label: "Controles existentes", value: compactValue(detailRecord.existingControlsDescription) },
                  { label: "Efectividad", value: detailRecord.existingControlEffectiveness },
                  { label: "Probabilidad residual", value: `${detailRecord.residualProbability} · ${probabilityLabels[detailRecord.residualProbability]}` },
                  { label: "Impacto residual", value: `${detailRecord.residualImpact} · ${impactLabels[detailRecord.residualImpact]}` },
                  { label: "Severidad residual", value: `${detailRecord.residualSeverity} (${detailRecord.residualScore})` },
                  { label: "Tratamiento", value: detailRecord.treatmentStrategy },
                  { label: "Risk Owner", value: detailRecord.riskOwner },
                  { label: "Fecha límite", value: formatDate(detailRecord.planDueDate) },
                  { label: "Estado", value: detailRecord.status },
                  { label: "Próxima revisión", value: formatDate(detailRecord.nextReviewDate) },
                ]}
              />

              <Card className="border-[hsl(var(--brand-border))]">
                <CardHeader>
                  <CardTitle className="text-base text-[hsl(var(--brand-deep))]">Acciones de mitigación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {detailRecord.mitigationActions.length === 0 ? (
                    <p className="text-sm text-slate-600">Sin acciones registradas.</p>
                  ) : (
                    detailRecord.mitigationActions.map((action) => (
                      <div key={action.id} className="rounded-3xl border border-[hsl(var(--brand-border))] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">{action.description || "Acción sin descripción"}</p>
                          <Badge className={mitigationClasses(action.status)}>{action.status}</Badge>
                        </div>
                        <div className="mt-2 text-sm text-slate-600">
                          Responsable: {compactValue(action.owner)} · Plazo: {formatDate(action.dueDate)}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <DetailSection
                title="Trazabilidad"
                rows={[
                  { label: "Incidentes vinculados", value: compactValue(detailRecord.linkedIncidentIds) },
                  { label: "Hallazgos de auditoría", value: compactValue(detailRecord.linkedAuditFindings) },
                  { label: "Requisito normativo", value: compactValue(detailRecord.linkedRequirement) },
                  { label: "Comentarios", value: compactValue(detailRecord.comments) },
                  { label: "Aprobado por", value: compactValue(detailRecord.approvedBy) },
                ]}
              />

              <Card className="border-[hsl(var(--brand-border))]">
                <CardHeader>
                  <CardTitle className="text-base text-[hsl(var(--brand-deep))]">Historial de cambios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {detailRecord.history.length === 0 ? (
                    <p className="text-sm text-slate-600">No hay historial registrado.</p>
                  ) : (
                    detailRecord.history.map((entry) => (
                      <div key={entry.id} className="rounded-3xl border border-[hsl(var(--brand-border))] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">{entry.action}</p>
                          <div className="text-xs text-slate-500">{formatDateTime(entry.timestamp)}</div>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">Campo: {entry.field} · Usuario: {entry.user}</p>
                        {(entry.previousValue || entry.nextValue) ? (
                          <p className="mt-2 text-sm text-slate-700">
                            {entry.previousValue ? `Antes: ${entry.previousValue}` : ""}
                            {entry.previousValue && entry.nextValue ? " · " : ""}
                            {entry.nextValue ? `Ahora: ${entry.nextValue}` : ""}
                          </p>
                        ) : null}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  )
}
