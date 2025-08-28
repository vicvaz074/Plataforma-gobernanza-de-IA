"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useLanguage } from "@/lib/LanguageContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Code, Download, Save, Eye, Trash2, File } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { desarrolloPropioTranslations } from "@/lib/desarrollo-propio-translations"
import jsPDF from "jspdf"

interface DocumentData {
  id: string
  name: string
  type: string
  size: number
  uploadDate: string
  category: string
  description?: string
  file?: File
}

interface QuestionnaireData {
  id: string
  systemName: string
  version: string
  createdAt: string
  updatedAt: string
  responses: Record<
    string,
    {
      answer: string
      explanation?: string
    }
  >
}

const questionnaireSections = [
  {
    id: "A",
    title: "Identificación general",
    questions: [
      "¿Está claramente definida la finalidad prevista del sistema de IA?",
      "¿Se documenta la versión del sistema, con su relación a versiones anteriores?",
      "¿Está descrito el modo de interacción con equipos y programas externos?",
      "¿Se especifican las versiones de software o firmware relevantes?",
      "¿Se describen todas las formas de despliegue o comercialización?",
      "¿Se documenta el hardware previsto de ejecución?",
      "Si el sistema forma parte de un producto, ¿se incluyen fotografías o diagramas del producto?",
      "¿Se incluye una descripción de la interfaz de usuario?",
      "¿Existen instrucciones de uso para el desplegador?",
    ],
  },
  {
    id: "B",
    title: "Desarrollo y diseño",
    questions: [
      "¿Se describe el proceso de desarrollo, incluyendo uso de modelos/herramientas de terceros?",
      "¿Existen especificaciones de diseño documentadas, incluyendo lógica, objetivos de optimización y parámetros clave?",
      "¿Está documentada la arquitectura del sistema?",
      "¿Se documentaron los recursos computacionales usados en entrenamiento, validación y pruebas?",
      "¿Se describen los datasets de entrenamiento y validación?",
      "¿Se documentan los procedimientos de etiquetado y limpieza de datos?",
      "¿Se incluye una evaluación de supervisión humana necesaria?",
      "¿Se describen los cambios predeterminados en el sistema y cómo se asegura la conformidad continua?",
      "¿Se documentan los procedimientos de validación y pruebas, con métricas de rendimiento y sesgo?",
      "¿Se detallan las medidas de ciberseguridad implementadas?",
    ],
  },
  {
    id: "C",
    title: "Supervisión, funcionamiento y control",
    questions: [
      "¿Se describen claramente las capacidades y limitaciones del sistema?",
      "¿Se identifican los resultados imprevistos previsibles y riesgos para la salud, seguridad y derechos fundamentales?",
      "¿Se detallan las especificaciones de datos de entrada requeridos?",
    ],
  },
  {
    id: "D",
    title: "Rendimiento y gestión de riesgos",
    questions: [
      "¿Está documentada la idoneidad de las métricas de rendimiento para la finalidad prevista?",
      "¿Existe un sistema de gestión de riesgos?",
      "¿Se mantiene un historial de cambios a lo largo del ciclo de vida del sistema?",
    ],
  },
  {
    id: "E",
    title: "Normas y conformidad",
    questions: [
      "¿Se documentan las normas armonizadas aplicadas?",
      "Si no se aplicaron normas armonizadas, ¿se describen las especificaciones técnicas alternativas adoptadas?",
      "¿Está preparado el plan de vigilancia poscomercialización?",
    ],
  },
  {
    id: "F",
    title: "Modelos de Uso General",
    questions: [
      "¿Se documentó el consumo computacional y energético del entrenamiento?",
      "¿Se documenta el proceso de entrenamiento, validación y pruebas, con sus datasets y metodología de curación?",
      "¿Se ha publicado un resumen de datasets de entrenamiento usando la plantilla oficial de la Comisión?",
      "¿Se proporciona un paquete de transparencia para integradores?",
      "¿Se incluyen ejemplos de integración técnica?",
      "¿Se detallan las restricciones de uso y políticas AUP para integradores y usuarios?",
    ],
  },
  {
    id: "G",
    title: "Complementos prácticos",
    questions: [
      "¿Se mantiene una matriz de trazabilidad?",
      "¿Existe un modelo de amenazas documentado con mitigaciones y riesgo residual?",
      "¿Se ha realizado una evaluación de impacto en protección de datos si aplica PII?",
      "¿Se documenta la gestión de vulnerabilidades?",
      "¿Existen runbooks/plan de continuidad para incidentes y recuperación?",
    ],
  },
]

