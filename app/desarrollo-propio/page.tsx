"use client"
import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/LanguageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Code, Download, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { desarrolloPropioTranslations } from "@/lib/desarrollo-propio-translations"
import jsPDF from "jspdf"

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

export default function DesarrolloPropioPage() {
  const { language } = useLanguage()
  const t = desarrolloPropioTranslations[language]
  const { toast } = useToast()

  const [activeCard, setActiveCard] = useState<"register" | "manage">("register")
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireData[]>([])
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState<QuestionnaireData | null>(null)
  const [systemName, setSystemName] = useState("")
  const [version, setVersion] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("aiDocumentationQuestionnaires")
    if (stored) {
      setQuestionnaires(JSON.parse(stored))
    }
  }, [])

  const saveQuestionnaires = (newQuestionnaires: QuestionnaireData[]) => {
    setQuestionnaires(newQuestionnaires)
    localStorage.setItem("aiDocumentationQuestionnaires", JSON.stringify(newQuestionnaires))
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentación de Sistemas de IA</h1>
        <p className="text-gray-600">Cuestionario de documentación técnica para sistemas de inteligencia artificial</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card
          className={`cursor-pointer transition-all ${activeCard === "register" ? "ring-2 ring-green-500" : ""}`}
          onClick={() => setActiveCard("register")}
        >
          <CardHeader className="text-center">
            <Code className="h-12 w-12 mx-auto text-green-600 mb-2" />
            <CardTitle>Nuevo cuestionario</CardTitle>
          </CardHeader>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${activeCard === "manage" ? "ring-2 ring-green-500" : ""}`}
          onClick={() => setActiveCard("manage")}
        >
          <CardHeader className="text-center">
            <FileText className="h-12 w-12 mx-auto text-green-600 mb-2" />
            <CardTitle>Gestionar cuestionarios</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {activeCard === "register" && (
        <div className="space-y-6">
          {!currentQuestionnaire ? (
            <Card>
              <CardHeader>
                <CardTitle>Iniciar nuevo cuestionario</CardTitle>
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
                  Iniciar cuestionario
                </Button>
              </CardContent>
            </Card>
          ) : (
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
        </div>
      )}

      {activeCard === "manage" && (
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
      )}
    </div>
  )
}
