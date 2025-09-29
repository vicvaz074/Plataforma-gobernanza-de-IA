"use client"

import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChecklistSection {
  id: string
  category: string
  title: string
  question: string
  evidences: string[]
  references: string[]
  criteria?: string[]
  recommendations?: string[]
}

interface SectionResponse {
  rating: "" | "C" | "PC" | "NC" | "NA"
  evidenceNotes: string
  actionPlan: string
  reviewerNotes: string
}

const ratingOptions = [
  { value: "", label: "Selecciona calificación" },
  { value: "C", label: "Conforme (C)" },
  { value: "PC", label: "Parcialmente Conforme (PC)" },
  { value: "NC", label: "No Conforme (NC)" },
  { value: "NA", label: "No Aplicable (NA)" },
]

const checklistSections: ChecklistSection[] = [
  {
    id: "1.1",
    category: "Sección 1: Gobernanza organizacional",
    title: "Marco político y estratégico",
    question:
      "¿Existen políticas formales que integren principios de transparencia y explicabilidad específicos para sistemas de IA?",
    evidences: [
      "Política de IA que incluya definiciones específicas de transparencia",
      "Procedimientos operativos para implementar explicabilidad",
      "Evidencia de comunicación y capacitación del personal",
      "Mecanismos de revisión y actualización periódica",
    ],
    references: [
      "ISO/IEC 42001:2023 - Sección 5.2",
      "NIST AI RMF GOVERN 1.2",
    ],
    criteria: [
      "Política específica vs. genérica para IA",
      "Definición clara de información apropiada por stakeholder",
      "Excepciones justificadas (propiedad intelectual, seguridad)",
      "Alineación con objetivos organizacionales",
    ],
  },
  {
    id: "1.2",
    category: "Sección 1: Gobernanza organizacional",
    title: "Estructura de responsabilidades",
    question:
      "¿Se han definido y asignado roles específicos para gestionar transparencia y explicabilidad a lo largo del ciclo de vida del sistema?",
    evidences: [
      "Matriz RACI de responsabilidades para transparencia",
      "Descripciones de cargo que incluyan funciones específicas",
      "Autoridad asignada para decisiones de transparencia",
      "Canales de escalamiento y comunicación definidos",
    ],
    references: [
      "ISO/IEC 42001:2023 - Sección 5.3",
      "NIST AI RMF GOVERN 2.1",
    ],
  },
  {
    id: "2.1",
    category: "Sección 2: Análisis contextual y mapeo de requisitos",
    title: "Comprensión del contexto operacional",
    question:
      "¿Se ha establecido un análisis completo del contexto operacional incluyendo necesidades diferenciadas de transparencia por stakeholder?",
    evidences: [
      "Análisis detallado del contexto de aplicación",
      "Mapeo completo de stakeholders con matriz de necesidades informativas",
      "Evaluación de impactos potenciales (positivos y negativos)",
      "Consideraciones culturales y jurisdiccionales específicas",
    ],
    references: [
      "ISO/IEC 23894:2023 - Sección 6.3",
      "NIST AI RMF MAP 1.1",
    ],
    recommendations: [
      "Realizar entrevistas estructuradas con usuarios finales",
      "Documentar niveles de explicación requeridos por audiencia",
      "Considerar aspectos regulatorios específicos del sector",
      "Evaluar capacidades técnicas de explicabilidad requeridas",
    ],
  },
  {
    id: "2.2",
    category: "Sección 2: Análisis contextual y mapeo de requisitos",
    title: "Definición de requisitos de sistema",
    question:
      "¿Los requisitos del sistema incorporan consideraciones específicas de transparencia y explicabilidad basadas en el análisis socio-técnico?",
    evidences: [
      "Especificación de requisitos con sección dedicada a transparencia",
      "Análisis de trade-offs entre precisión y explicabilidad",
      "Requisitos de interfaz para presentación de explicaciones",
      "Criterios de aceptación para capacidades de explicabilidad",
    ],
    references: [
      "ISO/IEC 42001:2023 - Sección A.6.2.2",
      "NIST AI RMF MAP 1.6",
    ],
  },
  {
    id: "3.1",
    category: "Sección 3: Capacidades técnicas de explicabilidad",
    title: "Implementación de explicabilidad",
    question:
      "¿El sistema implementa capacidades técnicas verificables para generar explicaciones comprensibles de sus decisiones?",
    evidences: [
      "Especificaciones técnicas de métodos explicativos implementados",
      "Ejemplos documentados de explicaciones generadas",
      "Evaluaciones de comprensibilidad con usuarios reales",
      "Benchmarks de rendimiento de explicabilidad vs. precisión",
    ],
    references: [
      "NIST AI RMF Sección 3.5",
      "ISO/IEC 23894:2023 - Anexo A.12",
    ],
    criteria: [
      "Implementación de técnicas XAI (SHAP, LIME, GRAD-CAM, etc.)",
      "Capacidad de explicación local y global",
      "Explicaciones contrafactuales disponibles",
      "Medidas de confianza incluidas en explicaciones",
    ],
  },
  {
    id: "3.2",
    category: "Sección 3: Capacidades técnicas de explicabilidad",
    title: "Calidad y adaptabilidad de explicaciones",
    question:
      "¿Las explicaciones se adaptan al contexto del usuario y proporcionan información relevante para la toma de decisiones?",
    evidences: [
      "Framework de personalización de explicaciones por tipo de usuario",
      "Pruebas de usabilidad documentadas con métricas específicas",
      "Sistemas de retroalimentación para mejorar calidad explicativa",
      "Validación de comprensibilidad con grupos de usuarios diversos",
    ],
    references: [
      "NIST AI RMF MEASURE 2.9",
      "ISO/IEC 42001:2023 - Sección A.8.2",
    ],
  },
  {
    id: "3.3",
    category: "Sección 3: Capacidades técnicas de explicabilidad",
    title: "Transparencia de factores determinantes",
    question: "¿Se identifican y comunican claramente los factores más importantes que influyen en las decisiones del sistema?",
    evidences: [
      "Análisis de importancia de características con visualizaciones",
      "Documentación de variables clave por tipo de decisión",
      "Métricas de confianza y rangos de incertidumbre",
      "Umbrales de confianza establecidos y comunicados",
    ],
    references: ["ISO/IEC 23894:2023 - Sección B.3"],
  },
  {
    id: "4.1",
    category: "Sección 4: Documentación y comunicación",
    title: "Documentación técnica integral",
    question:
      "¿Existe documentación técnica completa que incluye arquitectura, decisiones de diseño y procesos de desarrollo con enfoque en transparencia?",
    evidences: [
      "Documentación de arquitectura con componentes de explicabilidad",
      "Registro de decisiones de diseño relacionadas con transparencia",
      "Documentación de datos de entrenamiento y procesos de preparación",
      "Procedimientos de verificación y validación de explicabilidad",
    ],
    references: [
      "ISO/IEC 42001:2023 - Sección A.6.2.7",
      "NIST AI RMF GOVERN 1.4",
    ],
  },
  {
    id: "4.2",
    category: "Sección 4: Documentación y comunicación",
    title: "Comunicación diferenciada a usuarios",
    question:
      "¿Se proporciona información clara y diferenciada sobre capacidades, limitaciones y uso apropiado del sistema según la audiencia?",
    evidences: [
      "Manuales de usuario por nivel técnico",
      "Guías específicas sobre interpretación de resultados",
      "Advertencias claras sobre limitaciones y usos inapropiados",
      "Material de capacitación para diferentes roles de usuario",
    ],
    references: [
      "ISO/IEC 42001:2023 - Sección A.8.2",
      "NIST AI RMF Sección 3.4",
    ],
  },
  {
    id: "5.1",
    category: "Sección 5: Supervisión humana y control",
    title: "Mecanismos de intervención humana",
    question:
      "¿Existen mecanismos efectivos que permiten supervisión humana significativa e intervención en decisiones del sistema?",
    evidences: [
      "Procedimientos documentados de supervisión humana",
      "Interfaces técnicas para intervención y anulación",
      "Criterios específicos para intervención humana obligatoria",
      "Registro de intervenciones realizadas con justificaciones",
    ],
    references: [
      "NIST AI RMF MAP 3.5",
      "ISO/IEC 42001:2023 - Sección A.3.2",
    ],
  },
  {
    id: "5.2",
    category: "Sección 5: Supervisión humana y control",
    title: "Capacitación para interpretación",
    question:
      "¿Los supervisores y usuarios cuentan con capacitación adecuada para interpretar resultados y tomar decisiones informadas?",
    evidences: [
      "Programa de capacitación en interpretación de resultados IA",
      "Evaluaciones de competencia de supervisores",
      "Material didáctico sobre limitaciones y sesgos del sistema",
      "Métricas de efectividad de supervisión humana",
    ],
    references: [
      "ISO/IEC 42001:2023 - Sección 7.2",
      "NIST AI RMF Anexo C",
    ],
  },
  {
    id: "6.1",
    category: "Sección 6: Medición y monitoreo continuo",
    title: "Métricas de transparencia",
    question:
      "¿Se han implementado métricas específicas para medir y monitorear la efectividad de la transparencia y explicabilidad del sistema?",
    evidences: [
      "Catálogo de métricas de transparencia aplicadas",
      "Herramientas automatizadas de medición implementadas",
      "Reportes periódicos con análisis de tendencias",
      "Benchmarks internos y externos para comparación",
    ],
    references: [
      "NIST AI RMF MEASURE 2.8",
      "ISO/IEC 23894:2023 - Sección 6.4",
    ],
    recommendations: [
      "Tiempo promedio de comprensión de explicaciones",
      "Porcentaje de decisiones anuladas por supervisores",
      "Satisfacción de usuarios con nivel de explicabilidad",
      "Cobertura de explicaciones por tipo de decisión",
    ],
  },
  {
    id: "6.2",
    category: "Sección 6: Medición y monitoreo continuo",
    title: "Retroalimentación y mejora continua",
    question:
      "¿Existen mecanismos establecidos para capturar retroalimentación de usuarios sobre transparencia y explicabilidad?",
    evidences: [
      "Canales de retroalimentación implementados y activos",
      "Proceso documentado de integración de feedback",
      "Métricas de mejora en satisfacción de usuarios",
      "Plan de mejora continua con cronograma específico",
    ],
    references: [
      "NIST AI RMF MEASURE 3.3",
      "ISO/IEC 42001:2023 - Sección 10.1",
    ],
  },
  {
    id: "7.1",
    category: "Sección 7: Gestión de riesgos e incidentes",
    title: "Identificación y tratamiento de riesgos",
    question:
      "¿Se han identificado, evaluado y tratado específicamente los riesgos relacionados con falta de transparencia o explicabilidad inadecuada?",
    evidences: [
      "Registro de riesgos específicos de transparencia",
      "Análisis de impacto y probabilidad documentado",
      "Plan de tratamiento con controles específicos",
      "Monitoreo continuo de riesgos residuales",
    ],
    references: [
      "ISO/IEC 23894:2023 - Sección 6.1",
      "NIST AI RMF MANAGE 1.3",
    ],
  },
  {
    id: "7.2",
    category: "Sección 7: Gestión de riesgos e incidentes",
    title: "Gestión de incidentes de transparencia",
    question:
      "¿Existe un protocolo específico para gestionar incidentes relacionados con falta de transparencia o explicaciones inadecuadas?",
    evidences: [
      "Plan de comunicación de incidentes de transparencia",
      "Procedimientos de escalamiento y respuesta",
      "Registro histórico de incidentes con análisis de causas",
      "Comunicación efectiva a stakeholders afectados",
    ],
    references: [
      "NIST AI RMF MANAGE 4.3",
      "ISO/IEC 42001:2023 - Sección A.8.4",
    ],
  },
]

