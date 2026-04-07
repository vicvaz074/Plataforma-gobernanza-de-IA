"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, Edit, Trash2, FileText, Plus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
import { sortAlphabetically } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { GeneralTabShell, type GeneralTabShellBadge, type GeneralTabShellNavItem } from "@/components/general-tab-shell"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import jsPDF from "jspdf"

interface PolicyData {
  id: string
  policyType: string
  policyFullName: string
  policyPurpose: string
  appliesTo: string[]
  topicsCovered: string[]
  effectiveStartDate: Date | null
  effectiveEndDate: Date | null
  isIndefinite: boolean
  lastReviewDate: Date | null
  reviewPeriodicity: string
  responsibleArea: string
  designatedResponsible: string
  policyVersion: string
  currentStatus: string
  approvedBy: string
  relationshipOtherPolicies: string
  additionalObservations: string
  createdAt: Date
}

export default function PoliticasProcesosGobernanza() {
  const { language } = useLanguage()
  const t = translations[language]
  const { toast } = useToast()
  const [activeCard, setActiveCard] = useState<"register" | "manage">("register")
  const [policies, setPolicies] = useState<PolicyData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [areaFilter, setAreaFilter] = useState("")
  const [editingPolicy, setEditingPolicy] = useState<PolicyData | null>(null)

  // Form state
  const [formData, setFormData] = useState<Omit<PolicyData, "id" | "createdAt">>({
    policyType: "",
    policyFullName: "",
    policyPurpose: "",
    appliesTo: [],
    topicsCovered: [],
    effectiveStartDate: null,
    effectiveEndDate: null,
    isIndefinite: false,
    lastReviewDate: null,
    reviewPeriodicity: "",
    responsibleArea: "",
    designatedResponsible: "",
    policyVersion: "",
    currentStatus: "",
    approvedBy: "",
    relationshipOtherPolicies: "",
    additionalObservations: "",
  })

  // Load policies from localStorage
  useEffect(() => {
    const savedPolicies = localStorage.getItem("governancePolicies")
    if (savedPolicies) {
      const parsedPolicies = JSON.parse(savedPolicies).map((policy: any) => ({
        ...policy,
        effectiveStartDate: policy.effectiveStartDate ? new Date(policy.effectiveStartDate) : null,
        effectiveEndDate: policy.effectiveEndDate ? new Date(policy.effectiveEndDate) : null,
        lastReviewDate: policy.lastReviewDate ? new Date(policy.lastReviewDate) : null,
        createdAt: new Date(policy.createdAt),
      }))
      setPolicies(parsedPolicies)
    }
  }, [])

  // Save policies to localStorage
  const savePolicies = (updatedPolicies: PolicyData[]) => {
    localStorage.setItem("governancePolicies", JSON.stringify(updatedPolicies))
    setPolicies(updatedPolicies)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.policyType || !formData.policyFullName || !formData.policyPurpose) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const newPolicy: PolicyData = {
      ...formData,
      id: editingPolicy?.id || Date.now().toString(),
      createdAt: editingPolicy?.createdAt || new Date(),
    }

    let updatedPolicies
    if (editingPolicy) {
      updatedPolicies = policies.map((p) => (p.id === editingPolicy.id ? newPolicy : p))
      toast({
        title: "Éxito",
        description: "Política actualizada exitosamente",
      })
    } else {
      updatedPolicies = [...policies, newPolicy]
      toast({
        title: "Éxito",
        description: t.policyRegistered || "Política registrada exitosamente",
      })
    }

    savePolicies(updatedPolicies)
    resetForm()
    setActiveCard("manage")
  }

  const resetForm = () => {
    setFormData({
      policyType: "",
      policyFullName: "",
      policyPurpose: "",
      appliesTo: [],
      topicsCovered: [],
      effectiveStartDate: null,
      effectiveEndDate: null,
      isIndefinite: false,
      lastReviewDate: null,
      reviewPeriodicity: "",
      responsibleArea: "",
      designatedResponsible: "",
      policyVersion: "",
      currentStatus: "",
      approvedBy: "",
      relationshipOtherPolicies: "",
      additionalObservations: "",
    })
    setEditingPolicy(null)
  }

  const handleEdit = (policy: PolicyData) => {
    setFormData(policy)
    setEditingPolicy(policy)
    setActiveCard("register")
  }

  const handleDelete = (id: string) => {
    const updatedPolicies = policies.filter((p) => p.id !== id)
    savePolicies(updatedPolicies)
    toast({
      title: "Éxito",
      description: t.policyDeleted || "Política eliminada exitosamente",
    })
  }

  const generatePDF = (policy: PolicyData) => {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.text("Reporte de Política de Gobernanza", 20, 30)

    // Policy details
    doc.setFontSize(12)
    let yPosition = 50

    const addField = (label: string, value: string) => {
      doc.setFont("helvetica", "bold")
      doc.text(`${label}:`, 20, yPosition)
      doc.setFont("helvetica", "normal")
      doc.text(value, 20, yPosition + 7)
      yPosition += 20
    }

    addField("Tipo de Política", policy.policyType)
    addField("Nombre Completo", policy.policyFullName)
    addField("Propósito", policy.policyPurpose)
    addField("Aplica a", policy.appliesTo.join(", "))
    addField("Temas que Cubre", policy.topicsCovered.join(", "))
    addField("Estatus Actual", policy.currentStatus)
    addField("Versión", policy.policyVersion)
    addField("Área Responsable", policy.responsibleArea)
    addField("Responsable Designado", policy.designatedResponsible)

    if (policy.effectiveStartDate) {
      addField("Fecha de Inicio", format(policy.effectiveStartDate, "dd/MM/yyyy"))
    }

    if (policy.lastReviewDate) {
      addField("Última Revisión", format(policy.lastReviewDate, "dd/MM/yyyy"))
    }

    addField("Periodicidad de Revisión", policy.reviewPeriodicity)
    addField("Aprobada por", policy.approvedBy)

    if (policy.relationshipOtherPolicies) {
      addField("Relación con Otras Políticas", policy.relationshipOtherPolicies)
    }

    if (policy.additionalObservations) {
      addField("Observaciones Adicionales", policy.additionalObservations)
    }

    doc.save(`politica-${policy.policyFullName.replace(/\s+/g, "-").toLowerCase()}.pdf`)
  }

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.policyFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.policyType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || policy.currentStatus === statusFilter
    const matchesArea = !areaFilter || policy.responsibleArea === areaFilter

    return matchesSearch && matchesStatus && matchesArea
  })

  const policyTypes = sortAlphabetically(
    [
      "responsibleUsePolicy",
      "ethicsPrinciplesPolicy",
      "dataProtectionPolicy",
      "biasNonDiscriminationPolicy",
      "transparencyExplainabilityPolicy",
      "humanSupervisionPolicy",
      "securityCybersecurityPolicy",
      "riskManagementPolicy",
      "foundationalGenerativeModelsPolicy",
      "intellectualPropertyLicensingPolicy",
      "thirdPartySupplierPolicy",
      "trainingOrganizationalCulturePolicy",
    ],
    (type) => (t as any)[type] || type,
  )

  const appliesToOptions = sortAlphabetically(
    ["aiCommittee", "entireOrganization", "itArea", "legalArea", "productOperations", "security", "suppliers"],
    (option) => (t as any)[option] || option,
  )

  const topicsCoveredOptions = sortAlphabetically(
    [
      "biasDiscrimination",
      "ethics",
      "humanSupervision",
      "intellectualProperty",
      "others",
      "privacy",
      "risks",
      "security",
      "transparency",
    ],
    (option) => (t as any)[option] || option,
  )

  const responsibleAreaOptions = sortAlphabetically(
    ["aiGovernanceCommittee", "generalManagement", "legal", "security", "technology"],
    (option) => (t as any)[option] || option,
  )

  const statusOptions = sortAlphabetically(
    ["active", "draft", "repealed", "underReview"],
    (option) => (t as any)[option] || option,
  )

  const approvedByOptions = sortAlphabetically(
    ["aiGovernanceCommittee", "boardOfDirectors", "generalManagement"],
    (option) => (t as any)[option] || option,
  )

  const periodicityOptions = sortAlphabetically(
    ["adHoc", "annual", "biannual", "quarterly"],
    (option) => (t as any)[option] || option,
  )

  const navItems: GeneralTabShellNavItem[] = [
    { id: "register", label: editingPolicy ? "Editar política" : "Registrar política", mobileLabel: "Registrar", icon: Plus },
    { id: "manage", label: t.managePolicies || "Gestionar políticas", mobileLabel: "Gestionar", icon: FileText, badge: policies.length || undefined },
  ]

  const headerBadges: GeneralTabShellBadge[] = [{ label: `${policies.length} políticas`, tone: "primary" }]

  if (editingPolicy) {
    headerBadges.push({ label: "Edición activa", tone: "warning" })
  }

  return (
    <GeneralTabShell
      moduleLabel="Gobernanza IA"
      moduleTitle={t.governancePoliciesProcesses || "Políticas y procesos de gobernanza"}
      moduleDescription={t.governancePoliciesProcessesDescription || "Gestiona las políticas y procesos de gobernanza de IA"}
      pageLabel={activeCard === "register" ? "Registrar política" : t.managePolicies || "Gestionar políticas"}
      pageTitle={activeCard === "register" ? (editingPolicy ? "Editar política" : "Registrar política") : t.managePolicies || "Gestionar políticas"}
      pageDescription={
        activeCard === "register"
          ? "Registra o actualiza políticas de gobernanza de IA con trazabilidad, vigencia y responsables."
          : "Visualiza, filtra, edita y exporta las políticas registradas."
      }
      navItems={navItems}
      activeNavId={activeCard}
      onNavSelect={(itemId) => setActiveCard(itemId as "register" | "manage")}
      headerBadges={headerBadges}
      backHref="/dashboard"
      backLabel="Volver al panel"
    >

      {/* Register Policy Form */}
      {activeCard === "register" && (
        <Card>
          <CardHeader>
            <CardTitle>{t.governancePoliciesProcessesForm || "Formulario de Políticas"}</CardTitle>
            <CardDescription>
              {t.governancePoliciesProcessesFormDescription || "Complete la información de la política"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Policy Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="policyType" className="text-sm font-medium">
                  {t.policyTypeQuestion || "¿Qué política desea registrar?"} *
                </Label>
                <Select
                  value={formData.policyType}
                  onValueChange={(value) => setFormData({ ...formData, policyType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de política" />
                  </SelectTrigger>
                  <SelectContent>
                    {policyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {(t as any)[type] || type}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Otro (especifique)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Policy Full Name */}
              <div className="space-y-2">
                <Label htmlFor="policyFullName" className="text-sm font-medium">
                  {t.policyFullName} *
                </Label>
                <Input
                  id="policyFullName"
                  value={formData.policyFullName}
                  onChange={(e) => setFormData({ ...formData, policyFullName: e.target.value })}
                  placeholder="Ingrese el nombre completo de la política"
                />
              </div>

              {/* Policy Purpose */}
              <div className="space-y-2">
                <Label htmlFor="policyPurpose" className="text-sm font-medium">
                  {t.policyPurpose} *
                </Label>
                <Textarea
                  id="policyPurpose"
                  value={formData.policyPurpose}
                  onChange={(e) => setFormData({ ...formData, policyPurpose: e.target.value })}
                  placeholder={t.policyPurposePlaceholder}
                  rows={3}
                />
              </div>

              {/* Applies To */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.appliesTo}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {appliesToOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={formData.appliesTo.includes(option)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, appliesTo: [...formData.appliesTo, option] })
                          } else {
                            setFormData({
                              ...formData,
                              appliesTo: formData.appliesTo.filter((item) => item !== option),
                            })
                          }
                        }}
                      />
                      <Label htmlFor={option} className="text-sm">
                        {(t as any)[option] || option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics Covered */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.topicsCovered}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {topicsCoveredOptions.map((topic) => (
                    <div key={topic} className="flex items-center space-x-2">
                      <Checkbox
                        id={topic}
                        checked={formData.topicsCovered.includes(topic)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, topicsCovered: [...formData.topicsCovered, topic] })
                          } else {
                            setFormData({
                              ...formData,
                              topicsCovered: formData.topicsCovered.filter((item) => item !== topic),
                            })
                          }
                        }}
                      />
                      <Label htmlFor={topic} className="text-sm">
                        {(t as any)[topic] || topic}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t.effectiveStartDate}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.effectiveStartDate
                          ? format(formData.effectiveStartDate, "dd/MM/yyyy", { locale: es })
                          : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.effectiveStartDate || undefined}
                        onSelect={(date) => setFormData({ ...formData, effectiveStartDate: date || null })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t.effectiveEndDate}</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="indefinite"
                        checked={formData.isIndefinite}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            isIndefinite: !!checked,
                            effectiveEndDate: checked ? null : formData.effectiveEndDate,
                          })
                        }
                      />
                      <Label htmlFor="indefinite" className="text-sm">
                        {t.indefinite}
                      </Label>
                    </div>
                    {!formData.isIndefinite && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.effectiveEndDate
                              ? format(formData.effectiveEndDate, "dd/MM/yyyy", { locale: es })
                              : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.effectiveEndDate || undefined}
                            onSelect={(date) => setFormData({ ...formData, effectiveEndDate: date || null })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
              </div>

              {/* Last Review Date */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.lastReviewDate}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.lastReviewDate
                        ? format(formData.lastReviewDate, "dd/MM/yyyy", { locale: es })
                        : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.lastReviewDate || undefined}
                      onSelect={(date) => setFormData({ ...formData, lastReviewDate: date || null })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Review Periodicity */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.reviewPeriodicity}</Label>
                <Select
                  value={formData.reviewPeriodicity}
                  onValueChange={(value) => setFormData({ ...formData, reviewPeriodicity: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la periodicidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodicityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {(t as any)[option] || option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Responsible Area */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.responsibleArea}</Label>
                <Select
                  value={formData.responsibleArea}
                  onValueChange={(value) => setFormData({ ...formData, responsibleArea: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el área responsable" />
                  </SelectTrigger>
                  <SelectContent>
                    {responsibleAreaOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {(t as any)[option] || option}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Designated Responsible */}
              <div className="space-y-2">
                <Label htmlFor="designatedResponsible" className="text-sm font-medium">
                  {t.designatedResponsible}
                </Label>
                <Input
                  id="designatedResponsible"
                  value={formData.designatedResponsible}
                  onChange={(e) => setFormData({ ...formData, designatedResponsible: e.target.value })}
                  placeholder="Nombre y cargo del responsable"
                />
              </div>

              {/* Policy Version */}
              <div className="space-y-2">
                <Label htmlFor="policyVersion" className="text-sm font-medium">
                  {t.policyVersion}
                </Label>
                <Input
                  id="policyVersion"
                  value={formData.policyVersion}
                  onChange={(e) => setFormData({ ...formData, policyVersion: e.target.value })}
                  placeholder={t.policyVersionPlaceholder}
                />
              </div>

              {/* Current Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.currentStatus}</Label>
                <Select
                  value={formData.currentStatus}
                  onValueChange={(value) => setFormData({ ...formData, currentStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el estatus" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {(t as any)[status] || status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Approved By */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.approvedBy}</Label>
                <Select
                  value={formData.approvedBy}
                  onValueChange={(value) => setFormData({ ...formData, approvedBy: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione quién aprobó" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedByOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {(t as any)[option] || option}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Relationship with Other Policies */}
              <div className="space-y-2">
                <Label htmlFor="relationshipOtherPolicies" className="text-sm font-medium">
                  {t.relationshipOtherPolicies}
                </Label>
                <Textarea
                  id="relationshipOtherPolicies"
                  value={formData.relationshipOtherPolicies}
                  onChange={(e) => setFormData({ ...formData, relationshipOtherPolicies: e.target.value })}
                  placeholder={t.relationshipPlaceholder}
                  rows={2}
                />
              </div>

              {/* Additional Observations */}
              <div className="space-y-2">
                <Label htmlFor="additionalObservations" className="text-sm font-medium">
                  {t.additionalObservations}
                </Label>
                <Textarea
                  id="additionalObservations"
                  value={formData.additionalObservations}
                  onChange={(e) => setFormData({ ...formData, additionalObservations: e.target.value })}
                  placeholder="Observaciones adicionales sobre la política"
                  rows={3}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  {editingPolicy ? "Actualizar Política" : "Registrar Política"}
                </Button>
                {editingPolicy && (
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                    Cancelar Edición
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Manage Policies */}
      {activeCard === "manage" && (
        <Card>
          <CardHeader>
            <CardTitle>{t.managePolicies || "Gestionar Políticas"}</CardTitle>
            <CardDescription>Visualiza, edita y gestiona las políticas de gobernanza registradas</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={t.searchPolicies || "Buscar políticas..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t.filterByStatus || "Filtrar por estatus"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allStatuses || "Todos los estatus"}</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {(t as any)[status] || status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t.filterByArea || "Filtrar por área"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allAreas || "Todas las áreas"}</SelectItem>
                  {responsibleAreaOptions.map((area) => (
                    <SelectItem key={area} value={area}>
                      {(t as any)[area] || area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Policies List */}
            {filteredPolicies.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay políticas registradas</h3>
                <p className="text-gray-500 mb-4">Comience registrando su primera política de gobernanza de IA</p>
                <Button onClick={() => setActiveCard("register")} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Primera Política
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredPolicies.map((policy) => (
                  <Card key={policy.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{policy.policyFullName}</h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                policy.currentStatus === "active"
                                  ? "bg-green-100 text-green-800"
                                  : policy.currentStatus === "draft"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : policy.currentStatus === "underReview"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {(t as any)[policy.currentStatus] || policy.currentStatus}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{policy.policyPurpose}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span>Versión: {policy.policyVersion}</span>
                            <span>Área: {(t as any)[policy.responsibleArea] || policy.responsibleArea}</span>
                            {policy.effectiveStartDate && (
                              <span>Vigencia: {format(policy.effectiveStartDate, "dd/MM/yyyy")}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generatePDF(policy)}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(policy)}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            {t.editPolicy || "Editar"}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                {t.deletePolicy || "Eliminar"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t.confirmDelete || "¿Está seguro de que desea eliminar esta política?"}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(policy.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
    </GeneralTabShell>
  )
}