const responseOptions = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
  { value: "parcial", label: "Parcial (incompleto)" },
  { value: "pendiente", label: "Pendiente (comprometido, no implementado aún)" },
  { value: "no_aplica", label: "No aplica (por contexto del sistema/modelo)" },
  { value: "otro", label: "Otro (explicación libre)" },
]

export default function DesarrolloPropioSection() {
  const { language } = useLanguage()
  const t = desarrolloPropioTranslations[language]
  const { toast } = useToast()

  const [activeCard, setActiveCard] = useState<"general" | "documentation" | null>(null)
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireData[]>([])
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState<QuestionnaireData | null>(null)
  const [systemName, setSystemName] = useState("")
  const [version, setVersion] = useState("")

  const [documents, setDocuments] = useState<DocumentData[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [documentDescription, setDocumentDescription] = useState("")

  const documentCategories = [
    "Especificaciones técnicas",
    "Documentación de arquitectura",
    "Manuales de usuario",
    "Informes de pruebas",
    "Certificaciones",
    "Políticas de uso",
    "Otros",
  ]

  useEffect(() => {
    const stored = localStorage.getItem("aiDocumentationQuestionnaires")
    if (stored) {
      setQuestionnaires(JSON.parse(stored))
    }

    const storedDocs = localStorage.getItem("aiTechnicalDocuments")
    if (storedDocs) {
      setDocuments(JSON.parse(storedDocs))
    }
  }, [])

  const saveQuestionnaires = (newQuestionnaires: QuestionnaireData[]) => {
    setQuestionnaires(newQuestionnaires)
    localStorage.setItem("aiDocumentationQuestionnaires", JSON.stringify(newQuestionnaires))
  }

  const saveDocuments = (newDocuments: DocumentData[]) => {
    setDocuments(newDocuments)
    localStorage.setItem("aiTechnicalDocuments", JSON.stringify(newDocuments))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !selectedCategory) {
      toast({
        title: "Error",
        description: "Por favor selecciona una categoría antes de subir archivos",
        variant: "destructive",
      })
      return
    }

    Array.from(files).forEach((file) => {
      const newDocument: DocumentData = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        uploadDate: new Date().toISOString(),
        category: selectedCategory,
        description: documentDescription,
        file: file,
      }

      const updatedDocuments = [...documents, newDocument]
      saveDocuments(updatedDocuments)
    })

    setSelectedCategory("")
    setDocumentDescription("")
    event.target.value = ""

    toast({
      title: "Éxito",
      description: "Documentos subidos correctamente",
    })
  }

  const deleteDocument = (id: string) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== id)
    saveDocuments(updatedDocuments)
    toast({
      title: "Éxito",
      description: "Documento eliminado correctamente",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const startNewQuestionnaire = () => {
    if (!systemName || !version) {
      toast({
        title: "Error",
        description: "Por favor ingresa el nombre del sistema y la versión",
        variant: "destructive",
      })
      return
    }

    const newQuestionnaire: QuestionnaireData = {
      id: Date.now().toString(),
      systemName,
      version,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: {},
    }

    setCurrentQuestionnaire(newQuestionnaire)
    setSystemName("")
    setVersion("")
  }

  const updateResponse = (sectionId: string, questionIndex: number, answer: string, explanation?: string) => {
    if (!currentQuestionnaire) return

    const questionKey = `${sectionId}_${questionIndex}`
    const updatedQuestionnaire = {
      ...currentQuestionnaire,
      responses: {
        ...currentQuestionnaire.responses,
        [questionKey]: { answer, explanation },
      },
      updatedAt: new Date().toISOString(),
    }

    setCurrentQuestionnaire(updatedQuestionnaire)
  }

  const saveQuestionnaire = () => {
    if (!currentQuestionnaire) return

    const existingIndex = questionnaires.findIndex((q) => q.id === currentQuestionnaire.id)
    let updatedQuestionnaires

    if (existingIndex >= 0) {
      updatedQuestionnaires = questionnaires.map((q) => (q.id === currentQuestionnaire.id ? currentQuestionnaire : q))
    } else {
      updatedQuestionnaires = [...questionnaires, currentQuestionnaire]
    }

    saveQuestionnaires(updatedQuestionnaires)
    toast({
      title: "Éxito",
      description: "Cuestionario guardado correctamente",
    })
  }

  const generatePDF = () => {
    if (!currentQuestionnaire) return

    const doc = new jsPDF()
    let yPosition = 20

    doc.setFontSize(16)
    doc.text("Documentación de Sistema de IA", 20, yPosition)
    yPosition += 10

    doc.setFontSize(12)
    doc.text(`Sistema: ${currentQuestionnaire.systemName}`, 20, yPosition)
    yPosition += 7
    doc.text(`Versión: ${currentQuestionnaire.version}`, 20, yPosition)
    yPosition += 15

    questionnaireSections.forEach((section) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.text(`${section.id}. ${section.title}`, 20, yPosition)
      yPosition += 10

      section.questions.forEach((question, index) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }

        const questionKey = `${section.id}_${index}`
        const response = currentQuestionnaire.responses[questionKey]

        doc.setFontSize(10)
        doc.text(`${index + 1}. ${question}`, 20, yPosition)
        yPosition += 5

        if (response) {
          const answerLabel = responseOptions.find((opt) => opt.value === response.answer)?.label || response.answer
          doc.text(`Respuesta: ${answerLabel}`, 25, yPosition)
          yPosition += 5

          if (response.explanation) {
            const lines = doc.splitTextToSize(`Explicación: ${response.explanation}`, 160)
            doc.text(lines, 25, yPosition)
            yPosition += lines.length * 5
          }
        }
        yPosition += 5
      })
      yPosition += 5
    })

    doc.save(`${currentQuestionnaire.systemName}_v${currentQuestionnaire.version}_documentacion.pdf`)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Desarrollo Propio de IA</h1>
        <p className="text-gray-600">Gestión integral de sistemas de IA desarrollados internamente</p>
      </div>

      {!activeCard && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:ring-2 hover:ring-green-500/20"
            onClick={() => setActiveCard("general")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <Code className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-green-700">Registro General</CardTitle>
              <CardDescription className="text-sm">
                Cuestionario completo de documentación técnica para sistemas de IA según EU AI Act
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                  <Badge variant="outline" className="text-xs">
                    7 secciones
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    40 preguntas
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    EU AI Act
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    PDF
                  </Badge>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:ring-2 hover:ring-green-500/20"
            onClick={() => setActiveCard("documentation")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-green-700">Documentación Técnica</CardTitle>
              <CardDescription className="text-sm">
                Gestión de documentos técnicos, especificaciones, manuales y certificaciones
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                  <Badge variant="outline" className="text-xs">
                    {documents.length} documentos
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Subir archivos
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Categorías
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Gestión
                  </Badge>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      {activeCard && (
        <div className="mb-6">
          <Button variant="outline" onClick={() => setActiveCard(null)} className="mb-4">
            ← Volver a opciones principales
          </Button>
        </div>
      )}

      {activeCard === "general" && (
        <div className="space-y-6">
          {/* Registration form with questionnaire functionality */}
          {!currentQuestionnaire ? (
            <Card>
              <CardHeader>
                <CardTitle>Registrar Nuevo Sistema</CardTitle>
                <CardDescription>
                  Completa la información básica para iniciar la documentación de tu sistema de IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="systemName">Nombre del sistema de IA *</Label>
                    <input
                      id="systemName"
                      className="w-full p-2 border rounded"
                      value={systemName}
                      onChange={(e) => setSystemName(e.target.value)}
                      placeholder="ej. Sistema de detección de fraude"
                    />
                  </div>
                  <div>
                    <Label htmlFor="version">Versión *</Label>
                    <input
                      id="version"
                      className="w-full p-2 border rounded"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="ej. 1.0.0"
                    />
                  </div>
                </div>
                <Button onClick={startNewQuestionnaire} className="bg-green-600 hover:bg-green-700">
                  Iniciar nuevo cuestionario
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Complete questionnaire form with all sections
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>
                      {currentQuestionnaire.systemName} v{currentQuestionnaire.version}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveQuestionnaire} className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button onClick={generatePDF} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {questionnaireSections.map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {section.id}. {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {section.questions.map((question, index) => {
                      const questionKey = `${section.id}_${index}`
                      const response = currentQuestionnaire.responses[questionKey]

                      return (
                        <div key={index} className="border-l-4 border-green-200 pl-4">
                          <Label className="text-sm font-medium mb-2 block">
                            {index + 1}. {question}
                          </Label>

                          <Select
                            value={response?.answer || ""}
                            onValueChange={(value) => updateResponse(section.id, index, value, response?.explanation)}
                          >
                            <SelectTrigger className="mb-2">
                              <SelectValue placeholder="Seleccionar respuesta" />
                            </SelectTrigger>
                            <SelectContent>
                              {responseOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {(response?.answer === "otro" ||
                            response?.answer === "parcial" ||
                            response?.answer === "no") && (
                            <Textarea
                              placeholder="Proporciona una explicación detallada..."
                              value={response?.explanation || ""}
                              onChange={(e) => updateResponse(section.id, index, response.answer, e.target.value)}
                              rows={2}
                            />
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Saved questionnaires section */}
          <Card>
            <CardHeader>
              <CardTitle>Cuestionarios guardados ({questionnaires.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {questionnaires.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No hay cuestionarios guardados</div>
              ) : (
                <div className="space-y-4">
                  {questionnaires.map((questionnaire) => (
                    <div key={questionnaire.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{questionnaire.systemName}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">v{questionnaire.version}</Badge>
                            <Badge className="bg-green-100 text-green-800">
                              {Object.keys(questionnaire.responses).length} respuestas
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            Actualizado: {new Date(questionnaire.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          onClick={() => setCurrentQuestionnaire(questionnaire)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Continuar
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

      {activeCard === "documentation" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subir documentación técnica</CardTitle>
              <CardDescription>
                Organiza y gestiona todos los documentos técnicos relacionados con tus sistemas de IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoría del documento *</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Descripción (opcional)</Label>
                  <input
                    id="description"
                    className="w-full p-2 border rounded"
                    value={documentDescription}
                    onChange={(e) => setDocumentDescription(e.target.value)}
                    placeholder="Breve descripción del documento"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="fileUpload">Seleccionar archivos</Label>
                <input
                  id="fileUpload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="w-full p-2 border rounded"
                  accept=".pdf,.doc,.docx,.txt,.md,.xlsx,.pptx,.png,.jpg,.jpeg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Formatos soportados: PDF, DOC, DOCX, TXT, MD, XLSX, PPTX, PNG, JPG, JPEG
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentos almacenados ({documents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay documentos almacenados</p>
                  <p className="text-sm">Sube tu primera documentación técnica</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <File className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{doc.name}</h3>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline">{doc.category}</Badge>
                              <Badge className="bg-blue-100 text-blue-800">{formatFileSize(doc.size)}</Badge>
                            </div>
                            {doc.description && <p className="text-sm text-gray-600 mt-1">{doc.description}</p>}
                            <p className="text-xs text-gray-500 mt-2">
                              Subido: {new Date(doc.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (doc.file) {
                                const url = URL.createObjectURL(doc.file)
                                window.open(url, "_blank")
                              }
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteDocument(doc.id)}
                            className="text-red-600 hover:text-red-700"
                          >
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
        </div>
      )}
    </div>
  )
}