const storageKey = "transparencyExplainabilityChecklist"

export default function TransparencyExplainabilityChecklist() {
  const { toast } = useToast()
  const [responses, setResponses] = useState<Record<string, SectionResponse>>({})
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  const groupedSections = useMemo(() => {
    return checklistSections.reduce((acc, section) => {
      if (!acc[section.category]) {
        acc[section.category] = []
      }
      acc[section.category].push(section)
      return acc
    }, {} as Record<string, ChecklistSection[]>)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const parsed = JSON.parse(stored)
      setResponses(parsed.responses || {})
      setLastSaved(parsed.lastSaved || null)
    } else {
      const initial: Record<string, SectionResponse> = {}
      checklistSections.forEach((section) => {
        initial[section.id] = {
          rating: "",
          evidenceNotes: "",
          actionPlan: "",
          reviewerNotes: "",
        }
      })
      setResponses(initial)
    }
  }, [])

  useEffect(() => {
    if (Object.keys(responses).length === 0) {
      return
    }
    const payload = {
      responses,
      lastSaved,
    }
    localStorage.setItem(storageKey, JSON.stringify(payload))
  }, [responses, lastSaved])

  const handleResponseChange = (
    sectionId: string,
    field: keyof SectionResponse,
    value: string,
  ) => {
    setResponses((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value,
      },
    }))
  }

  const handleSaveProgress = () => {
    const timestamp = new Date().toISOString()
    setLastSaved(timestamp)
    toast({
      title: "Checklist guardado",
      description: "El progreso de evaluación fue almacenado localmente.",
    })
  }

  const handleReset = () => {
    const resetResponses: Record<string, SectionResponse> = {}
    checklistSections.forEach((section) => {
      resetResponses[section.id] = {
        rating: "",
        evidenceNotes: "",
        actionPlan: "",
        reviewerNotes: "",
      }
    })
    setResponses(resetResponses)
    setLastSaved(null)
    toast({
      title: "Formulario reiniciado",
      description: "Todos los campos fueron restablecidos.",
    })
  }

  const completedSections = useMemo(() => {
    return Object.values(responses).filter((response) => response?.rating && response.rating !== "").length
  }, [responses])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-r from-slate-50 via-white to-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle>Checklist unificado de transparencia y explicabilidad</CardTitle>
            <CardDescription>
              Marco integral alineado con ISO/IEC 23894:2023, ISO/IEC 42001:2023 y NIST AI RMF 1.0
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Este módulo permite evaluar el cumplimiento de requisitos de transparencia y explicabilidad para sistemas de IA,
              consolidando obligaciones normativas y mejores prácticas internacionales.
            </p>
            <div>
              <h3 className="font-semibold text-foreground">Objetivos principales</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Verificar implementación de características de IA confiable</li>
                <li>Evaluar conformidad con marcos regulatorios internacionales</li>
                <li>Identificar brechas en gobernanza de transparencia</li>
                <li>Facilitar mejora continua en explicabilidad de sistemas IA</li>
                <li>Proporcionar evidencia objetiva de cumplimiento normativo</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">ISO/IEC 23894:2023</Badge>
              <Badge variant="outline">ISO/IEC 42001:2023</Badge>
              <Badge variant="outline">NIST AI RMF 1.0</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Estado de la evaluación</CardTitle>
            <CardDescription>Gestiona el avance y la trazabilidad del checklist</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Secciones completadas</span>
              <Badge variant="secondary">
                {completedSections}/{checklistSections.length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Último guardado</span>
              <span className="text-muted-foreground text-xs">
                {lastSaved ? new Date(lastSaved).toLocaleString() : "Pendiente"}
              </span>
            </div>
            <div className="grid gap-2 pt-2 sm:grid-cols-2">
              <Button variant="default" onClick={handleSaveProgress}>
                Guardar progreso
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reiniciar checklist
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              La información se almacena localmente en el navegador para preservar la confidencialidad de los hallazgos.
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Instrucciones</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="platform">Configuración de plataforma</TabsTrigger>
          <TabsTrigger value="schedule">Cronograma y retención</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del proyecto</CardTitle>
                <CardDescription>Definición de alcance y contexto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Crear nueva evaluación especificando:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Sistema de IA a auditar</li>
                  <li>Marco regulatorio aplicable (ISO, NIST o ambos)</li>
                  <li>Contexto de aplicación y nivel de riesgo</li>
                  <li>Stakeholders relevantes identificados</li>
                  <li>Cronograma de evaluación</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Asignación de responsabilidades</CardTitle>
                <CardDescription>Roles mínimos requeridos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <ul className="list-disc space-y-1 pl-5">
                  <li>Líder de evaluación</li>
                  <li>Auditor técnico</li>
                  <li>Auditor de gobernanza</li>
                  <li>Representante de usuarios</li>
                  <li>Gestor de evidencias</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Metodología de evaluación</CardTitle>
              <CardDescription>Escala y requisitos transversales</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Escala de calificación:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Conforme (C): Cumplimiento total con evidencia suficiente</li>
                  <li>Parcialmente Conforme (PC): Cumplimiento incompleto requiere mejoras</li>
                  <li>No Conforme (NC): Incumplimiento significativo requiere acción inmediata</li>
                  <li>No Aplicable (NA): Criterio no relevante para el sistema evaluado</li>
                </ul>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Requisitos obligatorios para toda respuesta:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Evidencia documental para toda respuesta positiva</li>
                  <li>Plan de acción para no conformidades</li>
                  <li>Justificación técnica para elementos no aplicables</li>
                  <li>Revisión cruzada entre auditores</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Checklist operativo</CardTitle>
              <CardDescription>Registra hallazgos y evidencia por sección</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(groupedSections).map(([category, sections]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{category}</h3>
                    <Badge variant="secondary">{sections.length} criterios</Badge>
                  </div>
                  <div className="grid gap-4">
                    {sections.map((section) => {
                      const response = responses[section.id] || {
                        rating: "",
                        evidenceNotes: "",
                        actionPlan: "",
                        reviewerNotes: "",
                      }

                      return (
                        <Card key={section.id} className="border-slate-200">
                          <CardHeader className="space-y-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <CardTitle className="text-base">{section.id} · {section.title}</CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">
                                  {section.question}
                                </CardDescription>
                              </div>
                              {response.rating ? (
                                <Badge variant="outline">{response.rating}</Badge>
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">
                                  Sin calificar
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4 text-sm text-muted-foreground">
                            <div className="grid gap-4 lg:grid-cols-2">
                              <div className="space-y-2">
                                <Label>Calificación</Label>
                                <Select
                                  value={response.rating}
                                  onValueChange={(value) => handleResponseChange(section.id, "rating", value)}
                                >
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Selecciona calificación" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ratingOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Referencias normativas</Label>
                                <ul className="list-disc space-y-1 pl-5">
                                  {section.references.map((reference) => (
                                    <li key={reference}>{reference}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                              <div className="space-y-2">
                                <Label>Evidencias obligatorias</Label>
                                <ul className="list-disc space-y-1 pl-5">
                                  {section.evidences.map((evidence) => (
                                    <li key={evidence}>{evidence}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="space-y-2">
                                {section.criteria && (
                                  <div>
                                    <Label>Criterios de evaluación</Label>
                                    <ul className="mt-2 list-disc space-y-1 pl-5">
                                      {section.criteria.map((criterion) => (
                                        <li key={criterion}>{criterion}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {section.recommendations && (
                                  <div>
                                    <Label>Recomendaciones técnicas</Label>
                                    <ul className="mt-2 list-disc space-y-1 pl-5">
                                      {section.recommendations.map((recommendation) => (
                                        <li key={recommendation}>{recommendation}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-3">
                              <div className="lg:col-span-1 space-y-2 text-muted-foreground">
                                <Label className="text-foreground">Resumen de evidencias aportadas</Label>
                                <Textarea
                                  value={response.evidenceNotes}
                                  onChange={(event) =>
                                    handleResponseChange(section.id, "evidenceNotes", event.target.value)
                                  }
                                  placeholder="Describe documentos, enlaces o entrevistas que respaldan la calificación"
                                  className="min-h-[120px]"
                                />
                              </div>
                              <div className="lg:col-span-1 space-y-2 text-muted-foreground">
                                <Label className="text-foreground">Plan de acción o mitigación</Label>
                                <Textarea
                                  value={response.actionPlan}
                                  onChange={(event) =>
                                    handleResponseChange(section.id, "actionPlan", event.target.value)
                                  }
                                  placeholder="Define acciones correctivas, responsables y plazos"
                                  className="min-h-[120px]"
                                />
                              </div>
                              <div className="lg:col-span-1 space-y-2 text-muted-foreground">
                                <Label className="text-foreground">Notas del revisor</Label>
                                <Textarea
                                  value={response.reviewerNotes}
                                  onChange={(event) =>
                                    handleResponseChange(section.id, "reviewerNotes", event.target.value)
                                  }
                                  placeholder="Comentarios adicionales, dependencias o consideraciones"
                                  className="min-h-[120px]"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platform" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Funcionalidades técnicas requeridas</CardTitle>
                <CardDescription>Capacidades clave de la plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <ul className="list-disc space-y-1 pl-5">
                  <li>Dashboard de cumplimiento con visualización por secciones</li>
                  <li>Sistema de alertas para elementos críticos sin evidencia</li>
                  <li>Workflow automatizado de evaluación y aprobación</li>
                  <li>Repositorio centralizado de evidencias con trazabilidad</li>
                  <li>Generación automática de reportes de cumplimiento</li>
                  <li>Integración con sistemas de gestión de riesgos existentes</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Configuraciones administrativas</CardTitle>
                <CardDescription>Controles y automatizaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <ul className="list-disc space-y-1 pl-5">
                  <li>Roles diferenciados con permisos específicos por sección</li>
                  <li>Recordatorios automáticos para reevaluaciones periódicas</li>
                  <li>Trazabilidad completa de cambios y versiones</li>
                  <li>Notificaciones escaladas para no conformidades críticas</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Métricas de plataforma</CardTitle>
              <CardDescription>Indicadores de desempeño sugeridos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc space-y-1 pl-5">
                <li>Tiempo promedio de completitud de evaluaciones</li>
                <li>Porcentaje de cumplimiento por sección y organización</li>
                <li>Tendencias de mejora en indicadores de transparencia</li>
                <li>Efectividad de planes de remediación implementados</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Matriz de implementación por nivel de riesgo</CardTitle>
              <CardDescription>Requisitos diferenciados según criticidad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 text-sm text-muted-foreground">
                <Card className="bg-slate-50 border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Alto riesgo</CardTitle>
                    <CardDescription>Sistemas críticos (salud, justicia, finanzas)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Explicabilidad por diseño desde planificación</li>
                      <li>Comité multidisciplinario de transparencia</li>
                      <li>Explicaciones multinivel (técnico, regulatorio, usuario)</li>
                      <li>Auditorías trimestrales de transparencia</li>
                      <li>Documentación exhaustiva de todas las decisiones</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-slate-50 border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Riesgo medio</CardTitle>
                    <CardDescription>Sistemas semi-críticos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Herramientas XAI estándar implementadas</li>
                      <li>Transparencia priorizada en áreas de mayor impacto</li>
                      <li>Retroalimentación regular de usuarios</li>
                      <li>Auditorías semestrales</li>
                      <li>Documentación de casos de uso y limitaciones</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-slate-50 border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Bajo riesgo</CardTitle>
                    <CardDescription>Sistemas no críticos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Información básica sobre funcionamiento</li>
                      <li>Limitaciones conocidas documentadas</li>
                      <li>Canales de comunicación con usuarios</li>
                      <li>Auditorías anuales</li>
                      <li>Documentación técnica actualizada</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cronograma de evaluaciones</CardTitle>
                <CardDescription>Frecuencias sugeridas por nivel de riesgo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <ul className="list-disc space-y-1 pl-5">
                  <li>Alto riesgo: Evaluación trimestral con monitoreo continuo</li>
                  <li>Riesgo medio: Evaluación semestral</li>
                  <li>Bajo riesgo: Evaluación anual</li>
                  <li>Cambios significativos: Reevaluación dentro de 30 días</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Retención de evidencias</CardTitle>
                <CardDescription>Plazos y obligaciones mínimas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <ul className="list-disc space-y-1 pl-5">
                  <li>Sistemas críticos: 7 años</li>
                  <li>Sistemas no críticos: 5 años</li>
                  <li>Adaptar según requisitos regulatorios sectoriales</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Actualización y mejora continua</CardTitle>
              <CardDescription>Mantenimiento del checklist</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc space-y-1 pl-5">
                <li>Revisión anual o ante actualizaciones normativas</li>
                <li>Incorporación de lecciones aprendidas semestralmente</li>
                <li>Monitoreo de tendencias emergentes en transparencia de IA</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Registro de requisitos específicos del proyecto</CardTitle>
          <CardDescription>Utiliza este espacio para anotar alineaciones particulares</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <Textarea
              placeholder="Documenta decisiones, dependencias o acuerdos adicionales relacionados con transparencia y explicabilidad"
              className="min-h-[180px]"
            />
          </ScrollArea>
          <p className="mt-3 text-xs text-muted-foreground">
            Este campo no se almacena automáticamente. Copia su contenido en tu repositorio de evidencias antes de salir del módulo.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
