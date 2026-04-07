"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { GeneralTabShell, type GeneralTabShellBadge, type GeneralTabShellNavItem } from "@/components/general-tab-shell"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
import { Save, Users, Calendar, FileText, Plus, Eye, Edit, Trash2, Download, FileCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import jsPDF from "jspdf"

interface CommitteeData {
  id?: string
  // Section A: Identification and composition
  committeeMembers: string[]
  otherMembers: string
  rolesDocumented: string
  rolesApproved: string
  organizationalLevel: string // Changed from optional to required

  // Section B: Purpose and structure
  missionDefined: string
  agendaDetermination: string
  meetingFrequency: string
  committeeFunctions: string // Added new field for committee functions
  otherFunctions: string // Added field for other functions

  // Section C: Functions and obligations
  reviewsInitiatives: string
  validatesDataPolicies: string
  definesProcesses: string
  promotesCulture: string

  // Section D: Monitoring and reporting
  establishesKPIs: string
  communicatesInternally: string
  reportsToManagement: string

  // Section E: Compliance and control
  formedBasedOnFrameworks: string
  periodicReview: string

  // Section F: Formation act
  constitutionDate: string
  authorizingAuthority: string
  otherAuthority: string
  foundingMembers: string
  formalDocumentSigned: string
  validityDefined: string

  // Document uploads
  documents?: {
    formalDocument?: { name: string; data: string }
    foundingDocument?: { name: string; data: string }
    frameworkDocument?: { name: string; data: string }
    rolesDocument?: { name: string; data: string }
    rolesApprovedDocument?: { name: string; data: string }
    missionDocument?: { name: string; data: string }
  }

  createdAt?: string
  lastModified?: string
}

export default function AIGovernanceCommitteePage() {
  const { language } = useLanguage()
  const t = translations[language]
  const { toast } = useToast()

  const [currentView, setCurrentView] = useState<"register" | "view">("register")
  const [editingCommittee, setEditingCommittee] = useState<string | null>(null)

  const [formData, setFormData] = useState<CommitteeData>({
    committeeMembers: [],
    otherMembers: "",
    rolesDocumented: "",
    rolesApproved: "",
    organizationalLevel: "", // Added organizational level
    missionDefined: "",
    agendaDetermination: "",
    meetingFrequency: "",
    committeeFunctions: "", // Added committee functions
    otherFunctions: "", // Added other functions
    reviewsInitiatives: "",
    validatesDataPolicies: "",
    definesProcesses: "",
    promotesCulture: "",
    establishesKPIs: "",
    communicatesInternally: "",
    reportsToManagement: "",
    formedBasedOnFrameworks: "",
    periodicReview: "",
    constitutionDate: "",
    authorizingAuthority: "",
    otherAuthority: "",
    foundingMembers: "",
    formalDocumentSigned: "",
    validityDefined: "",
    documents: {},
  })

  const [savedCommittees, setSavedCommittees] = useState<CommitteeData[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("aiGovernanceCommittees")
    if (saved) {
      setSavedCommittees(JSON.parse(saved))
    }
  }, [])

  const handleFileUpload = (field: string, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: {
            name: file.name,
            data: result,
          },
        },
      }))
      toast({
        title: t.success,
        description: t.uploadedSuccessfully,
      })
    }
    reader.readAsDataURL(file)
  }

  const downloadDocument = (docItem: { name: string; data: string }) => {
    const link = document.createElement("a")
    link.href = docItem.data
    link.download = docItem.name
    link.click()
  }

  const handleInputChange = (field: keyof CommitteeData, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleMemberToggle = (member: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      committeeMembers: checked
        ? [...prev.committeeMembers, member]
        : prev.committeeMembers.filter((m) => m !== member),
    }))
  }

  const validateForm = () => {
    const requiredFields = [
      { field: formData.committeeMembers.length > 0, name: t.committeeMembers },
      { field: formData.rolesDocumented, name: t.rolesDocumented },
      { field: formData.missionDefined, name: t.missionDefined },
      { field: formData.meetingFrequency, name: t.meetingFrequency },
      { field: formData.constitutionDate, name: t.constitutionDate },
    ]

    const emptyFields = requiredFields.filter((item) => !item.field)

    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map((item) => item.name).join(", ")
      toast({
        title: t.error,
        description: `${t.pleaseComplete}: ${fieldNames}`,
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const translateValue = (value: string | undefined): string => {
    if (!value) return ""
    const translations: { [key: string]: string } = {
      // Valores booleanos
      yes: "Sí",
      no: "No",
      true: "Sí",
      false: "No",

      // Niveles organizacionales
      executive: "Ejecutivo",
      senior: "Senior",
      middle: "Medio",
      operational: "Operacional",
      other: "Otro",

      // Frecuencias
      weekly: "Semanal",
      biweekly: "Quincenal",
      monthly: "Mensual",
      quarterly: "Trimestral",
      biannual: "Semestral",
      annual: "Anual",

      // Miembros del comité
      ceo: "CEO",
      cto: "CTO",
      ciso: "CISO",
      dpo: "DPO",
      legal: "Legal",
      hr: "Recursos Humanos",
      compliance: "Cumplimiento",
      risk: "Riesgos",
      audit: "Auditoría",
      it: "TI",
      business: "Negocio",
      external: "Externo",

      // Autoridades
      board: "Junta Directiva",
      management: "Gerencia",
      shareholders: "Accionistas",
      regulatory: "Regulatorio",
    }

    return translations[value?.toLowerCase()] || value
  }

  // Updated generatePDFReport function
  const generatePDFReport = (committee: CommitteeData) => {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.width
    let yPosition = 20

    // Header
    pdf.setFillColor(27, 182, 126)
    pdf.rect(0, 0, pageWidth, 30, "F")
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(18)
    pdf.text("Reporte de Comité de Gobernanza de IA", 20, 20)

    // Reset text color
    pdf.setTextColor(0, 0, 0)
    yPosition = 50

    // Committee ID and Date
    pdf.setFontSize(12)
    pdf.text(`ID del Comité: ${committee.id}`, 20, yPosition)
    yPosition += 10
    pdf.text(`Fecha del Reporte: ${new Date().toLocaleDateString()}`, 20, yPosition)
    yPosition += 20

    // Section A: Identificación y composición
    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.text("A. Identificación y composición", 20, yPosition)
    yPosition += 10
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)

    if (committee.committeeMembers) {
      const members = Array.isArray(committee.committeeMembers)
        ? committee.committeeMembers.map((member) => translateValue(member)).join(", ")
        : translateValue(committee.committeeMembers)
      pdf.text(`Miembros del comité: ${members}`, 20, yPosition)
      yPosition += 5
    }
    if (committee.otherMembers) {
      pdf.text(`Otros miembros: ${committee.otherMembers}`, 20, yPosition)
      yPosition += 5
    }
    if (committee.organizationalLevel) {
      pdf.text(`Nivel organizacional: ${translateValue(committee.organizationalLevel)}`, 20, yPosition)
      yPosition += 5
    }

    // Document evidence indicators
    const hasDocuments = committee.documents && Object.keys(committee.documents).length > 0
    pdf.text(`Documentos adjuntos: ${hasDocuments ? "✓ Sí" : "✗ No"}`, 20, yPosition)
    yPosition += 15

    // Section B: Propósito y estructura
    if (yPosition > 250) {
      pdf.addPage()
      yPosition = 20
    }
    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.text("B. Propósito y estructura", 20, yPosition)
    yPosition += 10
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)

    if (committee.missionDefined) {
      pdf.text(`Misión definida: ${translateValue(committee.missionDefined)}`, 20, yPosition)
      yPosition += 5
    }
    if (committee.agendaDetermination) {
      pdf.text(`Determinación de agenda: ${translateValue(committee.agendaDetermination)}`, 20, yPosition)
      yPosition += 5
    }
    if (committee.meetingFrequency) {
      pdf.text(`Frecuencia de reuniones: ${translateValue(committee.meetingFrequency)}`, 20, yPosition)
      yPosition += 5
    }
    yPosition += 10

    // Section C: Funciones y obligaciones
    if (yPosition > 250) {
      pdf.addPage()
      yPosition = 20
    }
    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.text("C. Funciones y obligaciones", 20, yPosition)
    yPosition += 10
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)

    if (committee.reviewsInitiatives) {
      pdf.text(`Revisa iniciativas: ${translateValue(committee.reviewsInitiatives)}`, 20, yPosition)
      yPosition += 5
    }
    if (committee.validatesDataPolicies) {
      pdf.text(`Valida políticas de datos: ${translateValue(committee.validatesDataPolicies)}`, 20, yPosition)
      yPosition += 5
    }
    if (committee.definesProcesses) {
      pdf.text(`Define procesos: ${translateValue(committee.definesProcesses)}`, 20, yPosition)
      yPosition += 5
    }
    if (committee.promotesCulture) {
      pdf.text(`Promueve cultura: ${translateValue(committee.promotesCulture)}`, 20, yPosition)
      yPosition += 5
    }
    yPosition += 10

    // Section D: Seguimiento y reporte
    if (yPosition > 250) {
      pdf.addPage()
      yPosition = 20
    }
    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.text("D. Seguimiento y reporte", 20, yPosition)
    yPosition += 10
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)

    if (committee.establishesKPIs) {
      pdf.text(`Establece KPIs: ${translateValue(committee.establishesKPIs)}`, 20, yPosition)
      yPosition += 5
    }
    if (committee.communicatesInternally) {
      pdf.text(`Comunica internamente: ${translateValue(committee.communicatesInternally)}`, 20, yPosition)
      yPosition += 5
    }
    if (committee.reportsToManagement) {
      pdf.text(`Reporta a la gerencia: ${translateValue(committee.reportsToManagement)}`, 20, yPosition)
      yPosition += 5
    }
    yPosition += 10

    // Section E: Conformidad y control
    if (yPosition > 250) {
      pdf.addPage()
      yPosition = 20
    }
    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.text("E. Conformidad y control", 20, yPosition)
    yPosition += 10
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)

    if (committee.formedBasedOnFrameworks) {
      pdf.text(`Formado basado en marcos: ${translateValue(committee.formedBasedOnFrameworks)}`, 20, yPosition)
      yPosition += 5
    }
    if (committee.periodicReview) {
      pdf.text(`Revisión periódica: ${translateValue(committee.periodicReview)}`, 20, yPosition)
      yPosition += 5
    }
    yPosition += 10

    // Section F: Acta de Conformación
    if (yPosition > 250) {
      pdf.addPage()
      yPosition = 20
    }
    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.text("F. Acta de Conformación", 20, yPosition)
    yPosition += 10
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)

    if (committee.constitutionDate) {
      pdf.text(`Fecha de constitución: ${committee.constitutionDate}`, 20, yPosition)
      yPosition += 5
    }
    if (committee.authorizingAuthority) {
      pdf.text(`Autoridad autorizante: ${translateValue(committee.authorizingAuthority)}`, 20, yPosition)
      yPosition += 5
    }
    if (committee.foundingMembers) {
      pdf.text(`Miembros fundadores: ${committee.foundingMembers}`, 20, yPosition)
      yPosition += 5
    }
    if (committee.formalDocumentSigned) {
      pdf.text(`Documento formal firmado: ${translateValue(committee.formalDocumentSigned)}`, 20, yPosition)
      yPosition += 5
    }
    if (committee.validityDefined) {
      pdf.text(`Validez definida: ${translateValue(committee.validityDefined)}`, 20, yPosition)
      yPosition += 5
    }

    // Footer
    const pageCount = pdf.internal.pages.length - 1
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.text(`Página ${i} de ${pageCount}`, pageWidth - 40, pdf.internal.pageSize.height - 10)
      pdf.text("Generado por DavaraGovernance AI", 20, pdf.internal.pageSize.height - 10)
    }

    pdf.save(`comite-gobernanza-${committee.id}.pdf`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const committeeEntry: CommitteeData = {
        id: editingCommittee || Date.now().toString(),
        ...formData,
        createdAt: editingCommittee
          ? savedCommittees.find((c) => c.id === editingCommittee)?.createdAt
          : new Date().toISOString(),
        lastModified: new Date().toISOString(),
      }

      const existingCommittees = JSON.parse(localStorage.getItem("aiGovernanceCommittees") || "[]")
      let updatedCommittees

      if (editingCommittee) {
        updatedCommittees = existingCommittees.map((c: CommitteeData) =>
          c.id === editingCommittee ? committeeEntry : c,
        )
      } else {
        updatedCommittees = [...existingCommittees, committeeEntry]
      }

      localStorage.setItem("aiGovernanceCommittees", JSON.stringify(updatedCommittees))
      setSavedCommittees(updatedCommittees)

      // Reset form
      setFormData({
        committeeMembers: [],
        otherMembers: "",
        rolesDocumented: "",
        rolesApproved: "",
        organizationalLevel: "",
        missionDefined: "",
        agendaDetermination: "",
        meetingFrequency: "",
        committeeFunctions: "",
        otherFunctions: "",
        reviewsInitiatives: "",
        validatesDataPolicies: "",
        definesProcesses: "",
        promotesCulture: "",
        establishesKPIs: "",
        communicatesInternally: "",
        reportsToManagement: "",
        formedBasedOnFrameworks: "",
        periodicReview: "",
        constitutionDate: "",
        authorizingAuthority: "",
        otherAuthority: "",
        foundingMembers: "",
        formalDocumentSigned: "",
        validityDefined: "",
        documents: {},
      })

      setEditingCommittee(null)
      setCurrentView("view")

      toast({
        title: t.success,
        description: editingCommittee ? "Datos del comité actualizados exitosamente" : t.committeeDataSaved,
      })
    } catch (error) {
      console.error("Error saving committee data:", error)
      toast({
        title: t.error,
        description: t.errorSavingData,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (committee: CommitteeData) => {
    setFormData(committee)
    setEditingCommittee(committee.id!)
    setCurrentView("register")
  }

  const handleDelete = (committeeId: string) => {
    if (confirm(t.confirmDelete)) {
      const updatedCommittees = savedCommittees.filter((c) => c.id !== committeeId)
      localStorage.setItem("aiGovernanceCommittees", JSON.stringify(updatedCommittees))
      setSavedCommittees(updatedCommittees)
      toast({
        title: t.success,
        description: "Comité eliminado exitosamente",
      })
    }
  }

  const memberOptions = [
    { value: "presidency", label: "Presidencia (CIO/CDO)" },
    { value: "technicalSecretary", label: "Secretaría Técnica (Legal/Cumplimiento/DPO)" },
    { value: "legalRepresentative", label: "Representante Legal" },
    { value: "technicalResponsible", label: "Responsable Técnico (CTO/Ciencia de Datos)" },
    { value: "ethicsOfficer", label: "Oficial de Ética o ESG" },
    { value: "userAreaRepresentatives", label: "Representantes de áreas usuarias" },
    { value: "privacyCommitteeLink", label: "Enlace con Comité de Privacidad" },
    { value: "legal", label: t.legal },
    { value: "privacy", label: t.privacy },
    { value: "securityIT", label: t.securityIT },
    { value: "rdTechnology", label: t.rdTechnology },
    { value: "productManagement", label: t.productManagement },
    { value: "hrCulture", label: t.hrCulture },
    { value: "compliance", label: "Compliance" },
    { value: "dpo", label: "DPO" },
    { value: "other", label: t.other },
  ]

  const organizationalLevelOptions = [
    { value: "operation", label: "Operación" },
    { value: "direction", label: "Dirección" },
    { value: "commercial", label: "Comercial" },
    { value: "marketing", label: "Marketing" },
  ]

  const committeeFunctionsOptions = [
    { value: "strategicSupervision", label: "Supervisión Estratégica (visión institucional, políticas éticas)" },
    { value: "riskManagement", label: "Gestión de Riesgos (identificación, clasificación, mitigación)" },
    { value: "regulatoryCompliance", label: "Cumplimiento Normativo (AI Act, LFPDPPP, auditorías)" },
    { value: "ethicsAndRights", label: "Ética y Derechos Fundamentales (no discriminación, rendición de cuentas)" },
    { value: "systemsReview", label: "Revisión de Sistemas (inventarios IA, autorización alto riesgo)" },
    { value: "training", label: "Capacitación (AI Literacy, cultura responsable)" },
    { value: "incidentManagement", label: "Gestión de Incidentes relacionados con IA" },
    { value: "ethicalPrinciples", label: "Publicación de principios éticos institucionales" },
    { value: "technicalSecurity", label: "Seguridad Técnica" },
    { value: "modelSecurity", label: "Seguridad del Modelo" },
    { value: "dataGovernance", label: "Gobernanza de Datos" },
    { value: "organizationalMeasures", label: "Medidas Organizacionales y Jurídicas" },
    { value: "generativeSecurity", label: "Seguridad en GPAI o sistemas generativos" },
    { value: "other", label: t.other },
  ]

  const navItems: GeneralTabShellNavItem[] = [
    { id: "register", label: editingCommittee ? "Editar comité" : "Registrar comité", mobileLabel: "Registrar", icon: Plus },
    { id: "view", label: "Comités registrados", mobileLabel: "Comités", icon: Eye, badge: savedCommittees.length || undefined },
  ]

  const headerBadges: GeneralTabShellBadge[] = [{ label: `${savedCommittees.length} comités`, tone: "primary" }]

  if (editingCommittee) {
    headerBadges.push({ label: "Edición activa", tone: "warning" })
  }

  return (
    <GeneralTabShell
      moduleLabel="Gobernanza IA"
      moduleTitle={t.aiGovernanceCommitteeForm}
      moduleDescription={t.aiGovernanceCommitteeFormDescription}
      pageLabel={currentView === "register" ? "Registrar comité" : "Comités registrados"}
      pageTitle={currentView === "register" ? (editingCommittee ? "Editar comité" : "Registrar comité") : "Comités registrados"}
      pageDescription={
        currentView === "register"
          ? "Completa información de composición, propósito, funciones y documentación del comité."
          : "Visualiza, edita y exporta los comités de gobernanza de IA almacenados."
      }
      navItems={navItems}
      activeNavId={currentView}
      onNavSelect={(itemId) => setCurrentView(itemId as "register" | "view")}
      headerBadges={headerBadges}
      backHref="/"
      backLabel="Volver al inicio"
    >

      {currentView === "register" && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section A: Identification and composition */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t.sectionATitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Producto/Operación</Label>
                <Select
                  value={formData.organizationalLevel}
                  onValueChange={(value) => handleInputChange("organizationalLevel", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationalLevelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">{t.committeeMembers}</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {memberOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.value}
                        checked={formData.committeeMembers.includes(option.value)}
                        onCheckedChange={(checked) => handleMemberToggle(option.value, checked as boolean)}
                      />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </div>
                {formData.committeeMembers.includes("other") && (
                  <div className="mt-4">
                    <Input
                      placeholder={t.specifyOther}
                      value={formData.otherMembers}
                      onChange={(e) => handleInputChange("otherMembers", e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label className="text-base font-medium">{t.rolesDocumented}</Label>
                <Select
                  value={formData.rolesDocumented}
                  onValueChange={(value) => handleInputChange("rolesDocumented", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fullyDocumented">Completamente documentados</SelectItem>
                    <SelectItem value="partiallyDocumented">Parcialmente documentados</SelectItem>
                    <SelectItem value="verballyAgreed">Solo verbalmente acordados</SelectItem>
                    <SelectItem value="inDevelopment">En desarrollo</SelectItem>
                    <SelectItem value="notDocumented">No documentados</SelectItem>
                  </SelectContent>
                </Select>
                {(formData.rolesDocumented === "fullyDocumented" ||
                  formData.rolesDocumented === "partiallyDocumented") && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">{t.uploadDocument}</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload("rolesDocument", file)
                          }}
                          className="flex-1"
                        />
                        {formData.documents?.rolesDocument && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => downloadDocument(formData.documents!.rolesDocument!)}
                          >
                            <FileCheck className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
              </div>

              <div>
                <Label className="text-base font-medium">Han sido aprobados los roles</Label>
                <Select
                  value={formData.rolesApproved}
                  onValueChange={(value) => handleInputChange("rolesApproved", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">{t.yes}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
                {formData.rolesApproved === "yes" && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium">{t.uploadDocument}</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload("rolesApprovedDocument", file)
                        }}
                        className="flex-1"
                      />
                      {formData.documents?.rolesApprovedDocument && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => downloadDocument(formData.documents!.rolesApprovedDocument!)}
                        >
                          <FileCheck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section B: Purpose and structure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t.sectionBTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">
                  ¿La misión del comité está definida y alineada con la estrategia de IA?
                </Label>
                <Select
                  value={formData.missionDefined}
                  onValueChange={(value) => handleInputChange("missionDefined", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">{t.yes}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                  </SelectContent>
                </Select>
                {formData.missionDefined === "yes" && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium">{t.uploadDocument}</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload("missionDocument", file)
                        }}
                        className="flex-1"
                      />
                      {formData.documents?.missionDocument && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => downloadDocument(formData.documents!.missionDocument!)}
                        >
                          <FileCheck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-base font-medium">¿Cómo se determina la agenda del comité?</Label>
                <Select
                  value={formData.agendaDetermination}
                  onValueChange={(value) => handleInputChange("agendaDetermination", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boardOfDirectors">Consejo de administración</SelectItem>
                    <SelectItem value="committeeItself">{t.committeeItself}</SelectItem>
                    <SelectItem value="members">{t.members}</SelectItem>
                    <SelectItem value="noFormalAgenda">{t.noFormalAgenda}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">¿Con qué frecuencia se reúne el comité?</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Se recomienda reuniones ordinarias trimestrales y extraordinarias según criticidad
                </p>
                <Select
                  value={formData.meetingFrequency}
                  onValueChange={(value) => handleInputChange("meetingFrequency", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quarterly">{t.quarterly} (Recomendado)</SelectItem>
                    <SelectItem value="bimonthly">{t.bimonthly}</SelectItem>
                    <SelectItem value="monthly">{t.monthly}</SelectItem>
                    <SelectItem value="extraordinary">Solo reuniones extraordinarias</SelectItem>
                    <SelectItem value="notDefined">No está definida</SelectItem>
                    <SelectItem value="other">{t.other}</SelectItem>
                  </SelectContent>
                </Select>
                {formData.meetingFrequency === "other" && (
                  <Input
                    placeholder="Especificar frecuencia"
                    value={formData.otherFunctions}
                    onChange={(e) => handleInputChange("otherFunctions", e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              <div>
                <Label className="text-base font-medium">Describa las funciones del comité</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Seleccione las funciones que desempeña el comité según las mejores prácticas de gobernanza de IA
                </p>
                <div className="grid grid-cols-1 gap-3 mt-3">
                  {committeeFunctionsOptions.map((option) => (
                    <div key={option.value} className="flex items-start space-x-3 p-2 rounded border hover:bg-gray-50">
                      <Checkbox
                        id={`function-${option.value}`}
                        checked={formData.committeeFunctions.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const currentFunctions = formData.committeeFunctions.split(",").filter((f) => f.trim())
                          if (checked) {
                            setFormData((prev) => ({
                              ...prev,
                              committeeFunctions: [...currentFunctions, option.value].join(","),
                            }))
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              committeeFunctions: currentFunctions.filter((f) => f !== option.value).join(","),
                            }))
                          }
                        }}
                        className="mt-1"
                      />
                      <Label htmlFor={`function-${option.value}`} className="text-sm leading-relaxed cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.committeeFunctions.includes("other") && (
                  <Input
                    placeholder="Especificar otras funciones"
                    value={formData.otherFunctions}
                    onChange={(e) => handleInputChange("otherFunctions", e.target.value)}
                    className="mt-3"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section C: Functions and obligations */}
          <Card>
            <CardHeader>
              <CardTitle>{t.sectionCTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">
                  ¿Revisa las iniciativas de IA antes de su implementación?
                </Label>
                <Select
                  value={formData.reviewsInitiatives}
                  onValueChange={(value) => handleInputChange("reviewsInitiatives", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yesSystematically">{t.yesSystematically}</SelectItem>
                    <SelectItem value="onlyAdHoc">{t.onlyAdHoc}</SelectItem>
                    <SelectItem value="rarely">{t.rarely}</SelectItem>
                    <SelectItem value="never">{t.never}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">
                  ¿Valida las políticas de datos y privacidad relacionadas con la IA?
                </Label>
                <Select
                  value={formData.validatesDataPolicies}
                  onValueChange={(value) => handleInputChange("validatesDataPolicies", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yesCompletely">{t.yesCompletely}</SelectItem>
                    <SelectItem value="partially">{t.partially}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="notApplicable">{t.notApplicable}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">
                  ¿Define los procesos para garantizar el uso ético y responsable de la IA?
                </Label>
                <Select
                  value={formData.definesProcesses}
                  onValueChange={(value) => handleInputChange("definesProcesses", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yesDocumented">{t.yesDocumented}</SelectItem>
                    <SelectItem value="partially">{t.partially}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="notApplicable">{t.notApplicable}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">
                  ¿Promueve la cultura de IA (formación, sensibilización)?
                </Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="promotes-yes"
                      checked={formData.promotesCulture === "yes"}
                      onCheckedChange={(checked) => {
                        if (checked) handleInputChange("promotesCulture", "yes")
                      }}
                    />
                    <Label htmlFor="promotes-yes">{t.yes}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="promotes-no"
                      checked={formData.promotesCulture === "no"}
                      onCheckedChange={(checked) => {
                        if (checked) handleInputChange("promotesCulture", "no")
                      }}
                    />
                    <Label htmlFor="promotes-no">{t.no}</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section D: Monitoring and reporting */}
          <Card>
            <CardHeader>
              <CardTitle>{t.sectionDTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">
                  ¿Establece KPIs para medir el impacto y el riesgo de la IA?
                </Label>
                <Select
                  value={formData.establishesKPIs}
                  onValueChange={(value) => handleInputChange("establishesKPIs", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yesDetailed">{t.yesDetailed}</SelectItem>
                    <SelectItem value="partially">{t.partially}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="notApplicable">{t.notApplicable}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">
                  ¿Comunica internamente las decisiones y los resultados del comité?
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Las mejores prácticas incluyen actas aprobadas y reportes regulares a alta dirección
                </p>
                <Select
                  value={formData.communicatesInternally}
                  onValueChange={(value) => handleInputChange("communicatesInternally", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approvedMinutes">Actas aprobadas con acuerdos y seguimiento</SelectItem>
                    <SelectItem value="executiveReports">Reportes ejecutivos a alta dirección/Consejo</SelectItem>
                    <SelectItem value="bulletinIntranet">{t.bulletinIntranet}</SelectItem>
                    <SelectItem value="executiveReport">{t.executiveReport}</SelectItem>
                    <SelectItem value="verbally">{t.verbally}</SelectItem>
                    <SelectItem value="nothing">{t.nothing}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">
                  ¿Reporta a la gerencia sobre el cumplimiento de las políticas de IA?
                </Label>
                <Select
                  value={formData.reportsToManagement}
                  onValueChange={(value) => handleInputChange("reportsToManagement", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quarterly">{t.quarterly}</SelectItem>
                    <SelectItem value="semiannual">{t.semiannual}</SelectItem>
                    <SelectItem value="annual">{t.annual}</SelectItem>
                    <SelectItem value="adHocOrNever">{t.adHocOrNever}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Section E: Compliance and control */}
          <Card>
            <CardHeader>
              <CardTitle>{t.sectionETitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">¿Se formó basado en marcos regulatorios o éticos?</Label>
                <Select
                  value={formData.formedBasedOnFrameworks}
                  onValueChange={(value) => handleInputChange("formedBasedOnFrameworks", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yesExplicitly">{t.yesExplicitly}</SelectItem>
                    <SelectItem value="partially">{t.partially}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="didNotKnow">{t.didNotKnow}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">¿Se realiza una revisión periódica del comité?</Label>
                <Select
                  value={formData.periodicReview}
                  onValueChange={(value) => handleInputChange("periodicReview", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">{t.annual}</SelectItem>
                    <SelectItem value="every2to3Years">{t.every2to3Years}</SelectItem>
                    <SelectItem value="never">{t.never}</SelectItem>
                    <SelectItem value="notApplicable">{t.notApplicable}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Section F: Formation act */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t.sectionFTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">{t.constitutionDate}</Label>
                <Input
                  type="date"
                  value={formData.constitutionDate}
                  onChange={(e) => handleInputChange("constitutionDate", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-base font-medium">{t.authorizingAuthority}</Label>
                <Select
                  value={formData.authorizingAuthority}
                  onValueChange={(value) => handleInputChange("authorizingAuthority", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boardOfDirectors">{t.boardOfDirectors}</SelectItem>
                    <SelectItem value="generalManagement">{t.generalManagement}</SelectItem>
                    <SelectItem value="legalDirection">{t.legalDirection}</SelectItem>
                    <SelectItem value="otherSpecify">{t.otherSpecify}</SelectItem>
                  </SelectContent>
                </Select>
                {formData.authorizingAuthority === "otherSpecify" && (
                  <Input
                    placeholder={t.specifyAuthority}
                    value={formData.otherAuthority}
                    onChange={(e) => handleInputChange("otherAuthority", e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              <div>
                <Label className="text-base font-medium">{t.foundingMembers}</Label>
                <Textarea
                  placeholder={t.enterFoundingMembers}
                  value={formData.foundingMembers}
                  onChange={(e) => handleInputChange("foundingMembers", e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-base font-medium">{t.formalDocumentSigned}</Label>
                <Select
                  value={formData.formalDocumentSigned}
                  onValueChange={(value) => handleInputChange("formalDocumentSigned", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yesInDocumentManagementSystem">{t.yesInDocumentManagementSystem}</SelectItem>
                    <SelectItem value="yesInPhysicalFile">{t.yesInPhysicalFile}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="inProcess">{t.inProcess}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">{t.validityDefined}</Label>
                <Select
                  value={formData.validityDefined}
                  onValueChange={(value) => handleInputChange("validityDefined", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yesAnnual">{t.yesAnnual}</SelectItem>
                    <SelectItem value="yesEvery2to3Years">{t.yesEvery2to3Years}</SelectItem>
                    <SelectItem value="no">{t.no}</SelectItem>
                    <SelectItem value="notApplicable">{t.notApplicable}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            {editingCommittee && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingCommittee(null)
                  setFormData({
                    committeeMembers: [],
                    otherMembers: "",
                    rolesDocumented: "",
                    rolesApproved: "",
                    organizationalLevel: "",
                    missionDefined: "",
                    agendaDetermination: "",
                    meetingFrequency: "",
                    committeeFunctions: "",
                    otherFunctions: "",
                    reviewsInitiatives: "",
                    validatesDataPolicies: "",
                    definesProcesses: "",
                    promotesCulture: "",
                    establishesKPIs: "",
                    communicatesInternally: "",
                    reportsToManagement: "",
                    formedBasedOnFrameworks: "",
                    periodicReview: "",
                    constitutionDate: "",
                    authorizingAuthority: "",
                    otherAuthority: "",
                    foundingMembers: "",
                    formalDocumentSigned: "",
                    validityDefined: "",
                    documents: {},
                  })
                }}
              >
                {t.cancel}
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="bg-[#01A79E] hover:bg-[#018b84]">
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? t.submitting : editingCommittee ? "Actualizar datos del comité" : t.saveCommitteeData}
            </Button>
          </div>
        </form>
      )}

      {currentView === "view" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {t.registeredCommittees}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {savedCommittees.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t.noCommitteesRegistered}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedCommittees.map((committee) => (
                  <div key={committee.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <Label className="text-sm font-medium">{t.committeeId}</Label>
                        <p className="text-sm text-gray-600">{committee.id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">{t.constitutionDate}</Label>
                        <p className="text-sm text-gray-600">{committee.constitutionDate}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">{t.documentAttached}</Label>
                        <p className="text-sm text-gray-600">
                          {committee.documents && Object.keys(committee.documents).length > 0 ? "✓" : "✗"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(committee)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => generatePDFReport(committee)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(committee.id!)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </GeneralTabShell>
  )
}
