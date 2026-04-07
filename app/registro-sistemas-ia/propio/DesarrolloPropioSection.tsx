"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FileText, Code, Download, Save, Eye, Trash2, File, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import jsPDF from "jspdf"
import AISystemRegistryForm from "@/app/registro-sistemas-ia/AISystemRegistryForm"
import { ModuleSubnav } from "@/components/module-subnav"

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

const questionInfo: Record<string, string> = {
  "¿Está descrito el modo de interacción con equipos y programas externos?":
    "Aquí debes describir con qué otros sistemas se conecta el tuyo (APIs, ERPs, otros modelos de IA), cómo se produce esa interacción y qué dependencias existen.",
  "¿Se especifican las versiones de software o firmware relevantes?":
    "Aquí debes indicar qué versiones de librerías, frameworks, firmware o dependencias son críticas para que el sistema funcione correctamente.",
  "¿Se documenta el hardware previsto de ejecución?":
    "Aquí debes detallar en qué infraestructura corre el sistema (servidores, GPU, CPU, memoria mínima, dispositivos edge) y los requisitos recomendados.",
  "Si el sistema forma parte de un producto, ¿se incluyen fotografías o diagramas del producto?":
    "Aquí debes añadir imágenes o diagramas que muestren cómo se integra el sistema en un producto, su aspecto externo y, si corresponde, el marcado CE.",
  "¿Se incluye una descripción de la interfaz de usuario?":
    "Aquí debes explicar cómo interactúa el usuario con el sistema: si hay un dashboard, una app, una línea de comandos, controles de accesibilidad, etc.",
  "¿Existen instrucciones de uso para el desplegador?":
    "Aquí debes detallar manuales de instalación, guías de configuración, pasos de despliegue y FAQs que permitan poner el sistema en marcha correctamente.",
  "¿Existen especificaciones de diseño documentadas, incluyendo lógica, objetivos de optimización y parámetros clave?":
    "Aquí debes describir la lógica general del sistema, los algoritmos usados, qué se optimizó (ej. precisión, velocidad, costo) y los parámetros más relevantes.",
  "¿Se documentaron los recursos computacionales usados en entrenamiento, validación y pruebas?":
    "Aquí debes señalar qué hardware y tiempo de cómputo se usó (ej. GPUs, CPUs, FLOPs, horas de entrenamiento), el consumo energético estimado y cómo esto permite evaluar impacto ambiental, reproducibilidad de resultados y trazabilidad técnica.",
  "¿Se documentan los procedimientos de etiquetado y limpieza de datos?":
    "Aquí debes describir cómo se prepararon los datos: etiquetado manual o automático, técnicas de limpieza, eliminación de duplicados, anonimización, balance de clases.",
  "¿Se incluye una evaluación de supervisión humana necesaria?":
    "Aquí debes explicar en qué puntos una persona interviene o valida resultados del sistema, qué autoridad tiene y qué formación necesita para hacerlo bien.",
  "¿Se describen los cambios predeterminados en el sistema y cómo se asegura la conformidad continua?":
    "Aquí debes señalar si el sistema hace ajustes automáticos (ej. reentrenos, actualizaciones), qué cambia por defecto y cómo se controla que siga cumpliendo requisitos legales.",
  "¿Se documentan los procedimientos de validación y pruebas, con métricas de rendimiento y sesgo?":
    "Aquí debes incluir qué pruebas se hicieron (ej. test de precisión, robustez, sesgo), con qué datasets y qué resultados se obtuvieron.",
  "¿Se describen claramente las capacidades y limitaciones del sistema?":
    "Aquí debes detallar qué puede y qué no puede hacer el sistema, los niveles de precisión alcanzados y los contextos en los que no es fiable.",
  "¿Se identifican los resultados imprevistos previsibles y riesgos para la salud, seguridad y derechos fundamentales?":
    "Aquí debes explicar qué fallos o riesgos podrían surgir en el uso real (ej. falsos positivos, sesgos, errores críticos) y cómo se previenen o mitigan.",
  "¿Se detallan las especificaciones de datos de entrada requeridos?":
    "Aquí debes señalar qué formato, tamaño o tipo de datos se necesitan para que el sistema funcione (ej. imágenes PNG 512x512, texto ≤ 2000 tokens, CSV con campos específicos).",
  "¿Está documentada la idoneidad de las métricas de rendimiento para la finalidad prevista?":
    "Aquí debes justificar por qué las métricas elegidas (ej. accuracy, recall, F1, AUC) son las adecuadas para la finalidad del sistema y no otras.",
  "¿Existe un sistema de gestión de riesgos?":
    "Aquí debes describir cómo identificas riesgos, cómo los evalúas, qué medidas de mitigación aplicas y cómo haces seguimiento de su evolución.",
  "¿Se documentó el consumo computacional y energético del entrenamiento?":
    "Aquí debes indicar recursos usados (ej. FLOPs, GPUs, horas de cómputo), consumo energético estimado y, si es posible, su equivalencia en CO₂.",
  "¿Se ha publicado un resumen de datasets de entrenamiento usando la plantilla oficial de la Comisión?":
    "Aquí debes listar, de manera general y transparente, qué fuentes de datos se usaron (ej. Wikipedia, Common Crawl, datasets clínicos anonimizados) y cómo se procesaron.",
  "¿Se proporciona un paquete de transparencia para integradores?":
    "Aquí debes entregar documentación clara para quienes integren tu modelo: usos aceptables, tareas previstas, límites de entrada/salida, benchmarks y políticas de actualización.",
  "¿Se incluyen ejemplos de integración técnica?":
    "Aquí debes dar instrucciones prácticas: SDKs, ejemplos de código, payloads de prueba, límites de contexto y casos no recomendados.",
}

