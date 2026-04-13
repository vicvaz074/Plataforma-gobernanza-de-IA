"use client"

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  AlertTriangle,
  Archive,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileText,
  FolderKanban,
  FolderOpen,
  Gauge,
  LayoutDashboard,
  ListChecks,
  Plus,
  Radio,
  Save,
  ShieldAlert,
  Trash2,
  UserPlus,
  Users,
  Workflow,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import jsPDF from "jspdf"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { GeneralTabShell, type GeneralTabShellBadge, type GeneralTabShellNavItem } from "@/components/general-tab-shell"
import { useToast } from "@/hooks/use-toast"
import {
  AI_GOVERNANCE_AUTOSAVE_KEY,
  AI_GOVERNANCE_STORAGE_KEY,
  AI_GOVERNANCE_STORAGE_VERSION,
  cloneCommitteeRecord,
  createEmptyCommitteeMember,
  createEmptyCommitteeRecord,
  migrateCommitteeCollection,
  normalizeCommitteeRecord,
  type CommitteeDraftSnapshot,
  type CommitteeLegacyDocuments,
  type CommitteeMember,
  type CommitteeMemberRole,
  type CommitteeModuleRecord,
  type CommitteeViewId,
} from "@/lib/ai-governance-committee"
import { AI_REGISTRY_STORAGE_UPDATED_EVENT, AI_SYSTEMS_REGISTRY_STORAGE_KEY, type AISystemData } from "@/lib/ai-registry"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
import { cn } from "@/lib/utils"

const WIZARD_STEPS = [
  { id: "organization", title: "Organizacion", description: "Empresa y representante" },
  { id: "document", title: "Documento", description: "Metadatos del acta" },
  { id: "members", title: "Integrantes", description: "Presidencia, secretaria y vocales" },
  { id: "framework", title: "Marco", description: "Normativa y base de aprobacion" },
  { id: "functions", title: "Atribuciones", description: "Mandato y alcance" },
  { id: "sessions", title: "Sesiones", description: "Periodicidad y convocatoria" },
  { id: "governance", title: "Gobierno", description: "Controles y seguimiento" },
  { id: "review", title: "Revision", description: "Resumen y documentos" },
] as const

const MEMBER_ROLE_OPTIONS: Array<{ value: CommitteeMemberRole; label: string }> = [
  { value: "president", label: "Presidente" },
  { value: "vicePresident", label: "Vicepresidente" },
  { value: "secretary", label: "Secretario tecnico" },
  { value: "vocal", label: "Vocal" },
  { value: "observer", label: "Observador externo" },
]

const LEGAL_BASIS_OPTIONS = [
  "ISO/IEC 42001",
  "NIST AI RMF",
  "EU AI Act",
  "LFPDPPP",
  "GDPR",
  "UNESCO",
  "OCDE",
]

const FUNCTION_OPTIONS = [
  "Gobernanza y liderazgo",
  "Riesgos y escalamiento",
  "Cumplimiento normativo",
  "Ciclo de vida de IA",
  "Transparencia y explicabilidad",
  "Incidentes y remediacion",
  "Capacitacion",
  "Colaboracion interareas",
  "Auditoria y mejora continua",
]

const CLASSIFICATION_OPTIONS = [
  { value: "internal", label: "Interno" },
  { value: "confidential", label: "Confidencial" },
  { value: "public", label: "Publico" },
]

const MEETING_FREQUENCY_OPTIONS = [
  { value: "monthly", label: "Mensual" },
  { value: "bimonthly", label: "Bimestral" },
  { value: "quarterly", label: "Trimestral" },
  { value: "semiannual", label: "Semestral" },
  { value: "annual", label: "Anual" },
]

const MODALITY_OPTIONS = [
  { value: "onsite", label: "Presencial" },
  { value: "remote", label: "Virtual" },
  { value: "hybrid", label: "Hibrida" },
]

const REPORT_TEMPLATES = [
  { id: "weekly", title: "Acuerdos activos", frequency: "Semanal", summary: "Vencimientos, responsables y bloqueos." },
  { id: "executive", title: "Ejecutivo del comite", frequency: "Mensual", summary: "Sesiones, quorum y decisiones clave." },
  { id: "compliance", title: "Cumplimiento normativo", frequency: "Bimestral", summary: "Adecuacion, remediaciones y cambios regulatorios." },
  { id: "annual", title: "Gobernanza anual", frequency: "Anual", summary: "KPIs, evolucion del inventario y hoja de ruta." },
  { id: "incident", title: "Incidente especifico", frequency: "Ad hoc", summary: "Mitigacion, notificaciones y lecciones aprendidas." },
  { id: "auditor", title: "Paquete regulador", frequency: "Ad hoc", summary: "Actas, evidencias y trazabilidad para auditoria." },
]

const LEGACY_DOCUMENT_LABELS: Record<keyof CommitteeLegacyDocuments, string> = {
  formalDocument: "Acta formal",
  foundingDocument: "Acta de constitucion",
  frameworkDocument: "Marco normativo",
  rolesDocument: "Roles documentados",
  rolesApprovedDocument: "Aprobacion de roles",
  missionDocument: "Mision del comite",
}

function readLocalJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback

  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeLocalJson(key: string, value: unknown) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(value))
}

function isEmailValid(value: string) {
  if (!value) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function toTitleCase(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatDate(value?: string) {
  if (!value) return "Sin fecha"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })
}

function formatRelativeDays(value?: string) {
  if (!value) return "Sin programar"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const now = new Date()
  const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return "Hoy"
  if (diff > 0) return `En ${diff} dia${diff === 1 ? "" : "s"}`
  const abs = Math.abs(diff)
  return `Hace ${abs} dia${abs === 1 ? "" : "s"}`
}

function getRoleLabel(role: CommitteeMemberRole) {
  return MEMBER_ROLE_OPTIONS.find((option) => option.value === role)?.label || "Vocal"
}

function getStatusChipClass(tone: "neutral" | "positive" | "warning" | "critical" | "info") {
  if (tone === "positive") return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (tone === "warning") return "border-amber-200 bg-amber-50 text-amber-700"
  if (tone === "critical") return "border-rose-200 bg-rose-50 text-rose-700"
  if (tone === "info") return "border-sky-200 bg-sky-50 text-sky-700"
  return "border-slate-200 bg-slate-50 text-slate-600"
}

function getRiskTone(system: AISystemData) {
  const risk = `${system.globalRiskLevel} ${system.highRiskClassification}`.toLowerCase()
  if (risk.includes("prohib")) return { label: "Prohibido", tone: "critical" as const }
  if (risk.includes("alto") || risk.includes("high")) return { label: "Alto riesgo", tone: "warning" as const }
  if (risk.includes("medio") || risk.includes("medium")) return { label: "Riesgo medio", tone: "info" as const }
  if (risk.includes("bajo") || risk.includes("low")) return { label: "Riesgo bajo", tone: "positive" as const }
  return { label: "Sin clasificar", tone: "neutral" as const }
}

function getCommitteeReviewLabel(value: string) {
  if (!value) return { label: "Pendiente", tone: "warning" as const }
  const normalized = value.toLowerCase()
  if (normalized.includes("aprob")) return { label: "Revisado", tone: "positive" as const }
  if (normalized.includes("pend")) return { label: "Pendiente", tone: "warning" as const }
  if (normalized.includes("sin_comite")) return { label: "Sin comite", tone: "critical" as const }
  return { label: toTitleCase(value), tone: "neutral" as const }
}

function computeCompletion(record: CommitteeModuleRecord) {
  const checks = [
    Boolean(record.committeeName),
    Boolean(record.organization.legalName),
    Boolean(record.documentMeta.constitutionDate),
    Boolean(record.rolesDocumented),
    Boolean(record.missionDefined),
    Boolean(record.sessionRegime.meetingFrequency),
    record.legalBasis.length > 0,
    record.functionCategories.length > 0,
    record.members.length > 0,
  ]
  const completed = checks.filter(Boolean).length
  return Math.round((completed / checks.length) * 100)
}

function sortByDate<T extends { date?: string; dueDate?: string }>(items: T[], key: "date" | "dueDate") {
  return [...items].sort((a, b) => {
    const first = new Date(a[key] || 0).getTime()
    const second = new Date(b[key] || 0).getTime()
    return first - second
  })
}

function getValidationErrorsByStep(record: CommitteeModuleRecord): string[][] {
  const presidentCount = record.members.filter((member) => member.membershipType === "president").length
  const secretaryCount = record.members.filter((member) => member.membershipType === "secretary").length
  const invalidEmails = record.members
    .filter((member) => member.email && !isEmailValid(member.email))
    .map((member) => member.fullName || getRoleLabel(member.membershipType))

  return [
    [
      !record.organization.legalName && "La razon social es obligatoria.",
      !record.organization.city && "La ciudad es obligatoria.",
      !record.organization.country && "El pais es obligatorio.",
      !record.organization.taxId && "El RFC/NIF es obligatorio.",
    ].filter(Boolean) as string[],
    [
      !record.documentMeta.committeeName && "El nombre del comite es obligatorio.",
      !record.documentMeta.constitutionDate && "La fecha de constitucion es obligatoria.",
      !record.documentMeta.classification && "Selecciona la clasificacion del documento.",
    ].filter(Boolean) as string[],
    [
      record.members.length === 0 && "Agrega al menos un integrante.",
      presidentCount === 0 && "Debe existir al menos un Presidente.",
      secretaryCount === 0 && "Debe existir al menos un Secretario tecnico.",
      invalidEmails.length > 0 && `Hay correos invalidos: ${invalidEmails.join(", ")}.`,
    ].filter(Boolean) as string[],
    [
      record.legalBasis.length === 0 && "Selecciona al menos un marco normativo.",
      !record.authorizingAuthority && "Indica quien autoriza la constitucion del comite.",
    ].filter(Boolean) as string[],
    [
      record.functionCategories.length === 0 && "Selecciona al menos una atribucion del comite.",
    ].filter(Boolean) as string[],
    [
      !record.sessionRegime.meetingFrequency && "Define la periodicidad de las sesiones.",
      record.sessionRegime.modalities.length === 0 && "Selecciona al menos una modalidad de sesion.",
      !record.sessionRegime.noticeDays && "Indica dias de anticipacion para convocatoria.",
    ].filter(Boolean) as string[],
    [
      !record.rolesDocumented && "Indica si los roles estan documentados.",
      !record.missionDefined && "Indica si la mision del comite esta definida.",
      !record.reportsToManagement && "Define la cadencia de reporte a direccion.",
      !record.periodicReview && "Define la revision periodica del comite.",
    ].filter(Boolean) as string[],
    [],
  ]
}

