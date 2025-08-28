"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import ConTercerosRegistry from "../../con-terceros/page"

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
  // ... existing sections ...
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
      <ConTercerosRegistry />
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
