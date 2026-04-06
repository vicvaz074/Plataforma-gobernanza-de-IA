"use client"

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
import { GeneralTabShell, type GeneralTabShellBadge, type GeneralTabShellNavItem } from "@/components/general-tab-shell"
import {
  CalendarIcon,
  Upload,
  Edit,
  Trash2,
  FileText,
  Search,
  Users,
  Plus,
  Eye,
  Database,
  ClipboardList,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
import { sortAlphabetically } from "@/lib/utils"
import jsPDF from "jspdf"

interface TrainingData {
  id: string
  courseName: string
  mainTopic: string
  trainingObjective: string
  depthLevel: string
  modality: string
  instructorName: string
  instructorType: string
  instructorProfile: string
  startDate: Date | null
  endDate: Date | null
  totalDuration: string
  locationPlatform: string
  participantsList: string
  attendeeAreas: string[]
  totalAttendees: string
  targetAudienceLevel: string
  trainingEvidence: File[]
  attendeeEvaluation: string
  evaluationResults: string
  certificatesDelivered: string
  internalResponsible: string
  nextUpdateDate: Date | null
  programVersion: string
  trainingStatus: string
  additionalObservations: string
  createdAt: Date
  updatedAt: Date
}

interface SupportMaterial {
  id: string
  materialType: string
  materialDescription: string
  file: File
  uploadDate: Date
  relatedTraining: string
}

export default function ConcientizacionEntrenamientoIA() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const t = translations[language]

  const [activeView, setActiveView] = useState<"register" | "view" | "materials">("register")

  // Training form state
  const [formData, setFormData] = useState<Partial<TrainingData>>({
    courseName: "",
    mainTopic: "",
    trainingObjective: "",
    depthLevel: "",
    modality: "",
    instructorName: "",
    instructorType: "",
    instructorProfile: "",
    startDate: null,
    endDate: null,
    totalDuration: "",
    locationPlatform: "",
    participantsList: "",
    attendeeAreas: [],
    totalAttendees: "",
    targetAudienceLevel: "",
    trainingEvidence: [],
    attendeeEvaluation: "",
    evaluationResults: "",
    certificatesDelivered: "",
    internalResponsible: "",
    nextUpdateDate: null,
    programVersion: "",
    trainingStatus: "",
    additionalObservations: "",
  })

  // Support material form state
  const [materialData, setMaterialData] = useState<Partial<SupportMaterial>>({
    materialType: "",
    materialDescription: "",
    file: undefined,
    relatedTraining: "",
  })

  // Data management state
  const [trainings, setTrainings] = useState<TrainingData[]>([])
  const [materials, setMaterials] = useState<SupportMaterial[]>([])
  const [editingTraining, setEditingTraining] = useState<TrainingData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [modalityFilter, setModalityFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")

  // Load data from localStorage
  useEffect(() => {
    const savedTrainings = localStorage.getItem("aiTrainings")
    const savedMaterials = localStorage.getItem("aiTrainingMaterials")

    if (savedTrainings) {
      setTrainings(JSON.parse(savedTrainings))
    }
    if (savedMaterials) {
      setMaterials(JSON.parse(savedMaterials))
    }
  }, [])

  // Save training data
  const saveTraining = () => {
    if (!formData.courseName || !formData.mainTopic || !formData.trainingObjective) {
      toast({
        title: t.validationError,
        description: t.requiredFieldsMissing,
        variant: "destructive",
      })
      return
    }

    const { id: _formId, ...formRest } = formData as TrainingData
    const trainingData: TrainingData = {
      id: editingTraining?.id || _formId || Date.now().toString(),
      ...formRest,
      createdAt: editingTraining?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    let updatedTrainings
    if (editingTraining) {
      updatedTrainings = trainings.map((t) => (t.id === editingTraining.id ? trainingData : t))
      toast({
        title: t.success,
        description: t.trainingUpdated,
      })
    } else {
      updatedTrainings = [...trainings, trainingData]
      toast({
        title: t.success,
        description: t.trainingSaved,
      })
    }

    setTrainings(updatedTrainings)
    localStorage.setItem("aiTrainings", JSON.stringify(updatedTrainings))

    // Reset form
    setFormData({
      courseName: "",
      mainTopic: "",
      trainingObjective: "",
      depthLevel: "",
      modality: "",
      instructorName: "",
      instructorType: "",
      instructorProfile: "",
      startDate: null,
      endDate: null,
      totalDuration: "",
      locationPlatform: "",
      participantsList: "",
      attendeeAreas: [],
      totalAttendees: "",
      targetAudienceLevel: "",
      trainingEvidence: [],
      attendeeEvaluation: "",
      evaluationResults: "",
      certificatesDelivered: "",
      internalResponsible: "",
      nextUpdateDate: null,
      programVersion: "",
      trainingStatus: "",
      additionalObservations: "",
    })
    setEditingTraining(null)
  }

  // Save support material
  const saveMaterial = () => {
    if (!materialData.materialType || !materialData.materialDescription || !materialData.file) {
      toast({
        title: t.validationError,
        description: t.requiredFieldsMissing,
        variant: "destructive",
      })
      return
    }

    const { id: _materialId, uploadDate: _uploadDate, ...materialRest } =
      materialData as SupportMaterial
    const material: SupportMaterial = {
      id: _materialId || Date.now().toString(),
      ...materialRest,
      uploadDate: new Date(),
    }

    const updatedMaterials = [...materials, material]
    setMaterials(updatedMaterials)
    localStorage.setItem("aiTrainingMaterials", JSON.stringify(updatedMaterials))

    toast({
      title: t.success,
      description: t.materialUploaded,
    })

    // Reset form
    setMaterialData({
      materialType: "",
      materialDescription: "",
      file: undefined,
      relatedTraining: "",
    })
  }

  // Delete training
  const deleteTraining = (id: string) => {
    const updatedTrainings = trainings.filter((t) => t.id !== id)
    setTrainings(updatedTrainings)
    localStorage.setItem("aiTrainings", JSON.stringify(updatedTrainings))

    toast({
      title: t.success,
      description: t.trainingDeleted,
    })
  }

  // Delete material
  const deleteMaterial = (id: string) => {
    const updatedMaterials = materials.filter((m) => m.id !== id)
    setMaterials(updatedMaterials)
    localStorage.setItem("aiTrainingMaterials", JSON.stringify(updatedMaterials))

    toast({
      title: t.success,
      description: t.materialDeleted,
    })
  }

  // Generate PDF report
  const generatePDFReport = (training: TrainingData) => {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(20)
    doc.text("Reporte de Capacitación en IA", 20, 30)

    // Training details
    doc.setFontSize(12)
    let yPosition = 50

    const addField = (label: string, value: string) => {
      doc.text(`${label}: ${value}`, 20, yPosition)
      yPosition += 10
    }

    addField("Nombre del curso", training.courseName)
    addField("Tema principal", training.mainTopic)
    addField("Objetivo", training.trainingObjective)
    addField("Nivel", training.depthLevel)
    addField("Modalidad", training.modality)
    addField("Instructor", training.instructorName)
    addField("Tipo de instructor", training.instructorType)
    addField("Duración total", training.totalDuration + " horas")
    addField("Total de asistentes", training.totalAttendees)
    addField("Estado", training.trainingStatus)

    if (training.startDate) {
      addField("Fecha de inicio", format(training.startDate, "dd/MM/yyyy"))
    }
    if (training.endDate) {
      addField("Fecha de término", format(training.endDate, "dd/MM/yyyy"))
    }

    doc.save(`capacitacion-${training.courseName.replace(/\s+/g, "-").toLowerCase()}.pdf`)
  }

  // Filter trainings
  const filteredTrainings = trainings.filter((training) => {
    const matchesSearch =
      training.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.mainTopic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || training.trainingStatus === statusFilter
    const matchesModality = modalityFilter === "all" || training.modality === modalityFilter
    const matchesLevel = levelFilter === "all" || training.depthLevel === levelFilter

    return matchesSearch && matchesStatus && matchesModality && matchesLevel
  })

  const materialTypeOptions = [
    t.slides,
    t.infographics,
    t.manuals,
    t.videos,
    t.exercises,
    t.assessments,
    t.references,
  ]

  // Training topics options (alphabetically ordered)
  const trainingTopics = sortAlphabetically([
    t.aiDataProtection,
    t.aiEthics,
    t.aiFunctionalAreas,
    t.aiGovernanceCompliance,
    t.aiIntellectualProperty,
    t.aiSecurity,
    t.deepLearning,
    t.explainableAI,
    t.generativeAI,
    t.introToAI,
    t.mlFundamentals,
    t.nlpProcessing,
    t.responsibleAIUse,
    t.other,
  ])

  // Attendee areas options (alphabetically ordered)
  const attendeeAreas = sortAlphabetically([
    "Administración",
    "Compras",
    "Compliance",
    "Finanzas",
    "Jurídico",
    "Marketing",
    "Operaciones",
    "Recursos Humanos",
    "Seguridad",
    "Tecnología",
  ])

  const resetForm = () => {
    setFormData({
      courseName: "",
      mainTopic: "",
      trainingObjective: "",
      depthLevel: "",
      modality: "",
      instructorName: "",
      instructorType: "",
      instructorProfile: "",
      startDate: null,
      endDate: null,
      totalDuration: "",
      locationPlatform: "",
      participantsList: "",
      attendeeAreas: [],
      totalAttendees: "",
      targetAudienceLevel: "",
      trainingEvidence: [],
      attendeeEvaluation: "",
      evaluationResults: "",
      certificatesDelivered: "",
      internalResponsible: "",
      nextUpdateDate: null,
      programVersion: "",
      trainingStatus: "",
      additionalObservations: "",
    })
    setEditingTraining(null)
    setActiveView("register")
  }

  const navItems: GeneralTabShellNavItem[] = [
    {
      id: "register",
      label: editingTraining ? t.editTraining : t.trainingRegistration,
      mobileLabel: "Registrar",
      icon: Plus,
    },
    { id: "view", label: t.viewTrainings, mobileLabel: "Capacitaciones", icon: Eye, badge: trainings.length || undefined },
    { id: "materials", label: t.supportMaterials, mobileLabel: "Materiales", icon: Upload, badge: materials.length || undefined },
  ]

  const headerBadges: GeneralTabShellBadge[] = [
    { label: `${trainings.length} ${t.registeredTrainings.toLowerCase()}`, tone: "primary" },
    { label: `${materials.length} materiales`, tone: "neutral" },
  ]

  return (
    <GeneralTabShell
      moduleLabel="Gobernanza IA"
      moduleTitle={t.awarenessTrainingAI}
      moduleDescription={t.awarenessTrainingDescription}
      pageLabel={
        activeView === "register"
          ? t.trainingRegistration
          : activeView === "view"
            ? t.viewTrainings
            : t.supportMaterials
      }
      pageTitle={
        activeView === "register"
          ? editingTraining
            ? t.editTraining
            : t.trainingRegistration
          : activeView === "view"
            ? t.viewTrainings
            : t.supportMaterials
      }
      pageDescription={
        activeView === "register"
          ? t.trainingRegistrationDescription
          : activeView === "view"
            ? t.viewTrainingsDescription
            : t.supportMaterialsDescription
      }
      navItems={navItems}
      activeNavId={activeView}
      onNavSelect={(itemId) => setActiveView(itemId as "register" | "view" | "materials")}
      headerBadges={headerBadges}
      backHref="/dashboard"
      backLabel="Volver al panel"
    >

      {activeView === "register" && (
        <Card className="border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-800 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {editingTraining ? t.editTraining : t.trainingRegistration}
            </CardTitle>
            <CardDescription className="text-green-600">
              {editingTraining ? t.editTrainingDescription : t.trainingRegistrationDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Section A: General Training Data */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800 border-b border-green-200 pb-2">
                {t.generalTrainingData}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseName">{t.courseName} *</Label>
                  <Input
                    id="courseName"
                    value={formData.courseName || ""}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    placeholder="Nombre del curso..."
                  />
                </div>

                <div>
                  <Label htmlFor="mainTopic">{t.mainTopic} *</Label>
                  <Select
                    value={formData.mainTopic || ""}
                    onValueChange={(value) => setFormData({ ...formData, mainTopic: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tema..." />
                    </SelectTrigger>
                    <SelectContent>
                      {trainingTopics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="trainingObjective">{t.trainingObjective} *</Label>
                <Textarea
                  id="trainingObjective"
                  value={formData.trainingObjective || ""}
                  onChange={(e) => setFormData({ ...formData, trainingObjective: e.target.value })}
                  placeholder="Ejemplo: Sensibilizar a empleados en sesgos de IA en procesos de contratación"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="depthLevel">{t.depthLevel}</Label>
                  <Select
                    value={formData.depthLevel || ""}
                    onValueChange={(value) => setFormData({ ...formData, depthLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nivel..." />
                    </SelectTrigger>
                    <SelectContent>
                      {sortAlphabetically([
                        t.introductory,
                        t.intermediate,
                        t.advanced,
                        t.specialized,
                      ]).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="modality">{t.modality}</Label>
                  <Select
                    value={formData.modality || ""}
                    onValueChange={(value) => setFormData({ ...formData, modality: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar modalidad..." />
                    </SelectTrigger>
                    <SelectContent>
                      {sortAlphabetically([
                        t.hybrid,
                        t.inPerson,
                        t.selfStudy,
                        t.virtual,
                      ]).map((mod) => (
                        <SelectItem key={mod} value={mod}>
                          {mod}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section B: Instructor Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800 border-b border-green-200 pb-2">
                {t.instructorInfo}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instructorName">{t.instructorName}</Label>
                  <Input
                    id="instructorName"
                    value={formData.instructorName || ""}
                    onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                    placeholder="Nombre del instructor..."
                  />
                </div>

                <div>
                  <Label htmlFor="instructorType">{t.instructorType}</Label>
                  <Select
                    value={formData.instructorType || ""}
                    onValueChange={(value) => setFormData({ ...formData, instructorType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {sortAlphabetically([
                        t.external,
                        t.independentConsultant,
                        t.internal,
                        t.technologyProvider,
                        t.universityInstitute,
                      ]).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="instructorProfile">{t.instructorProfile}</Label>
                <Textarea
                  id="instructorProfile"
                  value={formData.instructorProfile || ""}
                  onChange={(e) => setFormData({ ...formData, instructorProfile: e.target.value })}
                  placeholder="Ej. experto en ética de IA, científico de datos, abogado especializado en privacidad"
                  rows={2}
                />
              </div>
            </div>

            {/* Section C: Training Logistics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800 border-b border-green-200 pb-2">
                {t.trainingLogistics}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>{t.startDate}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate
                          ? format(formData.startDate, "dd/MM/yyyy", { locale: es })
                          : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate || undefined}
                        onSelect={(date) => setFormData({ ...formData, startDate: date || null })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>{t.endDate}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate
                          ? format(formData.endDate, "dd/MM/yyyy", { locale: es })
                          : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate || undefined}
                        onSelect={(date) => setFormData({ ...formData, endDate: date || null })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="totalDuration">{t.durationHours}</Label>
                  <Input
                    id="totalDuration"
                    type="number"
                    value={formData.totalDuration || ""}
                    onChange={(e) => setFormData({ ...formData, totalDuration: e.target.value })}
                    placeholder="Horas"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="locationPlatform">{t.locationPlatform}</Label>
                <Input
                  id="locationPlatform"
                  value={formData.locationPlatform || ""}
                  onChange={(e) => setFormData({ ...formData, locationPlatform: e.target.value })}
                  placeholder="Ej. Sala de juntas, Zoom, LMS interno"
                />
              </div>
            </div>

            {/* Section D: Attendee Registration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800 border-b border-green-200 pb-2">
                {t.attendeeRegistration}
              </h3>

              <div>
                <Label htmlFor="participantsList">{t.participantsList}</Label>
                <Textarea
                  id="participantsList"
                  value={formData.participantsList || ""}
                  onChange={(e) => setFormData({ ...formData, participantsList: e.target.value })}
                  placeholder="Lista de participantes o integración con directorio interno"
                  rows={3}
                />
              </div>

              <div>
                <Label>{t.attendeeAreas}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {attendeeAreas.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={formData.attendeeAreas?.includes(area) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              attendeeAreas: [...(formData.attendeeAreas || []), area],
                            })
                          } else {
                            setFormData({
                              ...formData,
                              attendeeAreas: formData.attendeeAreas?.filter((a) => a !== area) || [],
                            })
                          }
                        }}
                      />
                      <Label htmlFor={area} className="text-sm">
                        {area}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalAttendees">{t.totalAttendees}</Label>
                  <Input
                    id="totalAttendees"
                    type="number"
                    value={formData.totalAttendees || ""}
                    onChange={(e) => setFormData({ ...formData, totalAttendees: e.target.value })}
                    placeholder="Número de asistentes"
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudienceLevel">{t.targetAudienceLevel}</Label>
                  <Select
                    value={formData.targetAudienceLevel || ""}
                    onValueChange={(value) => setFormData({ ...formData, targetAudienceLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nivel..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={t.allLevels}>{t.allLevels}</SelectItem>
                      <SelectItem value={t.executives}>{t.executives}</SelectItem>
                      <SelectItem value={t.middleManagement}>{t.middleManagement}</SelectItem>
                      <SelectItem value={t.operationalStaff}>{t.operationalStaff}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section E: Evidence and Follow-up */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800 border-b border-green-200 pb-2">
                {t.evidenceFollowUp}
              </h3>

              <div>
                <Label htmlFor="trainingEvidence">{t.trainingEvidence}</Label>
                <Input
                  id="trainingEvidence"
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    setFormData({ ...formData, trainingEvidence: files })
                  }}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">Presentación, grabación, fotos, lista de firmas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="attendeeEvaluation">{t.attendeeEvaluation}</Label>
                  <Select
                    value={formData.attendeeEvaluation || ""}
                    onValueChange={(value) => setFormData({ ...formData, attendeeEvaluation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar evaluación..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={t.freeForm}>{t.freeForm}</SelectItem>
                      <SelectItem value={t.knowledgeExam}>{t.knowledgeExam}</SelectItem>
                      <SelectItem value={t.satisfactionSurvey}>{t.satisfactionSurvey}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="certificatesDelivered">{t.certificatesDelivered}</Label>
                  <Select
                    value={formData.certificatesDelivered || ""}
                    onValueChange={(value) => setFormData({ ...formData, certificatesDelivered: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={t.inProcess}>{t.inProcess}</SelectItem>
                      <SelectItem value={t.no}>{t.no}</SelectItem>
                      <SelectItem value={t.yes}>{t.yes}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="evaluationResults">{t.evaluationResults}</Label>
                <Textarea
                  id="evaluationResults"
                  value={formData.evaluationResults || ""}
                  onChange={(e) => setFormData({ ...formData, evaluationResults: e.target.value })}
                  placeholder="Resultados de la evaluación"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="internalResponsible">{t.internalResponsible}</Label>
                  <Input
                    id="internalResponsible"
                    value={formData.internalResponsible || ""}
                    onChange={(e) => setFormData({ ...formData, internalResponsible: e.target.value })}
                    placeholder="Responsable interno"
                  />
                </div>

                <div>
                  <Label>{t.nextUpdateDate}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.nextUpdateDate
                          ? format(formData.nextUpdateDate, "dd/MM/yyyy", { locale: es })
                          : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.nextUpdateDate || undefined}
                        onSelect={(date) => setFormData({ ...formData, nextUpdateDate: date || null })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Section F: Traceability and Control */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800 border-b border-green-200 pb-2">
                {t.traceabilityControl}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="programVersion">{t.programVersion}</Label>
                  <Input
                    id="programVersion"
                    value={formData.programVersion || ""}
                    onChange={(e) => setFormData({ ...formData, programVersion: e.target.value })}
                    placeholder="ej. v1.0, v2.0"
                  />
                </div>

                <div>
                  <Label htmlFor="trainingStatus">{t.trainingStatus}</Label>
                  <Select
                    value={formData.trainingStatus || ""}
                    onValueChange={(value) => setFormData({ ...formData, trainingStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={t.cancelled}>{t.cancelled}</SelectItem>
                      <SelectItem value={t.completed}>{t.completed}</SelectItem>
                      <SelectItem value={t.inProgress}>{t.inProgress}</SelectItem>
                      <SelectItem value={t.scheduled}>{t.scheduled}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="additionalObservations">{t.additionalObservations}</Label>
                <Textarea
                  id="additionalObservations"
                  value={formData.additionalObservations || ""}
                  onChange={(e) => setFormData({ ...formData, additionalObservations: e.target.value })}
                  placeholder="Observaciones adicionales"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button onClick={saveTraining} className="bg-[#01A79E] hover:bg-[#018b84]">
                {editingTraining ? t.updateTraining : t.saveTraining}
              </Button>
              {editingTraining && (
                <Button variant="outline" onClick={resetForm}>
                  {t.cancel}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeView === "view" && (
        <Card className="border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t.viewTrainings}
            </CardTitle>
            <CardDescription className="text-green-600">{t.viewTrainingsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Search and filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t.searchTrainings}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t.filterByStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allStatuses}</SelectItem>
                  {sortAlphabetically(
                    [
                      { value: t.completed, label: t.completed },
                      { value: t.inProgress, label: t.inProgress },
                      { value: t.scheduled, label: t.scheduled },
                      { value: t.cancelled, label: t.cancelled },
                    ],
                    (opt) => opt.label
                  ).map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={modalityFilter} onValueChange={setModalityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t.filterByModality} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allModalities}</SelectItem>
                  {sortAlphabetically(
                    [
                      { value: "Híbrida", label: t.hybrid },
                      { value: "Presencial", label: t.inPerson },
                      { value: "Virtual", label: t.virtual },
                    ],
                    (opt) => opt.label
                  ).map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t.filterByLevel} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allLevels}</SelectItem>
                  {sortAlphabetically(
                    [
                      { value: "Avanzado", label: t.advanced },
                      { value: "Básico", label: t.basic },
                      { value: "Intermedio", label: t.intermediate },
                    ],
                    (opt) => opt.label
                  ).map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Training list */}
            {filteredTrainings.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t.noTrainingsFound}</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredTrainings.map((training) => (
                  <Card key={training.id} className="border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{training.courseName}</CardTitle>
                          <CardDescription>{training.mainTopic}</CardDescription>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            training.trainingStatus === t.completed
                              ? "bg-green-100 text-green-800"
                              : training.trainingStatus === t.inProgress
                                ? "bg-blue-100 text-blue-800"
                                : training.trainingStatus === t.scheduled
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {training.trainingStatus}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">{t.modality}:</span>
                          <p className="font-medium">{training.modality}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">{t.depthLevel}:</span>
                          <p className="font-medium">{training.depthLevel}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">{t.totalAttendees}:</span>
                          <p className="font-medium">{training.totalAttendees || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">{t.durationHours}:</span>
                          <p className="font-medium">{training.totalDuration || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setFormData(training)
                            setEditingTraining(training)
                            setActiveView("register")
                          }}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          {t.edit}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generatePDFReport(training)}
                          className="flex-1"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTraining(training.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeView === "materials" && (
        <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
          <Card className="border-brand">
            <CardHeader className="bg-[hsl(var(--brand-muted))]">
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--brand-deep))]">
                <Upload className="h-5 w-5" />
                {t.supportMaterials}
              </CardTitle>
              <CardDescription>{t.supportMaterialsDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              <div className="space-y-2">
                <Label>{t.materialType}</Label>
                <Select
                  value={materialData.materialType || ""}
                  onValueChange={(value) => setMaterialData({ ...materialData, materialType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    {materialTypeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t.relatedTraining}</Label>
                <Select
                  value={materialData.relatedTraining || ""}
                  onValueChange={(value) => setMaterialData({ ...materialData, relatedTraining: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select} />
                  </SelectTrigger>
                  <SelectContent>
                    {trainings.length === 0 ? (
                      <SelectItem value="general">{t.supportMaterials}</SelectItem>
                    ) : (
                      trainings.map((training) => (
                        <SelectItem key={training.id} value={training.courseName}>
                          {training.courseName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t.materialDescription}</Label>
                <Textarea
                  rows={4}
                  value={materialData.materialDescription || ""}
                  onChange={(e) => setMaterialData({ ...materialData, materialDescription: e.target.value })}
                  placeholder={t.materialDescription}
                />
              </div>

              <div className="space-y-2">
                <Label>{t.upload}</Label>
                <Input
                  type="file"
                  onChange={(e) => setMaterialData({ ...materialData, file: e.target.files?.[0] })}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={saveMaterial}>{t.upload}</Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setMaterialData({
                      materialType: "",
                      materialDescription: "",
                      file: undefined,
                      relatedTraining: "",
                    })
                  }
                >
                  {t.cancel}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-brand">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--brand-deep))]">
                <Database className="h-5 w-5 text-[hsl(var(--primary))]" />
                {t.supportMaterials} ({materials.length})
              </CardTitle>
              <CardDescription>Repositorio de documentos de apoyo vinculados a las capacitaciones.</CardDescription>
            </CardHeader>
            <CardContent>
              {materials.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[hsl(var(--brand-border))] p-8 text-center text-sm text-slate-500">
                  {t.supportMaterialsDescription}
                </div>
              ) : (
                <div className="space-y-3">
                  {materials.map((material) => (
                    <div key={material.id} className="rounded-2xl border border-[hsl(var(--brand-border))] p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="font-medium text-slate-900">{material.materialDescription}</p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <Badge variant="outline">{material.materialType}</Badge>
                            {material.relatedTraining ? <Badge variant="outline">{material.relatedTraining}</Badge> : null}
                          </div>
                          <p className="text-xs text-slate-500">
                            {new Date(material.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteMaterial(material.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </GeneralTabShell>
  )
}
