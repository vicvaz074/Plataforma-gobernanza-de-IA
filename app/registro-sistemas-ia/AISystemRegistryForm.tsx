"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
import {
  AI_REGISTRY_STORAGE_UPDATED_EVENT,
  AI_SYSTEMS_REGISTRY_STORAGE_KEY,
  createEmptyAISystemData,
  ensureAISystemsRegistrySeeded,
  filterAISystemsByMode,
  type AISystemData,
} from "@/lib/ai-registry"
import { FileText, Plus, Eye, Edit, Trash2, Download, Database, FileDown } from "lucide-react"
import Link from "next/link"
import { ModuleSubnav } from "@/components/module-subnav"

export default function AISystemRegistryForm({
  registryMode = "third-party",
  embedded = false,
  initialView = "register",
}: {
  registryMode?: "third-party" | "own"
  embedded?: boolean
  initialView?: "register" | "view"
}) {
  const { language } = useLanguage()
  const t = translations[language]
  const { toast } = useToast()
  const [activeView, setActiveView] = useState<"register" | "view">(initialView)
  const [savedSystems, setSavedSystems] = useState<AISystemData[]>([])
  const [editingSystem, setEditingSystem] = useState<AISystemData | null>(null)
  const [formData, setFormData] = useState<AISystemData>(() => createEmptyAISystemData(registryMode))

  useEffect(() => {
    setActiveView(initialView)
  }, [initialView])

  useEffect(() => {
    setFormData(createEmptyAISystemData(registryMode))
    setEditingSystem(null)
  }, [registryMode])

  useEffect(() => {
    const syncSavedSystems = () => {
      const { systems } = ensureAISystemsRegistrySeeded(window.localStorage)
      setSavedSystems(systems)
    }

    syncSavedSystems()
    window.addEventListener(AI_REGISTRY_STORAGE_UPDATED_EVENT, syncSavedSystems as EventListener)

    return () => {
      window.removeEventListener(AI_REGISTRY_STORAGE_UPDATED_EVENT, syncSavedSystems as EventListener)
    }
  }, [])

  const visibleSystems = filterAISystemsByMode(savedSystems, registryMode)

  const handleInputChange = (field: keyof AISystemData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field: keyof AISystemData, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter((item) => item !== value),
    }))
  }

  const validateForm = (): boolean => {
    const requiredFields: (keyof AISystemData)[] = [
      "companyName",
      "systemName",
      "systemDescription",
      "responsibleArea",
      "internalOwner",
      "systemStage",
      "lastUpdateDate",
      "lastUpdateResponsible",
      "nextReviewDate",
      "systemPurpose",
      "organizationUseCase",
      "problemSolved",
      "personImpactDecision",
      "finalUsersDescription",
      "endUserInteraction",
      "inputDataTypes",
      "sensitivePersonalData",
      "minorsData",
      "dataOrigin",
      "dataQualityProcess",
      "outputData",
      "outputPersonalDataReidentification",
      "highRiskClassification",
      "impactEvaluation",
      "dpiaEvaluation",
      "identifiedRisks",
      "biasDiscrimination",
      "legalImpact",
      "criticalSectorsList",
      "globalRiskLevel",
      "riskMitigationMeasures",
      "reviewResponsible",
      "reviewFrequency",
      "humanOversightLevel",
      "suspensionProcess",
      "assetInventoryStatus",
      "technicalAuditStatus",
      "committeeReviewStatus",
      "committeeReportingDuty",
      "userInformed",
      "explainable",
      "complaintsChannel",
      "arcoRights",
      "securityTechnicalMeasures",
      "incidentResponsePlan",
      "auditLogsMonitoring",
      "externalProviderInvolvement",
      "providerContractStatus",
      "internationalTransferStatus",
      "trainingStatus",
      "responsibleAIPolicy",
      "complianceMetricsDefined",
      "continuousImprovementProcess",
      "incidentRegistryStatus",
      "validatorResponsibleSignature",
      "governanceResponsibleSignature",
      "validationDate",
    ]

    const missingFields = requiredFields.filter((field) => {
      const value = formData[field]
      if (Array.isArray(value)) return value.length === 0
      return value === undefined || value === null || String(value).trim() === ""
    })

    if (missingFields.length > 0) {
      toast({
        title: t.validationError,
        description: t.requiredFieldsMissing,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSave = () => {
    if (!validateForm()) return

    try {
      const systemData: AISystemData = {
        ...formData,
        registryType: registryMode,
        id: editingSystem?.id || Date.now().toString(),
        createdAt: editingSystem?.createdAt || new Date().toISOString(),
      }

      let updatedSystems: AISystemData[]
      if (editingSystem) {
        updatedSystems = savedSystems.map((system) => (system.id === editingSystem.id ? systemData : system))
      } else {
        updatedSystems = [...savedSystems, systemData]
      }

      setSavedSystems(updatedSystems)
      localStorage.setItem(AI_SYSTEMS_REGISTRY_STORAGE_KEY, JSON.stringify(updatedSystems))
      window.dispatchEvent(new Event(AI_REGISTRY_STORAGE_UPDATED_EVENT))

      toast({
        title: t.success,
        description: editingSystem ? t.systemUpdated : t.systemSaved,
      })

      // Reset form
      setFormData(createEmptyAISystemData(registryMode))
      setEditingSystem(null)
      setActiveView("view")
    } catch (error) {
      toast({
        title: t.error,
        description: t.saveError,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (system: AISystemData) => {
    setFormData({
      ...system,
    })
    setEditingSystem(system)
    setActiveView("register")
  }

  const handleDelete = (id: string) => {
    const updatedSystems = savedSystems.filter((system) => system.id !== id)
    setSavedSystems(updatedSystems)
    localStorage.setItem(AI_SYSTEMS_REGISTRY_STORAGE_KEY, JSON.stringify(updatedSystems))
    window.dispatchEvent(new Event(AI_REGISTRY_STORAGE_UPDATED_EVENT))

    toast({
      title: t.success,
      description: t.systemDeleted,
    })
  }

  const generatePDFReport = (system: AISystemData) => {
    import("jspdf")
      .then((jsPDFModule) => {
        const { jsPDF } = jsPDFModule
        const doc = new jsPDF()

        // Configuración del documento
        const pageWidth = doc.internal.pageSize.width
        const margin = 20
        const lineHeight = 7
        let yPosition = 30

        // Función para agregar texto con salto de línea automático
        const addText = (text: string, fontSize = 10, isBold = false) => {
          doc.setFontSize(fontSize)
          if (isBold) {
            doc.setFont("helvetica", "bold")
          } else {
            doc.setFont("helvetica", "normal")
          }

          const lines = doc.splitTextToSize(text, pageWidth - 2 * margin)

          // Verificar si necesitamos una nueva página
          if (yPosition + lines.length * lineHeight > doc.internal.pageSize.height - margin) {
            doc.addPage()
            yPosition = margin
          }

          doc.text(lines, margin, yPosition)
          yPosition += lines.length * lineHeight + 3
        }

        // Función para agregar sección
        const addSection = (title: string, content: { [key: string]: any }) => {
          // Título de sección
          doc.setFillColor(27, 182, 126) // Color verde corporativo
          doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 12, "F")
          doc.setTextColor(255, 255, 255)
          addText(title, 12, true)
          doc.setTextColor(0, 0, 0)
          yPosition += 5

          // Contenido de la sección
          Object.entries(content).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              const displayValue = Array.isArray(value) ? value.join(", ") : String(value)
              addText(`${key}: ${displayValue}`, 10)
            }
          })

          yPosition += 5
        }

        // Encabezado del documento
        doc.setFillColor(27, 182, 126)
        doc.rect(0, 0, pageWidth, 25, "F")
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        doc.text("REPORTE DE SISTEMA DE INTELIGENCIA ARTIFICIAL", pageWidth / 2, 15, { align: "center" })

        // Información del sistema
        doc.setTextColor(0, 0, 0)
        yPosition = 35
        addText(`Sistema: ${system.systemName}`, 14, true)
        addText(`Empresa: ${system.companyName}`, 12)
        addText(`Fecha de generación: ${new Date().toLocaleDateString()}`, 10)
        yPosition += 10

        // Secciones del formulario
        addSection("A. IDENTIFICACIÓN GENERAL", {
          "Nombre del sistema": system.systemName,
          Descripción: system.systemDescription,
          "Área responsable":
            system.responsibleArea + (system.responsibleAreaOther ? ` (${system.responsibleAreaOther})` : ""),
          "Fecha de implementación": system.implementationDate,
          "Etapa del sistema": system.systemStage + (system.systemStageOther ? ` (${system.systemStageOther})` : ""),
          "Fecha de última actualización": system.lastUpdateDate,
          "Responsable de última actualización": system.lastUpdateResponsible,
        })

        addSection("B. FINALIDAD Y CASO DE USO", {
          "Finalidad principal": system.systemPurpose,
          "Caso de uso principal": system.organizationUseCase,
          "Problema o necesidad que resuelve": system.problemSolved,
          "Impacto en personas físicas": system.personImpactDecision,
          "Usuarios finales": system.finalUsersDescription,
          "Interacción con personas": system.endUserInteraction,
          "Volumen estimado afectado": system.affectedPeopleVolume,
        })

        addSection("C. DATOS Y FUENTES DE INFORMACIÓN", {
          "Categorías de datos de entrada":
            system.inputDataTypes?.join(", ") + (system.inputDataTypesOther ? ` (${system.inputDataTypesOther})` : ""),
          "Datos personales sensibles": system.sensitivePersonalData,
          "Datos de menores": system.minorsData,
          "Origen de datos de entrada":
            system.dataOrigin?.join(", ") + (system.dataOriginOther ? ` (${system.dataOriginOther})` : ""),
          "Calidad, integridad y representatividad": system.dataQualityProcess,
          "Diversidad representativa": system.dataRepresentativeness,
          "Datos de salida": system.outputData,
          "Salida con datos personales/reidentificación": system.outputPersonalDataReidentification,
        })

        addSection("D. CARACTERÍSTICAS TÉCNICAS", {
          "Tipo de IA": system.aiType?.join(", ") + (system.aiTypeOther ? ` (${system.aiTypeOther})` : ""),
          "Nivel de autonomía":
            system.autonomyLevel + (system.autonomyLevelOther ? ` (${system.autonomyLevelOther})` : ""),
          "Impacto de las decisiones":
            system.decisionImpact + (system.decisionImpactOther ? ` (${system.decisionImpactOther})` : ""),
          "Interacción con usuarios finales": system.endUserInteraction,
        })

        addSection("E. EVALUACIÓN DE RIESGOS E IMPACTO", {
          "Clasificación EU AI Act": system.highRiskClassification,
          "Evaluación de Impacto Algorítmico (EIA)": system.impactEvaluation,
          "Evaluación de Impacto en Protección de Datos (EIPD/DPIA)": system.dpiaEvaluation,
          "Evaluación de Impacto en Propiedad Intelectual": system.ipImpactEvaluation,
          "Riesgos identificados":
            system.identifiedRisks?.join(", ") +
            (system.identifiedRisksOther ? ` (${system.identifiedRisksOther})` : ""),
          "Sesgo o discriminación": system.biasDiscrimination,
          "Impacto legal significativo": system.legalImpact,
          "Sectores de alto impacto": system.criticalSectorsList?.join(", "),
          "Nivel de riesgo global": system.globalRiskLevel,
          "Medidas de mitigación":
            system.riskMitigationMeasures?.join(", ") +
            (system.riskMitigationMeasuresOther ? ` (${system.riskMitigationMeasuresOther})` : ""),
          "Impacto en derechos humanos": system.humanRightsImpact,
        })

        addSection("F. GOBERNANZA, CONTROL Y SUPERVISIÓN HUMANA", {
          "Responsable de revisión periódica": system.reviewResponsible,
          "Frecuencia de revisión": system.reviewFrequency,
          "Supervisión humana significativa": system.humanOversightLevel,
          "Proceso de suspensión ante fallos": system.suspensionProcess,
          "Registro en inventario de activos": system.assetInventoryStatus,
          "Auditorías técnicas o de cumplimiento": system.technicalAuditStatus,
          "Revisión por Comité de Gobernanza IA": system.committeeReviewStatus,
          "Obligación de reporte al Comité": system.committeeReportingDuty,
          "Usuario informado": system.userInformed,
          "Activo de información registrado": system.informationAssetRegistered,
          "Documentación técnica": system.technicalDocumentation,
          "Evidencia documentación técnica": system.technicalDocumentationFile
            ? "✓ Archivo adjunto"
            : "✗ Sin evidencia",
          "Documentación interna": system.internalDocumentation,
          "Evidencia documentación interna": system.internalDocumentationFile ? "✓ Archivo adjunto" : "✗ Sin evidencia",
          "Auditoría periódica": system.periodicAudit,
        })

        addSection("G. RIESGOS Y MITIGACIONES", {
          "Riesgos identificados":
            system.identifiedRisks?.join(", ") +
            (system.identifiedRisksOther ? ` (${system.identifiedRisksOther})` : ""),
          "Sesgo y discriminación": system.biasDiscrimination,
          "Impacto legal": system.legalImpact,
          "Impacto en derechos humanos": system.humanRightsImpact,
          "Sectores críticos": system.criticalSectors,
          "La IA toma decisiones sin intervención humana": system.replacesHumanDecisions,
          "Fase o momento de decisiones autónomas": system.replacesHumanDecisionsPhase,
          Explicable: system.explainable,
          "Medidas de mitigación":
            system.riskMitigationMeasures?.join(", ") +
            (system.riskMitigationMeasuresOther ? ` (${system.riskMitigationMeasuresOther})` : ""),
        })
        addSection("H. SEGURIDAD TÉCNICA Y GESTIÓN DE PROVEEDORES", {
          "Medidas de seguridad técnica": system.securityTechnicalMeasures?.join(", "),
          "Plan de respuesta a incidentes": system.incidentResponsePlan,
          "Logs de auditoría": system.auditLogsMonitoring,
          "Intervención de proveedor externo": system.externalProviderInvolvement,
          "Evaluación de riesgos del proveedor": system.providerRiskAssessment,
          "Contrato específico con proveedor": system.providerContractStatus,
          "Transferencias internacionales": system.internationalTransferStatus,
          "Mecanismos de transferencia": system.internationalTransferMechanisms?.join(", "),
        })

        addSection("I. CONCIENTIZACIÓN, CAPACITACIÓN Y CULTURA", {
          "Capacitación específica en IA responsable": system.trainingStatus,
          "Temas de capacitación": system.trainingTopics?.join(", "),
          "Frecuencia de actualización": system.trainingFrequency,
          "Política interna de uso responsable": system.responsibleAIPolicy,
        })

        addSection("J. INDICADORES DE CUMPLIMIENTO Y MEJORA CONTINUA", {
          "Métricas definidas": system.complianceMetricsDefined,
          "Métricas de seguimiento": system.complianceMetrics?.join(", "),
          "Proceso de mejora continua": system.continuousImprovementProcess,
          "Registro de incidentes": system.incidentRegistryStatus,
        })

        addSection("K. OBSERVACIONES, COMPROMISOS Y FIRMAS", {
          "Observaciones adicionales": system.additionalObservations,
          "Compromisos de revisión": system.reviewCommitments,
          "Responsable que valida": system.validatorResponsibleSignature,
          "Responsable gobernanza/DPO/compliance": system.governanceResponsibleSignature,
          "Fecha de validación": system.validationDate,
        })

        addSection("L. RESPONSABILIDADES INTERNAS (RACI)", {
          "Área u órgano responsable principal":
            system.raciArea + (system.raciAreaOther ? ` (${system.raciAreaOther})` : ""),
          "Propietario del sistema (A)": `${system.raciOwnerName} - ${system.raciOwnerRole} - ${system.raciOwnerEmail}`,
          "Responsable operativo (R)": `${system.raciOperationalName} - ${system.raciOperationalRole} - ${system.raciOperationalEmail}`,
          "Supervisión técnica R": system.raciTechnicalR,
          "Supervisión técnica A": system.raciTechnicalA,
          "Supervisión técnica C": system.raciTechnicalC,
          "Supervisión técnica I": system.raciTechnicalI,
          "Supervisión legal R": system.raciLegalR,
          "Supervisión legal A": system.raciLegalA,
          "Supervisión legal C": system.raciLegalC,
          "Supervisión legal I": system.raciLegalI,
          "Protección de datos R": system.raciPrivacyR,
          "Protección de datos A": system.raciPrivacyA,
          "Protección de datos C": system.raciPrivacyC,
          "Protección de datos I": system.raciPrivacyI,
          "Gestión ética R": system.raciEthicalR,
          "Gestión ética A": system.raciEthicalA,
          "Gestión ética C": system.raciEthicalC,
          "Gestión ética I": system.raciEthicalI,
          "Incidentes y seguridad R": system.raciSecurityR,
          "Incidentes y seguridad A": system.raciSecurityA,
          "Incidentes y seguridad C": system.raciSecurityC,
          "Incidentes y seguridad I": system.raciSecurityI,
          "Frecuencia de reportes": system.raciReportFrequency,
          "Destinatarios de reportes":
            system.raciReportRecipients?.join(", ") +
            (system.raciReportRecipientsOther ? ` (${system.raciReportRecipientsOther})` : ""),
          "Documentación de aprobaciones": system.raciApprovalsDocumented,
          "Canales de escalamiento":
            system.raciEscalationChannels?.join(", ") +
            (system.raciEscalationChannelsOther ? ` (${system.raciEscalationChannelsOther})` : ""),
          "Acta interna RACI": system.raciActExistence,
          "Aceptación responsabilidad (A)": `${system.raciAcceptanceName} - ${system.raciAcceptanceRole} - ${system.raciAcceptanceDate}`,
        })

        addSection("G. TRANSPARENCIA, EXPLICABILIDAD Y DERECHOS", {
          "Información a usuarios sobre IA": system.userInformed,
          Explicabilidad: system.explainable,
          "Técnicas XAI implementadas": system.xaiTechniques?.join(", "),
          "Canal de reclamaciones/impugnación": system.complaintsChannel,
          "Mecanismos ARCO/ARSRP": system.arcoRights,
          "Documentación pública/accesible": system.publicDocumentation,
        })

        // Información adicional
        addSection("INFORMACIÓN ADICIONAL", {
          "Fecha de creación del registro": system.createdAt,
          "ID del sistema": system.id,
        })

        // Pie de página
        const totalPages = doc.getNumberOfPages()
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i)
          doc.setFontSize(8)
          doc.setTextColor(128, 128, 128)
          doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, doc.internal.pageSize.height - 10, {
            align: "right",
          })
          doc.text("DavaraGovernance AI - Reporte de Sistema de IA", margin, doc.internal.pageSize.height - 10)
        }

        // Descargar el PDF
        const fileName = `reporte_${system.systemName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`
        doc.save(fileName)

        toast({
          title: t.success,
          description: `Reporte PDF generado para ${system.systemName}`,
        })
      })
      .catch((error) => {
        console.error("Error loading jsPDF:", error)
        toast({
          title: "Error",
          description: "No se pudo generar el PDF. Intente nuevamente.",
          variant: "destructive",
        })
      })
  }

  const exportToExcel = () => {
    // Implementación básica de exportación
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Sistema,Empresa,Fecha de Creación\n" +
      visibleSystems
        .map((system) => `${system.systemName},${system.companyName},${system.createdAt}`)
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "sistemas_ia.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileUpload = (fieldName: string, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      setFormData((prev) => ({
        ...prev,
        [`${fieldName}File`]: base64,
      }))
      toast({
        title: t.documentUploaded,
        description: `${file.name} ${t.uploadedSuccessfully}`,
      })
    }
    reader.readAsDataURL(file)
  }

  const downloadFile = (base64Data: string, fileName: string) => {
    const link = document.createElement("a")
    link.href = base64Data
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={embedded ? "space-y-6" : "container mx-auto space-y-6 p-6"}>
      {!embedded ? (
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t.aiSystemRegistry}</h1>
        </div>
      ) : null}

      <ModuleSubnav
        activeId={activeView}
        onChange={(id) => setActiveView(id as "register" | "view")}
        items={[
          {
            id: "register",
            label: editingSystem ? t.editSystem : t.registerNewSystem,
            icon: Plus,
          },
          {
            id: "view",
            label: t.viewRegisteredSystems,
            icon: Eye,
            badge: visibleSystems.length || undefined,
          },
        ]}
      />

      {activeView === "register" && (
        <Card>
          <CardHeader>
            <CardTitle>{editingSystem ? t.editSystem : t.registerNewSystem}</CardTitle>
            <CardDescription>{t.fillFormDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/* Apartado: Instrucciones de uso */}
              <Card className="border-[hsl(var(--brand-border))] bg-gradient-to-br from-[hsl(var(--brand-muted))] to-white">
                <CardHeader>
                  <CardTitle className="text-[#0f3b66]">INSTRUCCIONES DE USO</CardTitle>
                  <CardDescription>
                    Referencias generales previas al diligenciamiento del módulo de Registro de Sistemas de IA
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-700">
                  <p>
                    Este cuestionario forma parte del módulo de Registro de Sistemas de IA de la plataforma
                    DavaraGovernance y debe completarse para cada sistema de inteligencia artificial que la
                    organización desarrolle, implemente o utilice, con independencia de que sea de uso interno o
                    externo.
                  </p>
                  <p>
                    <span className="font-medium text-orange-600">*</span> Las preguntas marcadas con asterisco naranja
                    son obligatorias. El resto son recomendadas para un registro completo.
                  </p>
                  <p>
                    Revise y actualice este registro ante cualquier cambio significativo en el sistema y, como mínimo,
                    una vez al año.
                  </p>
                  <p className="italic text-slate-600">
                    Los campos de texto libre admiten respuestas extendidas. Los campos de selección pueden ser de
                    respuesta única o múltiple según se indica.
                  </p>
                  <div className="rounded-md border bg-white p-3">
                    <p className="font-medium mb-2 text-slate-800">Referencias normativas y estándares internacionales incorporados:</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-900">ISO/IEC 42001:2023 · Marco de gobernanza de IA</span>
                      <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-900">EU AI Act · Reglamento Europeo de IA</span>
                      <span className="px-2 py-1 rounded bg-orange-100 text-orange-900">NIST AI RMF · AI Risk Mgmt. Framework</span>
                      <span className="px-2 py-1 rounded bg-teal-100 text-teal-900">OCDE / UNESCO · Principios de IA responsable</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sección A: Identificación del sistema de IA */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    A. Identificación del sistema de IA
                  </CardTitle>
                  <CardDescription>Datos básicos de identificación para el inventario organizacional</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-[#0f3b66] border-b pb-1">Datos de la organización</h4>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyName">
                        <span className="text-orange-600">*</span> Nombre legal de la organización responsable del sistema de IA
                      </Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        placeholder="Ingrese el nombre legal de la organización"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="corporateGroup">Grupo corporativo al que pertenece (si aplica)</Label>
                      <Input
                        id="corporateGroup"
                        value={formData.corporateGroup}
                        onChange={(e) => handleInputChange("corporateGroup", e.target.value)}
                        placeholder="Ingrese el grupo corporativo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mainJurisdiction">País y jurisdicción principal de operación</Label>
                      <Input
                        id="mainJurisdiction"
                        value={formData.mainJurisdiction}
                        onChange={(e) => handleInputChange("mainJurisdiction", e.target.value)}
                        placeholder="Ej. México, UE, internacional"
                      />
                    </div>

                    <div className="md:col-span-2 mt-2">
                      <h4 className="font-semibold text-[#0f3b66] border-b pb-1">Datos del sistema</h4>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="systemName">
                        <span className="text-orange-600">*</span> Nombre o identificador único del sistema de IA
                      </Label>
                      <Input
                        id="systemName"
                        value={formData.systemName}
                        onChange={(e) => handleInputChange("systemName", e.target.value)}
                        placeholder="Asigne un nombre descriptivo y un código interno (ej. IA-CRM-001)"
                      />
                      <p className="text-xs text-slate-500">Guía: Este identificador debe ser único en el inventario.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="systemVersion">Versión actual del sistema</Label>
                      <Input
                        id="systemVersion"
                        value={formData.systemVersion}
                        onChange={(e) => handleInputChange("systemVersion", e.target.value)}
                        placeholder="Ej. v2.3.1"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="systemDescription">
                        <span className="text-orange-600">*</span> Descripción del sistema (¿qué hace? ¿cómo lo hace?)
                      </Label>
                      <Textarea
                        id="systemDescription"
                        value={formData.systemDescription}
                        onChange={(e) => handleInputChange("systemDescription", e.target.value)}
                        placeholder="Describa brevemente el objetivo del sistema, el tipo de salidas que genera y la tecnología principal que utiliza"
                        rows={3}
                      />
                      <p className="text-xs text-slate-500">Guía: Incluya propósito, salidas principales y tecnología utilizada.</p>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="responsibleArea">
                        <span className="text-orange-600">*</span> Área o departamento responsable del sistema
                      </Label>
                      <select
                        id="responsibleArea"
                        value={formData.responsibleArea}
                        onChange={(e) => handleInputChange("responsibleArea", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Seleccione un área</option>
                        <option value="juridico_compliance">Jurídico / Compliance</option>
                        <option value="privacidad">Protección de datos / Privacidad</option>
                        <option value="tecnologia_ti">Tecnología / TI</option>
                        <option value="ciberseguridad">Ciberseguridad</option>
                        <option value="producto_innovacion">Producto / Innovación</option>
                        <option value="rrhh">RRHH / Personas</option>
                        <option value="comercial_marketing">Comercial / Marketing</option>
                        <option value="operaciones_logistica">Operaciones / Logística</option>
                        <option value="finanzas">Finanzas</option>
                        <option value="salud_bienestar">Salud / Bienestar</option>
                        <option value="otro">Otro</option>
                      </select>
                      {formData.responsibleArea === "otro" && (
                        <Input
                          placeholder="Especifique el área responsable"
                          value={formData.responsibleAreaOther || ""}
                          onChange={(e) => handleInputChange("responsibleAreaOther", e.target.value)}
                        />
                      )}
                      <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §6.1</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="internalOwner">
                        <span className="text-orange-600">*</span> Nombre y cargo del responsable interno del sistema
                      </Label>
                      <Input
                        id="internalOwner"
                        value={formData.internalOwner}
                        onChange={(e) => handleInputChange("internalOwner", e.target.value)}
                        placeholder="Nombre y cargo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="providerName">Proveedor o desarrollador del sistema (si es externo)</Label>
                      <Input
                        id="providerName"
                        value={formData.providerName}
                        onChange={(e) => handleInputChange("providerName", e.target.value)}
                        disabled={registryMode === "own"}
                        placeholder={
                          registryMode === "own"
                            ? "Desarrollo interno"
                            : "Indique el nombre comercial y razón social del proveedor"
                        }
                      />
                      <p className="text-xs text-slate-500">Guía: Si es desarrollo interno, escriba “Desarrollo interno”.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="systemStage">
                        <span className="text-orange-600">*</span> Etapa actual del ciclo de vida del sistema
                      </Label>
                      <select
                        id="systemStage"
                        value={formData.systemStage}
                        onChange={(e) => handleInputChange("systemStage", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="diseno">Diseño / Conceptualización</option>
                        <option value="desarrollo">Desarrollo / Entrenamiento</option>
                        <option value="piloto">Piloto / Pruebas</option>
                        <option value="produccion">Producción activa</option>
                        <option value="mantenimiento">Mantenimiento</option>
                        <option value="retirado">Retirado / Descontinuado</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §8.4 | NIST AI RMF — Govern 1.1</p>
                    </div>

                    <div className="md:col-span-2 mt-2">
                      <h4 className="font-semibold text-[#0f3b66] border-b pb-1">Fechas clave del registro</h4>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="implementationDate">Fecha de primera implementación o puesta en producción</Label>
                      <Input
                        id="implementationDate"
                        type="date"
                        value={formData.implementationDate}
                        onChange={(e) => handleInputChange("implementationDate", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastUpdateDate">
                        <span className="text-orange-600">*</span> Fecha de la última actualización del registro
                      </Label>
                      <Input
                        id="lastUpdateDate"
                        type="date"
                        value={formData.lastUpdateDate}
                        onChange={(e) => handleInputChange("lastUpdateDate", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastUpdateResponsible">
                        <span className="text-orange-600">*</span> Responsable de la última actualización del registro (nombre y cargo)
                      </Label>
                      <Input
                        id="lastUpdateResponsible"
                        value={formData.lastUpdateResponsible}
                        onChange={(e) => handleInputChange("lastUpdateResponsible", e.target.value)}
                        placeholder="Nombre y cargo del responsable"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nextReviewDate">
                        <span className="text-orange-600">*</span> Fecha programada de la próxima revisión
                      </Label>
                      <Input
                        id="nextReviewDate"
                        type="date"
                        value={formData.nextReviewDate}
                        onChange={(e) => handleInputChange("nextReviewDate", e.target.value)}
                      />
                      <p className="text-xs text-slate-500">Guía: Se recomienda una revisión al menos anual o ante cambios significativos.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sección B: Finalidad y caso de uso */}
              <Card>
                <CardHeader>
                  <CardTitle>B. Finalidad y caso de uso</CardTitle>
                  <CardDescription>
                    Describe el propósito del sistema y la manera en que es utilizado en la organización
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="systemPurpose">
                      <span className="text-orange-600">*</span> Finalidad principal del sistema de IA
                    </Label>
                    <Textarea
                      id="systemPurpose"
                      value={formData.systemPurpose}
                      onChange={(e) => handleInputChange("systemPurpose", e.target.value)}
                      placeholder="Describa el objetivo concreto que el sistema persigue"
                      rows={3}
                    />
                    <p className="text-xs text-slate-500">
                      Guía: Describa el objetivo concreto que el sistema persigue (ej. clasificar solicitudes de crédito,
                      detectar anomalías de seguridad, generar respuestas de atención al cliente).
                    </p>
                    <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §6.2 | NIST AI RMF — Map 1.1</p>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      <span className="text-orange-600">*</span> Caso de uso principal en la organización
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border border-gray-200 rounded-md">
                      {[
                        "Atención al cliente / Chatbot",
                        "Recursos Humanos (selección, evaluación, desempeño)",
                        "Marketing / Publicidad / Personalización",
                        "Análisis financiero / Scoring crediticio",
                        "Ciberseguridad / Detección de fraude",
                        "Salud / Diagnóstico / Bienestar",
                        "Legal / Compliance / Gobernanza",
                        "Operaciones / Cadena de suministro",
                        "Manufactura / Control de calidad",
                        "Educación / Formación",
                        "Sector público / Servicios gubernamentales",
                        "Investigación y desarrollo",
                        "Otro",
                      ].map((useCase) => (
                        <div key={useCase} className="flex items-start space-x-2">
                          <Checkbox
                            id={`useCase-${useCase}`}
                            checked={formData.organizationUseCase?.includes(useCase) || false}
                            onCheckedChange={(checked) => {
                              const currentUseCases = formData.organizationUseCase || []
                              handleInputChange(
                                "organizationUseCase",
                                checked
                                  ? [...currentUseCases, useCase]
                                  : currentUseCases.filter((item) => item !== useCase),
                              )
                            }}
                          />
                          <Label htmlFor={`useCase-${useCase}`} className="font-normal leading-5">
                            {useCase}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">Referencia: EU AI Act Anexo III</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="problemSolved">
                      <span className="text-orange-600">*</span> ¿Problema o necesidad organizacional que el sistema resuelve?
                    </Label>
                    <Textarea
                      id="problemSolved"
                      value={formData.problemSolved}
                      onChange={(e) => handleInputChange("problemSolved", e.target.value)}
                      placeholder="Describa el problema o necesidad que motivó la implementación"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personImpactDecision">
                      <span className="text-orange-600">*</span> ¿El sistema genera decisiones o recomendaciones que afectan a personas físicas?
                    </Label>
                    <select
                      id="personImpactDecision"
                      value={formData.personImpactDecision}
                      onChange={(e) => handleInputChange("personImpactDecision", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="si_vinculantes">Sí — decisiones vinculantes</option>
                      <option value="si_no_vinculantes">Sí — recomendaciones no vinculantes</option>
                      <option value="no_interno">No — únicamente procesa información interna</option>
                    </select>
                    <p className="text-xs text-slate-500">
                      Referencia: LFPDPPP Art. 16 | EU AI Act Art. 9 | NIST AI RMF — Map 1.5
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="finalUsersDescription">
                      <span className="text-orange-600">*</span> Descripción de los destinatarios o usuarios finales del sistema
                    </Label>
                    <Textarea
                      id="finalUsersDescription"
                      value={formData.finalUsersDescription}
                      onChange={(e) => handleInputChange("finalUsersDescription", e.target.value)}
                      placeholder="Describa quiénes son los usuarios finales"
                      rows={3}
                    />
                    <p className="text-xs text-slate-500">
                      Guía: Indique si los usuarios son empleados, clientes, ciudadanos, pacientes, estudiantes u otro grupo.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endUserInteraction">
                      <span className="text-orange-600">*</span> ¿El sistema interactúa directamente con personas físicas (usuarios finales)?
                    </Label>
                    <select
                      id="endUserInteraction"
                      value={formData.endUserInteraction}
                      onChange={(e) => handleInputChange("endUserInteraction", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="directa_tiempo_real">Sí, directamente y en tiempo real</option>
                      <option value="mediada_diferida">Sí, de forma mediada o diferida</option>
                      <option value="sin_interaccion">No, opera de forma interna sin interacción directa</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="affectedPeopleVolume">Volumen estimado de personas afectadas o procesadas por el sistema</Label>
                    <select
                      id="affectedPeopleVolume"
                      value={formData.affectedPeopleVolume}
                      onChange={(e) => handleInputChange("affectedPeopleVolume", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="menos_100">Menos de 100</option>
                      <option value="100_1000">100 – 1,000</option>
                      <option value="1000_10000">1,000 – 10,000</option>
                      <option value="10000_100000">10,000 – 100,000</option>
                      <option value="mas_100000">Más de 100,000</option>
                    </select>
                    <p className="text-xs text-slate-500">Referencia: EU AI Act (considerando análisis de escala)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Sección C: Datos y fuentes de información */}
              <Card>
                <CardHeader>
                  <CardTitle>C. Datos y fuentes de información</CardTitle>
                  <CardDescription>Identifica qué datos utiliza el sistema, su origen y naturaleza</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#0f3b66] border-b pb-1">Tipos de datos de entrada</h4>

                    <div className="space-y-2">
                      <Label>
                        <span className="text-orange-600">*</span> ¿Qué categorías de datos utiliza el sistema como entrada?
                        (Seleccione todas las que apliquen)
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border border-gray-200 rounded-md">
                        {[
                          "Datos de identificación (nombre, ID, RFC, CURP)",
                          "Datos de contacto (correo, teléfono, domicilio)",
                          "Datos biométricos (huella, voz, imagen facial)",
                          "Datos de salud / médicos",
                          "Datos financieros / patrimoniales",
                          "Datos de comportamiento / navegación",
                          "Datos laborales / de desempeño",
                          "Datos de ubicación / geolocalización",
                          "Datos de comunicaciones (correos, chats)",
                          "Imágenes / video / audio",
                          "Datos públicos / fuentes abiertas",
                          "Datos sintéticos o de prueba",
                          "No procesa datos personales",
                        ].map((type) => (
                          <div key={type} className="flex items-start space-x-2">
                            <Checkbox
                              id={`inputDataType-${type}`}
                              checked={formData.inputDataTypes?.includes(type) || false}
                              onCheckedChange={(checked) => {
                                const current = formData.inputDataTypes || []
                                handleInputChange(
                                  "inputDataTypes",
                                  checked ? [...current, type] : current.filter((item) => item !== type),
                                )
                              }}
                            />
                            <Label htmlFor={`inputDataType-${type}`} className="font-normal leading-5">
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">Referencia: LFPDPPP Art. 3 | ISO/IEC 29101 | EU AI Act Art. 10</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sensitivePersonalData">
                        <span className="text-orange-600">*</span> ¿El sistema procesa datos personales considerados sensibles por la normatividad aplicable?
                      </Label>
                      <p className="text-xs text-slate-500">
                        Guía: Datos sensibles incluyen: origen étnico/racial, salud, biometría, creencias religiosas,
                        ideología política, vida/preferencia sexual.
                      </p>
                      <select
                        id="sensitivePersonalData"
                        value={formData.sensitivePersonalData}
                        onChange={(e) => handleInputChange("sensitivePersonalData", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si_observaciones">Sí — especifique en el campo de observaciones</option>
                        <option value="no">No</option>
                        <option value="en_evaluacion">En evaluación</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: LFPDPPP Art. 3 fracc. VI | EU AI Act Art. 10.5</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minorsData">
                        <span className="text-orange-600">*</span> ¿El sistema procesa datos de menores de edad?
                      </Label>
                      <select
                        id="minorsData"
                        value={formData.minorsData}
                        onChange={(e) => handleInputChange("minorsData", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                        <option value="en_evaluacion">En evaluación</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: LFPDPPP Art. 8 | COPPA | Convención sobre los Derechos del Niño</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#0f3b66] border-b pb-1">Origen y calidad de los datos</h4>

                    <div className="space-y-2">
                      <Label>
                        <span className="text-orange-600">*</span> Origen de los datos de entrada utilizados (seleccione todos los que apliquen)
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border border-gray-200 rounded-md">
                        {[
                          "Generados internamente por la organización",
                          "Proporcionados directamente por el titular",
                          "Recabados de proveedores externos de datos",
                          "Datos abiertos / fuentes públicas",
                          "Adquiridos de terceros comerciales",
                          "Datos generados por otros sistemas de IA",
                          "Datos sintéticos generados para entrenamiento",
                        ].map((origin) => (
                          <div key={origin} className="flex items-start space-x-2">
                            <Checkbox
                              id={`origin-${origin}`}
                              checked={formData.dataOrigin?.includes(origin) || false}
                              onCheckedChange={(checked) => {
                                const current = formData.dataOrigin || []
                                handleInputChange(
                                  "dataOrigin",
                                  checked ? [...current, origin] : current.filter((item) => item !== origin),
                                )
                              }}
                            />
                            <Label htmlFor={`origin-${origin}`} className="font-normal leading-5">
                              {origin}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §8.4 | NIST AI RMF — Map 3.5</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataQualityProcess">
                        <span className="text-orange-600">*</span> ¿Existen procesos documentados para garantizar la calidad,
                        integridad y representatividad de los datos de entrenamiento?
                      </Label>
                      <select
                        id="dataQualityProcess"
                        value={formData.dataQualityProcess}
                        onChange={(e) => handleInputChange("dataQualityProcess", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si_formal">Sí — proceso formal documentado</option>
                        <option value="si_informal">Sí — proceso informal sin documentar</option>
                        <option value="no">No</option>
                        <option value="no_aplica">No aplica (sistema sin entrenamiento propio)</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §8.3 | NIST AI RMF — Measure 2.5</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataRepresentativeness">
                        ¿Los datos de entrenamiento representan adecuadamente la diversidad de la población que el
                        sistema afectará?
                      </Label>
                      <select
                        id="dataRepresentativeness"
                        value={formData.dataRepresentativeness}
                        onChange={(e) => handleInputChange("dataRepresentativeness", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si_verificado">Sí — verificado y documentado</option>
                        <option value="parcialmente">Parcialmente</option>
                        <option value="no_brechas">No — se han identificado brechas de representatividad</option>
                        <option value="no_aplica">No aplica</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: NIST AI RMF — Map 5.1 | OCDE Principio 1.2</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#0f3b66] border-b pb-1">Datos de salida</h4>

                    <div className="space-y-2">
                      <Label htmlFor="outputData">
                        <span className="text-orange-600">*</span> Descripción de los datos de salida o resultados que genera
                        el sistema
                      </Label>
                      <Textarea
                        id="outputData"
                        value={formData.outputData}
                        onChange={(e) => handleInputChange("outputData", e.target.value)}
                        placeholder="Describa los datos de salida"
                        rows={3}
                      />
                      <p className="text-xs text-slate-500">
                        Guía: Ej.: puntuaciones de riesgo, recomendaciones de contenido, clasificaciones, textos
                        generados, imágenes sintéticas, decisiones binarias.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="outputPersonalDataReidentification">
                        <span className="text-orange-600">*</span> ¿Los datos de salida incluyen información personal o
                        pueden ser reidentificados?
                      </Label>
                      <select
                        id="outputPersonalDataReidentification"
                        value={formData.outputPersonalDataReidentification}
                        onChange={(e) => handleInputChange("outputPersonalDataReidentification", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                        <option value="en_evaluacion">En evaluación</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: LFPDPPP Art. 3 | ISO/IEC 29101</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sección D: Características técnicas */}
              <Card>
                <CardHeader>
                  <CardTitle>D. Características técnicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>16. Tipo de IA</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["NLP", "Visión", "ML", "Sistemas expertos basados en reglas", "Generativa", "Otro"].map(
                        (type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`aiType-${type}`}
                              checked={formData.aiType.includes(type)}
                              onCheckedChange={(checked) => handleCheckboxChange("aiType", type, checked as boolean)}
                            />
                            <Label htmlFor={`aiType-${type}`}>{type}</Label>
                          </div>
                        ),
                      )}
                    </div>
                    {formData.aiType.includes("Otro") && (
                      <div className="mt-2">
                        <Input
                          placeholder="Especifique otro tipo de IA"
                          value={formData.aiTypeOther || ""}
                          onChange={(e) => handleInputChange("aiTypeOther", e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="autonomyLevel">17. Nivel de autonomía</Label>
                    <select
                      id="autonomyLevel"
                      value={formData.autonomyLevel}
                      onChange={(e) => handleInputChange("autonomyLevel", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="asistido">Asistido</option>
                      <option value="parcial">Parcial</option>
                      <option value="total">Total</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="decisionImpact">18. Impacto de las decisiones del sistema</Label>
                    <select
                      id="decisionImpact"
                      value={formData.decisionImpact}
                      onChange={(e) => handleInputChange("decisionImpact", e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Seleccione el impacto</option>
                      <option value="apoyo">Apoyo</option>
                      <option value="critico">Crítico</option>
                      <option value="legal">Legal</option>
                      <option value="operacional">Operacional</option>
                      <option value="otro">Otro</option>
                    </select>
                    {formData.decisionImpact === "otro" && (
                      <div className="mt-2">
                        <Label htmlFor="decisionImpactOther">Especifique el impacto de decisión</Label>
                        <Input
                          id="decisionImpactOther"
                          value={formData.decisionImpactOther || ""}
                          onChange={(e) => handleInputChange("decisionImpactOther", e.target.value)}
                          placeholder="Especifique el impacto de decisión"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endUserInteraction">19. ¿Interacción con usuarios finales?</Label>
                    <select
                      id="endUserInteraction"
                      value={formData.endUserInteraction}
                      onChange={(e) => handleInputChange("endUserInteraction", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="no">No</option>
                      <option value="si">Sí</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Sección E: Evaluación de riesgos e impacto */}
              <Card>
                <CardHeader>
                  <CardTitle>E. Evaluación de riesgos e impacto</CardTitle>
                  <CardDescription>
                    Identifica y pondera los riesgos del sistema para las personas y la organización
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#0f3b66] border-b pb-1">Clasificación de riesgo regulatorio</h4>

                    <div className="space-y-2">
                      <Label htmlFor="highRiskClassification">
                        <span className="text-orange-600">*</span> ¿El sistema está clasificado como de alto riesgo conforme al EU AI Act?
                      </Label>
                      <select
                        id="highRiskClassification"
                        value={formData.highRiskClassification}
                        onChange={(e) => handleInputChange("highRiskClassification", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si_anexo_iii">Sí — catalogado en Anexo III del EU AI Act</option>
                        <option value="posiblemente_evaluacion">Posiblemente — en evaluación</option>
                        <option value="no_limitado_minimo">No — riesgo limitado o mínimo</option>
                        <option value="no_aplica_territorial">No aplica — fuera del ámbito territorial del EU AI Act</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: EU AI Act Arts. 6 y 7 | Anexo III</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="impactEvaluation">
                        <span className="text-orange-600">*</span> ¿El sistema ha sido objeto de una Evaluación de Impacto Algorítmico (EIA)?
                      </Label>
                      <div className="flex items-center space-x-2">
                        <select
                          id="impactEvaluation"
                          value={formData.impactEvaluation}
                          onChange={(e) => handleInputChange("impactEvaluation", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="si_completa">Sí — completa y documentada</option>
                          <option value="si_parcial">Sí — parcial o en proceso</option>
                          <option value="no_pendiente">No — pendiente</option>
                          <option value="no_requiere">No requiere (bajo riesgo documentado)</option>
                        </select>
                        <Link href="/evaluacion-impacto-algoritmico" target="_blank" className="text-sm text-blue-600 hover:underline">
                          Ir al módulo
                        </Link>
                      </div>
                      <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §8.4 | NIST AI RMF — Map 5.2</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dpiaEvaluation">
                        <span className="text-orange-600">*</span> ¿El sistema ha sido objeto de una Evaluación de Impacto en la Protección de Datos (EIPD/DPIA)?
                      </Label>
                      <select
                        id="dpiaEvaluation"
                        value={formData.dpiaEvaluation}
                        onChange={(e) => handleInputChange("dpiaEvaluation", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si_completa">Sí — completa y documentada</option>
                        <option value="si_parcial">Sí — parcial o en proceso</option>
                        <option value="no_pendiente">No — pendiente</option>
                        <option value="no_requiere">No requiere (no trata datos personales)</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: LFPDPPP Art. 18 | ISO/IEC 29134</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ipImpactEvaluation">¿El sistema ha sido objeto de una Evaluación de Impacto en Propiedad Intelectual?</Label>
                      <select
                        id="ipImpactEvaluation"
                        value={formData.ipImpactEvaluation}
                        onChange={(e) => handleInputChange("ipImpactEvaluation", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si_completa">Sí — completa y documentada</option>
                        <option value="si_parcial">Sí — parcial</option>
                        <option value="no">No</option>
                        <option value="no_requiere">No requiere</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §6.1.2</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#0f3b66] border-b pb-1">Riesgos específicos identificados</h4>

                    <div className="space-y-2">
                      <Label>
                        <span className="text-orange-600">*</span> Principales riesgos identificados para el sistema (seleccione todos los que apliquen)
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border border-gray-200 rounded-md">
                        {[
                          "Privacidad y protección de datos personales",
                          "Sesgo algorítmico y discriminación",
                          "Falta de transparencia o explicabilidad",
                          "Ciberseguridad y vulnerabilidades técnicas",
                          "Dependencia tecnológica o de proveedor (lock-in)",
                          "Reputacional / daño a la imagen corporativa",
                          "Legal / regulatorio / incumplimiento normativo",
                          "Derechos humanos (dignidad, autonomía, privacidad)",
                          "Seguridad física (sistemas en entornos críticos)",
                          "Errores de modelo / alucinaciones (IA generativa)",
                          "Impacto medioambiental / huella de carbono computacional",
                          "Ningún riesgo significativo identificado",
                        ].map((risk) => (
                          <div key={risk} className="flex items-start space-x-2">
                            <Checkbox
                              id={`risk-${risk}`}
                              checked={formData.identifiedRisks.includes(risk)}
                              onCheckedChange={(checked) => handleCheckboxChange("identifiedRisks", risk, !!checked)}
                            />
                            <Label htmlFor={`risk-${risk}`} className="font-normal leading-5">{risk}</Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">Referencia: NIST AI RMF — Map 5.1 | ISO/IEC 42001 §6.1</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="biasDiscrimination">
                        <span className="text-orange-600">*</span> ¿El sistema podría generar sesgos, discriminación o tratamiento diferenciado injusto hacia personas o grupos?
                      </Label>
                      <select
                        id="biasDiscrimination"
                        value={formData.biasDiscrimination}
                        onChange={(e) => handleInputChange("biasDiscrimination", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si_con_mitigacion">Sí — se han identificado sesgos y existen medidas de mitigación</option>
                        <option value="si_sin_mitigacion">Sí — se han identificado sesgos sin mitigación implementada</option>
                        <option value="no_descartado">No — evaluado y descartado</option>
                        <option value="en_evaluacion">En evaluación</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: EU AI Act Art. 10.2 | NIST AI RMF — Measure 2.5 | OCDE Principio 1.2</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="legalImpact">
                        <span className="text-orange-600">*</span> ¿El sistema puede tener un impacto legal significativo sobre las personas?
                      </Label>
                      <p className="text-xs text-slate-500">
                        Guía: Ejemplos: afectar acceso a crédito, empleo, educación, servicios públicos, cobertura de seguro, administración de justicia.
                      </p>
                      <select
                        id="legalImpact"
                        value={formData.legalImpact}
                        onChange={(e) => handleInputChange("legalImpact", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                        <option value="en_evaluacion">En evaluación</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: EU AI Act Anexo III | LFPDPPP Art. 16</p>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        <span className="text-orange-600">*</span> ¿El sistema opera en sectores de alto impacto social o de infraestructura crítica?
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border border-gray-200 rounded-md">
                        {[
                          "Salud / Medicina / Diagnóstico",
                          "Justicia / Administración judicial",
                          "Educación / Evaluación académica",
                          "Seguridad pública / Vigilancia",
                          "Servicios financieros / Crediticios",
                          "Infraestructura crítica (energía, agua, transporte)",
                          "Empleo / Selección de personal",
                          "Migración / Asilo / Control fronterizo",
                          "Ninguno de los anteriores",
                        ].map((sector) => (
                          <div key={sector} className="flex items-start space-x-2">
                            <Checkbox
                              id={`critical-${sector}`}
                              checked={formData.criticalSectorsList?.includes(sector) || false}
                              onCheckedChange={(checked) => {
                                const current = formData.criticalSectorsList || []
                                handleInputChange(
                                  "criticalSectorsList",
                                  checked ? [...current, sector] : current.filter((item) => item !== sector),
                                )
                              }}
                            />
                            <Label htmlFor={`critical-${sector}`} className="font-normal leading-5">{sector}</Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">Referencia: EU AI Act Arts. 6 y 7 | Anexo III</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="globalRiskLevel">
                        <span className="text-orange-600">*</span> Nivel de riesgo global evaluado para el sistema
                      </Label>
                      <select
                        id="globalRiskLevel"
                        value={formData.globalRiskLevel}
                        onChange={(e) => handleInputChange("globalRiskLevel", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="inaceptable">Inaceptable — uso prohibido (EU AI Act Art. 5)</option>
                        <option value="alto">Alto — sujeto a requisitos obligatorios de conformidad</option>
                        <option value="limitado">Limitado — obligaciones de transparencia aplicables</option>
                        <option value="minimo">Mínimo o ningún riesgo identificado</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: EU AI Act Arts. 5, 6, 50 | ISO/IEC 42001 §6.1</p>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        <span className="text-orange-600">*</span> Medidas adoptadas para mitigar los riesgos identificados (seleccione todas las que apliquen)
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border border-gray-200 rounded-md">
                        {[
                          "Evaluación de Impacto Algorítmico (EIA)",
                          "Evaluación de Impacto en Protección de Datos (EIPD/DPIA)",
                          "Evaluación ética independiente",
                          "Supervisión humana en el ciclo de decisión",
                          "Controles de acceso y autenticación",
                          "Cifrado de datos en tránsito y en reposo",
                          "Anonimización o seudonimización",
                          "Auditorías técnicas periódicas",
                          "Pruebas de sesgo y equidad algorítmica",
                          "Monitoreo continuo del desempeño del modelo",
                          "Procedimientos de respuesta ante incidentes de IA",
                          "Ninguna implementada",
                        ].map((option) => {
                          const id = `mitigation-${option.toLowerCase().replace(/\s+/g, "-")}`
                          return (
                            <div key={option} className="flex items-start space-x-2">
                              <Checkbox
                                id={id}
                                checked={formData.riskMitigationMeasures.includes(option)}
                                onCheckedChange={(checked) => handleCheckboxChange("riskMitigationMeasures", option, !!checked)}
                              />
                              <Label htmlFor={id} className="font-normal leading-5">{option}</Label>
                            </div>
                          )
                        })}
                      </div>
                      <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §8.5 | NIST AI RMF — Manage 2.2</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#0f3b66] border-b pb-1">Complementario de gobernanza y control</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="humanRightsImpact">¿Impacto sobre derechos humanos?</Label>
                        <select
                          id="humanRightsImpact"
                          value={formData.humanRightsImpact}
                          onChange={(e) => handleInputChange("humanRightsImpact", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="si">Sí</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="replacesHumanDecisions">¿La IA toma decisiones sin intervención humana?</Label>
                        <select
                          id="replacesHumanDecisions"
                          value={formData.replacesHumanDecisions}
                          onChange={(e) => handleInputChange("replacesHumanDecisions", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="si">Sí</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      {formData.replacesHumanDecisions === "si" && (
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="replacesHumanDecisionsPhase">Describa la fase o momento donde ocurren</Label>
                          <Input
                            id="replacesHumanDecisionsPhase"
                            value={formData.replacesHumanDecisionsPhase || ""}
                            onChange={(e) => handleInputChange("replacesHumanDecisionsPhase", e.target.value)}
                            placeholder="Fase o momento"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="explainable">¿Es explicable su funcionamiento?</Label>
                        <select
                          id="explainable"
                          value={formData.explainable}
                          onChange={(e) => handleInputChange("explainable", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="si">Sí</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="userInformed">¿Se informa a los usuarios que interactúan con IA?</Label>
                        <select
                          id="userInformed"
                          value={formData.userInformed}
                          onChange={(e) => handleInputChange("userInformed", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="si-claramente">Sí claramente</option>
                          <option value="no">No</option>
                          <option value="no-aplica">No aplica</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="informationAssetRegistered">¿Está registrado como activo de información?</Label>
                        <select
                          id="informationAssetRegistered"
                          value={formData.informationAssetRegistered}
                          onChange={(e) => handleInputChange("informationAssetRegistered", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="si-completo">Sí completo</option>
                          <option value="no">No</option>
                          <option value="no-aplica">No aplica</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="technicalDocumentation">¿Existe documentación técnica?</Label>
                        <select
                          id="technicalDocumentation"
                          value={formData.technicalDocumentation}
                          onChange={(e) => handleInputChange("technicalDocumentation", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="si">Sí</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="internalDocumentation">¿Existe documentación interna?</Label>
                        <select
                          id="internalDocumentation"
                          value={formData.internalDocumentation}
                          onChange={(e) => handleInputChange("internalDocumentation", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="si">Sí</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="periodicAudit">¿Se realizan auditorías periódicas?</Label>
                        <select
                          id="periodicAudit"
                          value={formData.periodicAudit}
                          onChange={(e) => handleInputChange("periodicAudit", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="si">Sí</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Sección F: Gobernanza, control y supervisión humana */}
              <Card>
                <CardHeader>
                  <CardTitle>F. Gobernanza, control y supervisión humana</CardTitle>
                  <CardDescription>
                    Define los mecanismos de control, supervisión y rendición de cuentas del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#0f3b66] border-b pb-1">Supervisión y control interno</h4>

                    <div className="space-y-2">
                      <Label htmlFor="reviewResponsible">
                        <span className="text-orange-600">*</span> ¿Quién revisa los resultados y el comportamiento del sistema de forma periódica?
                      </Label>
                      <Textarea
                        id="reviewResponsible"
                        value={formData.reviewResponsible}
                        onChange={(e) => handleInputChange("reviewResponsible", e.target.value)}
                        placeholder="Nombre, cargo y área del responsable de revisión"
                        rows={3}
                      />
                      <p className="text-xs text-slate-500">Guía: Indique nombre, cargo y área del responsable de revisión.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reviewFrequency">
                        <span className="text-orange-600">*</span> Frecuencia de revisión periódica del sistema y sus resultados
                      </Label>
                      <select
                        id="reviewFrequency"
                        value={formData.reviewFrequency}
                        onChange={(e) => handleInputChange("reviewFrequency", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="continua">Continua (monitoreo en tiempo real)</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensual">Mensual</option>
                        <option value="trimestral">Trimestral</option>
                        <option value="semestral">Semestral</option>
                        <option value="anual">Anual</option>
                        <option value="adhoc">Ad hoc / Bajo demanda</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §9.1 | NIST AI RMF — Manage 4.1</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="humanOversightLevel">
                        <span className="text-orange-600">*</span> ¿Existe supervisión humana significativa (*meaningful human oversight*) en las decisiones del sistema?
                      </Label>
                      <select
                        id="humanOversightLevel"
                        value={formData.humanOversightLevel}
                        onChange={(e) => handleInputChange("humanOversightLevel", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si_total">Sí — el humano puede revisar, cuestionar e invalidar cualquier decisión</option>
                        <option value="si_parcial">Sí — supervisión parcial o en casos de alto impacto únicamente</option>
                        <option value="no_autonomo">No — el sistema opera de forma autónoma sin revisión humana sistemática</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: EU AI Act Art. 14 | NIST AI RMF — Govern 6.1 | OCDE Principio 1.4</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="suspensionProcess">
                        <span className="text-orange-600">*</span> ¿Existe un proceso documentado para detener o suspender el sistema ante fallos, comportamientos anómalos o riesgos emergentes?
                      </Label>
                      <select
                        id="suspensionProcess"
                        value={formData.suspensionProcess}
                        onChange={(e) => handleInputChange("suspensionProcess", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si_formal">Sí — protocolo formal y probado</option>
                        <option value="si_informal">Sí — proceso informal sin documentar</option>
                        <option value="no">No</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: EU AI Act Art. 9.7 | ISO/IEC 42001 §8.7</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetInventoryStatus">
                        <span className="text-orange-600">*</span> ¿Está el sistema registrado en el inventario o registro de activos de información de la organización?
                      </Label>
                      <select
                        id="assetInventoryStatus"
                        value={formData.assetInventoryStatus}
                        onChange={(e) => handleInputChange("assetInventoryStatus", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si_completo">Sí — registro completo</option>
                        <option value="si_parcial">Sí — registro parcial</option>
                        <option value="no">No</option>
                        <option value="no_aplica">No aplica</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: ISO/IEC 27001 §A.5.9 | ISO/IEC 42001 §7.5</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="technicalAuditStatus">
                        <span className="text-orange-600">*</span> ¿Se han implementado auditorías técnicas o de cumplimiento del sistema?
                      </Label>
                      <select
                        id="technicalAuditStatus"
                        value={formData.technicalAuditStatus}
                        onChange={(e) => handleInputChange("technicalAuditStatus", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si_formales">Sí — auditorías periódicas formales (internas o externas)</option>
                        <option value="si_internas_informales">Sí — revisiones internas informales</option>
                        <option value="no_pendiente">No — pendiente</option>
                        <option value="no_requiere">No requiere</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §9.2 | EU AI Act Art. 17</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#0f3b66] border-b pb-1">Comité de Gobernanza de IA</h4>

                    <div className="space-y-2">
                      <Label htmlFor="committeeReviewStatus">
                        <span className="text-orange-600">*</span> ¿El sistema ha sido presentado o revisado por el Comité de Gobernanza de IA de la organización?
                      </Label>
                      <select
                        id="committeeReviewStatus"
                        value={formData.committeeReviewStatus}
                        onChange={(e) => handleInputChange("committeeReviewStatus", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si_aprobado">Sí — revisado y aprobado por el Comité</option>
                        <option value="si_pendiente">Sí — revisado, pendiente de resolución</option>
                        <option value="no_pendiente_presentar">No — pendiente de presentar al Comité</option>
                        <option value="sin_comite">La organización no cuenta con Comité de Gobernanza de IA</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §5.1 | NIST AI RMF — Govern 4.1</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="committeeReportingDuty">
                        <span className="text-orange-600">*</span> Obligación de reporte periódico al Comité de Gobernanza de IA
                      </Label>
                      <select
                        id="committeeReportingDuty"
                        value={formData.committeeReportingDuty}
                        onChange={(e) => handleInputChange("committeeReportingDuty", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="trimestral">Sí — trimestral</option>
                        <option value="semestral">Sí — semestral</option>
                        <option value="anual">Sí — anual</option>
                        <option value="incidentes_cambios">Reporte solo ante incidentes o cambios significativos</option>
                        <option value="no_definido">No definido</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §9.3 | NIST AI RMF — Govern 4.2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sección G: Transparencia, explicabilidad y derechos */}
              <Card>
                <CardHeader>
                  <CardTitle>G. Transparencia, explicabilidad y derechos</CardTitle>
                  <CardDescription>
                    Evalúa si el sistema opera de forma comprensible y respeta los derechos de las personas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userInformed">
                      <span className="text-orange-600">*</span> ¿Los usuarios que interactúan con el sistema son informados de que están siendo atendidos o evaluados por un sistema de IA?
                    </Label>
                    <select
                      id="userInformed"
                      value={formData.userInformed}
                      onChange={(e) => handleInputChange("userInformed", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="si_clara_previa">Sí — de forma clara, prominente y previa a la interacción</option>
                      <option value="si_generica">Sí — de forma genérica (ej. en aviso de privacidad o términos de servicio)</option>
                      <option value="parcialmente">Parcialmente — en algunos canales o contextos</option>
                      <option value="no">No</option>
                    </select>
                    <p className="text-xs text-slate-500">Referencia: EU AI Act Art. 50 | OCDE Principio 1.3 | LFPDPPP Art. 15</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="explainable">
                      <span className="text-orange-600">*</span> ¿El funcionamiento del sistema es explicable para las personas afectadas por sus decisiones?
                    </Label>
                    <select
                      id="explainable"
                      value={formData.explainable}
                      onChange={(e) => handleInputChange("explainable", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="si_claras">Sí — el sistema ofrece explicaciones claras y comprensibles</option>
                      <option value="parcial_tecnica">Parcialmente — explicaciones técnicas disponibles pero no accesibles al usuario</option>
                      <option value="no_caja_negra">No — sistema de caja negra sin mecanismos de explicación</option>
                    </select>
                    <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §8.6 | NIST AI RMF — Measure 2.6 | OCDE Principio 1.3</p>
                  </div>

                  <div className="space-y-2">
                    <Label>¿Se han implementado técnicas de IA explicable (XAI) en el sistema?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border border-gray-200 rounded-md">
                      {[
                        "LIME (Local Interpretable Model-agnostic Explanations)",
                        "SHAP (SHapley Additive exPlanations)",
                        "Atención / Mapas de relevancia (Attention maps)",
                        "Modelos interpretables por diseño (árboles de decisión, regresión lineal)",
                        "Explicaciones en lenguaje natural generadas por el sistema",
                        "Ninguna",
                        "No aplica",
                      ].map((tech) => (
                        <div key={tech} className="flex items-start space-x-2">
                          <Checkbox
                            id={`xai-${tech}`}
                            checked={formData.xaiTechniques?.includes(tech) || false}
                            onCheckedChange={(checked) => {
                              const current = formData.xaiTechniques || []
                              handleInputChange(
                                "xaiTechniques",
                                checked ? [...current, tech] : current.filter((item) => item !== tech),
                              )
                            }}
                          />
                          <Label htmlFor={`xai-${tech}`} className="font-normal leading-5">{tech}</Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §8.6 | NIST AI RMF — Measure 2.6</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complaintsChannel">
                      <span className="text-orange-600">*</span> ¿Existe un canal formal de reclamaciones, impugnación o revisión para personas afectadas por las decisiones del sistema?
                    </Label>
                    <select
                      id="complaintsChannel"
                      value={formData.complaintsChannel}
                      onChange={(e) => handleInputChange("complaintsChannel", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="si_especifico_ia">Sí — canal específico para decisiones de IA</option>
                      <option value="si_general">Sí — canal general de quejas y reclamaciones</option>
                      <option value="no_pendiente">No — pendiente de implementar</option>
                    </select>
                    <p className="text-xs text-slate-500">Referencia: EU AI Act Art. 86 | LFPDPPP Art. 28 | OCDE Principio 1.5</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arcoRights">
                      <span className="text-orange-600">*</span> ¿Están previstos mecanismos para que los titulares ejerzan sus derechos ARCO / ARSRP en el contexto de este sistema de IA?
                    </Label>
                    <select
                      id="arcoRights"
                      value={formData.arcoRights}
                      onChange={(e) => handleInputChange("arcoRights", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="si_completos">Sí — mecanismos completos y documentados</option>
                      <option value="parcialmente">Parcialmente implementados</option>
                      <option value="no_pendiente">No — pendiente de definir</option>
                      <option value="no_aplica">No aplica (no trata datos personales)</option>
                    </select>
                    <p className="text-xs text-slate-500">Referencia: LFPDPPP Arts. 22-27 | ISO/IEC 42001 §8.6</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publicDocumentation">¿Existe documentación accesible al público o a los interesados sobre el sistema de IA?</Label>
                    <select
                      id="publicDocumentation"
                      value={formData.publicDocumentation}
                      onChange={(e) => handleInputChange("publicDocumentation", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="si_publica">Sí — documentación pública disponible (sitio web, registro público)</option>
                      <option value="si_solicitud">Sí — disponible bajo solicitud</option>
                      <option value="no_interna">No — documentación estrictamente interna</option>
                      <option value="no_existe">No existe documentación</option>
                    </select>
                    <p className="text-xs text-slate-500">Referencia: EU AI Act Art. 13 | ISO/IEC 42001 §7.5</p>
                  </div>
                </CardContent>
              </Card>

              {/* Sección H: Seguridad técnica y gestión de proveedores */}
              <Card>
                <CardHeader>
                  <CardTitle>H. Seguridad técnica y gestión de proveedores</CardTitle>
                  <CardDescription>Verifica las salvaguardas técnicas del sistema y la cadena de suministro de IA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#0f3b66] border-b pb-1">H.1 Medidas de seguridad técnica</h4>
                    <div className="space-y-2">
                      <Label><span className="text-orange-600">*</span> Medidas de seguridad técnica implementadas para el sistema (seleccione todas las que apliquen)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border border-gray-200 rounded-md">
                        {[
                          "Cifrado de datos en tránsito (TLS/SSL)",
                          "Cifrado de datos en reposo",
                          "Control de acceso basado en roles (RBAC)",
                          "Autenticación multifactor (MFA)",
                          "Anonimización o seudonimización de datos",
                          "Registros de auditoría y trazabilidad (logs)",
                          "Pruebas de penetración (pentesting)",
                          "Monitoreo continuo de seguridad",
                          "Gestión de vulnerabilidades y parches",
                          "Segmentación de red",
                          "Respaldo y recuperación ante desastres (BCP/DRP)",
                        ].map((m) => (
                          <div key={m} className="flex items-start space-x-2">
                            <Checkbox
                              id={`sec-${m}`}
                              checked={formData.securityTechnicalMeasures?.includes(m) || false}
                              onCheckedChange={(checked) => {
                                const current = formData.securityTechnicalMeasures || []
                                handleInputChange("securityTechnicalMeasures", checked ? [...current, m] : current.filter((i) => i !== m))
                              }}
                            />
                            <Label htmlFor={`sec-${m}`} className="font-normal leading-5">{m}</Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">Referencia: ISO/IEC 27001 | ISO/IEC 42001 §8.7 | NIST AI RMF — Manage 2.4</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incidentResponsePlan"><span className="text-orange-600">*</span> ¿Existe un plan de respuesta ante incidentes de seguridad específico para este sistema de IA?</Label>
                      <select id="incidentResponsePlan" value={formData.incidentResponsePlan} onChange={(e) => handleInputChange("incidentResponsePlan", e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Seleccione una opción</option>
                        <option value="si_especifico">Sí — plan específico para IA documentado y probado</option>
                        <option value="si_general">Sí — cubierto por el plan general de respuesta a incidentes</option>
                        <option value="no_pendiente">No — pendiente</option>
                        <option value="no_aplica">No aplica</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §8.7 | EU AI Act Art. 9</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="auditLogsMonitoring"><span className="text-orange-600">*</span> ¿Se registran y monitorean los eventos, predicciones y decisiones del sistema (logs de auditoría)?</Label>
                      <select id="auditLogsMonitoring" value={formData.auditLogsMonitoring} onChange={(e) => handleInputChange("auditLogsMonitoring", e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Seleccione una opción</option>
                        <option value="si_completo">Sí — registro completo y automatizado con retención definida</option>
                        <option value="parcial">Parcialmente</option>
                        <option value="no">No</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: EU AI Act Art. 12 | ISO/IEC 42001 §9.1</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#0f3b66] border-b pb-1">H.2 Proveedores y cadena de suministro de IA</h4>
                    <div className="space-y-2">
                      <Label htmlFor="externalProviderInvolvement"><span className="text-orange-600">*</span> ¿Interviene algún proveedor externo en el ciclo de vida del sistema de IA?</Label>
                      <select id="externalProviderInvolvement" value={formData.externalProviderInvolvement} onChange={(e) => handleInputChange("externalProviderInvolvement", e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Seleccione una opción</option>
                        <option value="si">Sí</option>
                        <option value="no_interno">No — exclusivamente desarrollo y operación internos</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="providerRiskAssessment">¿Se ha realizado una evaluación de riesgos del proveedor de IA conforme a criterios de gobernanza?</Label>
                      <select id="providerRiskAssessment" value={formData.providerRiskAssessment} onChange={(e) => handleInputChange("providerRiskAssessment", e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Seleccione una opción</option>
                        <option value="si_completa">Sí — evaluación completa y documentada</option>
                        <option value="si_parcial">Sí — evaluación parcial</option>
                        <option value="no_pendiente">No — pendiente</option>
                        <option value="no_aplica">No aplica</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §8.6 | NIST AI RMF — Govern 6.2</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="providerContractStatus"><span className="text-orange-600">*</span> ¿Existe un contrato específico con el proveedor que regule las obligaciones en materia de IA y datos personales?</Label>
                      <select id="providerContractStatus" value={formData.providerContractStatus} onChange={(e) => handleInputChange("providerContractStatus", e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Seleccione una opción</option>
                        <option value="si_especifico_dpa">Sí — contrato específico con cláusulas de IA y DPA/contrato de encargado</option>
                        <option value="si_general">Sí — contrato general sin cláusulas específicas de IA</option>
                        <option value="no_pendiente">No — pendiente</option>
                        <option value="no_aplica">No aplica</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: LFPDPPP Art. 37 | EU AI Act Art. 25 | ISO/IEC 42001 §8.6</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="internationalTransferStatus"><span className="text-orange-600">*</span> ¿El sistema o sus datos involucran transferencias internacionales de datos personales?</Label>
                      <select id="internationalTransferStatus" value={formData.internationalTransferStatus} onChange={(e) => handleInputChange("internationalTransferStatus", e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Seleccione una opción</option>
                        <option value="si_con_mecanismo">Sí — con mecanismo de transferencia documentado</option>
                        <option value="si_sin_mecanismo">Sí — sin mecanismo de transferencia definido (riesgo regulatorio)</option>
                        <option value="no">No</option>
                        <option value="en_evaluacion">En evaluación</option>
                      </select>
                      <p className="text-xs text-slate-500">Referencia: LFPDPPP Arts. 36-37 | EU AI Act Art. 10 | RGPD Arts. 44-49</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Mecanismo de transferencia internacional aplicable (si corresponde)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border border-gray-200 rounded-md">
                        {[
                          "Cláusulas contractuales tipo (CCT / SCC)",
                          "Decisión de adecuación de la autoridad competente",
                          "Normas corporativas vinculantes (BCR)",
                          "Consentimiento explícito del titular",
                          "Ninguno implementado",
                          "No aplica",
                        ].map((m) => (
                          <div key={m} className="flex items-start space-x-2">
                            <Checkbox id={`tm-${m}`} checked={formData.internationalTransferMechanisms?.includes(m) || false} onCheckedChange={(checked) => {
                              const current = formData.internationalTransferMechanisms || []
                              handleInputChange("internationalTransferMechanisms", checked ? [...current, m] : current.filter((i) => i !== m))
                            }} />
                            <Label htmlFor={`tm-${m}`} className="font-normal leading-5">{m}</Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">Referencia: LFPDPPP Art. 36 | RGPD Arts. 46-47</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sección I: Concientización, capacitación y cultura */}
              <Card>
                <CardHeader>
                  <CardTitle>I. Concientización, capacitación y cultura</CardTitle>
                  <CardDescription>Evalúa el nivel de preparación y formación del personal que utiliza o supervisa el sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="trainingStatus"><span className="text-orange-600">*</span> ¿El personal que opera, supervisa o toma decisiones basadas en este sistema ha recibido capacitación específica en IA responsable?</Label>
                    <select id="trainingStatus" value={formData.trainingStatus} onChange={(e) => handleInputChange("trainingStatus", e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="">Seleccione una opción</option>
                      <option value="si_formal">Sí — capacitación formal y documentada</option>
                      <option value="si_informal">Sí — capacitación informal o autodidacta</option>
                      <option value="no_pendiente">No — pendiente de implementar</option>
                    </select>
                    <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §7.2 | NIST AI RMF — Govern 4.1</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Temas cubiertos en la capacitación del personal (seleccione todos los que apliquen)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border border-gray-200 rounded-md">
                      {[
                        "Fundamentos de IA y machine learning",
                        "Ética en IA y principios de IA responsable",
                        "Riesgos específicos del sistema (sesgos, privacidad, seguridad)",
                        "Marco legal aplicable (EU AI Act, normatividad nacional)",
                        "Protección de datos personales en contextos de IA",
                        "Interpretación y supervisión de los resultados del sistema",
                        "Procedimientos ante fallos, anomalías o incidentes",
                        "Derechos de los titulares y mecanismos de reclamación",
                      ].map((topic) => (
                        <div key={topic} className="flex items-start space-x-2">
                          <Checkbox id={`topic-${topic}`} checked={formData.trainingTopics?.includes(topic) || false} onCheckedChange={(checked) => {
                            const current = formData.trainingTopics || []
                            handleInputChange("trainingTopics", checked ? [...current, topic] : current.filter((i) => i !== topic))
                          }} />
                          <Label htmlFor={`topic-${topic}`} className="font-normal leading-5">{topic}</Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §7.3</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trainingFrequency">Frecuencia de actualización de la capacitación del personal</Label>
                    <select id="trainingFrequency" value={formData.trainingFrequency} onChange={(e) => handleInputChange("trainingFrequency", e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="">Seleccione una opción</option>
                      <option value="anual_o_mas">Anual o más frecuente</option>
                      <option value="ante_cambios">Ante cambios regulatorios o del sistema</option>
                      <option value="solo_inicial">Solo capacitación inicial (no se actualiza)</option>
                      <option value="no_impartida">No se ha impartido capacitación</option>
                    </select>
                    <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §7.2</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsibleAIPolicy"><span className="text-orange-600">*</span> ¿La organización cuenta con una política interna de uso responsable de IA que aplique a este sistema?</Label>
                    <select id="responsibleAIPolicy" value={formData.responsibleAIPolicy} onChange={(e) => handleInputChange("responsibleAIPolicy", e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="">Seleccione una opción</option>
                      <option value="si_aprobada">Sí — política aprobada, documentada y comunicada</option>
                      <option value="en_desarrollo">En desarrollo</option>
                      <option value="no_pendiente">No — pendiente</option>
                      <option value="no_aplica">No aplica</option>
                    </select>
                    <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §5.2 | NIST AI RMF — Govern 1.2</p>
                  </div>
                </CardContent>
              </Card>

              {/* Sección J: Indicadores de cumplimiento y mejora continua */}
              <Card>
                <CardHeader>
                  <CardTitle>J. Indicadores de cumplimiento y mejora continua</CardTitle>
                  <CardDescription>Define métricas para el seguimiento del desempeño ético, legal y técnico del sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="complianceMetricsDefined"><span className="text-orange-600">*</span> ¿Se han definido métricas de cumplimiento normativo y desempeño ético para este sistema?</Label>
                    <select id="complianceMetricsDefined" value={formData.complianceMetricsDefined} onChange={(e) => handleInputChange("complianceMetricsDefined", e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="">Seleccione una opción</option>
                      <option value="si_formales">Sí — métricas formales definidas, medidas y reportadas</option>
                      <option value="si_informales">Sí — métricas informales o parciales</option>
                      <option value="no_pendiente">No — pendiente de definir</option>
                    </select>
                    <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §9.1 | NIST AI RMF — Measure 4.1</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Métricas de seguimiento definidas para el sistema (seleccione todas las que apliquen)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border border-gray-200 rounded-md">
                      {[
                        "Precisión / exactitud del modelo (accuracy, F1, AUC)",
                        "Tasa de falsos positivos / negativos",
                        "Métricas de equidad y sesgo (fairness metrics)",
                        "Tiempo de respuesta y disponibilidad del sistema",
                        "Número de reclamaciones o impugnaciones recibidas",
                        "Tasa de resolución de solicitudes ARCO/ARSRP",
                        "Número de incidentes de seguridad relacionados con el sistema",
                        "Nivel de satisfacción de usuarios",
                        "Indicadores de impacto en derechos humanos",
                        "Huella de carbono / impacto ambiental computacional",
                      ].map((m) => (
                        <div key={m} className="flex items-start space-x-2">
                          <Checkbox id={`metric-${m}`} checked={formData.complianceMetrics?.includes(m) || false} onCheckedChange={(checked) => {
                            const current = formData.complianceMetrics || []
                            handleInputChange("complianceMetrics", checked ? [...current, m] : current.filter((i) => i !== m))
                          }} />
                          <Label htmlFor={`metric-${m}`} className="font-normal leading-5">{m}</Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §9.1 | NIST AI RMF — Measure 1.1</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="continuousImprovementProcess"><span className="text-orange-600">*</span> ¿El sistema cuenta con un proceso de mejora continua documentado?</Label>
                    <select id="continuousImprovementProcess" value={formData.continuousImprovementProcess} onChange={(e) => handleInputChange("continuousImprovementProcess", e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="">Seleccione una opción</option>
                      <option value="si_pdca">Sí — ciclo formal de mejora continua (PDCA u equivalente)</option>
                      <option value="parcial_reactiva">Parcialmente — mejoras reactivas ante incidentes</option>
                      <option value="no">No</option>
                    </select>
                    <p className="text-xs text-slate-500">Referencia: ISO/IEC 42001 §10.2 | NIST AI RMF — Manage 4.2</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="incidentRegistryStatus"><span className="text-orange-600">*</span> ¿Existe un registro de incidentes, errores o comportamientos anómalos del sistema?</Label>
                    <select id="incidentRegistryStatus" value={formData.incidentRegistryStatus} onChange={(e) => handleInputChange("incidentRegistryStatus", e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="">Seleccione una opción</option>
                      <option value="si_formal">Sí — registro formal y revisado periódicamente</option>
                      <option value="si_informal">Sí — registro informal</option>
                      <option value="no">No</option>
                    </select>
                    <p className="text-xs text-slate-500">Referencia: EU AI Act Art. 73 | ISO/IEC 42001 §10.1</p>
                  </div>
                </CardContent>
              </Card>

              {/* Sección K: Observaciones, compromisos y firmas */}
              <Card>
                <CardHeader>
                  <CardTitle>K. Observaciones, compromisos y firmas</CardTitle>
                  <CardDescription>Espacio para comentarios adicionales y validación formal del registro</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="additionalObservations">Observaciones adicionales relevantes para el registro de este sistema</Label>
                    <Textarea id="additionalObservations" value={formData.additionalObservations} onChange={(e) => handleInputChange("additionalObservations", e.target.value)} rows={3} placeholder="Incluya información adicional relevante no capturada previamente" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reviewCommitments">Compromisos de revisión y actualización</Label>
                    <Textarea id="reviewCommitments" value={formData.reviewCommitments} onChange={(e) => handleInputChange("reviewCommitments", e.target.value)} rows={3} placeholder="Indique compromisos específicos para próximos ciclos de revisión" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validatorResponsibleSignature"><span className="text-orange-600">*</span> Nombre, cargo y firma del responsable que valida el registro</Label>
                    <Textarea id="validatorResponsibleSignature" value={formData.validatorResponsibleSignature} onChange={(e) => handleInputChange("validatorResponsibleSignature", e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="governanceResponsibleSignature"><span className="text-orange-600">*</span> Nombre, cargo y firma del responsable del área de Gobernanza de IA / DPO / Compliance</Label>
                    <Textarea id="governanceResponsibleSignature" value={formData.governanceResponsibleSignature} onChange={(e) => handleInputChange("governanceResponsibleSignature", e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validationDate"><span className="text-orange-600">*</span> Fecha de validación del registro</Label>
                    <Input id="validationDate" type="date" value={formData.validationDate} onChange={(e) => handleInputChange("validationDate", e.target.value)} />
                  </div>
                </CardContent>
              </Card>

              {/* Sección L: Registro de responsabilidades internas (RACI) */}
              <Card>
                <CardHeader>
                  <CardTitle>L. Registro de responsabilidades internas (RACI)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">A. Identificación</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="raciArea">1. Área u órgano responsable principal del sistema de IA</Label>
                        <select
                          id="raciArea"
                          value={formData.raciArea}
                          onChange={(e) => handleInputChange("raciArea", e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="comite">Comité de Gobernanza de IA</option>
                          <option value="direccion">Dirección General</option>
                          <option value="juridico">Jurídico/Privacidad</option>
                          <option value="otro">Otro</option>
                          <option value="producto">Producto/Operaciones</option>
                          <option value="seguridad">Seguridad</option>
                          <option value="tecnologia">Tecnología/IT</option>
                        </select>
                        {formData.raciArea === "otro" && (
                          <Input
                            id="raciAreaOther"
                            placeholder="Especifique el área u órgano"
                            value={formData.raciAreaOther || ""}
                            onChange={(e) => handleInputChange("raciAreaOther", e.target.value)}
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>2. Propietario del sistema (A)</Label>
                        <Input
                          placeholder="Nombre"
                          value={formData.raciOwnerName}
                          onChange={(e) => handleInputChange("raciOwnerName", e.target.value)}
                        />
                        <Input
                          placeholder="Cargo"
                          value={formData.raciOwnerRole}
                          onChange={(e) => handleInputChange("raciOwnerRole", e.target.value)}
                        />
                        <Input
                          placeholder="Correo"
                          value={formData.raciOwnerEmail}
                          onChange={(e) => handleInputChange("raciOwnerEmail", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>3. Responsable operativo (R)</Label>
                        <Input
                          placeholder="Nombre"
                          value={formData.raciOperationalName}
                          onChange={(e) => handleInputChange("raciOperationalName", e.target.value)}
                        />
                        <Input
                          placeholder="Cargo"
                          value={formData.raciOperationalRole}
                          onChange={(e) => handleInputChange("raciOperationalRole", e.target.value)}
                        />
                        <Input
                          placeholder="Correo"
                          value={formData.raciOperationalEmail}
                          onChange={(e) => handleInputChange("raciOperationalEmail", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">B. Roles RACI por función clave</h4>
                    {[
                      {
                        key: "technical",
                        label:
                          "4. Supervisión técnica (desarrollo, mantenimiento, performance del modelo)",
                        R: "raciTechnicalR",
                        A: "raciTechnicalA",
                        C: "raciTechnicalC",
                        I: "raciTechnicalI",
                        placeholderR: "IT / Científico de datos / Proveedor externo",
                        placeholderA: "Director de Tecnología / Propietario del sistema",
                        placeholderC: "Comité de IA / Seguridad",
                        placeholderI: "Alta dirección / Usuarios internos",
                      },
                      {
                        key: "legal",
                        label: "5. Supervisión legal/regulatoria",
                        R: "raciLegalR",
                        A: "raciLegalA",
                        C: "raciLegalC",
                        I: "raciLegalI",
                        placeholderR: "Área Legal / Compliance",
                        placeholderA: "Oficial de Cumplimiento / Comité de IA",
                        placeholderC: "DPO / Asesor externo",
                        placeholderI: "Alta Dirección",
                      },
                      {
                        key: "privacy",
                        label: "6. Protección de datos y privacidad",
                        R: "raciPrivacyR",
                        A: "raciPrivacyA",
                        C: "raciPrivacyC",
                        I: "raciPrivacyI",
                        placeholderR: "DPO / Jurídico",
                        placeholderA: "Comité de IA",
                        placeholderC: "Seguridad IT",
                        placeholderI: "Usuarios y responsables de área",
                      },
                      {
                        key: "ethics",
                        label: "7. Gestión de riesgos éticos y sesgos",
                        R: "raciEthicalR",
                        A: "raciEthicalA",
                        C: "raciEthicalC",
                        I: "raciEthicalI",
                        placeholderR: "Comité de Ética / Científicos de datos",
                        placeholderA: "Comité de Gobernanza de IA",
                        placeholderC: "Académicos / consultores externos",
                        placeholderI: "Alta Dirección / Comunicación interna",
                      },
                      {
                        key: "security",
                        label: "8. Gestión de incidentes y seguridad",
                        R: "raciSecurityR",
                        A: "raciSecurityA",
                        C: "raciSecurityC",
                        I: "raciSecurityI",
                        placeholderR: "Equipo de Seguridad / IT",
                        placeholderA: "CISO / Director de Tecnología",
                        placeholderC: "Proveedores externos",
                        placeholderI: "Comité de IA / Alta dirección",
                      },
                    ].map((item) => (
                      <div key={item.key} className="space-y-2">
                        <Label>{item.label}</Label>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <Input
                            placeholder={`R: ${item.placeholderR}`}
                            value={formData[item.R as keyof AISystemData] as string}
                            onChange={(e) => handleInputChange(item.R as keyof AISystemData, e.target.value)}
                          />
                          <Input
                            placeholder={`A: ${item.placeholderA}`}
                            value={formData[item.A as keyof AISystemData] as string}
                            onChange={(e) => handleInputChange(item.A as keyof AISystemData, e.target.value)}
                          />
                          <Input
                            placeholder={`C: ${item.placeholderC}`}
                            value={formData[item.C as keyof AISystemData] as string}
                            onChange={(e) => handleInputChange(item.C as keyof AISystemData, e.target.value)}
                          />
                          <Input
                            placeholder={`I: ${item.placeholderI}`}
                            value={formData[item.I as keyof AISystemData] as string}
                            onChange={(e) => handleInputChange(item.I as keyof AISystemData, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">C. Reporting y accountability</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="raciReportFrequency">9. Frecuencia de reportes del sistema de IA</Label>
                        <select
                          id="raciReportFrequency"
                          value={formData.raciReportFrequency}
                          onChange={(e) => handleInputChange("raciReportFrequency", e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="ad-hoc">Ad hoc</option>
                          <option value="anual">Anual</option>
                          <option value="mensual">Mensual</option>
                          <option value="semestral">Semestral</option>
                          <option value="trimestral">Trimestral</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>10. Destinatarios de los reportes</Label>
                        <div className="flex flex-col space-y-2">
                          {[
                            { value: "Alta Dirección", label: "Alta Dirección" },
                            { value: "Comité de IA", label: "Comité de IA" },
                            { value: "Consejo de Administración", label: "Consejo de Administración" },
                            { value: "Otro", label: "Otro" },
                          ].map((opt) => (
                            <div key={opt.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`raciReportRecipients-${opt.value}`}
                                checked={formData.raciReportRecipients.includes(opt.value)}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange("raciReportRecipients", opt.value, checked as boolean)
                                }
                              />
                              <Label htmlFor={`raciReportRecipients-${opt.value}`}>{opt.label}</Label>
                            </div>
                          ))}
                          {formData.raciReportRecipients.includes("Otro") && (
                            <Input
                              className="mt-2"
                              placeholder="Especifique otros destinatarios"
                              value={formData.raciReportRecipientsOther || ""}
                              onChange={(e) => handleInputChange("raciReportRecipientsOther", e.target.value)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="raciApprovalsDocumented">
                          11. ¿Se documenta formalmente quién aprueba despliegues/actualizaciones del modelo?
                        </Label>
                        <select
                          id="raciApprovalsDocumented"
                          value={formData.raciApprovalsDocumented}
                          onChange={(e) => handleInputChange("raciApprovalsDocumented", e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="no">No</option>
                          <option value="parcial">Parcial</option>
                          <option value="si">Sí</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">D. Escalamiento y formalización</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>12. Canal de escalamiento en caso de incidentes</Label>
                        <div className="flex flex-col space-y-2">
                          {[
                            { value: "Mesa de ayuda IT", label: "Mesa de ayuda IT" },
                            { value: "Comité de IA", label: "Comité de IA" },
                            { value: "Seguridad", label: "Seguridad" },
                            { value: "Jurídico", label: "Jurídico" },
                            { value: "Otro", label: "Otro" },
                          ].map((opt) => (
                            <div key={opt.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`raciEscalation-${opt.value}`}
                                checked={formData.raciEscalationChannels.includes(opt.value)}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange("raciEscalationChannels", opt.value, checked as boolean)
                                }
                              />
                              <Label htmlFor={`raciEscalation-${opt.value}`}>{opt.label}</Label>
                            </div>
                          ))}
                          {formData.raciEscalationChannels.includes("Otro") && (
                            <Input
                              className="mt-2"
                              placeholder="Especifique otro canal"
                              value={formData.raciEscalationChannelsOther || ""}
                              onChange={(e) => handleInputChange("raciEscalationChannelsOther", e.target.value)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="raciActExistence">
                          13. ¿Existe acta interna de asignación de roles y responsabilidades (RACI) para este sistema?
                        </Label>
                        <select
                          id="raciActExistence"
                          value={formData.raciActExistence}
                          onChange={(e) => handleInputChange("raciActExistence", e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="en-proceso">En proceso</option>
                          <option value="no">No</option>
                          <option value="si-firmada">Sí, firmada</option>
                        </select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>14. ¿Quién firma la aceptación de responsabilidad principal (A)?</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input
                            placeholder="Nombre"
                            value={formData.raciAcceptanceName}
                            onChange={(e) => handleInputChange("raciAcceptanceName", e.target.value)}
                          />
                          <Input
                            placeholder="Cargo"
                            value={formData.raciAcceptanceRole}
                            onChange={(e) => handleInputChange("raciAcceptanceRole", e.target.value)}
                          />
                          <Input
                            type="date"
                            placeholder="Fecha"
                            value={formData.raciAcceptanceDate}
                            onChange={(e) => handleInputChange("raciAcceptanceDate", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setActiveView("view")
                  setEditingSystem(null)
                }}
              >
                {t.cancel}
              </Button>
              <Button onClick={handleSave} className="bg-[#01A79E] hover:bg-[#018b84] text-white">
                {editingSystem ? t.updateSystem : t.saveSystem}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeView === "view" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t.registeredSystems}</CardTitle>
                <CardDescription>{t.manageSystemsDescription}</CardDescription>
              </div>
              <Button onClick={exportToExcel} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                {t.exportExcel}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {visibleSystems.length === 0 ? (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t.noSystemsRegistered}</p>
                <Button
                  onClick={() => setActiveView("register")}
                  className="mt-4 bg-[#01A79E] hover:bg-[#018b84] text-white"
                >
                  {t.registerFirstSystem}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleSystems.map((system) => (
                  <Card key={system.id} className="border-l-4 border-l-[#01A79E]">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{system.systemName}</h3>
                          <p className="text-gray-600">{system.companyName}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-gray-500">
                              {t.created}: {new Date(system.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setEditingSystem(system)
                              setFormData(system)
                              setActiveView("register")
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => generatePDFReport(system)}
                            variant="outline"
                            size="sm"
                            className="text-[#01A79E] border-[#01A79E] hover:bg-[#01A79E] hover:text-white"
                          >
                            <FileDown className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(system.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
