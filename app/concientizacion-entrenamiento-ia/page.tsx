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

  const [activeView, setActiveView] = useState<"register" | "view">("register")

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

    const trainingData: TrainingData = {
      id: editingTraining?.id || Date.now().toString(),
      ...(formData as TrainingData),
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

    const material: SupportMaterial = {
      id: Date.now().toString(),
      ...(materialData as SupportMaterial),
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

  // Training topics options (alphabetically ordered)
  const trainingTopics = [
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
  ]

  // Attendee areas options (alphabetically ordered)
  const attendeeAreas = [
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
  ]

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

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{t.awarenessTrainingAI}</h1>
        <p className="text-gray-600">{t.awarenessTrainingDescription}</p>
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
              {editingTraining ? t.editTraining : t.trainingRegistration}
            </CardTitle>
            <CardDescription>
              {editingTraining ? t.editTrainingDescription : t.trainingRegistrationDescription}
            </CardDescription>
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
              {t.viewTrainings}
            </CardTitle>
            <CardDescription>{t.viewTrainingsDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-2xl font-bold">{trainings.length}</p>
                  <p className="text-sm text-gray-500">{t.registeredTrainings}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                      <SelectItem value={t.introductory}>{t.introductory}</SelectItem>
                      <SelectItem value={t.intermediate}>{t.intermediate}</SelectItem>
                      <SelectItem value={t.advanced}>{t.advanced}</SelectItem>
                      <SelectItem value={t.specialized}>{t.specialized}</SelectItem>
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
                      <SelectItem value={t.hybrid}>{t.hybrid}</SelectItem>
                      <SelectItem value={t.inPerson}>{t.inPerson}</SelectItem>
                      <SelectItem value={t.selfStudy}>{t.selfStudy}</SelectItem>
                      <SelectItem value={t.virtual}>{t.virtual}</SelectItem>
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
                      <SelectItem value={t.external}>{t.external}</SelectItem>
                      <SelectItem value={t.independentConsultant}>{t.independentConsultant}</SelectItem>
                      <SelectItem value={t.internal}>{t.internal}</SelectItem>
                      <SelectItem value={t.technologyProvider}>{t.technologyProvider}</SelectItem>
                      <SelectItem value={t.universityInstitute}>{t.universityInstitute}</SelectItem>
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
              <Button onClick={saveTraining} className="bg-[#1bb67e] hover:bg-[#159f6b]">
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
                  <SelectItem value={t.completed}>{t.completed}</SelectItem>
                  <SelectItem value={t.inProgress}>{t.inProgress}</SelectItem>
                  <SelectItem value={t.scheduled}>{t.scheduled}</SelectItem>
                  <SelectItem value={t.cancelled}>{t.cancelled}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={modalityFilter} onValueChange={setModalityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t.filterByModality} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allModalities}</SelectItem>
                  <SelectItem value="Presencial">{t.inPerson}</SelectItem>
                  <SelectItem value="Virtual">{t.virtual}</SelectItem>
                  <SelectItem value="Híbrida">{t.hybrid}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t.filterByLevel} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allLevels}</SelectItem>
                  <SelectItem value="Básico">{t.basic}</SelectItem>
                  <SelectItem value="Intermedio">{t.intermediate}</SelectItem>
                  <SelectItem value="Avanzado">{t.advanced}</SelectItem>
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

      {/* Materials section remains as additional functionality */}
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t.supportMaterials}
          </CardTitle>
          <CardDescription className="text-blue-600">{t.supportMaterialsDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">{/* ... existing materials functionality ... */}</CardContent>
      </Card>
    </div>
  )
}
