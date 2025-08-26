"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Download,
  Calendar,
  Users,
  AlertCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import {
  type AuditReminder,
  type AuditPriority,
  type AuditStatus,
  getAuditReminders,
  getUpcomingAuditReminders,
  getOverdueAuditReminders,
  addAuditReminder,
  deleteAuditReminder,
  completeAuditReminder,
  getPriorityColor,
  getStatusColor,
  formatDate,
  getDaysRemaining,
} from "@/lib/audit-alarms"
import jsPDF from "jspdf"

interface ModuleStatus {
  name: string
  route: string
  completionRate: number
  lastUpdated: string
  status: "complete" | "partial" | "pending"
  criticalIssues: number
  totalRecords: number
  incompleteRecords: number
}

export default function AuditoriaPage() {
  const { language } = useLanguage()
  const t = translations[language]
  const { toast } = useToast()

  const [reminders, setReminders] = useState<AuditReminder[]>([])
  const [filteredReminders, setFilteredReminders] = useState<AuditReminder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<AuditStatus | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<AuditPriority | "all">("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<AuditReminder | null>(null)
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "media" as AuditPriority,
    assignedTo: "",
    category: "",
    notes: "",
  })

  const [moduleStatuses, setModuleStatuses] = useState<ModuleStatus[]>([])

  const loadRealModuleData = () => {
    const modules: ModuleStatus[] = []

    // AI Systems Registry
    const aiSystems = JSON.parse(localStorage.getItem("aiSystemsRegistry") || "[]")
    const aiSystemsTotal = aiSystems.length
    const aiSystemsIncomplete = aiSystems.filter(
      (system: any) => !system.systemName || !system.riskLevel || !system.mainPurpose,
    ).length
    const aiSystemsCompletion =
      aiSystemsTotal > 0 ? Math.round(((aiSystemsTotal - aiSystemsIncomplete) / aiSystemsTotal) * 100) : 0

    modules.push({
      name: t.aiSystemRegistry || "Registro de Sistemas IA",
      route: "/registro-sistemas-ia",
      completionRate: aiSystemsCompletion,
      lastUpdated:
        aiSystemsTotal > 0
          ? new Date(Math.max(...aiSystems.map((s: any) => new Date(s.createdAt || Date.now()).getTime())))
              .toISOString()
              .split("T")[0]
          : "N/A",
      status: aiSystemsCompletion >= 90 ? "complete" : aiSystemsCompletion >= 50 ? "partial" : "pending",
      criticalIssues: aiSystemsIncomplete,
      totalRecords: aiSystemsTotal,
      incompleteRecords: aiSystemsIncomplete,
    })

    // Algorithmic Impact Assessment
    const algorithmicAssessments = JSON.parse(localStorage.getItem("algorithmicImpactAssessments") || "[]")
    const algorithmicTotal = algorithmicAssessments.length
    const algorithmicIncomplete = algorithmicAssessments.filter(
      (assessment: any) => !assessment.systemName || !assessment.riskScore || assessment.riskScore === 0,
    ).length
    const algorithmicCompletion =
      algorithmicTotal > 0 ? Math.round(((algorithmicTotal - algorithmicIncomplete) / algorithmicTotal) * 100) : 0

    modules.push({
      name: t.algorithmicImpactAssessment || "Evaluación de Impacto Algorítmico",
      route: "/evaluacion-impacto-algoritmico",
      completionRate: algorithmicCompletion,
      lastUpdated:
        algorithmicTotal > 0
          ? new Date(Math.max(...algorithmicAssessments.map((a: any) => new Date(a.createdAt || Date.now()).getTime())))
              .toISOString()
              .split("T")[0]
          : "N/A",
      status: algorithmicCompletion >= 90 ? "complete" : algorithmicCompletion >= 50 ? "partial" : "pending",
      criticalIssues: algorithmicIncomplete,
      totalRecords: algorithmicTotal,
      incompleteRecords: algorithmicIncomplete,
    })

    // Data Protection Risk Assessment
    const dataProtectionAssessments = JSON.parse(localStorage.getItem("dataProtectionAssessments") || "[]")
    const dataProtectionTotal = dataProtectionAssessments.length
    const dataProtectionIncomplete = dataProtectionAssessments.filter(
      (assessment: any) => !assessment.responses || Object.keys(assessment.responses).length < 10,
    ).length
    const dataProtectionCompletion =
      dataProtectionTotal > 0
        ? Math.round(((dataProtectionTotal - dataProtectionIncomplete) / dataProtectionTotal) * 100)
        : 0

    modules.push({
      name: t.dataProtectionRiskAssessment || "Evaluación de Riesgos PDP",
      route: "/evaluacion-riesgos-pdp",
      completionRate: dataProtectionCompletion,
      lastUpdated:
        dataProtectionTotal > 0
          ? new Date(
              Math.max(...dataProtectionAssessments.map((d: any) => new Date(d.createdAt || Date.now()).getTime())),
            )
              .toISOString()
              .split("T")[0]
          : "N/A",
      status: dataProtectionCompletion >= 90 ? "complete" : dataProtectionCompletion >= 50 ? "partial" : "pending",
      criticalIssues: dataProtectionIncomplete,
      totalRecords: dataProtectionTotal,
      incompleteRecords: dataProtectionIncomplete,
    })

    // Intellectual Property Impact Assessment
    const ipAssessments = JSON.parse(localStorage.getItem("intellectualPropertyAssessments") || "[]")
    const ipTotal = ipAssessments.length
    const ipIncomplete = ipAssessments.filter(
      (assessment: any) => !assessment.systemName || !assessment.riskScore,
    ).length
    const ipCompletion = ipTotal > 0 ? Math.round(((ipTotal - ipIncomplete) / ipTotal) * 100) : 0

    modules.push({
      name: t.intellectualPropertyImpactAssessment || "Evaluación de Impacto PI",
      route: "/evaluacion-impacto-pi",
      completionRate: ipCompletion,
      lastUpdated:
        ipTotal > 0
          ? new Date(Math.max(...ipAssessments.map((i: any) => new Date(i.createdAt || Date.now()).getTime())))
              .toISOString()
              .split("T")[0]
          : "N/A",
      status: ipCompletion >= 90 ? "complete" : ipCompletion >= 50 ? "partial" : "pending",
      criticalIssues: ipIncomplete,
      totalRecords: ipTotal,
      incompleteRecords: ipIncomplete,
    })

    // Supplier Risk Assessment
    const supplierAssessments = JSON.parse(localStorage.getItem("supplierRiskAssessments") || "[]")
    const supplierTotal = supplierAssessments.length
    const supplierIncomplete = supplierAssessments.filter(
      (assessment: any) => !assessment.supplierName || !assessment.riskScore,
    ).length
    const supplierCompletion =
      supplierTotal > 0 ? Math.round(((supplierTotal - supplierIncomplete) / supplierTotal) * 100) : 0

    modules.push({
      name: t.supplierProtectionRiskAssessment || "Evaluación de Riesgos Proveedores",
      route: "/evaluacion-riesgos-proveedores",
      completionRate: supplierCompletion,
      lastUpdated:
        supplierTotal > 0
          ? new Date(Math.max(...supplierAssessments.map((s: any) => new Date(s.createdAt || Date.now()).getTime())))
              .toISOString()
              .split("T")[0]
          : "N/A",
      status: supplierCompletion >= 90 ? "complete" : supplierCompletion >= 50 ? "partial" : "pending",
      criticalIssues: supplierIncomplete,
      totalRecords: supplierTotal,
      incompleteRecords: supplierIncomplete,
    })

    // Governance Policies
    const policies = JSON.parse(localStorage.getItem("governancePolicies") || "[]")
    const policiesTotal = policies.length
    const policiesIncomplete = policies.filter(
      (policy: any) => !policy.policyFullName || !policy.currentStatus || policy.currentStatus === "draft",
    ).length
    const policiesCompletion =
      policiesTotal > 0 ? Math.round(((policiesTotal - policiesIncomplete) / policiesTotal) * 100) : 0

    modules.push({
      name: t.governancePoliciesProcesses || "Políticas y Procesos de Gobernanza",
      route: "/politicas-procesos-gobernanza",
      completionRate: policiesCompletion,
      lastUpdated:
        policiesTotal > 0
          ? new Date(Math.max(...policies.map((p: any) => new Date(p.createdAt || Date.now()).getTime())))
              .toISOString()
              .split("T")[0]
          : "N/A",
      status: policiesCompletion >= 90 ? "complete" : policiesCompletion >= 50 ? "partial" : "pending",
      criticalIssues: policiesIncomplete,
      totalRecords: policiesTotal,
      incompleteRecords: policiesIncomplete,
    })

    // AI Training
    const trainings = JSON.parse(localStorage.getItem("aiTrainings") || "[]")
    const trainingsTotal = trainings.length
    const trainingsIncomplete = trainings.filter(
      (training: any) =>
        !training.courseName ||
        !training.trainingObjective ||
        !training.completionStatus ||
        training.completionStatus === "planned",
    ).length
    const trainingsCompletion =
      trainingsTotal > 0 ? Math.round(((trainingsTotal - trainingsIncomplete) / trainingsTotal) * 100) : 0

    modules.push({
      name: t.aiAwarenessTraining || "Concientización y Entrenamiento IA",
      route: "/concientizacion-entrenamiento-ia",
      completionRate: trainingsCompletion,
      lastUpdated:
        trainingsTotal > 0
          ? new Date(Math.max(...trainings.map((t: any) => new Date(t.createdAt || Date.now()).getTime())))
              .toISOString()
              .split("T")[0]
          : "N/A",
      status: trainingsCompletion >= 90 ? "complete" : trainingsCompletion >= 50 ? "partial" : "pending",
      criticalIssues: trainingsIncomplete,
      totalRecords: trainingsTotal,
      incompleteRecords: trainingsIncomplete,
    })

    // AI Governance Committee
    const committees = JSON.parse(localStorage.getItem("aiGovernanceCommittees") || "[]")
    const committeesTotal = committees.length
    const committeesIncomplete = committees.filter(
      (committee: any) => !committee.committeeName || !committee.rolesDocumented || committee.rolesDocumented === "no",
    ).length
    const committeesCompletion =
      committeesTotal > 0 ? Math.round(((committeesTotal - committeesIncomplete) / committeesTotal) * 100) : 0

    modules.push({
      name: t.aiGovernanceCommittee || "Comité de Gobernanza IA",
      route: "/comite-gobernanza-ia",
      completionRate: committeesCompletion,
      lastUpdated:
        committeesTotal > 0
          ? new Date(Math.max(...committees.map((c: any) => new Date(c.createdAt || Date.now()).getTime())))
              .toISOString()
              .split("T")[0]
          : "N/A",
      status: committeesCompletion >= 90 ? "complete" : committeesCompletion >= 50 ? "partial" : "pending",
      criticalIssues: committeesIncomplete,
      totalRecords: committeesTotal,
      incompleteRecords: committeesIncomplete,
    })

    setModuleStatuses(modules)
  }

  useEffect(() => {
    setReminders(getAuditReminders())
    loadRealModuleData()
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      loadRealModuleData()
    }

    window.addEventListener("storage", handleStorageChange)
    // Also listen for custom events when data is updated within the same tab
    window.addEventListener("localStorageUpdate", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("localStorageUpdate", handleStorageChange)
    }
  }, [])

  useEffect(() => {
    let filtered = reminders

    if (searchTerm) {
      filtered = filtered.filter(
        (reminder) =>
          reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reminder.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reminder.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((reminder) => reminder.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((reminder) => reminder.priority === priorityFilter)
    }

    setFilteredReminders(filtered)
  }, [reminders, searchTerm, statusFilter, priorityFilter])

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.dueDate) {
      toast({
        title: "Error",
        description: "Por favor completa los campos requeridos",
        variant: "destructive",
      })
      return
    }

    const reminder = addAuditReminder({
      ...newReminder,
      dueDate: new Date(newReminder.dueDate),
      assignedTo: newReminder.assignedTo
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      status: "pendiente",
    })

    setReminders(getAuditReminders())
    setNewReminder({
      title: "",
      description: "",
      dueDate: "",
      priority: "media",
      assignedTo: "",
      category: "",
      notes: "",
    })
    setIsAddDialogOpen(false)

    toast({
      title: t.reminderCreated || "Recordatorio creado",
      description: "El recordatorio se ha creado exitosamente",
    })
  }

  const handleCompleteReminder = (id: string) => {
    completeAuditReminder(id)
    setReminders(getAuditReminders())

    toast({
      title: t.reminderCompleted || "Recordatorio completado",
      description: "El recordatorio se ha marcado como completado",
    })
  }

  const handleDeleteReminder = (id: string) => {
    deleteAuditReminder(id)
    setReminders(getAuditReminders())

    toast({
      title: t.reminderDeleted || "Recordatorio eliminado",
      description: "El recordatorio se ha eliminado exitosamente",
    })
  }

  const generateAuditReport = () => {
    const overallCompliance = Math.round(
      moduleStatuses.reduce((sum, module) => sum + module.completionRate, 0) / moduleStatuses.length,
    )

    const criticalIssues = moduleStatuses.reduce((sum, module) => sum + module.criticalIssues, 0)
    const totalRecords = moduleStatuses.reduce((sum, module) => sum + module.totalRecords, 0)
    const upcomingReminders = getUpcomingAuditReminders(7)
    const overdueReminders = getOverdueAuditReminders()

    // Create PDF with real data
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.text("REPORTE DE AUDITORÍA DE GOBERNANZA DE IA", 20, 30)

    doc.setFontSize(12)
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 20, 50)

    // Executive Summary
    doc.setFontSize(16)
    doc.text("RESUMEN EJECUTIVO:", 20, 70)

    doc.setFontSize(12)
    doc.text(`- Cumplimiento General: ${overallCompliance}%`, 20, 85)
    doc.text(`- Total de Registros: ${totalRecords}`, 20, 95)
    doc.text(`- Problemas Críticos: ${criticalIssues}`, 20, 105)
    doc.text(`- Recordatorios Próximos (7 días): ${upcomingReminders.length}`, 20, 115)
    doc.text(`- Recordatorios Vencidos: ${overdueReminders.length}`, 20, 125)

    // Module Status
    doc.setFontSize(16)
    doc.text("ESTADO POR MÓDULO:", 20, 145)

    let yPosition = 160
    doc.setFontSize(10)

    moduleStatuses.forEach((module) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 30
      }

      doc.text(`• ${module.name}: ${module.completionRate}% (${module.status})`, 20, yPosition)
      yPosition += 10
      doc.text(`  Última actualización: ${module.lastUpdated}`, 25, yPosition)
      yPosition += 10
      doc.text(`  Registros totales: ${module.totalRecords}, Incompletos: ${module.incompleteRecords}`, 25, yPosition)
      yPosition += 15
    })

    // Save PDF
    doc.save(`reporte-auditoria-${new Date().toISOString().split("T")[0]}.pdf`)

    toast({
      title: t.auditReportGenerated || "Reporte generado",
      description: "El reporte de auditoría se ha generado exitosamente",
    })
  }

  const overallCompliance =
    moduleStatuses.length > 0
      ? Math.round(moduleStatuses.reduce((sum, module) => sum + module.completionRate, 0) / moduleStatuses.length)
      : 0

  const criticalIssues = moduleStatuses.reduce((sum, module) => sum + module.criticalIssues, 0)
  const totalRecords = moduleStatuses.reduce((sum, module) => sum + module.totalRecords, 0)
  const upcomingReminders = getUpcomingAuditReminders(7)
  const overdueReminders = getOverdueAuditReminders()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "partial":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600"
    if (rate >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-800">{t.auditDashboard || "Panel de Auditoría"}</h1>
          <p className="text-gray-600 mt-2">
            {t.complianceOverview || "Resumen de cumplimiento y gestión de auditorías"}
          </p>
        </div>
        <Button onClick={generateAuditReport} className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          {t.generateAuditReport || "Generar Reporte"}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.overallCompliance || "Cumplimiento General"}</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getComplianceColor(overallCompliance)}`}>{overallCompliance}%</div>
            <p className="text-xs text-gray-600">Promedio de todos los módulos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.criticalAlerts || "Alertas Críticas"}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalIssues}</div>
            <p className="text-xs text-gray-600">Registros incompletos que requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.upcomingDeadlines || "Fechas Próximas"}</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{upcomingReminders.length}</div>
            <p className="text-xs text-gray-600">Próximos 7 días</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recordatorios Vencidos</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueReminders.length}</div>
            <p className="text-xs text-gray-600">Requieren atención inmediata</p>
          </CardContent>
        </Card>
      </div>

      {/* Module Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            {t.moduleCompliance || "Cumplimiento por Módulo"}
          </CardTitle>
          <CardDescription>Estado actual de completitud de cada módulo del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moduleStatuses.map((module, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(module.status)}
                  <div>
                    <h3 className="font-medium">{module.name}</h3>
                    <p className="text-sm text-gray-600">
                      {t.lastUpdated || "Última actualización"}: {module.lastUpdated}
                    </p>
                    <p className="text-xs text-gray-500">
                      Registros: {module.totalRecords} | Incompletos: {module.incompleteRecords}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {module.criticalIssues > 0 && (
                    <Badge variant="destructive">{module.criticalIssues} incompletos</Badge>
                  )}
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getComplianceColor(module.completionRate)}`}>
                      {module.completionRate}%
                    </div>
                    <div className="text-xs text-gray-600">{t.completionRate || "Completitud"}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => (window.location.href = module.route)}>
                    {t.viewDetails || "Ver Detalles"}
                  </Button>
                </div>
              </div>
            ))}
            {moduleStatuses.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos disponibles</h3>
                <p className="text-gray-600">Comience registrando información en los módulos del sistema</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Audit Reminders section remains the same */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                {t.auditReminders || "Recordatorios de Auditoría"}
              </CardTitle>
              <CardDescription>Gestiona recordatorios y tareas de auditoría</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addReminder || "Agregar Recordatorio"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t.addReminder || "Agregar Recordatorio"}</DialogTitle>
                  <DialogDescription>Crea un nuevo recordatorio de auditoría</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">{t.reminderTitle || "Título"} *</Label>
                    <Input
                      id="title"
                      value={newReminder.title}
                      onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                      placeholder="Título del recordatorio"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">{t.reminderDescription || "Descripción"}</Label>
                    <Textarea
                      id="description"
                      value={newReminder.description}
                      onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                      placeholder="Descripción detallada"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">{t.dueDate || "Fecha Límite"} *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newReminder.dueDate}
                      onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">{t.priority || "Prioridad"}</Label>
                    <Select
                      value={newReminder.priority}
                      onValueChange={(value: AuditPriority) => setNewReminder({ ...newReminder, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alta">{t.highPriority || "Alta"}</SelectItem>
                        <SelectItem value="media">{t.mediumPriority || "Media"}</SelectItem>
                        <SelectItem value="baja">{t.lowPriority || "Baja"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="assignedTo">{t.assignedTo || "Asignado a"}</Label>
                    <Input
                      id="assignedTo"
                      value={newReminder.assignedTo}
                      onChange={(e) => setNewReminder({ ...newReminder, assignedTo: e.target.value })}
                      placeholder="Nombres separados por comas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">{t.category || "Categoría"}</Label>
                    <Input
                      id="category"
                      value={newReminder.category}
                      onChange={(e) => setNewReminder({ ...newReminder, category: e.target.value })}
                      placeholder="Categoría del recordatorio"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddReminder} className="bg-green-600 hover:bg-green-700">
                      Crear Recordatorio
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t.searchReminders || "Buscar recordatorios..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: AuditStatus | "all") => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t.filterByStatus || "Filtrar por Estado"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allStatuses || "Todos los Estados"}</SelectItem>
                <SelectItem value="pendiente">{t.pending || "Pendiente"}</SelectItem>
                <SelectItem value="en-progreso">{t.inProgress || "En Progreso"}</SelectItem>
                <SelectItem value="completada">{t.completed || "Completado"}</SelectItem>
                <SelectItem value="vencida">{t.overdue || "Vencido"}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(value: AuditPriority | "all") => setPriorityFilter(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t.filterByPriority || "Filtrar por Prioridad"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allPriorities || "Todas las Prioridades"}</SelectItem>
                <SelectItem value="alta">{t.highPriority || "Alta"}</SelectItem>
                <SelectItem value="media">{t.mediumPriority || "Media"}</SelectItem>
                <SelectItem value="baja">{t.lowPriority || "Baja"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reminders List */}
          {filteredReminders.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noReminders || "No hay recordatorios"}</h3>
              <p className="text-gray-600">{t.createFirstReminder || "Crea tu primer recordatorio de auditoría"}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReminders.map((reminder) => {
                const daysRemaining = getDaysRemaining(reminder.dueDate)
                const isOverdue = daysRemaining < 0

                return (
                  <div key={reminder.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{reminder.title}</h3>
                          <Badge className={getStatusColor(reminder.status)}>
                            {reminder.status === "pendiente"
                              ? t.pending
                              : reminder.status === "en-progreso"
                                ? t.inProgress
                                : reminder.status === "completada"
                                  ? t.completed
                                  : t.overdue}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(reminder.priority)}>
                            {reminder.priority === "alta"
                              ? t.highPriority
                              : reminder.priority === "media"
                                ? t.mediumPriority
                                : t.lowPriority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{reminder.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(reminder.dueDate)}
                            {isOverdue ? (
                              <span className="text-red-600 ml-1">
                                ({Math.abs(daysRemaining)} {t.daysOverdue || "días vencido"})
                              </span>
                            ) : daysRemaining === 0 ? (
                              <span className="text-yellow-600 ml-1">(Hoy)</span>
                            ) : (
                              <span className="text-green-600 ml-1">
                                ({daysRemaining} {t.daysRemaining || "días restantes"})
                              </span>
                            )}
                          </span>
                          {reminder.assignedTo.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {reminder.assignedTo.join(", ")}
                            </span>
                          )}
                          <span>{reminder.category}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {reminder.status !== "completada" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCompleteReminder(reminder.id)}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {t.markAsComplete || "Completar"}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteReminder(reminder.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Eliminar
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
    </div>
  )
}
