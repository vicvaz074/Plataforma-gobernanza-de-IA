"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GeneralTabShell, type GeneralTabShellBadge, type GeneralTabShellNavItem } from "@/components/general-tab-shell"
import HighRiskIncidentReportForm from "@/components/high-risk-incident-report-form"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
import { useToast } from "@/hooks/use-toast"
import {
  HighRiskIncidentReport,
  createEmptyHighRiskIncidentReport,
  validateHighRiskIncidentReport,
} from "@/lib/high-risk-incident"
import { ClipboardList, Download, Edit, Eye, PlusCircle, Trash2 } from "lucide-react"

interface StoredIncidentReport {
  id: string
  createdAt: string
  updatedAt: string
  report: HighRiskIncidentReport
}

const STORAGE_KEY = "highRiskIncidentReports"

const labels = {
  es: {
    title: "Reportes de incidentes de alto riesgo",
    description:
      "Gestiona los reportes oficiales para incidentes asociados a sistemas de IA clasificados como de alto riesgo.",
    registerAction: "Registrar incidente",
    viewAction: "Ver reportes",
    registerDescription: "Completa el formulario oficial para generar un nuevo reporte de incidente.",
    viewDescription: "Consulta y gestiona los reportes guardados en la plataforma.",
    saveReport: "Guardar reporte",
    updateReport: "Actualizar reporte",
    cancelEdit: "Cancelar edición",
    reportSavedDescription: "El reporte se ha guardado correctamente.",
    reportUpdatedDescription: "Los cambios en el reporte se han guardado correctamente.",
    reportDeletedDescription: "El reporte se ha eliminado del registro.",
    deleteConfirmation: "¿Seguro que deseas eliminar este reporte? Esta acción no se puede deshacer.",
    noReports: "No hay reportes registrados todavía.",
    newReport: "Nuevo reporte",
    totalReports: "Total de reportes",
    downloadAll: "Descargar registros",
    downloadReport: "Descargar reporte",
    viewDetails: "Ver detalles",
    editReport: "Editar",
    deleteReport: "Eliminar",
    notProvided: "No proporcionado",
    reportDetailsTitle: "Detalle del reporte",
    administrativeSection: "Datos administrativos",
    responsibleSection: "Organización responsable",
    systemSection: "Sistema de IA",
    incidentSection: "Incidente reportado",
    responseSection: "Respuesta y mitigación",
    complianceSection: "Cumplimiento",
    declarationSection: "Declaración",
    tableHeaders: {
      folio: "Folio",
      system: "Sistema",
      status: "Estado",
      createdAt: "Creado",
      updatedAt: "Actualizado",
      actions: "Acciones",
    },
    fields: {
      folioNumber: "Folio",
      expediente: "Expediente",
      authority: "Autoridad receptora",
      state: "Entidad federativa",
      reportDate: "Fecha del reporte",
      incidentStart: "Inicio del incidente",
      incidentEnd: "Fin del incidente",
      detectionDate: "Detección",
      notificationDate: "Notificación interna",
      followUpDate: "Siguiente reporte",
      severity: "Clasificación de gravedad",
      responsibleType: "Tipo de responsable",
      company: "Razón social",
      sector: "Sector económico",
      businessLine: "Giro empresarial",
      responsibleName: "Responsable técnico",
      responsiblePosition: "Cargo del responsable",
      responsibleEmail: "Correo principal",
      responsibleSecondaryEmail: "Correo secundario",
      responsiblePhone: "Teléfono",
      address: "Dirección",
      systemName: "Nombre del sistema",
      systemVersion: "Versión",
      systemType: "Tipo de IA",
      systemPurpose: "Propósito",
      systemSector: "Sector de aplicación",
      trainingData: "Datos de entrenamiento",
      estimatedUsers: "Usuarios estimados",
      usageFrequency: "Frecuencia de uso",
      automationLevel: "Nivel de automatización",
      incidentDescription: "Descripción del incidente",
      detectedFailure: "Falla detectada",
      usageContext: "Contexto de uso",
      specialConditions: "Condiciones especiales",
      affectedPeople: "Personas afectadas",
      affectedTypes: "Tipos de personas afectadas",
      economicImpact: "Impacto económico",
      compromisedRecords: "Registros comprometidos",
      interruptedServices: "Servicios interrumpidos",
      probableCause: "Causa probable",
      rootCause: "Análisis de causa raíz",
      contributingFactors: "Factores contribuyentes",
      immediateActions: "Medidas inmediatas",
      shortTermActions: "Medidas a corto plazo",
      longTermActions: "Medidas a largo plazo",
      systemSuspended: "Sistema suspendido",
      plannedImprovements: "Mejoras planificadas",
      reviewPerformed: "Evaluación revisada",
      evaluationAdequate: "Evaluación adecuada",
      newRisks: "Nuevos riesgos identificados",
      recurrenceProbability: "Probabilidad de recurrencia",
      applicableLaws: "Leyes aplicables",
      otherReports: "Otros reportes",
      notifiedAuthorities: "Autoridades notificadas",
      declarantName: "Nombre del declarante",
      declarantRole: "Cargo del declarante",
      digitalSignature: "Firma digital",
      declarationDate: "Fecha de declaración",
      followUpCommitment: "Compromiso de seguimiento",
      followUpFrequency: "Frecuencia de seguimiento",
      followUpContact: "Contacto de seguimiento",
      reportStatus: "Estado del reporte",
      generationDate: "Fecha de generación",
      hash: "Hash de integridad",
    },
  },
  en: {
    title: "High-risk incident reports",
    description: "Manage official reports for incidents linked to AI systems classified as high risk.",
    registerAction: "Register incident",
    viewAction: "View reports",
    registerDescription: "Complete the official form to create a new incident report.",
    viewDescription: "Review and manage the reports stored in the platform.",
    saveReport: "Save report",
    updateReport: "Update report",
    cancelEdit: "Cancel editing",
    reportSavedDescription: "The incident report has been saved successfully.",
    reportUpdatedDescription: "The incident report has been updated successfully.",
    reportDeletedDescription: "The incident report has been removed from the registry.",
    deleteConfirmation: "Are you sure you want to delete this report? This action cannot be undone.",
    noReports: "There are no reports registered yet.",
    newReport: "New report",
    totalReports: "Total reports",
    downloadAll: "Download records",
    downloadReport: "Download report",
    viewDetails: "View details",
    editReport: "Edit",
    deleteReport: "Delete",
    notProvided: "Not provided",
    reportDetailsTitle: "Report details",
    administrativeSection: "Administrative data",
    responsibleSection: "Responsible organization",
    systemSection: "AI system",
    incidentSection: "Reported incident",
    responseSection: "Response and mitigation",
    complianceSection: "Compliance",
    declarationSection: "Declaration",
    tableHeaders: {
      folio: "Folio",
      system: "System",
      status: "Status",
      createdAt: "Created",
      updatedAt: "Updated",
      actions: "Actions",
    },
    fields: {
      folioNumber: "Folio",
      expediente: "Case number",
      authority: "Receiving authority",
      state: "State",
      reportDate: "Report date",
      incidentStart: "Incident start",
      incidentEnd: "Incident end",
      detectionDate: "Detection",
      notificationDate: "Internal notification",
      followUpDate: "Next report",
      severity: "Severity classification",
      responsibleType: "Type of responsible entity",
      company: "Legal entity",
      sector: "Economic sector",
      businessLine: "Business line",
      responsibleName: "Technical contact",
      responsiblePosition: "Contact position",
      responsibleEmail: "Primary email",
      responsibleSecondaryEmail: "Secondary email",
      responsiblePhone: "Phone",
      address: "Address",
      systemName: "System name",
      systemVersion: "Version",
      systemType: "AI type",
      systemPurpose: "Purpose",
      systemSector: "Application sector",
      trainingData: "Training data",
      estimatedUsers: "Estimated users",
      usageFrequency: "Usage frequency",
      automationLevel: "Automation level",
      incidentDescription: "Incident description",
      detectedFailure: "Detected failure",
      usageContext: "Usage context",
      specialConditions: "Special conditions",
      affectedPeople: "People affected",
      affectedTypes: "Types of people affected",
      economicImpact: "Economic impact",
      compromisedRecords: "Compromised records",
      interruptedServices: "Interrupted services",
      probableCause: "Probable cause",
      rootCause: "Root cause analysis",
      contributingFactors: "Contributing factors",
      immediateActions: "Immediate actions",
      shortTermActions: "Short-term actions",
      longTermActions: "Long-term actions",
      systemSuspended: "System suspended",
      plannedImprovements: "Planned improvements",
      reviewPerformed: "Risk review performed",
      evaluationAdequate: "Assessment still adequate",
      newRisks: "New risks identified",
      recurrenceProbability: "Recurrence probability",
      applicableLaws: "Applicable laws",
      otherReports: "Other reports",
      notifiedAuthorities: "Authorities notified",
      declarantName: "Declarant name",
      declarantRole: "Declarant role",
      digitalSignature: "Digital signature",
      declarationDate: "Declaration date",
      followUpCommitment: "Follow-up commitment",
      followUpFrequency: "Follow-up frequency",
      followUpContact: "Follow-up contact",
      reportStatus: "Report status",
      generationDate: "Generation date",
      hash: "Integrity hash",
    },
  },
}

