"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import AISystemRegistry from "@/app/registro-sistemas-ia/con-terceros/page"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
      {
        text: "¿Se describe cómo interactúa el sistema con otros equipos o software externos, incluidos otros sistemas de IA?",
        info: "Aquí debes describir con qué otros sistemas se conecta el tuyo (APIs, ERPs, otros modelos de IA), cómo se produce esa interacción y qué dependencias existen.",
      },
      {
        text: "¿Se especifican las versiones de software o firmware relevantes?",
        info: "Aquí debes indicar qué versiones de librerías, frameworks, firmware o dependencias son críticas para que el sistema funcione correctamente.",
      },
      {
        text: "¿Se documenta el hardware previsto de ejecución?",
        info: "Aquí debes detallar en qué infraestructura corre el sistema (servidores, GPU, CPU, memoria mínima, dispositivos edge) y los requisitos recomendados.",
      },
      {
        text: "Si el sistema forma parte de un producto físico, ¿se incluyen fotografías o diagramas del producto?",
        info: "Aquí debes añadir imágenes o diagramas que muestren cómo se integra el sistema en un producto, su aspecto externo y, si corresponde, el marcado CE.",
      },
      {
        text: "¿Se incluye una descripción de la interfaz de usuario?",
        info: "Aquí debes explicar cómo interactúa el usuario con el sistema: si hay un dashboard, una app, una línea de comandos, controles de accesibilidad, etc.",
      },
      {
        text: "¿Existen instrucciones de uso para el desplegador (la organización que lo instala)?",
        info: "Aquí debes detallar manuales de instalación, guías de configuración, pasos de despliegue y FAQs que permitan poner el sistema en marcha correctamente.",
      },
    ],
  },
  {
    id: "B",
    title: "Desarrollo y diseño",
    questions: [
      {
        text: "¿Existen especificaciones de diseño documentadas, incluyendo lógica, objetivos de optimización y parámetros clave?",
        info: "Aquí debes describir la lógica general del sistema, los algoritmos usados, qué se optimizó (ej. precisión, velocidad, costo) y los parámetros más relevantes.",
      },
      {
        text: "¿Se documentaron los recursos computacionales usados en entrenamiento, validación y pruebas?",
        info: "Aquí debes señalar qué hardware y tiempo de cómputo se usó (ej. GPUs, CPUs, FLOPs, horas de entrenamiento), el consumo energético estimado y cómo esto permite evaluar impacto ambiental, reproducibilidad de resultados y trazabilidad técnica.",
      },
      {
        text: "¿Se documentaron los procedimientos de etiquetado y limpieza de datos?",
        info: "Aquí debes describir cómo se prepararon los datos: etiquetado manual o automático, técnicas de limpieza, eliminación de duplicados, anonimización, balance de clases.",
      },
      {
        text: "¿Se incluye una evaluación de la supervisión humana necesaria?",
        info: "Aquí debes explicar en qué puntos una persona interviene o valida resultados del sistema, qué autoridad tiene y qué formación necesita para hacerlo bien.",
      },
      {
        text: "¿Se describen los cambios predeterminados en el sistema y cómo se asegura su conformidad continua?",
        info: "Aquí debes señalar si el sistema hace ajustes automáticos (ej. reentrenos, actualizaciones), qué cambia por defecto y cómo se controla que siga cumpliendo requisitos legales.",
      },
      {
        text: "¿Se documentaron los procedimientos de validación y pruebas, con métricas de rendimiento y sesgo?",
        info: "Aquí debes incluir qué pruebas se hicieron (ej. test de precisión, robustez, sesgo), con qué datasets y qué resultados se obtuvieron.",
      },
    ],
  },
  {
    id: "C",
    title: "Supervisión, funcionamiento y control",
    questions: [
      {
        text: "¿Se describen las capacidades y limitaciones del sistema?",
        info: "Aquí debes detallar qué puede y qué no puede hacer el sistema, los niveles de precisión alcanzados y los contextos en los que no es fiable.",
      },
      {
        text: "¿Se identifican los resultados imprevistos previsibles y riesgos?",
        info: "Aquí debes explicar qué fallos o riesgos podrían surgir en el uso real (ej. falsos positivos, sesgos, errores críticos) y cómo se previenen o mitigan.",
      },
      {
        text: "¿Se detallan las especificaciones de los datos de entrada requeridos?",
        info: "Aquí debes señalar qué formato, tamaño o tipo de datos se necesitan para que el sistema funcione (ej. imágenes PNG 512x512, texto ≤ 2000 tokens, CSV con campos específicos).",
      },
    ],
  },
  {
    id: "D",
    title: "Rendimiento y gestión de riesgos",
    questions: [
      {
        text: "¿Está documentada la idoneidad de las métricas de rendimiento?",
        info: "Aquí debes justificar por qué las métricas elegidas (ej. accuracy, recall, F1, AUC) son las adecuadas para la finalidad del sistema y no otras.",
      },
      {
        text: "¿Existe un sistema de gestión de riesgos?",
        info: "Aquí debes describir cómo identificas riesgos, cómo los evalúas, qué medidas de mitigación aplicas y cómo haces seguimiento de su evolución.",
      },
    ],
  },
  {
    id: "F",
    title: "Modelos GPAI",
    questions: [
      {
        text: "¿Se documentó el consumo computacional y energético del entrenamiento?",
        info: "Aquí debes indicar recursos usados (ej. FLOPs, GPUs, horas de cómputo), consumo energético estimado y, si es posible, su equivalencia en CO₂.",
      },
      {
        text: "¿Se ha publicado un resumen de datasets de entrenamiento con la plantilla oficial?",
        info: "Aquí debes listar, de manera general y transparente, qué fuentes de datos se usaron (ej. Wikipedia, Common Crawl, datasets clínicos anonimizados) y cómo se procesaron.",
      },
      {
        text: "¿Se proporciona un paquete de transparencia para integradores?",
        info: "Aquí debes entregar documentación clara para quienes integren tu modelo: usos aceptables, tareas previstas, límites de entrada/salida, benchmarks y políticas de actualización.",
      },
      {
        text: "¿Se incluyen ejemplos de integración técnica?",
        info: "Aquí debes dar instrucciones prácticas: SDKs, ejemplos de código, payloads de prueba, límites de contexto y casos no recomendados.",
      },
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

export default function RegistroGeneralPage() {
  const { toast } = useToast()
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

  return (
    <div className="space-y-8">
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center gap-4 mb-6">
        <Link href="/registro-sistemas-ia/propio">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registro General</h1>
          <p className="text-gray-600">Cuestionario de documentación técnica para sistemas de IA</p>
        </div>
      </div>

      <AISystemRegistry />

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
                      <div className="flex items-start gap-2 mb-2">
                        <Label className="text-sm font-medium flex-1">
                          {index + 1}. {question.text}
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="p-1 rounded-full hover:bg-gray-100">
                              <Info className="h-4 w-4 text-gray-500" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 text-sm">
                            {question.info}
                          </PopoverContent>
                        </Popover>
                      </div>

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

                      {(response?.answer === "otro" || response?.answer === "parcial" || response?.answer === "no") && (
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
    </div>
  )
}