const responseOptions = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
  { value: "parcial", label: "Parcial (incompleto)" },
  { value: "pendiente", label: "Pendiente (comprometido, no implementado aún)" },
  { value: "no_aplica", label: "No aplica (por contexto del sistema/modelo)" },
  { value: "otro", label: "Otro (explicación libre)" },
]

export default function DesarrolloPropioSection({
  initialTab = "general",
  integrated = false,
}: {
  initialTab?: "general" | "documentation"
  integrated?: boolean
}) {
  const { toast } = useToast()

  const [activeCard, setActiveCard] = useState<"general" | "documentation" | null>(integrated ? initialTab : null)
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

  useEffect(() => {
    if (integrated) {
      setActiveCard(initialTab)
    }
  }, [initialTab, integrated])

  const saveQuestionnaires = (newQuestionnaires: QuestionnaireData[]) => {
    setQuestionnaires(newQuestionnaires)
    localStorage.setItem("aiDocumentationQuestionnaires", JSON.stringify(newQuestionnaires))
    window.dispatchEvent(new Event("ai-registry-storage-updated"))
  }

  const saveDocuments = (newDocuments: DocumentData[]) => {
    setDocuments(newDocuments)
    localStorage.setItem("aiTechnicalDocuments", JSON.stringify(newDocuments))
    window.dispatchEvent(new Event("ai-registry-storage-updated"))
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
    <div className={integrated ? "space-y-6" : "space-y-8"}>
      <div className={integrated ? "space-y-6" : "container mx-auto space-y-8 py-8"}>
        {!integrated ? (
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Desarrollos Propios de IA</h1>
            <p className="text-gray-600">Gestión integral de sistemas de IA desarrollados internamente</p>
          </div>
        ) : null}

        {integrated || activeCard ? (
          <ModuleSubnav
            activeId={activeCard || initialTab}
            onChange={(id) => setActiveCard(id as "general" | "documentation")}
            items={[
              { id: "general", label: "Registro general", icon: Code, badge: questionnaires.length || undefined },
              { id: "documentation", label: "Documentación técnica", icon: FileText, badge: documents.length || undefined },
            ]}
          />
        ) : null}

        {!activeCard ? (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card
              className="cursor-pointer border-brand transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-2 hover:ring-[#01A79E]/20"
              onClick={() => setActiveCard("general")}
            >
              <CardHeader className="text-center">
                <div className="bg-brand-soft mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Code className="h-8 w-8 text-brand-deep" />
                </div>
                <CardTitle className="text-xl text-brand-deep">Registro General</CardTitle>
                <CardDescription className="text-sm">
                  Cuestionario completo de documentación técnica para sistemas de IA según EU AI Act
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    <Badge variant="outline" className="border-brand text-xs text-brand-deep">
                      7 secciones
                    </Badge>
                    <Badge variant="outline" className="border-brand text-xs text-brand-deep">
                      40 preguntas
                    </Badge>
                    <Badge variant="outline" className="border-brand text-xs text-brand-deep">
                      EU AI Act
                    </Badge>
                    <Badge variant="outline" className="border-brand text-xs text-brand-deep">
                      PDF
                    </Badge>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer border-brand transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-2 hover:ring-[#01A79E]/20"
              onClick={() => setActiveCard("documentation")}
            >
              <CardHeader className="text-center">
                <div className="bg-brand-soft mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <FileText className="h-8 w-8 text-brand-deep" />
                </div>
                <CardTitle className="text-xl text-brand-deep">Documentación Técnica</CardTitle>
                <CardDescription className="text-sm">
                  Gestión de documentos técnicos, especificaciones, manuales y certificaciones
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    <Badge variant="outline" className="border-brand text-xs text-brand-deep">
                      {documents.length} documentos
                    </Badge>
                    <Badge variant="outline" className="border-brand text-xs text-brand-deep">
                      Subir archivos
                    </Badge>
                    <Badge variant="outline" className="border-brand text-xs text-brand-deep">
                      Categorías
                    </Badge>
                    <Badge variant="outline" className="border-brand text-xs text-brand-deep">
                      Gestión
                    </Badge>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        ) : null}

        {activeCard && !integrated ? (
          <div className="mb-6">
            <Button variant="outline" onClick={() => setActiveCard(null)} className="mb-4 border-brand text-brand-deep">
              ← Volver a opciones principales
            </Button>
          </div>
        ) : null}

        {activeCard === "general" ? (
          <div className="space-y-6">
            <AISystemRegistryForm registryMode="own" embedded />
            {!currentQuestionnaire ? (
              <Card>
                <CardHeader>
                  <CardTitle>Registrar Nuevo Sistema</CardTitle>
                  <CardDescription>
                    Completa la información básica para iniciar la documentación de tu sistema de IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="systemName">Nombre del sistema de IA *</Label>
                      <input
                        id="systemName"
                        className="w-full rounded border border-[rgba(1,167,158,0.2)] p-2 outline-none transition focus:border-[#01A79E] focus:ring-2 focus:ring-[#01A79E]/20"
                        value={systemName}
                        onChange={(e) => setSystemName(e.target.value)}
                        placeholder="ej. Sistema de detección de fraude"
                      />
                    </div>
                    <div>
                      <Label htmlFor="version">Versión *</Label>
                      <input
                        id="version"
                        className="w-full rounded border border-[rgba(1,167,158,0.2)] p-2 outline-none transition focus:border-[#01A79E] focus:ring-2 focus:ring-[#01A79E]/20"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        placeholder="ej. 1.0.0"
                      />
                    </div>
                  </div>
                  <Button onClick={startNewQuestionnaire} className="bg-[#01A79E] text-white hover:bg-[#018b84]">
                    Iniciar nuevo cuestionario
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>
                        {currentQuestionnaire.systemName} v{currentQuestionnaire.version}
                      </CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={saveQuestionnaire} className="bg-[#01A79E] text-white hover:bg-[#018b84]">
                        <Save className="mr-2 h-4 w-4" />
                        Guardar
                      </Button>
                      <Button onClick={generatePDF} variant="outline" className="border-brand text-brand-deep">
                        <Download className="mr-2 h-4 w-4" />
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
                          <div key={index} className="border-l-4 border-[rgba(1,167,158,0.22)] pl-4">
                            <div className="mb-2 flex items-start gap-2">
                              <Label className="text-sm font-medium">
                                {index + 1}. {question}
                              </Label>
                              {questionInfo[question] ? (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button type="button" className="p-1 text-gray-500 transition hover:text-brand-deep">
                                      <Info className="h-4 w-4" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80 text-sm" align="start">
                                    {questionInfo[question]}
                                  </PopoverContent>
                                </Popover>
                              ) : null}
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

                            {response?.answer === "otro" ||
                            response?.answer === "parcial" ||
                            response?.answer === "no" ? (
                              <Textarea
                                placeholder="Proporciona una explicación detallada..."
                                value={response?.explanation || ""}
                                onChange={(e) => updateResponse(section.id, index, response.answer, e.target.value)}
                                rows={2}
                              />
                            ) : null}
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
                  <div className="py-8 text-center text-gray-500">No hay cuestionarios guardados</div>
                ) : (
                  <div className="space-y-4">
                    {questionnaires.map((questionnaire) => (
                      <div key={questionnaire.id} className="rounded-lg border p-4 transition-shadow hover:shadow-md">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{questionnaire.systemName}</h3>
                            <div className="mt-1 flex flex-wrap gap-2">
                              <Badge variant="outline">v{questionnaire.version}</Badge>
                              <Badge className="bg-brand-soft text-brand-deep">
                                {Object.keys(questionnaire.responses).length} respuestas
                              </Badge>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                              Actualizado: {new Date(questionnaire.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            onClick={() => setCurrentQuestionnaire(questionnaire)}
                            className="bg-[#01A79E] text-white hover:bg-[#018b84]"
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
        ) : null}

        {activeCard === "documentation" ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subir documentación técnica</CardTitle>
                <CardDescription>
                  Organiza y gestiona todos los documentos técnicos relacionados con tus sistemas de IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                      className="w-full rounded border border-[rgba(1,167,158,0.2)] p-2 outline-none transition focus:border-[#01A79E] focus:ring-2 focus:ring-[#01A79E]/20"
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
                    className="w-full rounded border border-[rgba(1,167,158,0.2)] p-2 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-brand-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-deep hover:file:bg-brand-muted"
                    accept=".pdf,.doc,.docx,.txt,.md,.xlsx,.pptx,.png,.jpg,.jpeg"
                  />
                  <p className="mt-1 text-sm text-gray-500">
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
                  <div className="py-8 text-center text-gray-500">
                    <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>No hay documentos almacenados</p>
                    <p className="text-sm">Sube tu primera documentación técnica</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="rounded-lg border p-4 transition-shadow hover:shadow-md">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex items-start gap-3">
                            <div className="bg-brand-soft flex h-10 w-10 items-center justify-center rounded-lg">
                              <File className="h-5 w-5 text-brand-deep" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{doc.name}</h3>
                              <div className="mt-1 flex flex-wrap gap-2">
                                <Badge variant="outline">{doc.category}</Badge>
                                <Badge className="bg-brand-soft text-brand-deep">{formatFileSize(doc.size)}</Badge>
                              </div>
                              {doc.description ? <p className="mt-1 text-sm text-gray-600">{doc.description}</p> : null}
                              <p className="mt-2 text-xs text-gray-500">
                                Subido: {new Date(doc.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-brand text-brand-deep"
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
        ) : null}
      </div>
    </div>
  )
}
