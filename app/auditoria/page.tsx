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
  Info,
} from "lucide-react"
import { useAuditReminders, generateReminderSuggestions } from "@/lib/audit-reminders"
import { formatDate, getDaysRemaining, getPriorityColor, getStatusColor } from "@/lib/audit-alarms"
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

  const [moduleStatuses, setModuleStatuses] = useState<ModuleStatus[]>([])
  const [showReminderHelp, setShowReminderHelp] = useState(false)

  const {
    reminders,
    filteredReminders,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    isAddDialogOpen,
    setIsAddDialogOpen,
    newReminder,
    setNewReminder,
    handleAddReminder,
    handleCompleteReminder,
    handleDeleteReminder,
    upcomingReminders,
    overdueReminders,
  } = useAuditReminders()

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

    // ... existing code for other modules ...

    setModuleStatuses(modules)
  }

  useEffect(() => {
    loadRealModuleData()
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      loadRealModuleData()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("localStorageUpdate", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("localStorageUpdate", handleStorageChange)
    }
  }, [])

  const generateAuditReport = () => {
    const overallCompliance = Math.round(
      moduleStatuses.reduce((sum, module) => sum + module.completionRate, 0) / moduleStatuses.length,
    )

    const criticalIssues = moduleStatuses.reduce((sum, module) => sum + module.criticalIssues, 0)
    const totalRecords = moduleStatuses.reduce((sum, module) => sum + module.totalRecords, 0)

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
  }

  const overallCompliance =
    moduleStatuses.length > 0
      ? Math.round(moduleStatuses.reduce((sum, module) => sum + module.completionRate, 0) / moduleStatuses.length)
      : 0

  const criticalIssues = moduleStatuses.reduce((sum, module) => sum + module.criticalIssues, 0)
  const totalRecords = moduleStatuses.reduce((sum, module) => sum + module.totalRecords, 0)

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

  const reminderSuggestions = generateReminderSuggestions(moduleStatuses)

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

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                {t.auditReminders || "Recordatorios de Auditoría"}
                <Dialog open={showReminderHelp} onOpenChange={setShowReminderHelp}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Info className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cómo crear recordatorios efectivos</DialogTitle>
                      <DialogDescription>
                        <div className="space-y-4 text-sm">
                          <div>
                            <h4 className="font-medium">📋 Tipos de recordatorios recomendados:</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              <li>Revisiones periódicas de cumplimiento (mensual/trimestral)</li>
                              <li>Actualizaciones de políticas y procedimientos</li>
                              <li>Evaluaciones de riesgo de sistemas críticos</li>
                              <li>Capacitaciones obligatorias del personal</li>
                              <li>Auditorías internas y externas</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium">⚡ Sugerencias automáticas:</h4>
                            <p>El sistema genera sugerencias basadas en:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              <li>Módulos con baja tasa de completitud (&lt;50%)</li>
                              <li>Registros incompletos que requieren atención</li>
                              <li>Fechas de vencimiento de políticas</li>
                            </ul>
                          </div>
                          {reminderSuggestions.length > 0 && (
                            <div>
                              <h4 className="font-medium">💡 Sugerencias actuales:</h4>
                              <div className="space-y-2 mt-2">
                                {reminderSuggestions.slice(0, 3).map((suggestion, index) => (
                                  <div key={index} className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                                    <p className="font-medium text-sm">{suggestion.title}</p>
                                    <p className="text-xs text-gray-600">{suggestion.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
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
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">{t.priority || "Prioridad"}</Label>
                    <Select
                      value={newReminder.priority}
                      onValueChange={(value: any) => setNewReminder({ ...newReminder, priority: value })}
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
                    <Select
                      value={newReminder.category}
                      onValueChange={(value) => setNewReminder({ ...newReminder, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cumplimiento">Cumplimiento</SelectItem>
                        <SelectItem value="Problemas Críticos">Problemas Críticos</SelectItem>
                        <SelectItem value="Revisión Periódica">Revisión Periódica</SelectItem>
                        <SelectItem value="Capacitación">Capacitación</SelectItem>
                        <SelectItem value="Auditoría">Auditoría</SelectItem>
                        <SelectItem value="Políticas">Políticas</SelectItem>
                      </SelectContent>
                    </Select>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
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