function syncDraftCompatibility(record: CommitteeModuleRecord) {
  const normalized = normalizeCommitteeRecord({
    ...record,
    committeeName: record.documentMeta.committeeName || record.committeeName,
    constitutionDate: record.documentMeta.constitutionDate || record.constitutionDate,
    meetingFrequency: record.sessionRegime.meetingFrequency || record.meetingFrequency,
    committeeFunctions: record.functionCategories.join(","),
    foundingMembers:
      record.foundingMembers || record.members.map((member) => member.fullName).filter(Boolean).join(", "),
    committeeMembers: record.members.map((member) => member.membershipType),
    lastModified: new Date().toISOString(),
    storageVersion: AI_GOVERNANCE_STORAGE_VERSION,
    version: AI_GOVERNANCE_STORAGE_VERSION,
  })

  return normalized
}

function generateCommitteePdf(record: CommitteeModuleRecord) {
  const pdf = new jsPDF()
  const margin = 18
  const pageWidth = pdf.internal.pageSize.width
  const pageHeight = pdf.internal.pageSize.height
  let y = 18

  const addParagraph = (label: string, value: string | string[]) => {
    const content = Array.isArray(value) ? value.filter(Boolean).join(", ") : value
    if (!content) return

    const lines = pdf.splitTextToSize(content, pageWidth - margin * 2)

    if (y > pageHeight - 28) {
      pdf.addPage()
      y = 20
    }

    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(11)
    pdf.text(label, margin, y)
    y += 6
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)
    pdf.text(lines, margin, y)
    y += lines.length * 5 + 6
  }

  pdf.setFillColor(1, 167, 158)
  pdf.roundedRect(12, 12, pageWidth - 24, 26, 8, 8, "F")
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(18)
  pdf.text(record.committeeName || "Comite de Gobernanza de IA", margin, 28)

  pdf.setTextColor(15, 23, 42)
  y = 48

  addParagraph("Organizacion", record.organization.legalName || "Sin capturar")
  addParagraph("Representante legal", record.organization.legalRepresentative)
  addParagraph("Clasificacion", record.documentMeta.classification)
  addParagraph("Fecha de constitucion", formatDate(record.documentMeta.constitutionDate))
  addParagraph("Marcos normativos", record.legalBasis)
  addParagraph("Integrantes", record.members.map((member) => `${member.fullName || "Pendiente"} - ${getRoleLabel(member.membershipType)}`))
  addParagraph("Atribuciones", record.functionCategories)
  addParagraph("Periodicidad de sesion", record.sessionRegime.meetingFrequency)
  addParagraph("Dias de convocatoria", record.sessionRegime.noticeDays)
  addParagraph("Reporte a direccion", record.reportsToManagement)
  addParagraph("Documentos adjuntos", record.repository.map((document) => document.name))

  const pages = pdf.internal.pages.length - 1
  for (let page = 1; page <= pages; page += 1) {
    pdf.setPage(page)
    pdf.setFontSize(8)
    pdf.setTextColor(100, 116, 139)
    pdf.text(`DavaraGovernance · Pagina ${page} de ${pages}`, margin, pageHeight - 10)
  }

  pdf.save(`${record.committeeName.replace(/\s+/g, "-").toLowerCase() || "comite-ia"}.pdf`)
}

function readCommitteeDraftSnapshot(): CommitteeDraftSnapshot | null {
  return readLocalJson<CommitteeDraftSnapshot | null>(AI_GOVERNANCE_AUTOSAVE_KEY, null)
}

function MetricTile({
  label,
  value,
  sublabel,
  tone = "neutral",
  icon: Icon,
}: {
  label: string
  value: string
  sublabel: string
  tone?: "neutral" | "positive" | "warning" | "critical" | "info"
  icon: LucideIcon
}) {
  return (
    <div className="rounded-[26px] border border-[hsl(var(--brand-border))] bg-[linear-gradient(180deg,#ffffff_0%,#f8fffe_100%)] p-4 shadow-[0_16px_42px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <p className="mt-2 text-3xl text-slate-950">{value}</p>
        </div>
        <div className="rounded-2xl bg-[hsl(var(--brand-soft))] p-3 text-[hsl(var(--brand-deep))]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className={cn("mt-3 text-sm", tone === "critical" && "text-rose-600", tone === "warning" && "text-amber-600", tone === "positive" && "text-emerald-600", tone === "info" && "text-sky-600", tone === "neutral" && "text-slate-500")}>
        {sublabel}
      </p>
    </div>
  )
}

