"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Clock, Download, Calendar, AlertCircle, TrendingUp, BarChart3 } from "lucide-react"
import { getUpcomingAuditReminders, getOverdueAuditReminders } from "@/lib/audit-alarms"
import AuditRemindersManager from "@/components/audit-reminders-manager"
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

  // Función refactorizada para cargar datos reales de todos los módulos
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

    const incidentReports = JSON.parse(localStorage.getItem("highRiskIncidentReports") || "[]")
    const incidentTotal = incidentReports.length
    const lastIncidentUpdate =
      incidentTotal > 0
        ? new Date(
            Math.max(
              ...incidentReports.map((report: any) =>
                new Date(report.updatedAt || report.createdAt || Date.now()).getTime(),
              ),
            ),
          )
            .toISOString()
            .split("T")[0]
        : "N/A"

    modules.push({
      name: t.highRiskIncidentReports || "Reportes de incidentes de alto riesgo",
      route: "/incidentes-alto-riesgo",
      completionRate: incidentTotal > 0 ? 100 : 0,
      lastUpdated: lastIncidentUpdate,
      status: incidentTotal > 0 ? "complete" : "pending",
      criticalIssues: 0,
      totalRecords: incidentTotal,
      incompleteRecords: 0,
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
      name: t.supplierProtectionRiskAssessment || "Evaluación de Proveedores",
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

    // Transparency & Explainability Checklist
    const transparencyChecklists = JSON.parse(localStorage.getItem("transparencyExplainabilityChecklists") || "[]")
    const transparencyTotal = transparencyChecklists.length
    const transparencyIncomplete = transparencyChecklists.filter((checklist: any) => {
      if (!checklist.sections || !Array.isArray(checklist.sections)) return true
      return checklist.sections.some(
        (section: any) =>
          !section.items || !Array.isArray(section.items) || section.items.some((item: any) => !item.rating),
      )
    }).length
    const transparencyCompletion =
      transparencyTotal > 0
        ? Math.round(((transparencyTotal - transparencyIncomplete) / transparencyTotal) * 100)
        : 0

    modules.push({
      name: t.transparencyExplainability || "Transparencia y explicabilidad",
      route: "/transparencia-explicabilidad",
      completionRate: transparencyCompletion,
      lastUpdated:
        transparencyTotal > 0
          ? new Date(
              Math.max(
                ...transparencyChecklists.map((record: any) =>
                  new Date(record.updatedAt || record.createdAt || Date.now()).getTime(),
                ),
              ),
            )
              .toISOString()
              .split("T")[0]
          : "N/A",
      status:
        transparencyCompletion >= 90
          ? "complete"
          : transparencyCompletion >= 50
            ? "partial"
            : "pending",
      criticalIssues: transparencyIncomplete,
      totalRecords: transparencyTotal,
      incompleteRecords: transparencyIncomplete,
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

  // Función mejorada para generar reportes PDF con datos reales
  const generateAuditReport = () => {
    const overallCompliance = Math.round(
      moduleStatuses.reduce((sum, module) => sum + module.completionRate, 0) / moduleStatuses.length,
    )

    const criticalIssues = moduleStatuses.reduce((sum, module) => sum + module.criticalIssues, 0)
    const totalRecords = moduleStatuses.reduce((sum, module) => sum + module.totalRecords, 0)
    const upcomingReminders = getUpcomingAuditReminders(7)
    const overdueReminders = getOverdueAuditReminders()

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

    doc.save(`reporte-auditoria-${new Date().toISOString().split("T")[0]}.pdf`)
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
          <h1 className="text-3xl font-bold text-green-800">{t.auditDashboard || "Indicadores de cumplimiento"}</h1>
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

      {/* Componente refactorizado de recordatorios de auditoría */}
      <AuditRemindersManager />
    </div>
  )
}
