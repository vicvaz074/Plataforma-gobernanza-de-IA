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
import { FileText, Plus, Eye, Edit, Trash2, Download, Database, ClipboardList, FileDown } from "lucide-react"
import { Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"

const RiskClassificationInfo = () => (
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
            <li>
              Reconocimiento facial en tiempo real en espacios públicos para control policial (salvo excepciones muy
              restringidas).
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-orange-600">2. Alto Riesgo</h4>
          <p className="mb-2">
            Permitidos, pero bajo requisitos estrictos de cumplimiento. Son los más relevantes porque abarcan muchos
            usos.
          </p>
          <p className="font-medium">Incluye dos grandes categorías:</p>
          <ol className="list-decimal list-inside ml-2 space-y-1">
            <li>Sistemas de IA como productos regulados (ej.: dispositivos médicos, vehículos autónomos).</li>
            <li>
              Sistemas de IA en sectores críticos listados en el Anexo III:
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
            <li>
              Chatbots y sistemas conversacionales → deben informar claramente al usuario de que interactúa con una IA.
            </li>
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
)

interface AISystemData {
  id: string
  companyName: string
  systemName: string
  createdAt: string
  lastUpdateDate: string
  lastUpdateResponsible: string
  systemDescription: string
  responsibleArea: string
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
  impactEvaluation: string
  impactEvaluationJustification?: string
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
  replacesHumanDecisionsPhase?: string
  explainable: string
  riskMitigationMeasures: string[]
  securityMeasures: string[]
  internationalTransfer: string
  transferMechanism: string
  raciArea: string
  raciAreaOther?: string
  raciOwnerName: string
  raciOwnerRole: string
  raciOwnerEmail: string
  raciOperationalName: string
  raciOperationalRole: string
  raciOperationalEmail: string
  raciTechnicalR: string
  raciTechnicalA: string
  raciTechnicalC: string
  raciTechnicalI: string
  raciLegalR: string
  raciLegalA: string
  raciLegalC: string
  raciLegalI: string
  raciPrivacyR: string
  raciPrivacyA: string
  raciPrivacyC: string
  raciPrivacyI: string
  raciEthicalR: string
  raciEthicalA: string
  raciEthicalC: string
  raciEthicalI: string
  raciSecurityR: string
  raciSecurityA: string
  raciSecurityC: string
  raciSecurityI: string
  raciReportFrequency: string
  raciReportRecipients: string[]
  raciReportRecipientsOther?: string
  raciApprovalsDocumented: string
  raciEscalationChannels: string[]
  raciEscalationChannelsOther?: string
  raciActExistence: string
  raciAcceptanceName: string
  raciAcceptanceRole: string
  raciAcceptanceDate: string
  complaintsChannel: string
  arcoRights: string
  responsibleAreaOther?: string
  systemStageOther?: string
  autonomyLevelOther?: string
  decisionImpactOther?: string
  transferMechanismOther?: string
  inputDataTypesOther?: string
  dataOriginOther?: string
  aiTypeOther?: string
  securityMeasuresOther?: string
  identifiedRisksOther?: string
  riskMitigationMeasuresOther?: string
  technicalDocumentationFile?: string
  internalDocumentationFile?: string
  transferMechanismFile?: string
  registrationEvidenceFile?: string
  criticalSectorType?: string
  securityDevelopment?: string[]
  securityProduction?: string[]
  securityModel?: string[]
  securityGovernance?: string[]
  securityOrganizational?: string[]
  securityGPAI?: string[]
  personalDataSubtypes?: string[]
  piSubtypes?: string[]
  algorithmicSubtypes?: string[]
  developmentType?: string
  providerName?: string
  userAreas?: string[]
  userAreasOther?: string
  providerType?: string
  datasetSystem?: string
  noPersonalDataSubtypes?: string[]
  highRiskClassificationOther?: string
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
    createdAt: "",
    lastUpdateDate: "",
    lastUpdateResponsible: "",
    systemDescription: "",
    responsibleArea: "",
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
    impactEvaluation: "",
    impactEvaluationJustification: "",
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
    replacesHumanDecisionsPhase: "",
    explainable: "",
    riskMitigationMeasures: [],
    securityMeasures: [],
    internationalTransfer: "",
    transferMechanism: "",
    raciArea: "",
    raciAreaOther: "",
    raciOwnerName: "",
    raciOwnerRole: "",
    raciOwnerEmail: "",
    raciOperationalName: "",
    raciOperationalRole: "",
    raciOperationalEmail: "",
    raciTechnicalR: "",
    raciTechnicalA: "",
    raciTechnicalC: "",
    raciTechnicalI: "",
    raciLegalR: "",
    raciLegalA: "",
    raciLegalC: "",
    raciLegalI: "",
    raciPrivacyR: "",
    raciPrivacyA: "",
    raciPrivacyC: "",
    raciPrivacyI: "",
    raciEthicalR: "",
    raciEthicalA: "",
    raciEthicalC: "",
    raciEthicalI: "",
    raciSecurityR: "",
    raciSecurityA: "",
    raciSecurityC: "",
    raciSecurityI: "",
    raciReportFrequency: "",
    raciReportRecipients: [],
    raciReportRecipientsOther: "",
    raciApprovalsDocumented: "",
    raciEscalationChannels: [],
    raciEscalationChannelsOther: "",
    raciActExistence: "",
    raciAcceptanceName: "",
    raciAcceptanceRole: "",
    raciAcceptanceDate: "",
    complaintsChannel: "",
    arcoRights: "",
    responsibleAreaOther: "",
    systemStageOther: "",
    autonomyLevelOther: "",
    decisionImpactOther: "",
    transferMechanismOther: "",
    inputDataTypesOther: "",
    dataOriginOther: "",
    aiTypeOther: "",
    securityMeasuresOther: "",
    identifiedRisksOther: "",
    riskMitigationMeasuresOther: "",
    registrationEvidenceFile: "",
    criticalSectorType: "",
    securityDevelopment: [],
    securityProduction: [],
    securityModel: [],
    securityGovernance: [],
    securityOrganizational: [],
    securityGPAI: [],
    personalDataSubtypes: [],
    piSubtypes: [],
    algorithmicSubtypes: [],
    developmentType: "",
    providerName: "",
    userAreas: [],
    userAreasOther: "",
    providerType: "",
    datasetSystem: "",
    noPersonalDataSubtypes: [],
    highRiskClassificationOther: "",
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
        createdAt: "",
        lastUpdateDate: "",
        lastUpdateResponsible: "",
        systemDescription: "",
        responsibleArea: "",
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
        impactEvaluation: "",
        impactEvaluationJustification: "",
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
        replacesHumanDecisionsPhase: "",
        explainable: "",
        riskMitigationMeasures: [],
        securityMeasures: [],
        internationalTransfer: "",
        transferMechanism: "",
        raciArea: "",
        raciAreaOther: "",
        raciOwnerName: "",
        raciOwnerRole: "",
        raciOwnerEmail: "",
        raciOperationalName: "",
        raciOperationalRole: "",
        raciOperationalEmail: "",
        raciTechnicalR: "",
        raciTechnicalA: "",
        raciTechnicalC: "",
        raciTechnicalI: "",
        raciLegalR: "",
        raciLegalA: "",
        raciLegalC: "",
        raciLegalI: "",
        raciPrivacyR: "",
        raciPrivacyA: "",
        raciPrivacyC: "",
        raciPrivacyI: "",
        raciEthicalR: "",
        raciEthicalA: "",
        raciEthicalC: "",
        raciEthicalI: "",
        raciSecurityR: "",
        raciSecurityA: "",
        raciSecurityC: "",
        raciSecurityI: "",
        raciReportFrequency: "",
        raciReportRecipients: [],
        raciReportRecipientsOther: "",
        raciApprovalsDocumented: "",
        raciEscalationChannels: [],
        raciEscalationChannelsOther: "",
        raciActExistence: "",
        raciAcceptanceName: "",
        raciAcceptanceRole: "",
        raciAcceptanceDate: "",
        complaintsChannel: "",
        arcoRights: "",
        responsibleAreaOther: "",
        systemStageOther: "",
        autonomyLevelOther: "",
        decisionImpactOther: "",
        transferMechanismOther: "",
        inputDataTypesOther: "",
        dataOriginOther: "",
        aiTypeOther: "",
        securityMeasuresOther: "",
        identifiedRisksOther: "",
        riskMitigationMeasuresOther: "",
        registrationEvidenceFile: "",
        criticalSectorType: "",
        securityDevelopment: [],
        securityProduction: [],
        securityModel: [],
        securityGovernance: [],
        securityOrganizational: [],
        securityGPAI: [],
        personalDataSubtypes: [],
        piSubtypes: [],
        algorithmicSubtypes: [],
        developmentType: "",
        providerName: "",
        userAreas: [],
        userAreasOther: "",
        providerType: "",
        datasetSystem: "",
        noPersonalDataSubtypes: [],
        highRiskClassificationOther: "",
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
          "Evaluación de impacto algorítmico/PI":
            system.impactEvaluation +
            (system.impactEvaluationJustification
              ? ` (${system.impactEvaluationJustification})`
              : ""),
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
          "La IA toma decisiones sin intervención humana": system.replacesHumanDecisions,
          "Fase o momento de decisiones autónomas": system.replacesHumanDecisionsPhase,
          Explicable: system.explainable,
          "Medidas de mitigación":
            system.riskMitigationMeasures?.join(", ") +
            (system.riskMitigationMeasuresOther ? ` (${system.riskMitigationMeasuresOther})` : ""),
        })

        addSection("G. SEGURIDAD Y TRANSFERENCIAS", {
          "Medidas de seguridad":
            system.securityMeasures?.join(", ") +
            (system.securityMeasuresOther ? ` (${system.securityMeasuresOther})` : ""),
          "Transferencia internacional": system.internationalTransfer,
          "Mecanismo de transferencia":
            system.transferMechanism + (system.transferMechanismOther ? ` (${system.transferMechanismOther})` : ""),
          "Evidencia mecanismo transferencia": system.transferMechanismFile ? "✓ Archivo adjunto" : "✗ Sin evidencia",
        })

        addSection("H. RESPONSABILIDADES INTERNAS (RACI)", {
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

        addSection("I. TRANSPARENCIA Y DERECHOS", {
          "Canal de quejas": system.complaintsChannel,
          "Derechos ARCO": system.arcoRights,
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
      savedSystems
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
                      <Label htmlFor="developmentType">2. ¿Es un desarrollo interno o se adquiere de un tercero?</Label>
                      <select
                        id="developmentType"
                        value={formData.developmentType || ""}
                        onChange={(e) => handleInputChange("developmentType", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="interno">Desarrollo interno</option>
                        <option value="tercero">Se adquiere de un tercero</option>
                        <option value="proveedor-interno">Se adquiere de un proveedor o distribuidor interno</option>
                      </select>
                    </div>

                    {formData.developmentType !== "interno" && (
                      <div className="space-y-2">
                        <Label htmlFor="providerName">Nombre del proveedor o distribuidor</Label>
                        <Input
                          id="providerName"
                          value={formData.providerName || ""}
                          onChange={(e) => handleInputChange("providerName", e.target.value)}
                          placeholder="Ingrese el nombre del proveedor o distribuidor"
                        />
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
                        <option value="activo">Activo</option>
                        <option value="desarrollo">Desarrollo</option>
                        <option value="piloto">Piloto</option>
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
                        <RiskClassificationInfo />
                      </div>
                      <select
                        id="highRiskClassification"
                        value={formData.highRiskClassification}
                        onChange={(e) => handleInputChange("highRiskClassification", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="alto-riesgo">Alto Riesgo</option>
                        <option value="otro">Otro</option>
                        <option value="riesgo-inaceptable">Riesgo Inaceptable</option>
                        <option value="riesgo-limitado">Riesgo Limitado</option>
                        <option value="riesgo-minimo">Riesgo Mínimo o Nulo</option>
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
                      <Label htmlFor="impactEvaluation">
                        21. ¿Se realizó evaluación de impacto algorítmico y de propiedad intelectual (PI)?
                      </Label>
                      <div className="flex items-center space-x-2">
                        <select
                          id="impactEvaluation"
                          value={formData.impactEvaluation}
                          onChange={(e) => handleInputChange("impactEvaluation", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="no">No</option>
                          <option value="proceso">En proceso</option>
                          <option value="no-aplica">No aplica</option>
                        </select>
                        <Link
                          href="/evaluacion-impacto-algoritmico"
                          target="_blank"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Ir al módulo
                        </Link>
                      </div>
                      {(formData.impactEvaluation === "no" || formData.impactEvaluation === "no-aplica") && (
                        <Textarea
                          id="impactEvaluationJustification"
                          value={formData.impactEvaluationJustification || ""}
                          onChange={(e) => handleInputChange("impactEvaluationJustification", e.target.value)}
                          placeholder="Justificación (ej.: no aplica por...)"
                          rows={3}
                        />
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
                        <option value="no">No</option>
                        <option value="no-aplica">No aplica</option>
                        <option value="si-claramente">Sí claramente</option>
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
                        <option value="no">No</option>
                        <option value="no-aplica">No aplica</option>
                        <option value="si-completo">Sí completo</option>
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
                        <option value="en-proceso">En proceso</option>
                        <option value="no">No</option>
                        <option value="si-completa">Sí completa</option>
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
                        <option value="en-proceso">En proceso</option>
                        <option value="no">No</option>
                        <option value="si-completa">Sí completa</option>
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
                        <option value="no">No</option>
                        <option value="si">Sí</option>
                      </select>
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
                        <option value="no">No</option>
                        <option value="si">Sí</option>
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
                        <option value="no">No</option>
                        <option value="si">Sí</option>
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
                        <option value="no">No</option>
                        <option value="si">Sí</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="criticalSectors">31. ¿Está en sectores críticos?</Label>
                        <RiskClassificationInfo />
                      </div>
                      <select
                        id="criticalSectors"
                        value={formData.criticalSectors}
                        onChange={(e) => handleInputChange("criticalSectors", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="no">No</option>
                        <option value="si">Sí</option>
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
                            <option value="educacion">Educación</option>
                            <option value="energia">Energía</option>
                            <option value="financiero">Financiero</option>
                            <option value="justicia">Justicia</option>
                            <option value="otro">Otro</option>
                            <option value="salud">Salud</option>
                            <option value="seguridad">Seguridad</option>
                            <option value="transporte">Transporte</option>
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="replacesHumanDecisions">32. ¿La IA toma decisiones sin intervención humana?</Label>
                      <select
                        id="replacesHumanDecisions"
                        value={formData.replacesHumanDecisions}
                        onChange={(e) => handleInputChange("replacesHumanDecisions", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="no">No</option>
                        <option value="si">Sí</option>
                      </select>
                      {formData.replacesHumanDecisions === "si" && (
                        <div className="mt-2">
                          <Label htmlFor="replacesHumanDecisionsPhase">
                            Describa la fase o momento donde ocurren
                          </Label>
                          <Input
                            id="replacesHumanDecisionsPhase"
                            value={formData.replacesHumanDecisionsPhase || ""}
                            onChange={(e) => handleInputChange("replacesHumanDecisionsPhase", e.target.value)}
                            placeholder="Fase o momento"
                          />
                        </div>
                      )}
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
                        <option value="no">No</option>
                        <option value="si">Sí</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>34. Medidas de mitigación de riesgos</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "EIPD",
                        "Evaluación de impacto algorítmico",
                        "Evaluación de PI",
                        "Evaluación ética",
                        "Controles de acceso",
                        "Cifrado",
                        "Supervisión humana",
                        "Auditorías",
                        "Monitoreo continuo",
                        "Capacitación",
                        "Políticas internas",
                      ].map((option) => {
                        const id = `mitigation-${option.toLowerCase().replace(/\s+/g, "-")}`
                        return (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={id}
                              checked={formData.riskMitigationMeasures.includes(option)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("riskMitigationMeasures", option, checked)
                              }
                            />
                            <Label htmlFor={id}>{option}</Label>
                          </div>
                        )
                      })}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="mitigation-otro"
                          checked={formData.riskMitigationMeasures.includes("Otro")}
                          onCheckedChange={(checked) => handleCheckboxChange("riskMitigationMeasures", "Otro", checked)}
                        />
                        <Label htmlFor="mitigation-otro">Otro</Label>
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
                </CardContent>
              </Card>


              <Card>
                <CardHeader>
                  <CardTitle>H. Registro de responsabilidades internas (RACI)</CardTitle>
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
                        <option value="no">No</option>
                        <option value="si">Sí</option>
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
                        <option value="no">No</option>
                        <option value="no-aplica">No aplica</option>
                        <option value="si">Sí</option>
                      </select>
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