function SectionBlock({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-[30px] border border-[hsl(var(--brand-border))] bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--brand-deep))]/55">{eyebrow}</p>
          <h2 className="mt-2 text-2xl text-slate-950 sm:text-[1.8rem]">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function EmptyStatePanel({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/60 px-6 py-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[hsl(var(--brand-deep))] shadow-sm">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-xl text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}

export default function AIGovernanceCommitteePage() {
  const { language } = useLanguage()
  const t = translations[language]
  const { toast } = useToast()
  const editQueryRef = useRef(false)
  const pendingEditIdRef = useRef<string | null>(null)

  const [committees, setCommittees] = useState<CommitteeModuleRecord[]>([])
  const [systems, setSystems] = useState<AISystemData[]>([])
  const [activeCommitteeId, setActiveCommitteeId] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<CommitteeViewId>("dashboard")
  const [constitutionDraft, setConstitutionDraft] = useState<CommitteeModuleRecord | null>(null)
  const [editingCommitteeId, setEditingCommitteeId] = useState<string | null>(null)
  const [wizardStep, setWizardStep] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [restoredDraft, setRestoredDraft] = useState(false)
  const [oversightStatusFilter, setOversightStatusFilter] = useState("all")
  const [oversightRiskFilter, setOversightRiskFilter] = useState("all")
  const [repositoryQuery, setRepositoryQuery] = useState("")

  useEffect(() => {
    pendingEditIdRef.current = new URLSearchParams(window.location.search).get("edit")

    const migratedCommittees = migrateCommitteeCollection(readLocalJson(AI_GOVERNANCE_STORAGE_KEY, [] as unknown[]))
    writeLocalJson(AI_GOVERNANCE_STORAGE_KEY, migratedCommittees)
    setCommittees(migratedCommittees)
    setActiveCommitteeId(migratedCommittees[0]?.id || null)

    const draftSnapshot = readCommitteeDraftSnapshot()
    if (draftSnapshot?.record) {
      setConstitutionDraft(normalizeCommitteeRecord(draftSnapshot.record))
      setWizardStep(draftSnapshot.wizardStep || 0)
      setEditingCommitteeId(draftSnapshot.editingCommitteeId)
      setActiveCommitteeId(draftSnapshot.activeCommitteeId || migratedCommittees[0]?.id || null)
      setActiveView("constitution")
      setRestoredDraft(true)
    }

    const syncSystems = () => {
      setSystems(readLocalJson<AISystemData[]>(AI_SYSTEMS_REGISTRY_STORAGE_KEY, []))
    }

    syncSystems()
    window.addEventListener(AI_REGISTRY_STORAGE_UPDATED_EVENT, syncSystems as EventListener)
    window.addEventListener("storage", syncSystems)

    return () => {
      window.removeEventListener(AI_REGISTRY_STORAGE_UPDATED_EVENT, syncSystems as EventListener)
      window.removeEventListener("storage", syncSystems)
    }
  }, [])

  useEffect(() => {
    if (!constitutionDraft) {
      window.localStorage.removeItem(AI_GOVERNANCE_AUTOSAVE_KEY)
      return
    }

    const payload: CommitteeDraftSnapshot = {
      record: constitutionDraft,
      wizardStep,
      editingCommitteeId,
      activeCommitteeId,
    }

    writeLocalJson(AI_GOVERNANCE_AUTOSAVE_KEY, payload)
  }, [constitutionDraft, wizardStep, editingCommitteeId, activeCommitteeId])

  useEffect(() => {
    const queryId = pendingEditIdRef.current
    if (!queryId || editQueryRef.current || committees.length === 0) return

    const target = committees.find((committee) => committee.id === queryId)
    if (target) {
      setActiveCommitteeId(target.id)
      setEditingCommitteeId(target.id)
      setConstitutionDraft(cloneCommitteeRecord(target))
      setWizardStep(0)
      setActiveView("constitution")
      editQueryRef.current = true
    }
  }, [committees])

  useEffect(() => {
    if (!activeCommitteeId && committees.length > 0) {
      setActiveCommitteeId(committees[0].id)
    }
  }, [activeCommitteeId, committees])

  const activeCommittee = useMemo(
    () => committees.find((committee) => committee.id === activeCommitteeId) || null,
    [activeCommitteeId, committees],
  )

  const committeeSystems = useMemo(() => {
    if (!activeCommittee) return []

    const organizationName = activeCommittee.organization.legalName.toLowerCase().trim()
    const committeeRelatedSystems = systems.filter((system) => system.committeeReviewStatus || system.committeeReportingDuty)

    if (!organizationName) return committeeRelatedSystems

    const exactMatches = systems.filter((system) => system.companyName.toLowerCase().trim() === organizationName)
    return exactMatches.length > 0 ? exactMatches : committeeRelatedSystems
  }, [activeCommittee, systems])

  const activeCommitteeRepository = useMemo(() => activeCommittee?.repository || [], [activeCommittee])
  const completionRate = activeCommittee ? computeCompletion(activeCommittee) : 0
  const sortedSessions = activeCommittee ? sortByDate(activeCommittee.sessions, "date") : []
  const upcomingSession = sortedSessions.find((session) => session.date && new Date(session.date).getTime() >= Date.now()) || null
  const agreementStats = useMemo(() => {
    const agreements = activeCommittee?.agreements || []
    return {
      total: agreements.length,
      pending: agreements.filter((agreement) => agreement.status === "pending").length,
      inProgress: agreements.filter((agreement) => agreement.status === "in_progress").length,
      overdue: agreements.filter((agreement) => agreement.status === "overdue").length,
      completed: agreements.filter((agreement) => agreement.status === "completed").length,
    }
  }, [activeCommittee])

  const systemsNeedingReview = useMemo(() => {
    return committeeSystems.filter((system) => {
      const review = getCommitteeReviewLabel(system.committeeReviewStatus)
      const hasDueReview = system.nextReviewDate ? new Date(system.nextReviewDate).getTime() < Date.now() : false
      const risk = getRiskTone(system)
      return review.label !== "Revisado" || hasDueReview || risk.label === "Alto riesgo" || risk.label === "Prohibido"
    })
  }, [committeeSystems])

  const headerBadges: GeneralTabShellBadge[] = []

  if (activeCommittee) {
    headerBadges.push({
      label: activeCommittee.status === "active" ? "Comite activo" : "Comite inactivo",
      tone: activeCommittee.status === "active" ? "positive" : "neutral",
    })
    headerBadges.push({ label: `${activeCommitteeRepository.length} documentos`, tone: "primary" })
    if (systemsNeedingReview.length > 0) {
      headerBadges.push({ label: `${systemsNeedingReview.length} revisiones pendientes`, tone: "warning" })
    }
  }

  if (constitutionDraft) {
    headerBadges.push({ label: editingCommitteeId ? "Edicion activa" : "Nuevo borrador", tone: "warning" })
  }

  if (restoredDraft) {
    headerBadges.push({ label: "Borrador recuperado", tone: "primary" })
  }

  const navItems: GeneralTabShellNavItem[] = [
    { id: "dashboard", label: "Dashboard", mobileLabel: "Dashboard", icon: LayoutDashboard },
    { id: "constitution", label: "Constitucion", mobileLabel: "Constitucion", icon: FileText },
    { id: "members", label: "Integrantes", mobileLabel: "Integrantes", icon: Users, badge: activeCommittee?.members.length || undefined },
    { id: "sessions", label: "Sesiones", mobileLabel: "Sesiones", icon: Calendar, badge: activeCommittee?.sessions.length || undefined },
    {
      id: "oversight",
      label: "Seguimiento",
      mobileLabel: "Seguimiento",
      icon: ListChecks,
      badge: (agreementStats.overdue || 0) + (systemsNeedingReview.length || 0) || undefined,
    },
    { id: "reports", label: "Informes", mobileLabel: "Informes", icon: Gauge, badge: activeCommittee?.reports.length || undefined },
    { id: "repository", label: "Repositorio", mobileLabel: "Repositorio", icon: Archive, badge: activeCommitteeRepository.length || undefined },
  ]

  const pageMeta: Record<CommitteeViewId, { label: string; title: string; description: string }> = {
    dashboard: {
      label: "Resumen operativo",
      title: "Comite de Gobernanza de IA",
      description: "KPIs, alertas y accesos rapidos para revisar el estado del comite sin saturar la vista.",
    },
    constitution: {
      label: "Constitucion",
      title: constitutionDraft ? "Wizard de constitucion" : "Acta y onboarding del comite",
      description: "Alta progresiva con autosave, validacion en tiempo real y revison final antes de guardar.",
    },
    members: {
      label: "Directorio",
      title: "Integrantes del comite",
      description: "Roles, mandatos y vigencias visibles de un vistazo; el detalle completo queda a un clic.",
    },
    sessions: {
      label: "Ciclo de sesiones",
      title: "Sesiones y actas",
      description: "Configuracion del regimen de sesiones y espacio listo para crecer cuando se capturen convocatorias y actas.",
    },
    oversight: {
      label: "Seguimiento",
      title: "Acuerdos y sistemas IA",
      description: "Vencimientos, prioridades y sistemas que requieren escalamiento al comite.",
    },
    reports: {
      label: "Motor de informes",
      title: "Informes periodicos",
      description: "Plantillas listas para evolucionar a generacion estructurada sin cargar la interfaz actual.",
    },
    repository: {
      label: "Repositorio",
      title: "Repositorio documental",
      description: "Documentos clasificados, descargables y listos para control de versiones y retencion.",
    },
  }

  const persistCommittees = (nextCommittees: CommitteeModuleRecord[]) => {
    writeLocalJson(AI_GOVERNANCE_STORAGE_KEY, nextCommittees)
    setCommittees(nextCommittees)
  }

  const openNewCommittee = () => {
    const draft = createEmptyCommitteeRecord()
    setConstitutionDraft(draft)
    setEditingCommitteeId(null)
    setWizardStep(0)
    setActiveView("constitution")
    setRestoredDraft(false)
  }

  const openEditCommittee = (record: CommitteeModuleRecord) => {
    setConstitutionDraft(cloneCommitteeRecord(record))
    setEditingCommitteeId(record.id)
    setWizardStep(0)
    setActiveCommitteeId(record.id)
    setActiveView("constitution")
    setRestoredDraft(false)
  }

  const cancelDraft = () => {
    setConstitutionDraft(null)
    setEditingCommitteeId(null)
    setWizardStep(0)
    setRestoredDraft(false)
    window.localStorage.removeItem(AI_GOVERNANCE_AUTOSAVE_KEY)
  }

  const updateDraft = (updater: (draft: CommitteeModuleRecord) => CommitteeModuleRecord) => {
    setConstitutionDraft((current) => {
      if (!current) return current
      return syncDraftCompatibility(updater(cloneCommitteeRecord(current)))
    })
  }

  const setOrganizationField = (field: keyof CommitteeModuleRecord["organization"], value: string) => {
    updateDraft((draft) => {
      draft.organization[field] = value
      return draft
    })
  }

  const setDocumentMetaField = (field: keyof CommitteeModuleRecord["documentMeta"], value: string) => {
    updateDraft((draft) => {
      // The document meta drives several legacy-compatible fields.
      draft.documentMeta[field] = value as never
      if (field === "committeeName") draft.committeeName = value
      if (field === "constitutionDate") draft.constitutionDate = value
      return draft
    })
  }

  const setSessionRegimeField = (field: keyof CommitteeModuleRecord["sessionRegime"], value: string | string[]) => {
    updateDraft((draft) => {
      draft.sessionRegime[field] = value as never
      if (field === "meetingFrequency" && typeof value === "string") {
        draft.meetingFrequency = value
      }
      return draft
    })
  }

  const toggleArrayValue = (currentValues: string[], value: string, checked: boolean) => {
    if (checked) return currentValues.includes(value) ? currentValues : [...currentValues, value]
    return currentValues.filter((item) => item !== value)
  }

  const addMember = (role: CommitteeMemberRole = "vocal") => {
    updateDraft((draft) => {
      draft.members.push(createEmptyCommitteeMember(role))
      return draft
    })
  }

  const updateMember = (memberId: string, field: keyof CommitteeMember, value: string | boolean) => {
    updateDraft((draft) => {
      draft.members = draft.members.map((member) =>
        member.id === memberId
          ? {
              ...member,
              [field]: value,
              isExternal: field === "membershipType" ? value === "observer" : member.isExternal,
            }
          : member,
      )
      return draft
    })
  }

  const removeMember = (memberId: string) => {
    updateDraft((draft) => {
      draft.members = draft.members.filter((member) => member.id !== memberId)
      return draft
    })
  }

  const handleFileUpload = (field: keyof CommitteeLegacyDocuments, file: File) => {
    if (!constitutionDraft) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result
      if (typeof result !== "string") return

      updateDraft((draft) => {
        draft.documents[field] = {
          name: file.name,
          data: result,
        }
        return draft
      })

      toast({
        title: t.success,
        description: `${LEGACY_DOCUMENT_LABELS[field]} cargado correctamente.`,
      })
    }
    reader.readAsDataURL(file)
  }

  const downloadDocument = (fileItem: { name: string; data: string }) => {
    const link = document.createElement("a")
    link.href = fileItem.data
    link.download = fileItem.name
    link.click()
  }

  const handleNextStep = () => {
    if (!constitutionDraft) return

    const stepErrors = getValidationErrorsByStep(constitutionDraft)[wizardStep]
    if (stepErrors.length > 0) {
      toast({
        title: t.error,
        description: stepErrors[0],
        variant: "destructive",
      })
      return
    }

    setWizardStep((current) => Math.min(current + 1, WIZARD_STEPS.length - 1))
  }

  const handleSaveCommittee = () => {
    if (!constitutionDraft) return

    const allErrors = getValidationErrorsByStep(constitutionDraft)
    const firstInvalidStep = allErrors.findIndex((errors) => errors.length > 0)

    if (firstInvalidStep >= 0) {
      setWizardStep(firstInvalidStep)
      toast({
        title: t.error,
        description: allErrors[firstInvalidStep][0],
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const existingCommittee = committees.find((committee) => committee.id === editingCommitteeId)
      const nextRecord = normalizeCommitteeRecord({
        ...constitutionDraft,
        id: existingCommittee?.id || constitutionDraft.id || `${Date.now()}`,
        createdAt: existingCommittee?.createdAt || constitutionDraft.createdAt || new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: AI_GOVERNANCE_STORAGE_VERSION,
        storageVersion: AI_GOVERNANCE_STORAGE_VERSION,
      })

      const nextCommittees = editingCommitteeId
        ? committees.map((committee) => (committee.id === editingCommitteeId ? nextRecord : committee))
        : [...committees, nextRecord]

      persistCommittees(nextCommittees)
      setActiveCommitteeId(nextRecord.id)
      cancelDraft()
      setActiveView("dashboard")

      toast({
        title: t.success,
        description: editingCommitteeId ? "Comite actualizado correctamente." : "Comite registrado correctamente.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCommittee = (committeeId: string) => {
    const target = committees.find((committee) => committee.id === committeeId)
    if (!target) return

    if (!window.confirm(`Se eliminara ${target.committeeName}. Esta accion no se puede deshacer.`)) {
      return
    }

    const nextCommittees = committees.filter((committee) => committee.id !== committeeId)
    persistCommittees(nextCommittees)

    if (activeCommitteeId === committeeId) {
      setActiveCommitteeId(nextCommittees[0]?.id || null)
    }

    toast({
      title: t.success,
      description: "Comite eliminado correctamente.",
    })
  }

  const constitutionActions = (
    <>
      {activeCommittee ? (
        <Button variant="outline" className="gap-2 bg-transparent" onClick={() => generateCommitteePdf(activeCommittee)}>
          <Download className="h-4 w-4" />
          Exportar PDF
        </Button>
      ) : null}
      {activeCommittee ? (
        <Button variant="outline" className="gap-2 bg-transparent" onClick={() => openEditCommittee(activeCommittee)}>
          <Eye className="h-4 w-4" />
          Editar
        </Button>
      ) : null}
      <Button className="gap-2 bg-[#01A79E] hover:bg-[#018b84]" onClick={openNewCommittee}>
        <Plus className="h-4 w-4" />
        Nuevo comite
      </Button>
    </>
  )

  const shellActions = (
    <>
      {committees.length > 1 ? (
        <Select value={activeCommitteeId || undefined} onValueChange={setActiveCommitteeId}>
          <SelectTrigger className="min-w-[220px] bg-white">
            <SelectValue placeholder="Selecciona un comite" />
          </SelectTrigger>
          <SelectContent>
            {committees.map((committee) => (
              <SelectItem key={committee.id} value={committee.id}>
                {committee.committeeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
      {activeCommittee ? (
        <Button variant="outline" className="gap-2 bg-transparent" onClick={() => generateCommitteePdf(activeCommittee)}>
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      ) : null}
      <Button className="gap-2 bg-[#01A79E] hover:bg-[#018b84]" onClick={openNewCommittee}>
        <Plus className="h-4 w-4" />
        Nuevo comite
      </Button>
    </>
  )

  const renderDashboard = () => {
    if (!activeCommittee) {
      return (
        <SectionBlock
          eyebrow="Inicio"
          title="Crea el primer comite"
          description="El shell ya esta preparado para dashboard, constitucion, seguimiento y repositorio. Solo falta capturar la primera configuracion."
          actions={constitutionActions}
        >
          <EmptyStatePanel
            icon={FolderKanban}
            title="No hay comites registrados"
            description="Empieza por el wizard de constitucion. El modulo guardara un borrador automatico y luego te mostrara las vistas operativas con el mismo shell."
            action={
              <Button className="gap-2 bg-[#01A79E] hover:bg-[#018b84]" onClick={openNewCommittee}>
                <ArrowRight className="h-4 w-4" />
                Comenzar wizard
              </Button>
            }
          />
        </SectionBlock>
      )
    }

    const alerts = [
      activeCommittee.members.filter((member) => member.membershipType === "president").length === 0 && {
        icon: AlertTriangle,
        tone: "warning" as const,
        title: "Falta Presidencia designada",
        description: "El wizard exige al menos un Presidente antes de guardar definitivamente.",
      },
      activeCommittee.members.filter((member) => member.membershipType === "secretary").length === 0 && {
        icon: AlertTriangle,
        tone: "warning" as const,
        title: "Falta Secretaria tecnica",
        description: "El comite requiere secretaria tecnica para trazabilidad de sesiones y actas.",
      },
      systemsNeedingReview.length > 0 && {
        icon: ShieldAlert,
        tone: "critical" as const,
        title: `${systemsNeedingReview.length} sistemas requieren revision`,
        description: "El modulo detecta sistemas con reporte al comite, alto riesgo o revision vencida.",
      },
      activeCommitteeRepository.length === 0 && {
        icon: FolderOpen,
        tone: "info" as const,
        title: "Aun no hay documentos en repositorio",
        description: "Carga el acta formal y el marco normativo para completar la traza documental.",
      },
    ].filter(Boolean) as Array<{ icon: LucideIcon; tone: "warning" | "critical" | "info"; title: string; description: string }>

    return (
      <div className="space-y-6">
        <SectionBlock
          eyebrow="Dashboard"
          title={activeCommittee.committeeName}
          description="Vista corta para revisar salud del comite, decisiones pendientes y sistemas que necesitan escalamiento sin entrar al detalle tecnico."
          actions={
            <>
              <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setActiveView("sessions")}>
                <Calendar className="h-4 w-4" />
                Ver sesiones
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setActiveView("reports")}>
                <FileText className="h-4 w-4" />
                Informes
              </Button>
              <Button className="gap-2 bg-[#01A79E] hover:bg-[#018b84]" onClick={() => openEditCommittee(activeCommittee)}>
                <Save className="h-4 w-4" />
                Editar constitucion
              </Button>
            </>
          }
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricTile
              label="Proxima sesion"
              value={upcomingSession ? formatDate(upcomingSession.date).split(" ").slice(0, 2).join(" ") : "Sin fecha"}
              sublabel={upcomingSession ? formatRelativeDays(upcomingSession.date) : "Configura el regimen de sesiones"}
              tone={upcomingSession ? "warning" : "neutral"}
              icon={Calendar}
            />
            <MetricTile
              label="Acuerdos activos"
              value={`${agreementStats.total}`}
              sublabel={
                agreementStats.overdue > 0
                  ? `${agreementStats.overdue} con retraso`
                  : agreementStats.total > 0
                    ? `${agreementStats.completed} completados`
                    : "Sin acuerdos registrados"
              }
              tone={agreementStats.overdue > 0 ? "critical" : "positive"}
              icon={Workflow}
            />
            <MetricTile
              label="Sistemas IA"
              value={`${committeeSystems.length}`}
              sublabel={
                systemsNeedingReview.length > 0
                  ? `${systemsNeedingReview.length} requieren revision`
                  : committeeSystems.length > 0
                    ? "Sin alertas criticas"
                    : "Sin sistemas vinculados"
              }
              tone={systemsNeedingReview.length > 0 ? "warning" : "neutral"}
              icon={Radio}
            />
            <MetricTile
              label="Madurez del modulo"
              value={`${completionRate}%`}
              sublabel={completionRate >= 80 ? "Base documental consistente" : "Todavia hay huecos de configuracion"}
              tone={completionRate >= 80 ? "positive" : "info"}
              icon={Gauge}
            />
          </div>

          {alerts.length > 0 ? (
            <div className="mt-6 grid gap-3">
              {alerts.map((alert) => (
                <Alert
                  key={alert.title}
                  className={cn(
                    "rounded-[24px] border px-5 py-4",
                    alert.tone === "critical" && "border-rose-200 bg-rose-50 text-rose-700",
                    alert.tone === "warning" && "border-amber-200 bg-amber-50 text-amber-700",
                    alert.tone === "info" && "border-sky-200 bg-sky-50 text-sky-700",
                  )}
                >
                  <alert.icon className="h-4 w-4" />
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertDescription>{alert.description}</AlertDescription>
                </Alert>
              ))}
            </div>
          ) : null}
        </SectionBlock>

        <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
          <SectionBlock
            eyebrow="Actividad"
            title="Resumen operativo"
            description="Los bloques muestran solo lo urgente: sesion mas cercana, acuerdos criticos y salud documental."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg text-slate-950">Proxima sesion</h3>
                  <Badge className="bg-white text-slate-700" variant="secondary">
                    {upcomingSession ? "Programada" : "Pendiente"}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {upcomingSession
                    ? `${upcomingSession.title || "Sesion ordinaria"} · ${formatDate(upcomingSession.date)} · ${upcomingSession.modality || "Sin modalidad"}`
                    : "Aun no hay sesiones programadas. El modulo ya muestra el regimen para que el usuario entienda el hueco."}
                </p>
              </div>

              <div className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg text-slate-950">Repositorio</h3>
                  <Badge className="bg-white text-slate-700" variant="secondary">
                    {activeCommitteeRepository.length} docs
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {activeCommitteeRepository.length > 0
                    ? `${activeCommitteeRepository[0].name} es el ultimo documento indexado.`
                    : "Todavia no hay evidencia documental cargada en el repositorio."}
                </p>
              </div>

              <div className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-white p-4 md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg text-slate-950">Sistemas con foco del comite</h3>
                  <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setActiveView("oversight")}>
                    <ListChecks className="h-4 w-4" />
                    Ver seguimiento
                  </Button>
                </div>
                <div className="mt-4 grid gap-3">
                  {systemsNeedingReview.slice(0, 3).map((system) => {
                    const risk = getRiskTone(system)
                    const review = getCommitteeReviewLabel(system.committeeReviewStatus)
                    return (
                      <div
                        key={system.id}
                        className="flex flex-col gap-3 rounded-[22px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-base text-slate-950">{system.systemName || "Sistema sin nombre"}</p>
                          <p className="mt-1 text-sm text-slate-600">
                            {system.responsibleArea || "Area sin especificar"} · {formatRelativeDays(system.nextReviewDate)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className={cn("rounded-full border px-3 py-1 text-xs", getStatusChipClass(risk.tone))}>{risk.label}</span>
                          <span className={cn("rounded-full border px-3 py-1 text-xs", getStatusChipClass(review.tone))}>{review.label}</span>
                        </div>
                      </div>
                    )
                  })}

                  {systemsNeedingReview.length === 0 ? (
                    <div className="rounded-[22px] border border-dashed border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/40 p-5 text-sm text-slate-600">
                      No hay sistemas con alertas activas en este momento.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </SectionBlock>

          <SectionBlock
            eyebrow="Quick view"
            title="Decisiones pendientes"
            description="Una sola columna para lectura rapida en tablet y escritorio estrecho."
          >
            <div className="space-y-3">
              {[
                {
                  title: "Integrantes activos",
                  value: `${activeCommittee.members.length || activeCommittee.committeeMembers.length}`,
                  detail: activeCommittee.members.length > 0 ? "Con ficha individual" : "Solo hay roles heredados o placeholders",
                },
                {
                  title: "Atribuciones registradas",
                  value: `${activeCommittee.functionCategories.length}`,
                  detail: activeCommittee.functionCategories.length > 0 ? "Mandato visible" : "Falta terminar la configuracion",
                },
                {
                  title: "Reportes generados",
                  value: `${activeCommittee.reports.length}`,
                  detail: activeCommittee.reports.length > 0 ? "Historial disponible" : "Vista preparada para la siguiente fase",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[22px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm uppercase tracking-[0.14em] text-slate-500">{item.title}</p>
                    <p className="text-2xl text-slate-950">{item.value}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </SectionBlock>
        </div>
      </div>
    )
  }

  const renderConstitutionSummary = () => {
    if (!activeCommittee) {
      return (
        <EmptyStatePanel
          icon={FileText}
          title="Aun no hay constitucion capturada"
          description="El wizard organiza la informacion en ocho pasos y guarda progreso local automaticamente."
          action={
            <Button className="gap-2 bg-[#01A79E] hover:bg-[#018b84]" onClick={openNewCommittee}>
              <ArrowRight className="h-4 w-4" />
              Comenzar wizard
            </Button>
          }
        />
      )
    }

    const stepErrors = getValidationErrorsByStep(activeCommittee)

    return (
      <div className="space-y-6">
        <SectionBlock
          eyebrow="Constitucion"
          title="Resumen del acta y onboarding"
          description="Esta vista compacta evita mostrar todo el formulario. El detalle vuelve a abrirse solo cuando el usuario quiere editar."
          actions={
            <>
              <Button variant="outline" className="gap-2 bg-transparent" onClick={() => generateCommitteePdf(activeCommittee)}>
                <Download className="h-4 w-4" />
                Exportar
              </Button>
              <Button className="gap-2 bg-[#01A79E] hover:bg-[#018b84]" onClick={() => openEditCommittee(activeCommittee)}>
                <Save className="h-4 w-4" />
                Editar constitucion
              </Button>
            </>
          }
        >
          <div className="grid gap-4 lg:grid-cols-[1fr,0.9fr]">
            <div className="space-y-4">
              <div className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/40 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Documento base</p>
                <h3 className="mt-2 text-xl text-slate-950">{activeCommittee.committeeName}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {activeCommittee.organization.legalName || "Organizacion sin capturar"} · {formatDate(activeCommittee.documentMeta.constitutionDate)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={cn("rounded-full border px-3 py-1 text-xs", getStatusChipClass("info"))}>
                    {CLASSIFICATION_OPTIONS.find((option) => option.value === activeCommittee.documentMeta.classification)?.label || "Confidencial"}
                  </span>
                  <span className={cn("rounded-full border px-3 py-1 text-xs", getStatusChipClass("neutral"))}>
                    {activeCommittee.documentMeta.documentVersion || "v1.0"}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-white p-4">
                  <p className="text-sm uppercase tracking-[0.12em] text-slate-500">Marcos normativos</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {activeCommittee.legalBasis.length > 0 ? activeCommittee.legalBasis.join(", ") : "Pendiente de definir"}
                  </p>
                </div>
                <div className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-white p-4">
                  <p className="text-sm uppercase tracking-[0.12em] text-slate-500">Regimen de sesiones</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {activeCommittee.sessionRegime.meetingFrequency
                      ? `${activeCommittee.sessionRegime.meetingFrequency} · ${activeCommittee.sessionRegime.modalities.join(", ")}`
                      : "Pendiente de configurar"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-[hsl(var(--brand-border))] bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Progreso del wizard</p>
                  <h3 className="mt-2 text-xl text-slate-950">{computeCompletion(activeCommittee)}% completo</h3>
                </div>
                <Badge className="bg-[hsl(var(--brand-soft))] text-[hsl(var(--brand-deep))]" variant="secondary">
                  {stepErrors.filter((errors) => errors.length === 0).length}/{WIZARD_STEPS.length} pasos
                </Badge>
              </div>
              <div className="mt-4 space-y-3">
                {WIZARD_STEPS.map((step, index) => {
                  const valid = stepErrors[index].length === 0
                  return (
                    <button
                      key={step.id}
                      type="button"
                      className="flex w-full items-center justify-between rounded-[18px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/40 px-4 py-3 text-left"
                      onClick={() => {
                        openEditCommittee(activeCommittee)
                        setWizardStep(index)
                      }}
                    >
                      <div>
                        <p className="text-sm text-slate-950">{index + 1}. {step.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{step.description}</p>
                      </div>
                      <span className={cn("rounded-full border px-3 py-1 text-xs", getStatusChipClass(valid ? "positive" : "warning"))}>
                        {valid ? "Listo" : "Pendiente"}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </SectionBlock>
      </div>
    )
  }

  const renderDraftFieldLabel = (title: string, description?: string) => (
    <div className="mb-2">
      <Label className="text-sm text-slate-900">{title}</Label>
      {description ? <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p> : null}
    </div>
  )

  const renderConstitutionWizard = () => {
    if (!constitutionDraft) return renderConstitutionSummary()

    const allStepErrors = getValidationErrorsByStep(constitutionDraft)
    const currentStep = WIZARD_STEPS[wizardStep]

    return (
      <div className="space-y-6">
        <SectionBlock
          eyebrow="Wizard"
          title={editingCommitteeId ? "Editar constitucion del comite" : "Nuevo comite de gobernanza"}
          description="El formulario esta dividido para no saturar la interfaz. Solo se muestra el bloque necesario en cada paso."
          actions={
            <>
              <Button variant="outline" className="gap-2 bg-transparent" onClick={cancelDraft}>
                <XCircle className="h-4 w-4" />
                Descartar
              </Button>
              <Button className="gap-2 bg-[#01A79E] hover:bg-[#018b84]" onClick={handleSaveCommittee} disabled={isSaving}>
                <Save className="h-4 w-4" />
                {isSaving ? "Guardando..." : editingCommitteeId ? "Actualizar comite" : "Guardar comite"}
              </Button>
            </>
          }
        >
          <div className="rounded-[28px] border border-[hsl(var(--brand-border))] bg-[linear-gradient(180deg,hsl(var(--brand-soft))_0%,#ffffff_70%)] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[hsl(var(--brand-deep))]/55">Paso {wizardStep + 1} de {WIZARD_STEPS.length}</p>
                <h3 className="mt-2 text-xl text-slate-950">{currentStep.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{currentStep.description}</p>
              </div>
              <Badge className="bg-white text-[hsl(var(--brand-deep))]" variant="secondary">
                {computeCompletion(constitutionDraft)}% completo
              </Badge>
            </div>
            <Progress className="mt-4 h-2 bg-white" value={((wizardStep + 1) / WIZARD_STEPS.length) * 100} />
            <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              {WIZARD_STEPS.map((step, index) => {
                const isCurrent = index === wizardStep
                const isValid = allStepErrors[index].length === 0
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setWizardStep(index)}
                    className={cn(
                      "rounded-[18px] border px-4 py-3 text-left transition-all",
                      isCurrent
                        ? "border-[hsl(var(--primary))] bg-white shadow-[0_18px_36px_rgba(1,167,158,0.14)]"
                        : "border-white/80 bg-white/70 hover:bg-white",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-slate-950">{step.title}</span>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px]", getStatusChipClass(isValid ? "positive" : "warning"))}>
                        {isValid ? "OK" : "!"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{step.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {allStepErrors[wizardStep].length > 0 ? (
            <Alert className="rounded-[22px] border-amber-200 bg-amber-50 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Faltan datos en este paso</AlertTitle>
              <AlertDescription>{allStepErrors[wizardStep][0]}</AlertDescription>
            </Alert>
          ) : null}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="rounded-[30px] border border-[hsl(var(--brand-border))] bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:p-6"
            >
              {wizardStep === 0 ? (
                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    {renderDraftFieldLabel("Razon social", "Nombre legal que aparecera en el acta y en los reportes.")}
                    <Input value={constitutionDraft.organization.legalName} onChange={(event) => setOrganizationField("legalName", event.target.value)} />
                  </div>
                  <div>
                    {renderDraftFieldLabel("Representante legal")}
                    <Input value={constitutionDraft.organization.legalRepresentative} onChange={(event) => setOrganizationField("legalRepresentative", event.target.value)} />
                  </div>
                  <div className="lg:col-span-2">
                    {renderDraftFieldLabel("Domicilio")}
                    <Input value={constitutionDraft.organization.address} onChange={(event) => setOrganizationField("address", event.target.value)} />
                  </div>
                  <div>
                    {renderDraftFieldLabel("Ciudad")}
                    <Input value={constitutionDraft.organization.city} onChange={(event) => setOrganizationField("city", event.target.value)} />
                  </div>
                  <div>
                    {renderDraftFieldLabel("Pais")}
                    <Input value={constitutionDraft.organization.country} onChange={(event) => setOrganizationField("country", event.target.value)} />
                  </div>
                  <div>
                    {renderDraftFieldLabel("RFC / NIF")}
                    <Input value={constitutionDraft.organization.taxId} onChange={(event) => setOrganizationField("taxId", event.target.value)} />
                  </div>
                  <div>
                    {renderDraftFieldLabel("Area organizacional dominante", "Sirve para compatibilidad con reportes y auditoria.")}
                    <Select value={constitutionDraft.organizationalLevel || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, organizationalLevel: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direccion">Direccion</SelectItem>
                        <SelectItem value="operacion">Operacion</SelectItem>
                        <SelectItem value="riesgos">Riesgos</SelectItem>
                        <SelectItem value="cumplimiento">Cumplimiento</SelectItem>
                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : null}

              {wizardStep === 1 ? (
                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    {renderDraftFieldLabel("Nombre del comite")}
                    <Input value={constitutionDraft.documentMeta.committeeName} onChange={(event) => setDocumentMetaField("committeeName", event.target.value)} />
                  </div>
                  <div>
                    {renderDraftFieldLabel("Clasificacion")}
                    <Select value={constitutionDraft.documentMeta.classification} onValueChange={(value) => setDocumentMetaField("classification", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASSIFICATION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {renderDraftFieldLabel("Referencia")}
                    <Input value={constitutionDraft.documentMeta.referenceCode} onChange={(event) => setDocumentMetaField("referenceCode", event.target.value)} />
                  </div>
                  <div>
                    {renderDraftFieldLabel("Version")}
                    <Input value={constitutionDraft.documentMeta.documentVersion} onChange={(event) => setDocumentMetaField("documentVersion", event.target.value)} />
                  </div>
                  <div>
                    {renderDraftFieldLabel("Fecha de constitucion")}
                    <Input type="date" value={constitutionDraft.documentMeta.constitutionDate} onChange={(event) => setDocumentMetaField("constitutionDate", event.target.value)} />
                  </div>
                  <div>
                    {renderDraftFieldLabel("Propietario del documento")}
                    <Input value={constitutionDraft.documentMeta.owner} onChange={(event) => setDocumentMetaField("owner", event.target.value)} />
                  </div>
                  <div>
                    {renderDraftFieldLabel("Autor")}
                    <Input value={constitutionDraft.documentMeta.author} onChange={(event) => setDocumentMetaField("author", event.target.value)} />
                  </div>
                  <div>
                    {renderDraftFieldLabel("Estado del comite")}
                    <Select value={constitutionDraft.status} onValueChange={(value) => updateDraft((draft) => ({ ...draft, status: value === "inactive" ? "inactive" : "active" }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : null}

              {wizardStep === 2 ? (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-950">Integrantes capturados</p>
                      <p className="mt-1 text-xs text-slate-500">Se validan correos, Presidencia y Secretaria tecnica antes del guardado final.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="gap-2 bg-transparent" onClick={() => addMember("president")}>
                        <UserPlus className="h-4 w-4" />
                        Presidente
                      </Button>
                      <Button variant="outline" className="gap-2 bg-transparent" onClick={() => addMember("secretary")}>
                        <UserPlus className="h-4 w-4" />
                        Secretario
                      </Button>
                      <Button className="gap-2 bg-[#01A79E] hover:bg-[#018b84]" onClick={() => addMember("vocal")}>
                        <Plus className="h-4 w-4" />
                        Agregar integrante
                      </Button>
                    </div>
                  </div>

                  {constitutionDraft.members.length === 0 ? (
                    <EmptyStatePanel
                      icon={Users}
                      title="Aun no hay integrantes nominales"
                      description="El dato legacy solo conoce roles generales. Aqui capturamos nombres, areas y mandatos para una experiencia mucho mas util."
                    />
                  ) : null}

                  <div className="space-y-4">
                    {constitutionDraft.members.map((member, index) => (
                      <div key={member.id} className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/35 p-4">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Integrante {index + 1}</p>
                            <h4 className="mt-1 text-lg text-slate-950">{member.fullName || getRoleLabel(member.membershipType)}</h4>
                          </div>
                          <Button variant="outline" className="gap-2 bg-transparent text-rose-600 hover:text-rose-700" onClick={() => removeMember(member.id)}>
                            <Trash2 className="h-4 w-4" />
                            Quitar
                          </Button>
                        </div>
                        <div className="grid gap-4 lg:grid-cols-2">
                          <div>
                            {renderDraftFieldLabel("Nombre completo")}
                            <Input value={member.fullName} onChange={(event) => updateMember(member.id, "fullName", event.target.value)} />
                          </div>
                          <div>
                            {renderDraftFieldLabel("Rol en el comite")}
                            <Select value={member.membershipType} onValueChange={(value) => updateMember(member.id, "membershipType", value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {MEMBER_ROLE_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            {renderDraftFieldLabel("Cargo")}
                            <Input value={member.position} onChange={(event) => updateMember(member.id, "position", event.target.value)} />
                          </div>
                          <div>
                            {renderDraftFieldLabel("Area")}
                            <Input value={member.area} onChange={(event) => updateMember(member.id, "area", event.target.value)} />
                          </div>
                          <div>
                            {renderDraftFieldLabel("Correo institucional")}
                            <Input
                              type="email"
                              value={member.email}
                              onChange={(event) => updateMember(member.id, "email", event.target.value)}
                              className={cn(member.email && !isEmailValid(member.email) && "border-rose-300 focus-visible:ring-rose-400")}
                            />
                          </div>
                          <div>
                            {renderDraftFieldLabel("Telefono")}
                            <Input value={member.phone} onChange={(event) => updateMember(member.id, "phone", event.target.value)} />
                          </div>
                          <div>
                            {renderDraftFieldLabel("Inicio de mandato")}
                            <Input type="date" value={member.mandateStart} onChange={(event) => updateMember(member.id, "mandateStart", event.target.value)} />
                          </div>
                          <div>
                            {renderDraftFieldLabel("Fin de mandato")}
                            <Input type="date" value={member.mandateEnd} onChange={(event) => updateMember(member.id, "mandateEnd", event.target.value)} />
                          </div>
                          <div className="lg:col-span-2 flex items-center gap-3 rounded-[18px] border border-[hsl(var(--brand-border))] bg-white px-4 py-3">
                            <Checkbox
                              id={`external-${member.id}`}
                              checked={member.isExternal}
                              onCheckedChange={(checked) => updateMember(member.id, "isExternal", Boolean(checked))}
                            />
                            <Label htmlFor={`external-${member.id}`} className="text-sm text-slate-700">
                              Integrante externo
                            </Label>
                            {member.isExternal ? (
                              <Input
                                value={member.company}
                                onChange={(event) => updateMember(member.id, "company", event.target.value)}
                                placeholder="Empresa o despacho"
                                className="ml-auto max-w-xs"
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {wizardStep === 3 ? (
                <div className="grid gap-5 lg:grid-cols-[1fr,0.85fr]">
                  <div>
                    {renderDraftFieldLabel("Marcos normativos de referencia", "Selecciona solo lo esencial para que el bloque sea facil de escanear.")}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {LEGAL_BASIS_OPTIONS.map((framework) => {
                        const checked = constitutionDraft.legalBasis.includes(framework)
                        return (
                          <label
                            key={framework}
                            className="flex items-center gap-3 rounded-[18px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/35 px-4 py-3"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) =>
                                updateDraft((draft) => {
                                  draft.legalBasis = toggleArrayValue(draft.legalBasis, framework, Boolean(value))
                                  return draft
                                })
                              }
                            />
                            <span className="text-sm text-slate-700">{framework}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      {renderDraftFieldLabel("Base de aprobacion")}
                      <Select value={constitutionDraft.authorizingAuthority || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, authorizingAuthority: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Quien aprueba la constitucion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="board">Consejo / Junta Directiva</SelectItem>
                          <SelectItem value="management">Alta direccion</SelectItem>
                          <SelectItem value="compliance">Cumplimiento</SelectItem>
                          <SelectItem value="other">Otra autoridad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {constitutionDraft.authorizingAuthority === "other" ? (
                      <div>
                        {renderDraftFieldLabel("Especifica la autoridad")}
                        <Input value={constitutionDraft.otherAuthority} onChange={(event) => updateDraft((draft) => ({ ...draft, otherAuthority: event.target.value }))} />
                      </div>
                    ) : null}
                    <div>
                      {renderDraftFieldLabel("Formado con base en marcos regulatorios o eticos")}
                      <Select value={constitutionDraft.formedBasedOnFrameworks || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, formedBasedOnFrameworks: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una opcion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yesExplicitly">Si, de forma explicita</SelectItem>
                          <SelectItem value="partially">Parcialmente</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : null}

              {wizardStep === 4 ? (
                <div className="grid gap-5 lg:grid-cols-[1fr,0.85fr]">
                  <div>
                    {renderDraftFieldLabel("Atribuciones principales", "El texto se mantiene corto en interfaz y luego se convierte en lista para PDF y repositorio.")}
                    <div className="grid gap-3">
                      {FUNCTION_OPTIONS.map((option) => {
                        const checked = constitutionDraft.functionCategories.includes(option)
                        return (
                          <label
                            key={option}
                            className="flex items-start gap-3 rounded-[18px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/35 px-4 py-3"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) =>
                                updateDraft((draft) => {
                                  draft.functionCategories = toggleArrayValue(draft.functionCategories, option, Boolean(value))
                                  return draft
                                })
                              }
                              className="mt-0.5"
                            />
                            <span className="text-sm leading-6 text-slate-700">{option}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      {renderDraftFieldLabel("Otras atribuciones")}
                      <Textarea
                        value={constitutionDraft.otherFunctions}
                        onChange={(event) => updateDraft((draft) => ({ ...draft, otherFunctions: event.target.value }))}
                        className="min-h-[120px]"
                      />
                    </div>
                    <div className="rounded-[22px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/35 p-4">
                      <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Resumen actual</p>
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {constitutionDraft.functionCategories.length > 0
                          ? `${constitutionDraft.functionCategories.length} atribuciones seleccionadas.`
                          : "Todavia no hay atribuciones seleccionadas."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {wizardStep === 5 ? (
                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    {renderDraftFieldLabel("Periodicidad ordinaria")}
                    <Select value={constitutionDraft.sessionRegime.meetingFrequency || undefined} onValueChange={(value) => setSessionRegimeField("meetingFrequency", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una periodicidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {MEETING_FREQUENCY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {renderDraftFieldLabel("Quorum minimo")}
                    <Input value={constitutionDraft.sessionRegime.quorumRequired} onChange={(event) => setSessionRegimeField("quorumRequired", event.target.value)} />
                  </div>
                  <div>
                    {renderDraftFieldLabel("Dias de anticipacion para convocatoria")}
                    <Input value={constitutionDraft.sessionRegime.noticeDays} onChange={(event) => setSessionRegimeField("noticeDays", event.target.value)} />
                  </div>
                  <div>
                    {renderDraftFieldLabel("Dias previos para distribuir agenda")}
                    <Input value={constitutionDraft.sessionRegime.agendaLeadDays} onChange={(event) => setSessionRegimeField("agendaLeadDays", event.target.value)} />
                  </div>
                  <div className="lg:col-span-2">
                    {renderDraftFieldLabel("Modalidades permitidas")}
                    <div className="grid gap-3 sm:grid-cols-3">
                      {MODALITY_OPTIONS.map((option) => {
                        const checked = constitutionDraft.sessionRegime.modalities.includes(option.value)
                        return (
                          <label
                            key={option.value}
                            className="flex items-center gap-3 rounded-[18px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/35 px-4 py-3"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) =>
                                updateDraft((draft) => {
                                  draft.sessionRegime.modalities = toggleArrayValue(
                                    draft.sessionRegime.modalities,
                                    option.value,
                                    Boolean(value),
                                  )
                                  return draft
                                })
                              }
                            />
                            <span className="text-sm text-slate-700">{option.label}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    {renderDraftFieldLabel("Quien define la agenda")}
                    <Select value={constitutionDraft.agendaDetermination || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, agendaDetermination: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="board">Consejo / Junta</SelectItem>
                        <SelectItem value="committeeItself">El propio comite</SelectItem>
                        <SelectItem value="members">Integrantes</SelectItem>
                        <SelectItem value="mixed">Mixto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : null}

              {wizardStep === 6 ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    {renderDraftFieldLabel("Roles documentados")}
                    <Select value={constitutionDraft.rolesDocumented || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, rolesDocumented: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fullyDocumented">Completamente documentados</SelectItem>
                        <SelectItem value="partiallyDocumented">Parcialmente documentados</SelectItem>
                        <SelectItem value="inDevelopment">En desarrollo</SelectItem>
                        <SelectItem value="notDocumented">No documentados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {renderDraftFieldLabel("Roles aprobados")}
                    <Select value={constitutionDraft.rolesApproved || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, rolesApproved: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Si</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {renderDraftFieldLabel("Mision del comite definida")}
                    <Select value={constitutionDraft.missionDefined || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, missionDefined: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Si</SelectItem>
                        <SelectItem value="partial">Parcial</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {renderDraftFieldLabel("Revisa iniciativas de IA")}
                    <Select value={constitutionDraft.reviewsInitiatives || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, reviewsInitiatives: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yesSystematically">Si, de forma sistematica</SelectItem>
                        <SelectItem value="onlyAdHoc">Solo ad hoc</SelectItem>
                        <SelectItem value="rarely">Rara vez</SelectItem>
                        <SelectItem value="never">Nunca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {renderDraftFieldLabel("Valida datos y privacidad")}
                    <Select value={constitutionDraft.validatesDataPolicies || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, validatesDataPolicies: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yesCompletely">Si</SelectItem>
                        <SelectItem value="partially">Parcialmente</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {renderDraftFieldLabel("Define procesos eticos y responsables")}
                    <Select value={constitutionDraft.definesProcesses || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, definesProcesses: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yesDocumented">Si, documentados</SelectItem>
                        <SelectItem value="partially">Parcialmente</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {renderDraftFieldLabel("Promueve cultura de IA")}
                    <Select value={constitutionDraft.promotesCulture || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, promotesCulture: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Si</SelectItem>
                        <SelectItem value="partial">Parcial</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {renderDraftFieldLabel("KPIs del programa")}
                    <Select value={constitutionDraft.establishesKPIs || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, establishesKPIs: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yesDetailed">Si</SelectItem>
                        <SelectItem value="partial">Parcial</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {renderDraftFieldLabel("Comunica internamente")}
                    <Select value={constitutionDraft.communicatesInternally || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, communicatesInternally: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approvedMinutes">Actas aprobadas</SelectItem>
                        <SelectItem value="executiveReports">Reportes ejecutivos</SelectItem>
                        <SelectItem value="informal">Informal</SelectItem>
                        <SelectItem value="nothing">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {renderDraftFieldLabel("Reporte a alta direccion")}
                    <Select value={constitutionDraft.reportsToManagement || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, reportsToManagement: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Mensual</SelectItem>
                        <SelectItem value="quarterly">Trimestral</SelectItem>
                        <SelectItem value="semiannual">Semestral</SelectItem>
                        <SelectItem value="adHoc">Ad hoc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {renderDraftFieldLabel("Revision periodica del comite")}
                    <Select value={constitutionDraft.periodicReview || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, periodicReview: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annual">Anual</SelectItem>
                        <SelectItem value="semiannual">Semestral</SelectItem>
                        <SelectItem value="adHoc">Ad hoc</SelectItem>
                        <SelectItem value="none">No definida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {renderDraftFieldLabel("Documento formal firmado")}
                    <Select value={constitutionDraft.formalDocumentSigned || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, formalDocumentSigned: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Si</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {renderDraftFieldLabel("Vigencia definida")}
                    <Select value={constitutionDraft.validityDefined || undefined} onValueChange={(value) => updateDraft((draft) => ({ ...draft, validityDefined: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indefinite">Indefinida</SelectItem>
                        <SelectItem value="fixed">Periodo determinado</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : null}

              {wizardStep === 7 ? (
                <div className="grid gap-5 xl:grid-cols-[0.92fr,1.08fr]">
                  <div className="space-y-5">
                    <div className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/35 p-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Resumen rapido</p>
                      <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                        <p><strong>Organizacion:</strong> {constitutionDraft.organization.legalName || "Pendiente"}</p>
                        <p><strong>Fecha:</strong> {formatDate(constitutionDraft.documentMeta.constitutionDate)}</p>
                        <p><strong>Integrantes:</strong> {constitutionDraft.members.length}</p>
                        <p><strong>Marcos:</strong> {constitutionDraft.legalBasis.length}</p>
                        <p><strong>Documentos:</strong> {constitutionDraft.repository.length}</p>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-white p-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Repositorio inicial</p>
                      <div className="mt-4 space-y-3">
                        {(Object.keys(LEGACY_DOCUMENT_LABELS) as Array<keyof CommitteeLegacyDocuments>).map((field) => (
                          <div key={field} className="rounded-[18px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/35 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="text-sm text-slate-950">{LEGACY_DOCUMENT_LABELS[field]}</p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {constitutionDraft.documents[field]?.name || "Sin documento cargado"}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  onChange={(event) => {
                                    const file = event.target.files?.[0]
                                    if (file) handleFileUpload(field, file)
                                  }}
                                  className="max-w-[220px]"
                                />
                                {constitutionDraft.documents[field] ? (
                                  <Button
                                    variant="outline"
                                    className="gap-2 bg-transparent"
                                    onClick={() => downloadDocument(constitutionDraft.documents[field]!)}
                                  >
                                    <FileCheck2 className="h-4 w-4" />
                                    Ver
                                  </Button>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-white p-5">
                    <Accordion type="multiple" defaultValue={["organization", "members", "governance"]}>
                      <AccordionItem value="organization">
                        <AccordionTrigger>Organizacion y documento</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid gap-2 text-sm text-slate-700">
                            <p>Razon social: {constitutionDraft.organization.legalName || "Pendiente"}</p>
                            <p>Representante legal: {constitutionDraft.organization.legalRepresentative || "Pendiente"}</p>
                            <p>Clasificacion: {CLASSIFICATION_OPTIONS.find((option) => option.value === constitutionDraft.documentMeta.classification)?.label || "Confidencial"}</p>
                            <p>Referencia: {constitutionDraft.documentMeta.referenceCode || "Sin referencia"}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="members">
                        <AccordionTrigger>Integrantes y sesiones</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid gap-2 text-sm text-slate-700">
                            <p>Integrantes: {constitutionDraft.members.length}</p>
                            <p>Periodicidad: {constitutionDraft.sessionRegime.meetingFrequency || "Pendiente"}</p>
                            <p>Modalidades: {constitutionDraft.sessionRegime.modalities.join(", ") || "Pendiente"}</p>
                            <p>Quorum: {constitutionDraft.sessionRegime.quorumRequired || "Pendiente"}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="governance">
                        <AccordionTrigger>Gobierno y cumplimiento</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid gap-2 text-sm text-slate-700">
                            <p>Mision: {constitutionDraft.missionDefined || "Pendiente"}</p>
                            <p>Roles documentados: {constitutionDraft.rolesDocumented || "Pendiente"}</p>
                            <p>Reporte a direccion: {constitutionDraft.reportsToManagement || "Pendiente"}</p>
                            <p>Revision periodica: {constitutionDraft.periodicReview || "Pendiente"}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button variant="outline" className="gap-2 bg-transparent" disabled={wizardStep === 0} onClick={() => setWizardStep((current) => Math.max(current - 1, 0))}>
              Anterior
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-2 bg-transparent" onClick={cancelDraft}>
                Cancelar
              </Button>
              {wizardStep < WIZARD_STEPS.length - 1 ? (
                <Button className="gap-2 bg-[#01A79E] hover:bg-[#018b84]" onClick={handleNextStep}>
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button className="gap-2 bg-[#01A79E] hover:bg-[#018b84]" onClick={handleSaveCommittee} disabled={isSaving}>
                  <Save className="h-4 w-4" />
                  {isSaving ? "Guardando..." : "Guardar comite"}
                </Button>
              )}
            </div>
          </div>
        </SectionBlock>
      </div>
    )
  }

  const renderMembers = () => {
    if (!activeCommittee) {
      return (
        <EmptyStatePanel
          icon={Users}
          title="No hay directorio para mostrar"
          description="Cuando exista un comite, aqui veras integrantes activos, suplentes y roles que aun faltan por nominalizar."
          action={
            <Button className="gap-2 bg-[#01A79E] hover:bg-[#018b84]" onClick={openNewCommittee}>
              <Plus className="h-4 w-4" />
              Crear comite
            </Button>
          }
        />
      )
    }

    const expiringMembers = activeCommittee.members.filter((member) => {
      if (!member.mandateEnd) return false
      const diff = new Date(member.mandateEnd).getTime() - Date.now()
      return diff > 0 && diff < 1000 * 60 * 60 * 24 * 45
    })

    return (
      <div className="space-y-6">
        <SectionBlock
          eyebrow="Directorio"
          title="Integrantes activos e historicos"
          description="Las fichas priorizan rol, area y vigencia. El resto queda en segundo nivel para que el usuario no tenga que leer demasiado."
          actions={
            <Button className="gap-2 bg-[#01A79E] hover:bg-[#018b84]" onClick={() => openEditCommittee(activeCommittee)}>
              <UserPlus className="h-4 w-4" />
              Editar integrantes
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            <MetricTile label="Integrantes" value={`${activeCommittee.members.length || activeCommittee.committeeMembers.length}`} sublabel="Directorio visible" icon={Users} />
            <MetricTile label="Mandatos por vencer" value={`${expiringMembers.length}`} sublabel={expiringMembers.length > 0 ? "Requieren seguimiento" : "Sin alertas proximas"} tone={expiringMembers.length > 0 ? "warning" : "positive"} icon={Clock3} />
            <MetricTile label="Roles criticos" value={`${activeCommittee.members.filter((member) => member.membershipType === "president" || member.membershipType === "secretary").length}`} sublabel="Presidencia y secretaria" icon={CheckCircle2} />
          </div>

          {activeCommittee.members.length > 0 ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {activeCommittee.members.map((member) => (
                <div key={member.id} className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--brand-soft))] text-[hsl(var(--brand-deep))]">
                        {(member.fullName || getRoleLabel(member.membershipType))
                          .split(" ")
                          .slice(0, 2)
                          .map((segment) => segment.charAt(0))
                          .join("")}
                      </div>
                      <div>
                        <h3 className="text-lg text-slate-950">{member.fullName || getRoleLabel(member.membershipType)}</h3>
                        <p className="text-sm text-slate-500">{member.position || member.area || "Sin cargo definido"}</p>
                      </div>
                    </div>
                    <span className={cn("rounded-full border px-3 py-1 text-xs", getStatusChipClass(member.status === "active" ? "positive" : member.status === "substitute" ? "warning" : "neutral"))}>
                      {member.status === "active" ? "Activo" : member.status === "substitute" ? "Suplente" : "Inactivo"}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p><strong>Rol:</strong> {getRoleLabel(member.membershipType)}</p>
                    <p><strong>Area:</strong> {member.area || "Pendiente"}</p>
                    <p><strong>Correo:</strong> {member.email || "Pendiente"}</p>
                    <p><strong>Vigencia:</strong> {member.mandateEnd ? formatDate(member.mandateEnd) : "Sin fecha de cierre"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              <div className="rounded-[24px] border border-dashed border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/40 p-5">
                <p className="text-base text-slate-950">Aun no hay fichas nominales</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  El registro legacy si detecta estos roles: {activeCommittee.committeeMembers.length > 0 ? activeCommittee.committeeMembers.join(", ") : "ninguno"}.
                </p>
              </div>
            </div>
          )}
        </SectionBlock>
      </div>
    )
  }

  const renderSessions = () => {
    if (!activeCommittee) {
      return (
        <EmptyStatePanel
          icon={Calendar}
          title="Sin comite no hay ciclo de sesiones"
          description="La vista de sesiones se activara al guardar un comite y reutiliza el regimen de convocatoria que ya definiste."
        />
      )
    }

    return (
      <div className="space-y-6">
        <SectionBlock
          eyebrow="Sesiones"
          title="Ritmo operativo del comite"
          description="La pagina muestra primero el regimen de sesiones y, debajo, el espacio para convocatorias y actas cuando el flujo crezca."
          actions={
            <Button variant="outline" className="gap-2 bg-transparent" onClick={() => openEditCommittee(activeCommittee)}>
              <Calendar className="h-4 w-4" />
              Ajustar regimen
            </Button>
          }
        >
          <div className="grid gap-4 lg:grid-cols-[0.95fr,1.05fr]">
            <div className="space-y-4">
              <div className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/35 p-5">
                <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Regimen</p>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p><strong>Periodicidad:</strong> {activeCommittee.sessionRegime.meetingFrequency || "Pendiente"}</p>
                  <p><strong>Convocatoria:</strong> {activeCommittee.sessionRegime.noticeDays || "0"} dias antes</p>
                  <p><strong>Agenda:</strong> {activeCommittee.sessionRegime.agendaLeadDays || "0"} dias antes</p>
                  <p><strong>Modalidades:</strong> {activeCommittee.sessionRegime.modalities.map((value) => MODALITY_OPTIONS.find((option) => option.value === value)?.label || value).join(", ")}</p>
                </div>
              </div>
              <div className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-white p-5">
                <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Quorum</p>
                <p className="mt-3 text-2xl text-slate-950">{activeCommittee.sessionRegime.quorumRequired || "50%"}</p>
                <p className="mt-2 text-sm text-slate-600">Parametro base listo para enlazarse a futuras convocatorias y check-in.</p>
              </div>
            </div>

            <div className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Historial</p>
                  <h3 className="mt-2 text-xl text-slate-950">Sesiones registradas</h3>
                </div>
                <Badge className="bg-[hsl(var(--brand-soft))] text-[hsl(var(--brand-deep))]" variant="secondary">
                  {activeCommittee.sessions.length}
                </Badge>
              </div>

              {activeCommittee.sessions.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {sortedSessions.map((session) => (
                    <div key={session.id} className="rounded-[20px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/35 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-base text-slate-950">{session.title || "Sesion sin titulo"}</p>
                          <p className="mt-1 text-sm text-slate-600">{formatDate(session.date)} · {session.modality || "Sin modalidad"} · {session.time || "Sin hora"}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className={cn("rounded-full border px-3 py-1 text-xs", getStatusChipClass(session.status === "held" ? "positive" : session.status === "cancelled" ? "critical" : "warning"))}>
                            {session.status === "held" ? "Celebrada" : session.status === "cancelled" ? "Cancelada" : session.status === "convened" ? "Convocada" : "Borrador"}
                          </span>
                          {session.minutesSigned ? (
                            <span className={cn("rounded-full border px-3 py-1 text-xs", getStatusChipClass("positive"))}>Acta firmada</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5">
                  <EmptyStatePanel
                    icon={FolderKanban}
                    title="El ciclo de sesiones esta listo, pero vacio"
                    description="La interfaz ya soporta la vista de proximas sesiones e historial. Aun no persistimos sesiones nuevas en esta fase."
                  />
                </div>
              )}
            </div>
          </div>
        </SectionBlock>
      </div>
    )
  }

  const renderOversight = () => {
    if (!activeCommittee) {
      return (
        <EmptyStatePanel
          icon={ListChecks}
          title="No hay seguimiento sin un comite activo"
          description="Cuando exista un comite, esta vista mostrara acuerdos, alertas y sistemas IA vinculados."
        />
      )
    }

    const filteredSystems = committeeSystems.filter((system) => {
      const review = getCommitteeReviewLabel(system.committeeReviewStatus)
      const risk = getRiskTone(system)
      const matchesStatus = oversightStatusFilter === "all" || review.label.toLowerCase().includes(oversightStatusFilter)
      const matchesRisk =
        oversightRiskFilter === "all" ||
        (oversightRiskFilter === "high" && (risk.label === "Alto riesgo" || risk.label === "Prohibido")) ||
        (oversightRiskFilter === "medium" && risk.label === "Riesgo medio") ||
        (oversightRiskFilter === "low" && risk.label === "Riesgo bajo")
      return matchesStatus && matchesRisk
    })

    const agreementColumns = [
      { id: "pending", title: "Pendiente", count: agreementStats.pending },
      { id: "in_progress", title: "En proceso", count: agreementStats.inProgress },
      { id: "overdue", title: "Con retraso", count: agreementStats.overdue },
      { id: "completed", title: "Completado", count: agreementStats.completed },
    ] as const

    return (
      <div className="space-y-6">
        <SectionBlock
          eyebrow="Seguimiento"
          title="Acuerdos, alertas y sistemas IA"
          description="El kanban degrada a listas en pantallas chicas y la tabla de sistemas se convierte en tarjetas para evitar overflow horizontal."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricTile label="Acuerdos totales" value={`${agreementStats.total}`} sublabel={agreementStats.total > 0 ? `${agreementStats.completed} cerrados` : "Sin acuerdos registrados"} icon={Workflow} />
            <MetricTile label="Con retraso" value={`${agreementStats.overdue}`} sublabel={agreementStats.overdue > 0 ? "Requieren escalamiento" : "Sin alertas de vencimiento"} tone={agreementStats.overdue > 0 ? "critical" : "positive"} icon={AlertTriangle} />
            <MetricTile label="Sistemas vinculados" value={`${committeeSystems.length}`} sublabel="Datos del inventario de IA" icon={Radio} />
            <MetricTile label="Revision del comite" value={`${systemsNeedingReview.length}`} sublabel={systemsNeedingReview.length > 0 ? "Hay sistemas que requieren atencion" : "Sin pendientes"} tone={systemsNeedingReview.length > 0 ? "warning" : "positive"} icon={ShieldAlert} />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            {agreementColumns.map((column) => {
              const items = (activeCommittee.agreements || []).filter((agreement) => agreement.status === column.id)
              return (
                <div key={column.id} className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/35 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm uppercase tracking-[0.14em] text-slate-500">{column.title}</p>
                    <Badge variant="secondary" className="bg-white text-slate-700">
                      {column.count}
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-3">
                    {items.length > 0 ? (
                      items.map((agreement) => (
                        <div key={agreement.id} className="rounded-[18px] border border-[hsl(var(--brand-border))] bg-white p-4">
                          <p className="text-sm text-slate-950">{agreement.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{agreement.dueDate ? formatDate(agreement.dueDate) : "Sin vencimiento"}</p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[18px] border border-dashed border-[hsl(var(--brand-border))] bg-white/70 p-4 text-sm text-slate-500">
                        Sin elementos en esta columna.
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 rounded-[28px] border border-[hsl(var(--brand-border))] bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Sistemas IA</p>
                <h3 className="mt-2 text-xl text-slate-950">Vista operativa conectada al inventario</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={oversightStatusFilter} onValueChange={setOversightStatusFilter}>
                  <SelectTrigger className="min-w-[180px] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="revisado">Revisados</SelectItem>
                    <SelectItem value="pendiente">Pendientes</SelectItem>
                    <SelectItem value="sin comite">Sin comite</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={oversightRiskFilter} onValueChange={setOversightRiskFilter}>
                  <SelectTrigger className="min-w-[160px] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todo riesgo</SelectItem>
                    <SelectItem value="high">Alto / Prohibido</SelectItem>
                    <SelectItem value="medium">Medio</SelectItem>
                    <SelectItem value="low">Bajo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredSystems.length > 0 ? (
              <div className="mt-5 grid gap-4">
                {filteredSystems.map((system) => {
                  const review = getCommitteeReviewLabel(system.committeeReviewStatus)
                  const risk = getRiskTone(system)
                  return (
                    <div
                      key={system.id}
                      className="rounded-[22px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/35 p-4"
                    >
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                          <p className="text-base text-slate-950">{system.systemName || "Sistema sin nombre"}</p>
                          <p className="mt-1 text-sm text-slate-600">
                            {system.responsibleArea || "Area pendiente"} · {system.committeeReportingDuty || "Sin cadencia de reporte"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className={cn("rounded-full border px-3 py-1 text-xs", getStatusChipClass(risk.tone))}>{risk.label}</span>
                          <span className={cn("rounded-full border px-3 py-1 text-xs", getStatusChipClass(review.tone))}>{review.label}</span>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-3">
                        <p><strong>Revision:</strong> {formatDate(system.nextReviewDate)}</p>
                        <p><strong>DPIA:</strong> {system.dpiaEvaluation || "No informado"}</p>
                        <p><strong>Proveedor:</strong> {system.providerContractStatus || "No informado"}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="mt-5">
                <EmptyStatePanel
                  icon={Radio}
                  title="No hay sistemas para este filtro"
                  description="La integracion con el inventario ya esta activa; si no ves tarjetas, ajusta filtros o revisa el modulo Registro de Sistemas de IA."
                />
              </div>
            )}
          </div>
        </SectionBlock>
      </div>
    )
  }

  const renderReports = () => {
    if (!activeCommittee) {
      return (
        <EmptyStatePanel
          icon={FileText}
          title="Sin comite no hay reportes base"
          description="Las plantillas se activan al guardar al menos una constitucion."
        />
      )
    }

    return (
      <div className="space-y-6">
        <SectionBlock
          eyebrow="Informes"
          title="Motor de reportes preparado"
          description="En esta fase mostramos plantillas claras, usos y salida esperada. La exportacion PDF inmediata se resuelve con el resumen del comite."
          actions={
            <Button className="gap-2 bg-[#01A79E] hover:bg-[#018b84]" onClick={() => generateCommitteePdf(activeCommittee)}>
              <Download className="h-4 w-4" />
              Exportar resumen
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {REPORT_TEMPLATES.map((report) => (
              <div key={report.id} className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base text-slate-950">{report.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{report.summary}</p>
                  </div>
                  <span className={cn("rounded-full border px-3 py-1 text-xs", getStatusChipClass("info"))}>{report.frequency}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))]/35 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Historial</p>
                <h3 className="mt-2 text-xl text-slate-950">Reportes generados</h3>
              </div>
              <Badge variant="secondary" className="bg-white text-slate-700">
                {activeCommittee.reports.length}
              </Badge>
            </div>
            {activeCommittee.reports.length > 0 ? (
              <div className="mt-5 grid gap-3">
                {activeCommittee.reports.map((report) => (
                  <div key={report.id} className="rounded-[20px] border border-[hsl(var(--brand-border))] bg-white p-4">
                    <p className="text-base text-slate-950">{report.type}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {report.frequency} · {formatDate(report.generatedAt)} · {report.format.toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-600">
                Aun no hay ejecuciones almacenadas. La vista queda lista para integrarse con reportes PDF/XLSX en la siguiente fase.
              </p>
            )}
          </div>
        </SectionBlock>
      </div>
    )
  }

  const renderRepository = () => {
    if (!activeCommittee) {
      return (
        <EmptyStatePanel
          icon={Archive}
          title="Sin comite no hay repositorio"
          description="La vista indexara automaticamente los documentos que cargues desde el wizard."
        />
      )
    }

    const filteredRepository = activeCommitteeRepository.filter((document) => {
      const haystack = `${document.name} ${document.type}`.toLowerCase()
      return haystack.includes(repositoryQuery.toLowerCase())
    })

    return (
      <div className="space-y-6">
        <SectionBlock
          eyebrow="Repositorio"
          title="Documentos del comite"
          description="La lista prioriza nombre, tipo, clasificacion y descarga. Evitamos tablas densas para mantener buena lectura en movil."
          actions={
            <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setActiveView("constitution")}>
              <FileCheck2 className="h-4 w-4" />
              Cargar desde wizard
            </Button>
          }
        >
          <div className="flex flex-wrap gap-3">
            <Input
              value={repositoryQuery}
              onChange={(event) => setRepositoryQuery(event.target.value)}
              placeholder="Buscar por nombre o tipo"
              className="max-w-sm bg-white"
            />
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs text-slate-600">
              {filteredRepository.length} documentos visibles
            </Badge>
          </div>

          {filteredRepository.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {filteredRepository.map((document) => (
                <div key={document.id} className="rounded-[24px] border border-[hsl(var(--brand-border))] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-base text-slate-950">{document.name}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {document.type} · {document.version || "v1.0"} · {formatDate(document.uploadedAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={cn("rounded-full border px-3 py-1 text-xs", getStatusChipClass(document.classification === "confidential" ? "warning" : document.classification === "public" ? "info" : "neutral"))}>
                        {document.classification === "confidential" ? "Confidencial" : document.classification === "public" ? "Publico" : "Interno"}
                      </span>
                      {document.data ? (
                        <Button variant="outline" className="gap-2 bg-transparent" onClick={() => downloadDocument({ name: document.name, data: document.data! })}>
                          <Download className="h-4 w-4" />
                          Descargar
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyStatePanel
                icon={Archive}
                title={activeCommitteeRepository.length > 0 ? "No hay coincidencias" : "Repositorio vacio"}
                description={
                  activeCommitteeRepository.length > 0
                    ? "Ajusta la busqueda para volver a ver los documentos indexados."
                    : "Carga el acta formal, la mision y los soportes del comite desde el paso de revision."
                }
              />
            </div>
          )}
        </SectionBlock>
      </div>
    )
  }

  const renderActiveView = () => {
    if (activeView === "dashboard") return renderDashboard()
    if (activeView === "constitution") return constitutionDraft ? renderConstitutionWizard() : renderConstitutionSummary()
    if (activeView === "members") return renderMembers()
    if (activeView === "sessions") return renderSessions()
    if (activeView === "oversight") return renderOversight()
    if (activeView === "reports") return renderReports()
    return renderRepository()
  }

  return (
    <GeneralTabShell
      moduleLabel="Gobernanza IA"
      moduleTitle="Comite de Gobernanza de IA"
      moduleDescription="Modulo operativo para constitucion, seguimiento y documentacion del organo colegiado responsable de supervisar IA."
      pageLabel={pageMeta[activeView].label}
      pageTitle={pageMeta[activeView].title}
      pageDescription={pageMeta[activeView].description}
      navItems={navItems}
      activeNavId={activeView}
      onNavSelect={(itemId) => setActiveView(itemId as CommitteeViewId)}
      headerBadges={headerBadges}
      actions={shellActions}
      backHref="/"
      backLabel="Volver al inicio"
      contentClassName="space-y-6"
    >
      {renderActiveView()}
    </GeneralTabShell>
  )
}