type LabelKey = keyof typeof labels

type ViewMode = "register" | "view"

type FieldKey = keyof (typeof labels)["es"]["fields"]

const statusStyles: Record<string, string> = {
  Borrador: "bg-gray-200 text-gray-800 dark:bg-gray-500/20 dark:text-gray-200",
  Enviado: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200",
  "En Revisión": "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
  Cerrado: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
}

const formatDate = (value?: string) => {
  if (!value) return ""
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

const formatValue = (value: string | number | null | undefined | string[], fallback: string) => {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : fallback
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value.toString() : fallback
  }
  if (value === null || value === undefined || value === "") {
    return fallback
  }
  return value
}

export default function HighRiskIncidentReportsPage() {
  const { language } = useLanguage()
  const locale = (language as LabelKey) in labels ? (language as LabelKey) : "es"
  const t = labels[locale]
  const common = translations[language]
  const { toast } = useToast()

  const [activeView, setActiveView] = useState<ViewMode>("register")
  const [reports, setReports] = useState<StoredIncidentReport[]>([])
  const [currentReport, setCurrentReport] = useState<HighRiskIncidentReport>(createEmptyHighRiskIncidentReport())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<StoredIncidentReport | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    try {
      const parsed: StoredIncidentReport[] = JSON.parse(stored)
      setReports(parsed)
    } catch (error) {
      console.error("Error parsing stored high risk incident reports", error)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
  }, [reports])

  const handleReportChange = (report: HighRiskIncidentReport) => {
    setCurrentReport(report)
  }

  const resetForm = () => {
    setCurrentReport(createEmptyHighRiskIncidentReport())
    setEditingId(null)
  }

  const handleSave = () => {
    const errors = validateHighRiskIncidentReport(currentReport)
    if (errors.length > 0) {
      toast({
        title: common.validationError,
        description: errors.slice(0, 5).join(" · "),
        variant: "destructive",
      })
      return
    }

    const timestamp = new Date().toISOString()
    const reportToStore = JSON.parse(JSON.stringify(currentReport)) as HighRiskIncidentReport
    reportToStore.metadata = {
      ...reportToStore.metadata,
      fechaGeneracion: reportToStore.metadata.fechaGeneracion || timestamp,
    }

    if (editingId) {
      setReports((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                report: reportToStore,
                updatedAt: timestamp,
              }
            : item,
        ),
      )
      toast({
        title: common.success,
        description: t.reportUpdatedDescription,
      })
    } else {
      const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `report-${Date.now()}`
      const newReport: StoredIncidentReport = {
        id,
        createdAt: timestamp,
        updatedAt: timestamp,
        report: reportToStore,
      }
      setReports((prev) => [...prev, newReport])
      toast({
        title: common.success,
        description: t.reportSavedDescription,
      })
    }

    resetForm()
    setActiveView("view")
  }

  const handleEdit = (report: StoredIncidentReport) => {
    const cloned = JSON.parse(JSON.stringify(report.report)) as HighRiskIncidentReport
    setCurrentReport(cloned)
    setEditingId(report.id)
    setActiveView("register")
  }

  const handleDelete = (id: string) => {
    if (typeof window !== "undefined" && !window.confirm(t.deleteConfirmation)) {
      return
    }
    setReports((prev) => prev.filter((report) => report.id !== id))
    toast({
      title: common.success,
      description: t.reportDeletedDescription,
    })
  }

  const handleDownloadReport = (report: StoredIncidentReport) => {
    const data = JSON.stringify(report, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    const folio = report.report.metadata.folioNumber || report.id
    link.download = `reporte-alto-riesgo-${folio}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadAllReports = () => {
    if (reports.length === 0) return
    const data = JSON.stringify(reports, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "reportes-incidentes-alto-riesgo.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const openDetails = (report: StoredIncidentReport) => {
    setSelectedReport(report)
  }

  const closeDetails = (open: boolean) => {
    if (!open) {
      setSelectedReport(null)
    }
  }

  const renderSection = (title: string, entries: { key: FieldKey; value: string | number | null | undefined | string[] }[]) => (
    <section key={title} className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <div key={entry.key} className="space-y-1">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t.fields[entry.key]}
            </dt>
            <dd className="text-sm text-foreground">
              {formatValue(entry.value, t.notProvided)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )

  const navItems: GeneralTabShellNavItem[] = [
    { id: "register", label: t.registerAction, mobileLabel: t.registerAction, icon: PlusCircle },
    { id: "view", label: t.viewAction, mobileLabel: t.viewAction, icon: ClipboardList, badge: reports.length || undefined },
  ]

  const headerBadges: GeneralTabShellBadge[] = [{ label: `${reports.length} ${t.totalReports.toLowerCase()}`, tone: "primary" }]

  if (editingId) {
    headerBadges.push({ label: "Edición activa", tone: "warning" })
  }

  return (
    <GeneralTabShell
      moduleLabel="Gobernanza IA"
      moduleTitle={t.title}
      moduleDescription={t.description}
      pageLabel={activeView === "register" ? t.registerAction : t.viewAction}
      pageTitle={activeView === "register" ? t.registerAction : t.viewAction}
      pageDescription={activeView === "register" ? t.registerDescription : t.viewDescription}
      navItems={navItems}
      activeNavId={activeView}
      onNavSelect={(itemId) => setActiveView(itemId as ViewMode)}
      headerBadges={headerBadges}
      backHref="/"
      backLabel="Volver al inicio"
    >
      {activeView === "register" ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.title}</CardTitle>
              <CardDescription>{t.registerDescription}</CardDescription>
            </CardHeader>
          </Card>

          <HighRiskIncidentReportForm report={currentReport} onChange={handleReportChange} />

          <div className="flex justify-end gap-3">
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                {t.cancelEdit}
              </Button>
            )}
            <Button className="bg-[#01A79E] text-white hover:bg-[#018b84]" onClick={handleSave}>
              {editingId ? t.updateReport : t.saveReport}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.viewAction}</CardTitle>
              <CardDescription>{t.viewDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t.totalReports}</p>
                  <p className="text-2xl font-semibold">{reports.length}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={downloadAllReports} disabled={reports.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    {t.downloadAll}
                  </Button>
                  <Button
                    onClick={() => {
                      resetForm()
                      setActiveView("register")
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t.newReport}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              {reports.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">{t.noReports}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t.tableHeaders.folio}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t.tableHeaders.system}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t.tableHeaders.status}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t.tableHeaders.createdAt}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t.tableHeaders.updatedAt}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t.tableHeaders.actions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950">
                      {reports.map((report) => {
                        const status = report.report.metadata.estadoReporte
                        const statusClass = statusStyles[status] || "bg-gray-200 text-gray-800 dark:bg-gray-500/20 dark:text-gray-200"
                        return (
                          <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                              {report.report.metadata.folioNumber || report.id}
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                              {formatValue(report.report.system.nombreSistema, t.notProvided)}
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={statusClass}>{status}</Badge>
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                              {formatDate(report.createdAt) || t.notProvided}
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                              {formatDate(report.updatedAt) || t.notProvided}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => openDetails(report)}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">{t.viewDetails}</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(report)}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">{t.editReport}</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDownloadReport(report)}>
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">{t.downloadReport}</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(report.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">{t.deleteReport}</span>
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
      )}

      <Dialog open={!!selectedReport} onOpenChange={closeDetails}>
        {selectedReport && (
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {t.reportDetailsTitle} · {selectedReport.report.metadata.folioNumber || selectedReport.id}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 text-sm">
              {renderSection(t.administrativeSection, [
                { key: "folioNumber", value: selectedReport.report.metadata.folioNumber },
                { key: "expediente", value: selectedReport.report.administrative.numeroExpediente },
                { key: "authority", value: selectedReport.report.administrative.autoridadReceptora },
                { key: "state", value: selectedReport.report.administrative.entidadFederativa },
                { key: "reportDate", value: formatDate(selectedReport.report.administrative.fechaReporte) },
                { key: "incidentStart", value: formatDate(selectedReport.report.administrative.fechaIncidenteInicio) },
                { key: "incidentEnd", value: formatDate(selectedReport.report.administrative.fechaIncidenteFin) },
                { key: "detectionDate", value: formatDate(selectedReport.report.administrative.fechaDeteccion) },
                { key: "notificationDate", value: formatDate(selectedReport.report.administrative.fechaNotificacionInterna) },
                { key: "followUpDate", value: formatDate(selectedReport.report.administrative.fechaSeguimiento) },
                { key: "severity", value: selectedReport.report.administrative.clasificacionGravedad },
                { key: "reportStatus", value: selectedReport.report.metadata.estadoReporte },
                { key: "generationDate", value: formatDate(selectedReport.report.metadata.fechaGeneracion) },
                { key: "hash", value: selectedReport.report.metadata.hashIntegridad },
              ])}

              {renderSection(t.responsibleSection, [
                { key: "responsibleType", value: selectedReport.report.responsible.tipoResponsable },
                { key: "company", value: selectedReport.report.responsible.razonSocial },
                { key: "sector", value: selectedReport.report.responsible.sectorEconomico },
                { key: "businessLine", value: selectedReport.report.responsible.giroEmpresarial },
                { key: "responsibleName", value: selectedReport.report.responsible.responsableNombre },
                { key: "responsiblePosition", value: selectedReport.report.responsible.responsableCargo },
                { key: "responsibleEmail", value: selectedReport.report.responsible.emailPrincipal },
                { key: "responsibleSecondaryEmail", value: selectedReport.report.responsible.emailSecundario },
                { key: "responsiblePhone", value: selectedReport.report.responsible.telefono },
                { key: "address", value: selectedReport.report.responsible.direccionCompleta },
              ])}

              {renderSection(t.systemSection, [
                { key: "systemName", value: selectedReport.report.system.nombreSistema },
                { key: "systemVersion", value: selectedReport.report.system.versionSistema },
                { key: "systemType", value: selectedReport.report.system.tipoIA },
                { key: "systemPurpose", value: selectedReport.report.system.propositoPrincipal },
                { key: "systemSector", value: selectedReport.report.system.sectorAplicacion },
                { key: "trainingData", value: selectedReport.report.system.datosEntrenamiento },
                { key: "estimatedUsers", value: selectedReport.report.system.usuariosEstimados },
                { key: "usageFrequency", value: selectedReport.report.system.frecuenciaUso },
                { key: "automationLevel", value: selectedReport.report.system.nivelAutomatizacion },
              ])}

              {renderSection(t.incidentSection, [
                { key: "incidentDescription", value: selectedReport.report.incident.descripcionIncidente },
                { key: "detectedFailure", value: selectedReport.report.incident.fallaDetectada },
                { key: "usageContext", value: selectedReport.report.incident.contextoUso },
                { key: "specialConditions", value: selectedReport.report.incident.condicionesEspeciales },
                { key: "affectedPeople", value: selectedReport.report.incident.personasAfectadas },
                { key: "affectedTypes", value: selectedReport.report.incident.tipoPersonasAfectadas },
                { key: "economicImpact", value: selectedReport.report.incident.impactoEconomico },
                { key: "compromisedRecords", value: selectedReport.report.incident.datosComprometidos },
                { key: "interruptedServices", value: selectedReport.report.incident.serviciosInterrumpidos },
              ])}

              {renderSection(t.responseSection, [
                { key: "probableCause", value: selectedReport.report.response.causaProbable },
                { key: "rootCause", value: selectedReport.report.response.analisisCausaRaiz },
                { key: "contributingFactors", value: selectedReport.report.response.factoresContribuyentes },
                { key: "immediateActions", value: selectedReport.report.response.medidasInmediatas },
                { key: "shortTermActions", value: selectedReport.report.response.medidasCortoPlazo },
                { key: "longTermActions", value: selectedReport.report.response.medidasLargoPlazo },
                { key: "systemSuspended", value: selectedReport.report.response.sistemaSuspendido },
                { key: "plannedImprovements", value: selectedReport.report.response.mejorasPlanificadas },
              ])}

              {renderSection(t.complianceSection, [
                { key: "reviewPerformed", value: selectedReport.report.compliance.evaluacionRevisada },
                { key: "evaluationAdequate", value: selectedReport.report.compliance.evaluacionAdecuada },
                { key: "newRisks", value: selectedReport.report.compliance.nuevosRiesgosIdentificados },
                { key: "recurrenceProbability", value: selectedReport.report.compliance.probabilidadRecurrencia },
                { key: "applicableLaws", value: selectedReport.report.compliance.leyesAplicables },
                { key: "otherReports", value: selectedReport.report.compliance.otrosReportes },
                { key: "notifiedAuthorities", value: selectedReport.report.compliance.autoridadesNotificadas },
              ])}

              {renderSection(t.declarationSection, [
                { key: "declarantName", value: selectedReport.report.declaration.nombreDeclarante },
                { key: "declarantRole", value: selectedReport.report.declaration.cargoDeclarante },
                { key: "digitalSignature", value: selectedReport.report.declaration.firmaDigitalNombre || selectedReport.report.declaration.firmaDigital },
                { key: "declarationDate", value: formatDate(selectedReport.report.declaration.fechaDeclaracion) },
                { key: "followUpCommitment", value: selectedReport.report.declaration.compromisoSeguimiento },
                { key: "followUpFrequency", value: selectedReport.report.declaration.frecuenciaSeguimiento },
                { key: "followUpContact", value: selectedReport.report.declaration.contactoSeguimiento },
              ])}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleDownloadReport(selectedReport)}>
                  <Download className="mr-2 h-4 w-4" />
                  {t.downloadReport}
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </GeneralTabShell>
  )
}
