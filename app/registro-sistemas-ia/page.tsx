"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
import { FileText, Plus, Eye, Edit, Trash2, Download, Database, ClipboardList, FileDown } from "lucide-react"
import { Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface AISystemData {
  id: string
  companyName: string
  systemName: string
  riskLevel: string
  createdAt: string
  lastUpdateDate: string
  lastUpdateResponsible: string
  systemDescription: string
  responsibleArea: string
  providerDeveloper: string
  implementationDate: string
  systemStage: string
  systemPurpose: string
  organizationUseCase: string
  problemSolved: string
  inputDataTypes: string[]
  dataOrigin: string[]
  outputData: string
  aiType: string[]
  autonomyLevel: string
  decisionImpact: string
  endUserInteraction: string
  highRiskClassification: string
  dpiaConducted: string
  userInformed: string
  informationAssetRegistered: string
  technicalDocumentation: string
  internalDocumentation: string
  periodicAudit: string
  identifiedRisks: string[]
  biasDiscrimination: string
  legalImpact: string
  humanRightsImpact: string
  criticalSectors: string
  replacesHumanDecisions: string
  explainable: string
  riskMitigationMeasures: string[]
  securityMeasures: string[]
  thirdPartyInvolvement: string
  thirdPartyContract: string
  internationalTransfer: string
  transferMechanism: string
  lastReviewDate: string
  nextReviewDate: string
  resultsReviewer: string
  reviewFrequency: string
  governanceCommitteeReporting: string
  supervisionResponsibles: string
  complaintsChannel: string
  arcoRights: string
  responsibleAreaOther?: string
  systemStageOther?: string
  autonomyLevelOther?: string
  decisionImpactOther?: string
  reviewFrequencyOther?: string
  transferMechanismOther?: string
  inputDataTypesOther?: string
  dataOriginOther?: string
  aiTypeOther?: string
  securityMeasuresOther?: string
  identifiedRisksOther?: string
  riskMitigationMeasuresOther?: string
  technicalDocumentationFile?: string
  internalDocumentationFile?: string
  thirdPartyContractFile?: string
  transferMechanismFile?: string
  registrationEvidenceFile?: string
  reportingEvidenceFile?: string
  criticalSectorType?: string
  thirdPartyType?: string
  thirdPartyName?: string
  thirdPartyFunction?: string
  responsibleRole?: string
  securityDevelopment?: string[]
  securityProduction?: string[]
  securityModel?: string[]
  securityGovernance?: string[]
  securityOrganizational?: string[]
  securityGPAI?: string[]
  personalDataSubtypes?: string[]
  piSubtypes?: string[]
  algorithmicSubtypes?: string[]
  dpiaConductedEvidence?: string
  developmentType?: string
  providerName?: string
  providerNameOther?: string
  userAreas?: string[]
  userAreasOther?: string
  providerType?: string
  datasetSystem?: string
  noPersonalDataSubtypes?: string[]
  highRiskClassificationOther?: string
  responsable_diseño_y_desarrollo?: string
  responsable_entrenamiento?: string
  responsable_validación_y_pruebas?: string
  responsable_implementación?: string
  responsable_monitoreo_y_mantenimiento?: string
  responsable_supervisión_humana?: string
  responsable_gestión_de_incidentes?: string
}

export default function AISystemRegistry() {
  const { language } = useLanguage()
  const t = translations[language]
  const { toast } = useToast()
  const [activeView, setActiveView] = useState<"register" | "view">("register")
  const [savedSystems, setSavedSystems] = useState<AISystemData[]>([])
  const [editingSystem, setEditingSystem] = useState<AISystemData | null>(null)

  const [formData, setFormData] = useState<AISystemData>({
    id: "",
    companyName: "",
    systemName: "",
    riskLevel: "",
    createdAt: "",
    lastUpdateDate: "",
    lastUpdateResponsible: "",
    systemDescription: "",
    responsibleArea: "",
    providerDeveloper: "",
    implementationDate: "",
    systemStage: "",
    systemPurpose: "",
    organizationUseCase: "",
    problemSolved: "",
    inputDataTypes: [],
    dataOrigin: [],
    outputData: "",
    aiType: [],
    autonomyLevel: "",
    decisionImpact: "",
    endUserInteraction: "",
    highRiskClassification: "",
    dpiaConducted: "",
    userInformed: "",
    informationAssetRegistered: "",
    technicalDocumentation: "",
    internalDocumentation: "",
    periodicAudit: "",
    identifiedRisks: [],
    biasDiscrimination: "",
    legalImpact: "",
    humanRightsImpact: "",
    criticalSectors: "",
    replacesHumanDecisions: "",
    explainable: "",
    riskMitigationMeasures: [],
    securityMeasures: [],
    thirdPartyInvolvement: "",
    thirdPartyContract: "",
    internationalTransfer: "",
    transferMechanism: "",
    lastReviewDate: "",
    nextReviewDate: "",
    resultsReviewer: "",
    reviewFrequency: "",
    governanceCommitteeReporting: "",
    supervisionResponsibles: "",
    complaintsChannel: "",
    arcoRights: "",
    responsibleAreaOther: "",
    systemStageOther: "",
    autonomyLevelOther: "",
    decisionImpactOther: "",
    reviewFrequencyOther: "",
    transferMechanismOther: "",
    inputDataTypesOther: "",
    dataOriginOther: "",
    aiTypeOther: "",
    securityMeasuresOther: "",
    identifiedRisksOther: "",
    riskMitigationMeasuresOther: "",
    registrationEvidenceFile: "",
    reportingEvidenceFile: "",
    criticalSectorType: "",
    thirdPartyType: "",
    thirdPartyName: "",
    thirdPartyFunction: "",
    responsibleRole: "",
    securityDevelopment: [],
    securityProduction: [],
    securityModel: [],
    securityGovernance: [],
    securityOrganizational: [],
    securityGPAI: [],
    personalDataSubtypes: [],
    piSubtypes: [],
    algorithmicSubtypes: [],
    dpiaConductedEvidence: "",
    developmentType: "",
    providerName: "",
    providerNameOther: "",
    userAreas: [],
    userAreasOther: "",
    providerType: "",
    datasetSystem: "",
    noPersonalDataSubtypes: [],
    highRiskClassificationOther: "",
    responsable_diseño_y_desarrollo: "",
    responsable_entrenamiento: "",
    responsable_validación_y_pruebas: "",
    responsable_implementación: "",
    responsable_monitoreo_y_mantenimiento: "",
    responsable_supervisión_humana: "",
    responsable_gestión_de_incidentes: "",
  })

  useEffect(() => {
    const saved = localStorage.getItem("aiSystemsRegistry")
    if (saved) {
      setSavedSystems(JSON.parse(saved))
    }
  }, [])

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
    const requiredFields = ["companyName", "systemName"]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof AISystemData])

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
      localStorage.setItem("aiSystemsRegistry", JSON.stringify(updatedSystems))

      toast({
        title: t.success,
        description: editingSystem ? t.systemUpdated : t.systemSaved,
      })

      // Reset form
      setFormData({
        id: "",
        companyName: "",
        systemName: "",
        riskLevel: "",
        createdAt: "",
        lastUpdateDate: "",
        lastUpdateResponsible: "",
        systemDescription: "",
        responsibleArea: "",
        providerDeveloper: "",
        implementationDate: "",
        systemStage: "",
        systemPurpose: "",
        organizationUseCase: "",
        problemSolved: "",
        inputDataTypes: [],
        dataOrigin: [],
        outputData: "",
        aiType: [],
        autonomyLevel: "",
        decisionImpact: "",
        endUserInteraction: "",
        highRiskClassification: "",
        dpiaConducted: "",
        userInformed: "",
        informationAssetRegistered: "",
        technicalDocumentation: "",
        internalDocumentation: "",
        periodicAudit: "",
        identifiedRisks: [],
        biasDiscrimination: "",
        legalImpact: "",
        humanRightsImpact: "",
        criticalSectors: "",
        replacesHumanDecisions: "",
        explainable: "",
        riskMitigationMeasures: [],
        securityMeasures: [],
        thirdPartyInvolvement: "",
        thirdPartyContract: "",
        internationalTransfer: "",
        transferMechanism: "",
        lastReviewDate: "",
        nextReviewDate: "",
        resultsReviewer: "",
        reviewFrequency: "",
        governanceCommitteeReporting: "",
        supervisionResponsibles: "",
        complaintsChannel: "",
        arcoRights: "",
        responsibleAreaOther: "",
        systemStageOther: "",
        autonomyLevelOther: "",
        decisionImpactOther: "",
        reviewFrequencyOther: "",
        transferMechanismOther: "",
        inputDataTypesOther: "",
        dataOriginOther: "",
        aiTypeOther: "",
        securityMeasuresOther: "",
        identifiedRisksOther: "",
        riskMitigationMeasuresOther: "",
        registrationEvidenceFile: "",
        reportingEvidenceFile: "",
        criticalSectorType: "",
        thirdPartyType: "",
        thirdPartyName: "",
        thirdPartyFunction: "",
        responsibleRole: "",
        securityDevelopment: [],
        securityProduction: [],
        securityModel: [],
        securityGovernance: [],
        securityOrganizational: [],
        securityGPAI: [],
        personalDataSubtypes: [],
        piSubtypes: [],
        algorithmicSubtypes: [],
        dpiaConductedEvidence: "",
        developmentType: "",
        providerName: "",
        providerNameOther: "",
        userAreas: [],
        userAreasOther: "",
        providerType: "",
        datasetSystem: "",
        noPersonalDataSubtypes: [],
        highRiskClassificationOther: "",
        responsable_diseño_y_desarrollo: "",
        responsable_entrenamiento: "",
        responsable_validación_y_pruebas: "",
        responsable_implementación: "",
        responsable_monitoreo_y_mantenimiento: "",
        responsable_supervisión_humana: "",
        responsable_gestión_de_incidentes: "",
      })
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
    setFormData(system)
    setEditingSystem(system)
    setActiveView("register")
  }

  const handleDelete = (id: string) => {
    const updatedSystems = savedSystems.filter((system) => system.id !== id)
    setSavedSystems(updatedSystems)
    localStorage.setItem("aiSystemsRegistry", JSON.stringify(updatedSystems))

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
            doc.setFont(undefined, "bold")
          } else {
            doc.setFont(undefined, "normal")
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
        doc.setFont(undefined, "bold")
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
          "Proveedor/Desarrollador": system.providerDeveloper,
          "Fecha de implementación": system.implementationDate,
          "Etapa del sistema": system.systemStage + (system.systemStageOther ? ` (${system.systemStageOther})` : ""),
          "Fecha de última actualización": system.lastUpdateDate,
          "Responsable de última actualización": system.lastUpdateResponsible,
        })

        addSection("B. FINALIDAD Y CASOS DE USO", {
          "Finalidad del sistema": system.systemPurpose,
          "Caso de uso en la organización": system.organizationUseCase,
          "Problema que resuelve": system.problemSolved,
        })

        addSection("C. DATOS", {
          "Tipos de datos de entrada":
            system.inputDataTypes?.join(", ") + (system.inputDataTypesOther ? ` (${system.inputDataTypesOther})` : ""),
          "Origen de los datos":
            system.dataOrigin?.join(", ") + (system.dataOriginOther ? ` (${system.dataOriginOther})` : ""),
          "Datos de salida": system.outputData,
        })

        addSection("D. CARACTERÍSTICAS TÉCNICAS", {
          "Tipo de IA": system.aiType?.join(", ") + (system.aiTypeOther ? ` (${system.aiTypeOther})` : ""),
          "Nivel de autonomía":
            system.autonomyLevel + (system.autonomyLevelOther ? ` (${system.autonomyLevelOther})` : ""),
          "Impacto de las decisiones":
            system.decisionImpact + (system.decisionImpactOther ? ` (${system.decisionImpactOther})` : ""),
          "Interacción con usuarios finales": system.endUserInteraction,
        })

        addSection("E. GOBERNANZA Y CONTROL", {
          "Clasificación de alto riesgo": system.highRiskClassification,
          "DPIA realizada": system.dpiaConducted,
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

        addSection("F. RIESGOS Y MITIGACIONES", {
          "Riesgos identificados":
            system.identifiedRisks?.join(", ") +
            (system.identifiedRisksOther ? ` (${system.identifiedRisksOther})` : ""),
          "Sesgo y discriminación": system.biasDiscrimination,
          "Impacto legal": system.legalImpact,
          "Impacto en derechos humanos": system.humanRightsImpact,
          "Sectores críticos": system.criticalSectors,
          "Reemplaza decisiones humanas": system.replacesHumanDecisions,
          Explicable: system.explainable,
          "Medidas de mitigación":
            system.riskMitigationMeasures?.join(", ") +
            (system.riskMitigationMeasuresOther ? ` (${system.riskMitigationMeasuresOther})` : ""),
        })

        addSection("G. SEGURIDAD Y TRANSFERENCIAS", {
          "Medidas de seguridad":
            system.securityMeasures?.join(", ") +
            (system.securityMeasuresOther ? ` (${system.securityMeasuresOther})` : ""),
          "Participación de terceros": system.thirdPartyInvolvement,
          "Contrato con terceros": system.thirdPartyContract,
          "Evidencia contrato terceros": system.thirdPartyContractFile ? "✓ Archivo adjunto" : "✗ Sin evidencia",
          "Transferencia internacional": system.internationalTransfer,
          "Mecanismo de transferencia":
            system.transferMechanism + (system.transferMechanismOther ? ` (${system.transferMechanismOther})` : ""),
          "Evidencia mecanismo transferencia": system.transferMechanismFile ? "✓ Archivo adjunto" : "✗ Sin evidencia",
        })

        addSection("H. SEGUIMIENTO Y RESPONSABILIDADES", {
          "Fecha de última revisión": system.lastReviewDate,
          "Fecha de próxima revisión": system.nextReviewDate,
          "Revisor de resultados": system.resultsReviewer,
          "Frecuencia de revisión":
            system.reviewFrequency + (system.reviewFrequencyOther ? ` (${system.reviewFrequencyOther})` : ""),
          "Reporte al comité de gobernanza": system.governanceCommitteeReporting,
          "Responsables de supervisión": system.supervisionResponsibles,
        })

        addSection("I. TRANSPARENCIA Y DERECHOS", {
          "Canal de quejas": system.complaintsChannel,
          "Derechos ARCO": system.arcoRights,
        })

        // Información adicional
        addSection("INFORMACIÓN ADICIONAL", {
          "Nivel de riesgo": system.riskLevel,
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
      "Sistema,Empresa,Nivel de Riesgo,Fecha de Creación\n" +
      savedSystems
        .map((system) => `${system.systemName},${system.companyName},${system.riskLevel},${system.createdAt}`)
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t.aiSystemRegistry}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card de Registro */}
        <Card
          className={`cursor-pointer transition-all ${activeView === "register" ? "ring-2 ring-[#1bb67e]" : ""}`}
          onClick={() => setActiveView("register")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-6 w-6 text-[#1bb67e]" />
              {editingSystem ? t.editSystem : t.registerNewSystem}
            </CardTitle>
            <CardDescription>{editingSystem ? t.editSystemDescription : t.registerSystemDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <ClipboardList className="h-12 w-12 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Card de Visualización */}
        <Card
          className={`cursor-pointer transition-all ${activeView === "view" ? "ring-2 ring-[#1bb67e]" : ""}`}
          onClick={() => setActiveView("view")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-[#1bb67e]" />
              {t.viewRegisteredSystems}
            </CardTitle>
            <CardDescription>{t.viewSystemsDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-2xl font-bold">{savedSystems.length}</p>
                  <p className="text-sm text-gray-500">{t.registeredSystems}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {activeView === "register" && (
        <Card>
          <CardHeader>
            <CardTitle>{editingSystem ? t.editSystem : t.registerNewSystem}</CardTitle>
            <CardDescription>{t.fillFormDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/* Sección A: Identificación General */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t.generalIdentification}
                  </CardTitle>
                  <CardDescription>Información básica del sistema de IA y la organización</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systemName">1. Nombre del sistema *</Label>
                      <Input
                        id="systemName"
                        value={formData.systemName}
                        onChange={(e) => handleInputChange("systemName", e.target.value)}
                        placeholder="Ingrese el nombre del sistema"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="developmentType">2. ¿Es desarrollo interno o externo de la organización?</Label>
                      <select
                        id="developmentType"
                        value={formData.developmentType || ""}
                        onChange={(e) => handleInputChange("developmentType", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="interno">Interno</option>
                        <option value="externo">Externo</option>
                      </select>
                    </div>

                    {formData.developmentType === "externo" && (
                      <div className="space-y-2">
                        <Label htmlFor="providerName">Nombre del proveedor</Label>
                        <select
                          id="providerName"
                          value={formData.providerName || ""}
                          onChange={(e) => handleInputChange("providerName", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Seleccione un proveedor</option>
                          <option value="microsoft">Microsoft</option>
                          <option value="google">Google</option>
                          <option value="amazon">Amazon</option>
                          <option value="ibm">IBM</option>
                          <option value="otro">Otro</option>
                        </select>
                        {formData.providerName === "otro" && (
                          <Input
                            placeholder="Especifique el proveedor"
                            value={formData.providerNameOther || ""}
                            onChange={(e) => handleInputChange("providerNameOther", e.target.value)}
                          />
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="responsibleArea">3. ¿A qué área(s) se le asigna la titularidad?</Label>
                      <select
                        id="responsibleArea"
                        value={formData.responsibleArea}
                        onChange={(e) => handleInputChange("responsibleArea", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Seleccione un área</option>
                        <option value="administracion">Administración</option>
                        <option value="comercial">Comercial</option>
                        <option value="compliance">Compliance</option>
                        <option value="compras">Compras</option>
                        <option value="finanzas">Finanzas</option>
                        <option value="legal">Legal</option>
                        <option value="marketing">Marketing</option>
                        <option value="otro">Otro</option>
                        <option value="producto">Producto</option>
                        <option value="rrhh">RRHH</option>
                        <option value="seguridad">Seguridad</option>
                        <option value="ti">TI</option>
                      </select>
                      {formData.responsibleArea === "otro" && (
                        <div className="mt-2">
                          <Input
                            placeholder="Especifique el área responsable"
                            value={formData.responsibleAreaOther || ""}
                            onChange={(e) => handleInputChange("responsibleAreaOther", e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>4. Área(s) usuarias del sistema de IA (selección múltiple)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "Administración",
                          "Comercial",
                          "Compliance",
                          "Compras",
                          "Finanzas",
                          "Legal",
                          "Marketing",
                          "Producto",
                          "RRHH",
                          "Seguridad",
                          "TI",
                        ].map((area) => (
                          <div key={area} className="flex items-center space-x-2">
                            <Checkbox
                              id={`userArea-${area}`}
                              checked={formData.userAreas?.includes(area) || false}
                              onCheckedChange={(checked) => {
                                const current = formData.userAreas || []
                                handleInputChange(
                                  "userAreas",
                                  checked ? [...current, area] : current.filter((item) => item !== area),
                                )
                              }}
                            />
                            <Label htmlFor={`userArea-${area}`}>{area}</Label>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2">
                        <Label htmlFor="userAreasOther">Otras áreas usuarias (manual)</Label>
                        <Input
                          id="userAreasOther"
                          value={formData.userAreasOther || ""}
                          onChange={(e) => handleInputChange("userAreasOther", e.target.value)}
                          placeholder="Especifique otras áreas usuarias"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="providerType">5. ¿Cuál es el proveedor?</Label>
                      <select
                        id="providerType"
                        value={formData.providerType || ""}
                        onChange={(e) => handleInputChange("providerType", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="desarrollador">Desarrollador</option>
                        <option value="distribuidor">Distribuidor</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyName">6. Nombre de la empresa responsable del sistema de IA *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        placeholder="Ingrese el nombre de la empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastUpdateDate">2. Fecha de la última actualización del registro</Label>
                      <Input
                        id="lastUpdateDate"
                        type="date"
                        value={formData.lastUpdateDate}
                        onChange={(e) => handleInputChange("lastUpdateDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastUpdateResponsible">
                        3. Responsable de la última actualización (nombre y cargo)
                      </Label>
                      <Input
                        id="lastUpdateResponsible"
                        value={formData.lastUpdateResponsible}
                        onChange={(e) => handleInputChange("lastUpdateResponsible", e.target.value)}
                        placeholder="Nombre y cargo del responsable"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="systemDescription">5. Descripción del sistema</Label>
                      <Textarea
                        id="systemDescription"
                        value={formData.systemDescription}
                        onChange={(e) => handleInputChange("systemDescription", e.target.value)}
                        placeholder="Describa el sistema de IA"
                        rows={3}
                      />
                    </div>

                    {/* Cambiando pregunta 7 de input a select con opciones Proveedor/Desarrollador */}
                    <div className="space-y-2">
                      <Label htmlFor="providerDeveloper">7. Proveedor del sistema de IA</Label>
                      <select
                        id="providerDeveloper"
                        value={formData.providerDeveloper}
                        onChange={(e) => handleInputChange("providerDeveloper", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="proveedor">Proveedor</option>
                        <option value="desarrollador">Desarrollador</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="implementationDate">8. Fecha de implementación</Label>
                      <Input
                        id="implementationDate"
                        type="date"
                        value={formData.implementationDate}
                        onChange={(e) => handleInputChange("implementationDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="systemStage">9. Etapa del sistema</Label>
                      <select
                        id="systemStage"
                        value={formData.systemStage}
                        onChange={(e) => handleInputChange("systemStage", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="desarrollo">Desarrollo</option>
                        <option value="piloto">Piloto</option>
                        <option value="activo">Activo</option>
                        <option value="retirado">Retirado</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sección B: Finalidad y casos de uso */}
              <Card>
                <CardHeader>
                  <CardTitle>B. Finalidad y casos de uso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="systemPurpose">10. Finalidad del uso del sistema</Label>
                    <Textarea
                      id="systemPurpose"
                      value={formData.systemPurpose}
                      onChange={(e) => handleInputChange("systemPurpose", e.target.value)}
                      placeholder="Describa la finalidad del sistema"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizationUseCase">11. Caso de uso en la organización</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                      {[
                        "Reconocimiento de voz",
                        "Reconocimiento facial",
                        "Reconocimiento de imágenes",
                        "Detección de fraudes",
                        "Detección de enfermedades",
                        "Detección de objetos",
                        "Pronósticos meteorológicos",
                        "Pronósticos de mercado",
                        "Pronósticos de demanda",
                        "Personalización de contenido",
                        "Publicidad dirigida",
                        "Productos personalizados",
                        "Chatbots y asistentes virtuales",
                        "Interfaces de usuario adaptativas",
                        "Traducción y accesibilidad en tiempo real",
                        "Gestión de inventarios",
                        "Planificación de rutas para entregas",
                        "Mantenimiento predictivo",
                        "Recomendación de productos",
                        "Recomendaciones de contenido en medios sociales",
                        "Recomendación de cursos y recursos educativos",
                        "Atención al cliente",
                        "Recursos humanos",
                        "Marketing",
                        "Análisis financiero",
                        "Ciberseguridad/fraude",
                        "Salud",
                        "Legal/compliance",
                        "Operaciones/logística",
                        "Otro",
                      ].map((useCase) => (
                        <div key={useCase} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`useCase-${useCase}`}
                            checked={formData.organizationUseCase?.includes(useCase) || false}
                            onChange={(e) => {
                              const currentUseCases = formData.organizationUseCase || []
                              if (e.target.checked) {
                                handleInputChange("organizationUseCase", [...currentUseCases, useCase])
                              } else {
                                handleInputChange(
                                  "organizationUseCase",
                                  currentUseCases.filter((item) => item !== useCase),
                                )
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`useCase-${useCase}`} className="text-sm font-normal cursor-pointer">
                            {useCase}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.organizationUseCase?.includes("Otro") && (
                      <div className="mt-2">
                        <Label htmlFor="organizationUseCaseOther">Especifique el caso de uso</Label>
                        <Input
                          id="organizationUseCaseOther"
                          value={formData.organizationUseCaseOther || ""}
                          onChange={(e) => handleInputChange("organizationUseCaseOther", e.target.value)}
                          placeholder="Describa el caso de uso específico"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="problemSolved">12. Problema o necesidad que resuelve el sistema de IA</Label>
                    <Textarea
                      id="problemSolved"
                      value={formData.problemSolved}
                      onChange={(e) => handleInputChange("problemSolved", e.target.value)}
                      placeholder="Describa el problema que resuelve"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sección C: Datos */}
              <Card>
                <CardHeader>
                  <CardTitle>C. Datos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>13. Tipos de datos de entrada</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="inputData-personales"
                          checked={formData.inputDataTypes.includes("Datos personales")}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("inputDataTypes", "Datos personales", checked)
                          }
                        />
                        <Label htmlFor="inputData-personales">Datos personales</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="inputData-no-personales"
                          checked={formData.inputDataTypes.includes("No personales")}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("inputDataTypes", "No personales", checked)
                          }
                        />
                        <Label htmlFor="inputData-no-personales">No personales</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="inputData-mixtos"
                          checked={formData.inputDataTypes.includes("Datos personales y otra información")}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("inputDataTypes", "Datos personales y otra información", checked)
                          }
                        />
                        <Label htmlFor="inputData-mixtos">Datos personales y otra información</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="inputData-publicos"
                          checked={formData.inputDataTypes.includes("Datos de acceso público")}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("inputDataTypes", "Datos de acceso público", checked)
                          }
                        />
                        <Label htmlFor="inputData-publicos">Datos de acceso público</Label>
                      </div>
                    </div>

                    {formData.inputDataTypes.includes("Datos personales") && (
                      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                        <Label className="text-sm font-medium mb-2 block">Tipos de datos personales:</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Datos de ubicación",
                            "Datos patrimoniales",
                            "Datos de autenticación",
                            "Datos jurídicos",
                            "Datos de identificación",
                            "Datos de contacto",
                            "Información académica",
                            "Información laboral",
                            "Datos inferidos",
                            "Datos observados",
                          ].map((tipo) => (
                            <div key={tipo} className="flex items-center space-x-2">
                              <Checkbox
                                id={`personal-${tipo}`}
                                checked={formData.personalDataSubtypes?.includes(tipo)}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange("personalDataSubtypes", tipo, checked)
                                }
                              />
                              <Label htmlFor={`personal-${tipo}`}>{tipo}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.inputDataTypes.includes("No personales") && (
                      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                        <Label className="text-sm font-medium mb-2 block">Tipos de datos no personales:</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Financieros", "Comerciales", "Estadísticos", "Agregados", "Anonimizados", "Otro"].map(
                            (tipo) => (
                              <div key={tipo} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`no-personal-${tipo}`}
                                  checked={formData.noPersonalDataSubtypes?.includes(tipo)}
                                  onCheckedChange={(checked) =>
                                    handleCheckboxChange("noPersonalDataSubtypes", tipo, checked)
                                  }
                                />
                                <Label htmlFor={`no-personal-${tipo}`}>{tipo}</Label>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="datasetSystem">14. Dataset del sistema</Label>
                    <Input
                      id="datasetSystem"
                      value={formData.datasetSystem || ""}
                      onChange={(e) => handleInputChange("datasetSystem", e.target.value)}
                      placeholder="Describa el dataset utilizado"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outputData">15. Datos de salida generados por el sistema</Label>
                    <Textarea
                      id="outputData"
                      value={formData.outputData}
                      onChange={(e) => handleInputChange("outputData", e.target.value)}
                      placeholder="Describa los datos de salida"
                      rows={3}
                    />
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
                      <option value="critico">Crítico</option>
                      {/* Colocando "Otro" en posición central para mejor distribución visual */}
                      <option value="otro">Otro</option>
                      <option value="apoyo">Apoyo</option>
                      <option value="operacional">Operacional</option>
                      <option value="legal">Legal</option>
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
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Sección E: Gobernanza y control */}
              <Card>
                <CardHeader>
                  <CardTitle>E. Gobernanza y control</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="highRiskClassification">20. Clasificación de riesgo</Label>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="p-1 rounded-full hover:bg-gray-100">
                              <Info className="h-4 w-4 text-gray-500" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Clasificación de Riesgo según AI Act</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 text-sm">
                              <div>
                                <h4 className="font-semibold text-red-600">1. Riesgo Inaceptable</h4>
                                <p className="mb-2">Prohibidos porque atentan contra derechos fundamentales.</p>
                                <p className="font-medium">Ejemplos:</p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                  <li>Sistemas de manipulación subliminal de personas.</li>
                                  <li>Evaluación social por parte de gobiernos ("social scoring").</li>
                                  <li>Reconocimiento facial en tiempo real en espacios públicos para control policial (salvo excepciones muy restringidas).</li>
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-orange-600">2. Alto Riesgo</h4>
                                <p className="mb-2">Permitidos, pero bajo requisitos estrictos de cumplimiento. Son los más relevantes porque abarcan muchos usos.</p>
                                <p className="font-medium">Incluye dos grandes categorías:</p>
                                <ol className="list-decimal list-inside ml-2 space-y-1">
                                  <li>Sistemas de IA como productos regulados (ej.: dispositivos médicos, vehículos autónomos).</li>
                                  <li>Sistemas de IA en sectores críticos listados en el Anexo III:
                                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                      <li>Identificación biométrica y categorización de personas.</li>
                                      <li>Gestión y operación de infraestructuras críticas (agua, energía, transporte).</li>
                                      <li>Educación y formación profesional (evaluación de estudiantes).</li>
                                      <li>Empleo y gestión de trabajadores (contratación, promoción, despidos).</li>
                                      <li>Acceso a servicios esenciales (banca, seguros, asistencia social).</li>
                                      <li>Aplicación de la ley (evaluación de pruebas, predicción delictiva).</li>
                                      <li>Migración, asilo y control fronterizo.</li>
                                      <li>Administración de justicia y procesos democráticos.</li>
                                    </ul>
                                  </li>
                                </ol>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-yellow-600">3. Riesgo Limitado</h4>
                                <p className="mb-2">Permitidos con requisitos de transparencia.</p>
                                <p className="font-medium">Ejemplos:</p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                  <li>Chatbots y sistemas conversacionales → deben informar claramente al usuario de que interactúa con una IA.</li>
                                  <li>Sistemas de IA generativa → deben marcar outputs generados por IA (watermarking o avisos)</li>
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-green-600">4. Riesgo Mínimo o Nulo</h4>
                                <p className="mb-2">La mayoría de los sistemas de IA. Sin obligaciones adicionales.</p>
                                <p className="font-medium">Ejemplos:</p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                  <li>Filtros de spam.</li>
                                  <li>Videojuegos que usan IA.</li>
                                  <li>Recomendadores de películas o música.</li>
                                </ul>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <select
                        id="highRiskClassification"
                        value={formData.highRiskClassification}
                        onChange={(e) => handleInputChange("highRiskClassification", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="riesgo-inaceptable">Riesgo Inaceptable</option>
                        <option value="alto-riesgo">Alto Riesgo</option>
                        <option value="riesgo-limitado">Riesgo Limitado</option>
                        <option value="riesgo-minimo">Riesgo Mínimo o Nulo</option>
                        <option value="otro">Otro</option>
                      </select>
                      {formData.highRiskClassification === "otro" && (
                        <Input
                          placeholder="Especifique la clasificación"
                          value={formData.highRiskClassificationOther || ""}
                          onChange={(e) => handleInputChange("highRiskClassificationOther", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dpiaConducted">21. ¿Se realizó EIPD/DPIA específica?</Label>
                      <select
                        id="dpiaConducted"
                        value={formData.dpiaConducted}
                        onChange={(e) => handleInputChange("dpiaConducted", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                      </select>
                      {formData.dpiaConducted === "si" && (
                        <div className="mt-2">
                          <Label htmlFor="dpiaEvidence" className="text-sm text-gray-600">
                            Evidencia EIPD/DPIA (requerida)
                          </Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="file"
                              id="dpiaEvidence"
                              accept=".pdf,.doc,.docx,.txt"
                              onChange={(e) => handleFileUpload('dpiaEvidence', e.target.files?.[0] as File)}
                              className="flex-1"
                            />
                            {formData.dpiaEvidence && (
                              <div className="flex items-center gap-1">
                                <span className="text-green-600 text-xs">📎</span>
                                <button
                                  onClick={() => downloadFile(formData.dpiaEvidence, 'evidencia-dpia')}
                                  className="text-blue-600 hover:underline text-xs"
                                >
                                  Descargar
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userInformed">22. ¿Se informa a los usuarios que interactúan con IA?</Label>
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
                      <Label htmlFor="informationAssetRegistered">
                        23. ¿Está registrado como activo de información?
                      </Label>
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
                    {/* Quitando texto "Anexo VIII AI Act" de la pregunta 24 */}
                    <div className="space-y-2">
                      <Label htmlFor="technicalDocumentation">24. ¿Documentación técnica disponible?</Label>
                      <select
                        id="technicalDocumentation"
                        value={formData.technicalDocumentation}
                        onChange={(e) => handleInputChange("technicalDocumentation", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si-completa">Sí completa</option>
                        <option value="no">No</option>
                        <option value="en-proceso">En proceso</option>
                      </select>
                      {(formData.technicalDocumentation === "si-completa" ||
                        formData.technicalDocumentation === "parcial") && (
                        <div className="mt-2">
                          <Label className="text-sm text-gray-600">Subir documentación técnica:</Label>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload("technicalDocumentation", file)
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          />
                          {formData.technicalDocumentationFile && (
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-sm text-green-600">✓ Documento subido</span>
                              <button
                                type="button"
                                onClick={() =>
                                  downloadFile(formData.technicalDocumentationFile!, "documentacion-tecnica.pdf")
                                }
                                className="text-sm text-blue-600 hover:underline"
                              >
                                Descargar
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="internalDocumentation">25. ¿Documentación interna disponible?</Label>
                      <select
                        id="internalDocumentation"
                        value={formData.internalDocumentation}
                        onChange={(e) => handleInputChange("internalDocumentation", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si-completa">Sí completa</option>
                        <option value="no">No</option>
                        <option value="en-proceso">En proceso</option>
                      </select>
                      {(formData.internalDocumentation === "si-completa" ||
                        formData.internalDocumentation === "parcial") && (
                        <div className="mt-2">
                          <Label className="text-sm text-gray-600">Subir documentación interna:</Label>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload("internalDocumentation", file)
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          />
                          {formData.internalDocumentationFile && (
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-sm text-green-600">✓ Documento subido</span>
                              <button
                                type="button"
                                onClick={() =>
                                  downloadFile(formData.internalDocumentationFile!, "documentacion-interna.pdf")
                                }
                                className="text-sm text-blue-600 hover:underline"
                              >
                                Descargar
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="periodicAudit">26. ¿Auditoría periódica implementada?</Label>
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
                </CardContent>
              </Card>

              {/* Agregando nueva sección de Seguridad después de la sección E */}
              {/* Sección J: Seguridad */}
              <Card>
                <CardHeader>
                  <CardTitle>J. Seguridad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>49. Medidas de Seguridad Técnica - Durante el desarrollo:</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        "Control de acceso a entornos de entrenamiento y prueba",
                        "Versionado seguro del modelo y del código fuente",
                        "Revisión de vulnerabilidades en bibliotecas y dependencias",
                        "Pruebas adversariales en entornos aislados",
                        "Registro de logs y auditoría del sistema",
                      ].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dev-${option}`}
                            checked={formData.securityDevelopment?.includes(option) || false}
                            onCheckedChange={(checked) => {
                              const current = formData.securityDevelopment || []
                              handleInputChange(
                                "securityDevelopment",
                                checked ? [...current, option] : current.filter((item) => item !== option),
                              )
                            }}
                          />
                          <Label htmlFor={`dev-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>50. Medidas de Seguridad Técnica - En producción:</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        "Cifrado de datos en tránsito y reposo",
                        "Autenticación y autorización robusta",
                        "Monitorización de comportamiento en tiempo real",
                        "Limitación de tasa de consultas (rate limiting)",
                        "Validación de integridad del modelo",
                        "Protección contra inyecciones en datos de entrada",
                      ].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`prod-${option}`}
                            checked={formData.securityProduction?.includes(option) || false}
                            onCheckedChange={(checked) => {
                              const current = formData.securityProduction || []
                              handleInputChange(
                                "securityProduction",
                                checked ? [...current, option] : current.filter((item) => item !== option),
                              )
                            }}
                          />
                          <Label htmlFor={`prod-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>51. Seguridad del Modelo:</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        "Enmascaramiento o pseudonimización de datos sensibles",
                        "Prevención de ataques de inferencia (membership inference)",
                        "Pruebas de robustez ante entradas adversariales",
                        "Técnicas de regularización para evitar sobreajuste",
                      ].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`model-${option}`}
                            checked={formData.securityModel?.includes(option) || false}
                            onCheckedChange={(checked) => {
                              const current = formData.securityModel || []
                              handleInputChange(
                                "securityModel",
                                checked ? [...current, option] : current.filter((item) => item !== option),
                              )
                            }}
                          />
                          <Label htmlFor={`model-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>52. Gobernanza de Datos:</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        "Evaluación de sesgos y calidad de datos",
                        "Clasificación de sensibilidad",
                        "Verificación del consentimiento para datos personales",
                        "Registro del origen y legalidad del dataset",
                      ].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`governance-${option}`}
                            checked={formData.securityGovernance?.includes(option) || false}
                            onCheckedChange={(checked) => {
                              const current = formData.securityGovernance || []
                              handleInputChange(
                                "securityGovernance",
                                checked ? [...current, option] : current.filter((item) => item !== option),
                              )
                            }}
                          />
                          <Label htmlFor={`governance-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>53. Medidas Organizacionales y Jurídicas:</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        "Registro en inventario de IA institucional",
                        "Realización de DPIA y evaluaciones algorítmicas",
                        "Asignación de responsabilidades claras",
                        "Contratos de uso y tratamiento entre actores",
                        "Plan de respuesta a incidentes de IA",
                        "Capacitación continua sobre seguridad en IA",
                      ].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`org-${option}`}
                            checked={formData.securityOrganizational?.includes(option) || false}
                            onCheckedChange={(checked) => {
                              const current = formData.securityOrganizational || []
                              handleInputChange(
                                "securityOrganizational",
                                checked ? [...current, option] : current.filter((item) => item !== option),
                              )
                            }}
                          />
                          <Label htmlFor={`org-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>54. Seguridad en GPAI o sistemas generativos:</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        "Moderación de contenido automático",
                        "Prevención de desinformación o resultados dañinos",
                        "Controles de divulgación responsable (marca de agua, disclaimers)",
                        "Mecanismos de trazabilidad y explicabilidad",
                      ].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`gpai-${option}`}
                            checked={formData.securityGPAI?.includes(option) || false}
                            onCheckedChange={(checked) => {
                              const current = formData.securityGPAI || []
                              handleInputChange(
                                "securityGPAI",
                                checked ? [...current, option] : current.filter((item) => item !== option),
                              )
                            }}
                          />
                          <Label htmlFor={`gpai-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sección F: Riesgos y mitigaciones */}
              <Card>
                <CardHeader>
                  <CardTitle>F. Riesgos y mitigaciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>27. Riesgos identificados</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="risk-sesgo"
                          checked={formData.identifiedRisks.includes("Sesgo")}
                          onCheckedChange={(checked) => handleCheckboxChange("identifiedRisks", "Sesgo", checked)}
                        />
                        <Label htmlFor="risk-sesgo">Sesgo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="risk-discriminacion"
                          checked={formData.identifiedRisks.includes("Discriminación")}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("identifiedRisks", "Discriminación", checked)
                          }
                        />
                        <Label htmlFor="risk-discriminacion">Discriminación</Label>
                      </div>
                      {/* Posicionando "Otro" en el centro para mantener consistencia visual */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="risk-otro"
                          checked={formData.identifiedRisks.includes("Otro")}
                          onCheckedChange={(checked) => handleCheckboxChange("identifiedRisks", "Otro", checked)}
                        />
                        <Label htmlFor="risk-otro">Otro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="risk-privacidad"
                          checked={formData.identifiedRisks.includes("Privacidad")}
                          onCheckedChange={(checked) => handleCheckboxChange("identifiedRisks", "Privacidad", checked)}
                        />
                        <Label htmlFor="risk-privacidad">Privacidad</Label>
                      </div>
                    </div>
                    {formData.identifiedRisks.includes("Otro") && (
                      <div className="mt-2">
                        <Label htmlFor="identifiedRisksOther">Especifique otros riesgos</Label>
                        <Input
                          id="identifiedRisksOther"
                          value={formData.identifiedRisksOther || ""}
                          onChange={(e) => handleInputChange("identifiedRisksOther", e.target.value)}
                          placeholder="Especifique otros riesgos"
                        />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="biasDiscrimination">28. ¿Podría generar sesgo o discriminación?</Label>
                      <select
                        id="biasDiscrimination"
                        value={formData.biasDiscrimination}
                        onChange={(e) => handleInputChange("biasDiscrimination", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="legalImpact">29. ¿Podría tener impacto legal significativo?</Label>
                      <select
                        id="legalImpact"
                        value={formData.legalImpact}
                        onChange={(e) => handleInputChange("legalImpact", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="humanRightsImpact">30. ¿Impacto sobre derechos humanos?</Label>
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
                      <Label htmlFor="criticalSectors">31. ¿Está en sectores críticos?</Label>
                      <select
                        id="criticalSectors"
                        value={formData.criticalSectors}
                        onChange={(e) => handleInputChange("criticalSectors", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                      </select>
                      {formData.criticalSectors === "si" && (
                        <div className="mt-2">
                          <Label htmlFor="criticalSectorType">Especifique el sector crítico:</Label>
                          <select
                            id="criticalSectorType"
                            value={formData.criticalSectorType || ""}
                            onChange={(e) => handleInputChange("criticalSectorType", e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Seleccione un sector</option>
                            <option value="salud">Salud</option>
                            <option value="educacion">Educación</option>
                            <option value="financiero">Financiero</option>
                            <option value="energia">Energía</option>
                            <option value="transporte">Transporte</option>
                            <option value="seguridad">Seguridad</option>
                            <option value="justicia">Justicia</option>
                            <option value="otro">Otro</option>
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="replacesHumanDecisions">32. ¿La IA reemplaza decisiones humanas sensibles?</Label>
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
                    <div className="space-y-2">
                      <Label htmlFor="explainable">33. ¿Es explicable su funcionamiento?</Label>
                      <select
                        id="explainable"
                        value={formData.explainable}
                        onChange={(e) => handleInputChange("explainable", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si">Sí</option>
                        <option value="parcial">Parcial</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>34. Medidas de mitigación de riesgos</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="mitigation-tecnicas"
                          checked={formData.riskMitigationMeasures.includes("Medidas técnicas")}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("riskMitigationMeasures", "Medidas técnicas", checked)
                          }
                        />
                        <Label htmlFor="mitigation-tecnicas">Medidas técnicas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="mitigation-organizacionales"
                          checked={formData.riskMitigationMeasures.includes("Medidas organizacionales")}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("riskMitigationMeasures", "Medidas organizacionales", checked)
                          }
                        />
                        <Label htmlFor="mitigation-organizacionales">Medidas organizacionales</Label>
                      </div>
                      {/* Centrando "Otro" para mantener el patrón visual consistente */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="mitigation-otro"
                          checked={formData.riskMitigationMeasures.includes("Otro")}
                          onCheckedChange={(checked) => handleCheckboxChange("riskMitigationMeasures", "Otro", checked)}
                        />
                        <Label htmlFor="mitigation-otro">Otro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="mitigation-humanas"
                          checked={formData.riskMitigationMeasures.includes("Medidas de supervisión humana")}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("riskMitigationMeasures", "Medidas de supervisión humana", checked)
                          }
                        />
                        <Label htmlFor="mitigation-humanas">Medidas de supervisión humana</Label>
                      </div>
                    </div>
                    {formData.riskMitigationMeasures.includes("Otro") && (
                      <div className="mt-2">
                        <Label htmlFor="riskMitigationMeasuresOther">Especifique otras medidas</Label>
                        <Input
                          id="riskMitigationMeasuresOther"
                          value={formData.riskMitigationMeasuresOther || ""}
                          onChange={(e) => handleInputChange("riskMitigationMeasuresOther", e.target.value)}
                          placeholder="Especifique otras medidas"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="riskLevel">35. Nivel de riesgo evaluado</Label>
                    <select
                      id="riskLevel"
                      value={formData.riskLevel}
                      onChange={(e) => handleInputChange("riskLevel", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="alto">Alto</option>
                      <option value="medio">Medio</option>
                      <option value="bajo">Bajo</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>G. Identificación de terceros</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="thirdPartyInvolvement">¿Interviene un tercero?</Label>
                    <select
                      id="thirdPartyInvolvement"
                      value={formData.thirdPartyInvolvement}
                      onChange={(e) => handleInputChange("thirdPartyInvolvement", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {formData.thirdPartyInvolvement === "si" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="thirdPartyType">Identifique al tercero:</Label>
                        <select
                          id="thirdPartyType"
                          value={formData.thirdPartyType || ""}
                          onChange={(e) => handleInputChange("thirdPartyType", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="proveedor-desarrollador">Proveedor / desarrollador</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="thirdPartyName">Nombre del tercero</Label>
                        <Input
                          id="thirdPartyName"
                          value={formData.thirdPartyName || ""}
                          onChange={(e) => handleInputChange("thirdPartyName", e.target.value)}
                          placeholder="Ingrese el nombre del tercero"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="thirdPartyContract">Contrato (subir evidencia)</Label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload("thirdPartyContract", file)
                          }}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                        {formData.thirdPartyContractFile && (
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-sm text-green-600">✓ Contrato subido</span>
                            <button
                              type="button"
                              onClick={() => downloadFile(formData.thirdPartyContractFile!, "contrato-tercero.pdf")}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Descargar
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="thirdPartyFunction">Identifica su función</Label>
                        <Textarea
                          id="thirdPartyFunction"
                          value={formData.thirdPartyFunction || ""}
                          onChange={(e) => handleInputChange("thirdPartyFunction", e.target.value)}
                          placeholder="Describa la función del tercero"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>H. Registro de responsabilidades interna</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Fases del ciclo de vida y responsables</Label>
                    <div className="space-y-3">
                      {[
                        "Diseño y desarrollo",
                        "Entrenamiento",
                        "Validación y pruebas",
                        "Implementación",
                        "Monitoreo y mantenimiento",
                        "Supervisión humana",
                        "Gestión de incidentes",
                      ].map((fase) => (
                        <div key={fase} className="grid grid-cols-2 gap-4">
                          <Label className="self-center">{fase}:</Label>
                          <Input
                            placeholder="Responsable asignado"
                            value={
                              (formData[
                                `responsable_${fase.replace(/\s+/g, "_").toLowerCase()}` as keyof AISystemData
                              ] as string) || ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                `responsable_${fase.replace(/\s+/g, "_").toLowerCase()}` as keyof AISystemData,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>I. Transparencia y derechos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="complaintsChannel">47. ¿Cuenta con canal de reclamaciones para usuarios?</Label>
                      <select
                        id="complaintsChannel"
                        value={formData.complaintsChannel}
                        onChange={(e) => handleInputChange("complaintsChannel", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="arcoRights">48. ¿Están previstos mecanismos de atención a derechos ARCO?</Label>
                      <select
                        id="arcoRights"
                        value={formData.arcoRights}
                        onChange={(e) => handleInputChange("arcoRights", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                        <option value="no-aplica">No aplica</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>H. Cadena de responsabilidad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastReviewDate">37. Fecha de última revisión</Label>
                      <Input
                        id="lastReviewDate"
                        type="date"
                        value={formData.lastReviewDate}
                        onChange={(e) => handleInputChange("lastReviewDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nextReviewDate">38. Fecha de próxima revisión</Label>
                      <Input
                        id="nextReviewDate"
                        type="date"
                        value={formData.nextReviewDate}
                        onChange={(e) => handleInputChange("nextReviewDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resultsReviewer">40. ¿Quién revisa los resultados del sistema?</Label>
                      <Input
                        id="resultsReviewer"
                        value={formData.resultsReviewer}
                        onChange={(e) => handleInputChange("resultsReviewer", e.target.value)}
                        placeholder="Nombre del responsable de revisión"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsibleRole">Pregunta adicional para especificar rol</Label>
                      <Input
                        id="responsibleRole"
                        value={formData.responsibleRole || ""}
                        onChange={(e) => handleInputChange("responsibleRole", e.target.value)}
                        placeholder="Especifique el rol del responsable"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supervisionResponsibles">45. Responsables designados para la supervisión</Label>
                      <textarea
                        id="supervisionResponsibles"
                        value={formData.supervisionResponsibles}
                        onChange={(e) => handleInputChange("supervisionResponsibles", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
                        placeholder="Describa los responsables designados para la supervisión del sistema de IA..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="governanceCommitteeReporting">
                        46. Obligación de reportar al Comité de Gobernanza de IA
                      </Label>
                      <select
                        id="governanceCommitteeReporting"
                        value={formData.governanceCommitteeReporting}
                        onChange={(e) => handleInputChange("governanceCommitteeReporting", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="trimestral-evento">Trimestral y/o evento relevante identificado</option>
                        <option value="mensual-evento">Mensual y/o evento relevante identificado</option>
                        <option value="semestral-evento">Semestral y/o evento relevante identificado</option>
                        <option value="anual-evento">Anual y/o evento relevante identificado</option>
                        <option value="sin-definir">Sin definir</option>
                      </select>
                      {formData.governanceCommitteeReporting &&
                        formData.governanceCommitteeReporting !== "sin-definir" && (
                          <div className="mt-2">
                            <Label className="text-sm text-gray-600">Subir evidencia de reporte:</Label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.txt"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileUpload("reportingEvidence", file)
                              }}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                            {formData.reportingEvidenceFile && (
                              <div className="mt-1 flex items-center gap-2">
                                <span className="text-sm text-green-600">✓ Evidencia subida</span>
                                <button
                                  type="button"
                                  onClick={() => downloadFile(formData.reportingEvidenceFile!, "evidencia-reporte.pdf")}
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  Descargar
                                </button>
                              </div>
                            )}
                          </div>
                        )}
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
              <Button onClick={handleSave} className="bg-[#1bb67e] hover:bg-[#159f6b] text-white">
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
            {savedSystems.length === 0 ? (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t.noSystemsRegistered}</p>
                <Button
                  onClick={() => setActiveView("register")}
                  className="mt-4 bg-[#1bb67e] hover:bg-[#159f6b] text-white"
                >
                  {t.registerFirstSystem}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedSystems.map((system) => (
                  <Card key={system.id} className="border-l-4 border-l-[#1bb67e]">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{system.systemName}</h3>
                          <p className="text-gray-600">{system.companyName}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant={
                                system.riskLevel === "alto"
                                  ? "destructive"
                                  : system.riskLevel === "medio"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {system.riskLevel ? t[`${system.riskLevel}Risk` as keyof typeof t] : t.notEvaluated}
                            </Badge>
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
                            className="text-[#1bb67e] border-[#1bb67e] hover:bg-[#1bb67e] hover:text-white"
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
