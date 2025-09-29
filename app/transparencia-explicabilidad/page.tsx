"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { CalendarDays, ClipboardList, Download, Layers, RefreshCcw, Save, Shield, Users } from "lucide-react"

const frameworks = [
  "ISO/IEC 23894:2023",
  "ISO/IEC 42001:2023",
  "NIST AI RMF 1.0",
]

const riskLevels = [
  { value: "alto", label: "Alto riesgo" },
  { value: "medio", label: "Riesgo medio" },
  { value: "bajo", label: "Bajo riesgo" },
]

type Rating = "" | "C" | "PC" | "NC" | "NA"

type ChecklistItemField = "rating" | "evidenceNotes" | "actionPlan" | "justification"

interface ChecklistItem {
  id: string
  title: string
  question: string
  evidences: string[]
  references: string[]
  evaluationCriteria?: string[]
  recommendations?: string[]
}

interface ChecklistSection {
  id: string
  title: string
  description: string
  items: ChecklistItem[]
}

interface ChecklistItemResponse {
  itemId: string
  rating: Rating
  evidenceNotes: string
  actionPlan: string
  justification: string
}

interface ChecklistSectionResponse {
  sectionId: string
  items: ChecklistItemResponse[]
}

interface ChecklistRecord {
  id: string
  evaluationName: string
  aiSystem: string
  frameworks: string[]
  riskLevel: string
  evaluationCycle: string
  evaluationDate: string
  stakeholders: string
  leadEvaluator: string
  objectives: string
  notes: string
  sections: ChecklistSectionResponse[]
  createdAt: string
  updatedAt: string
}

const ratingOptions = [
  { value: "C", label: "Conforme (C)" },
  { value: "PC", label: "Parcialmente Conforme (PC)" },
  { value: "NC", label: "No Conforme (NC)" },
  { value: "NA", label: "No Aplicable (NA)" },
]

const sections: ChecklistSection[] = [
  {
    id: "1",
    title: "SECCIÓN 1: GOBERNANZA ORGANIZACIONAL",
    description:
      "Consolida la estructura organizacional que soporta la transparencia y la explicabilidad durante todo el ciclo de vida del sistema de IA.",
    items: [
      {
        id: "1.1",
        title: "1.1 Marco Político y Estratégico",
        question:
          "¿Existen políticas formales que integren principios de transparencia y explicabilidad específicos para sistemas de IA?",
        evidences: [
          "Política de IA que incluya definiciones específicas de transparencia",
          "Procedimientos operativos para implementar explicabilidad",
          "Evidencia de comunicación y capacitación del personal",
          "Mecanismos de revisión y actualización periódica",
        ],
        references: [
          "ISO/IEC 42001:2023 - Sección 5.2 (Política de IA)",
          "NIST AI RMF GOVERN 1.2 (Integración de características confiables)",
        ],
        evaluationCriteria: [
          "Existencia de políticas específicas vs. genéricas para IA",
          "Definición clara de la información apropiada por stakeholder",
          "Excepciones justificadas (propiedad intelectual, seguridad)",
          "Alineación con objetivos organizacionales",
        ],
      },
      {
        id: "1.2",
        title: "1.2 Estructura de Responsabilidades",
        question:
          "¿Se han definido y asignado roles específicos para gestionar transparencia y explicabilidad a lo largo del ciclo de vida del sistema?",
        evidences: [
          "Matriz RACI de responsabilidades para transparencia",
          "Descripciones de cargo que incluyan funciones específicas",
          "Autoridad asignada para decisiones de transparencia",
          "Canales de escalamiento y comunicación definidos",
        ],
        references: [
          "ISO/IEC 42001:2023 - Sección 5.3 (Roles y responsabilidades)",
          "NIST AI RMF GOVERN 2.1 (Roles documentados)",
        ],
      },
    ],
  },
  {
    id: "2",
    title: "SECCIÓN 2: ANÁLISIS CONTEXTUAL Y MAPEO DE REQUISITOS",
    description:
      "Garantiza que los requisitos de transparencia respondan al contexto socio-técnico y a las necesidades de información de cada stakeholder.",
    items: [
      {
        id: "2.1",
        title: "2.1 Comprensión del Contexto Operacional",
        question:
          "¿Se ha establecido un análisis completo del contexto operacional incluyendo necesidades diferenciadas de transparencia por stakeholder?",
        evidences: [
          "Análisis detallado del contexto de aplicación",
          "Mapeo completo de stakeholders con matriz de necesidades informativas",
          "Evaluación de impactos potenciales (positivos y negativos)",
          "Consideraciones culturales y jurisdiccionales específicas",
        ],
        references: [
          "ISO/IEC 23894:2023 - Sección 6.3 (Alcance, contexto y criterios)",
          "NIST AI RMF MAP 1.1 (Comprensión del contexto)",
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
        title: "2.2 Definición de Requisitos de Sistema",
        question:
          "¿Los requisitos del sistema incorporan consideraciones específicas de transparencia y explicabilidad basadas en el análisis socio-técnico?",
        evidences: [
          "Especificación de requisitos con sección dedicada a transparencia",
          "Análisis de trade-offs entre precisión y explicabilidad",
          "Requisitos de interfaz para presentación de explicaciones",
          "Criterios de aceptación para capacidades de explicabilidad",
        ],
        references: [
          "ISO/IEC 42001:2023 - Sección A.6.2.2 (Requisitos del sistema)",
          "NIST AI RMF MAP 1.6 (Requisitos socio-técnicos)",
        ],
      },
    ],
  },
  {
    id: "3",
    title: "SECCIÓN 3: CAPACIDADES TÉCNICAS DE EXPLICABILIDAD",
    description: "Evalúa la implementación de técnicas, herramientas y adaptabilidad de las explicaciones provistas por el sistema.",
    items: [
      {
        id: "3.1",
        title: "3.1 Implementación de Explicabilidad",
        question:
          "¿El sistema implementa capacidades técnicas verificables para generar explicaciones comprensibles de sus decisiones?",
        evidences: [
          "Especificaciones técnicas de métodos explicativos implementados",
          "Ejemplos documentados de explicaciones generadas",
          "Evaluaciones de comprensibilidad con usuarios reales",
          "Benchmarks de rendimiento de explicabilidad vs. precisión",
        ],
        references: [
          "NIST AI RMF Sección 3.5 (Explicable e Interpretable)",
          "ISO/IEC 23894:2023 - Anexo A.12 (Transparencia y explicabilidad)",
        ],
        evaluationCriteria: [
          "Implementación de técnicas XAI (SHAP, LIME, GRAD-CAM, etc.)",
          "Capacidad de explicación local y global",
          "Disponibilidad de explicaciones contrafactuales",
          "Inclusión de medidas de confianza en las explicaciones",
        ],
      },
      {
        id: "3.2",
        title: "3.2 Calidad y Adaptabilidad de Explicaciones",
        question:
          "¿Las explicaciones se adaptan al contexto del usuario y proporcionan información relevante para la toma de decisiones?",
        evidences: [
          "Framework de personalización de explicaciones por tipo de usuario",
          "Pruebas de usabilidad documentadas con métricas específicas",
          "Sistemas de retroalimentación para mejorar calidad explicativa",
          "Validación de comprensibilidad con grupos de usuarios diversos",
        ],
        references: [
          "NIST AI RMF MEASURE 2.9 (Explicación e interpretación del modelo)",
          "ISO/IEC 42001:2023 - Sección A.8.2 (Información para usuarios)",
        ],
      },
      {
        id: "3.3",
        title: "3.3 Transparencia de Factores Determinantes",
        question:
          "¿Se identifican y comunican claramente los factores más importantes que influyen en las decisiones del sistema?",
        evidences: [
          "Análisis de importancia de características con visualizaciones",
          "Documentación de variables clave por tipo de decisión",
          "Métricas de confianza y rangos de incertidumbre",
          "Umbrales de confianza establecidos y comunicados",
        ],
        references: ["ISO/IEC 23894:2023 - Sección B.3 (Falta de transparencia como fuente de riesgo)"],
      },
    ],
  },
  {
    id: "4",
    title: "SECCIÓN 4: DOCUMENTACIÓN Y COMUNICACIÓN",
    description:
      "Revisa la calidad de la documentación técnica y la efectividad de la comunicación diferenciada hacia las audiencias clave.",
    items: [
      {
        id: "4.1",
        title: "4.1 Documentación Técnica Integral",
        question:
          "¿Existe documentación técnica completa que incluye arquitectura, decisiones de diseño y procesos de desarrollo con enfoque en transparencia?",
        evidences: [
          "Documentación de arquitectura con componentes de explicabilidad",
          "Registro de decisiones de diseño relacionadas con transparencia",
          "Documentación de datos de entrenamiento y procesos de preparación",
          "Procedimientos de verificación y validación de explicabilidad",
        ],
        references: [
          "ISO/IEC 42001:2023 - Sección A.6.2.7 (Documentación técnica)",
          "NIST AI RMF GOVERN 1.4 (Procesos transparentes documentados)",
        ],
      },
      {
        id: "4.2",
        title: "4.2 Comunicación Diferenciada a Usuarios",
        question:
          "¿Se proporciona información clara y diferenciada sobre capacidades, limitaciones y uso apropiado del sistema según la audiencia?",
        evidences: [
          "Manuales de usuario por nivel técnico",
          "Guías específicas sobre interpretación de resultados",
          "Advertencias claras sobre limitaciones y usos inapropiados",
          "Material de capacitación para diferentes roles de usuario",
        ],
        references: [
          "ISO/IEC 42001:2023 - Sección A.8.2 (Documentación para usuarios)",
          "NIST AI RMF Sección 3.4 (Transparencia significativa)",
        ],
      },
    ],
  },
  {
    id: "5",
    title: "SECCIÓN 5: SUPERVISIÓN HUMANA Y CONTROL",
    description:
      "Confirma que existen mecanismos efectivos para supervisión humana significativa y capacidades para interpretar y actuar ante resultados del sistema.",
    items: [
      {
        id: "5.1",
        title: "5.1 Mecanismos de Intervención Humana",
        question:
          "¿Existen mecanismos efectivos que permiten supervisión humana significativa e intervención en decisiones del sistema?",
        evidences: [
          "Procedimientos documentados de supervisión humana",
          "Interfaces técnicas para intervención y anulación",
          "Criterios específicos para intervención humana obligatoria",
          "Registro de intervenciones realizadas con justificaciones",
        ],
        references: [
          "NIST AI RMF MAP 3.5 (Procesos de supervisión humana)",
          "ISO/IEC 42001:2023 - Sección A.3.2 (Configuraciones humano-IA)",
        ],
      },
      {
        id: "5.2",
        title: "5.2 Capacitación para Interpretación",
        question:
          "¿Los supervisores y usuarios cuentan con capacitación adecuada para interpretar resultados y tomar decisiones informadas?",
        evidences: [
          "Programa de capacitación en interpretación de resultados IA",
          "Evaluaciones de competencia de supervisores",
          "Material didáctico sobre limitaciones y sesgos del sistema",
          "Métricas de efectividad de supervisión humana",
        ],
        references: [
          "ISO/IEC 42001:2023 - Sección 7.2 (Competencia)",
          "NIST AI RMF Anexo C (Interacción humano-IA)",
        ],
      },
    ],
  },
  {
    id: "6",
    title: "SECCIÓN 6: MEDICIÓN Y MONITOREO CONTINUO",
    description:
      "Verifica la existencia de métricas, mecanismos de retroalimentación y procesos de mejora continua sobre transparencia y explicabilidad.",
    items: [
      {
        id: "6.1",
        title: "6.1 Métricas de Transparencia",
        question:
          "¿Se han implementado métricas específicas para medir y monitorear la efectividad de la transparencia y explicabilidad del sistema?",
        evidences: [
          "Catálogo de métricas de transparencia aplicadas",
          "Herramientas automatizadas de medición implementadas",
          "Reportes periódicos con análisis de tendencias",
          "Benchmarks internos y externos para comparación",
        ],
        references: [
          "NIST AI RMF MEASURE 2.8 (Evaluación de transparencia)",
          "ISO/IEC 23894:2023 - Sección 6.4 (Evaluación de riesgos)",
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
        title: "6.2 Retroalimentación y Mejora Continua",
        question:
          "¿Existen mecanismos establecidos para capturar retroalimentación de usuarios sobre transparencia y explicabilidad?",
        evidences: [
          "Canales de retroalimentación implementados y activos",
          "Proceso documentado de integración de feedback",
          "Métricas de mejora en satisfacción de usuarios",
          "Plan de mejora continua con cronograma específico",
        ],
        references: [
          "NIST AI RMF MEASURE 3.3 (Procesos de retroalimentación)",
          "ISO/IEC 42001:2023 - Sección 10.1 (Mejora continua)",
        ],
      },
    ],
  },
  {
    id: "7",
    title: "SECCIÓN 7: GESTIÓN DE RIESGOS E INCIDENTES",
    description:
      "Confirma la identificación, tratamiento y respuesta ante riesgos e incidentes relacionados con la transparencia y explicabilidad.",
    items: [
      {
        id: "7.1",
        title: "7.1 Identificación y Tratamiento de Riesgos",
        question:
          "¿Se han identificado, evaluado y tratado específicamente los riesgos relacionados con falta de transparencia o explicabilidad inadecuada?",
        evidences: [
          "Registro de riesgos específicos de transparencia",
          "Análisis de impacto y probabilidad documentado",
          "Plan de tratamiento con controles específicos",
          "Monitoreo continuo de riesgos residuales",
        ],
        references: [
          "ISO/IEC 23894:2023 - Sección 6.1 (Evaluación de riesgos IA)",
          "NIST AI RMF MANAGE 1.3 (Respuesta a riesgos prioritarios)",
        ],
      },
      {
        id: "7.2",
        title: "7.2 Gestión de Incidentes de Transparencia",
        question:
          "¿Existe un protocolo específico para gestionar incidentes relacionados con falta de transparencia o explicaciones inadecuadas?",
        evidences: [
          "Plan de comunicación de incidentes de transparencia",
          "Procedimientos de escalamiento y respuesta",
          "Registro histórico de incidentes con análisis de causas",
          "Comunicación efectiva a stakeholders afectados",
        ],
        references: [
          "NIST AI RMF MANAGE 4.3 (Comunicación de incidentes)",
          "ISO/IEC 42001:2023 - Sección A.8.4 (Comunicación de incidentes)",
        ],
      },
    ],
  },
]

const riskImplementationGuidelines = [
  {
    level: "Alto riesgo",
    description: "Sistemas críticos - Salud, justicia, finanzas",
    requirements: [
      "Explicabilidad por diseño desde planificación",
      "Comité multidisciplinario de transparencia",
      "Explicaciones multinivel (técnico, regulatorio, usuario)",
      "Auditorías trimestrales de transparencia",
      "Documentación exhaustiva de todas las decisiones",
    ],
  },
  {
    level: "Riesgo medio",
    description: "Sistemas semi-críticos - Recursos humanos, educación",
    requirements: [
      "Herramientas XAI estándar implementadas",
      "Transparencia priorizada en áreas de mayor impacto",
      "Retroalimentación regular de usuarios",
      "Auditorías semestrales",
      "Documentación de casos de uso y limitaciones",
    ],
  },
  {
    level: "Bajo riesgo",
    description: "Sistemas no críticos - Recomendaciones, optimización",
    requirements: [
      "Información básica sobre funcionamiento",
      "Limitaciones conocidas documentadas",
      "Canales de comunicación con usuarios",
      "Auditorías anuales",
      "Documentación técnica actualizada",
    ],
  },
]

const platformCapabilities = [
  {
    title: "Funcionalidades técnicas clave",
    icon: ClipboardList,
    items: [
      "Dashboard de cumplimiento con visualización por secciones",
      "Sistema de alertas para elementos críticos sin evidencia",
      "Workflow automatizado de evaluación y aprobación",
      "Repositorio centralizado de evidencias con trazabilidad",
      "Generación automática de reportes de cumplimiento",
      "Integración con sistemas de gestión de riesgos existentes",
    ],
  },
  {
    title: "Configuraciones administrativas",
    icon: Users,
    items: [
      "Roles diferenciados con permisos específicos por sección",
      "Recordatorios automáticos para reevaluaciones periódicas",
      "Trazabilidad completa de cambios y versiones",
      "Notificaciones escaladas para no conformidades críticas",
    ],
  },
  {
    title: "Métricas recomendadas",
    icon: Layers,
    items: [
      "Tiempo promedio de completitud de evaluaciones",
      "Porcentaje de cumplimiento por sección y organización",
      "Tendencias de mejora en indicadores de transparencia",
      "Efectividad de planes de remediación implementados",
    ],
  },
]

const evaluationSchedule = [
  {
    title: "Frecuencia por nivel de riesgo",
    icon: Shield,
    items: [
      "Alto riesgo: Evaluación trimestral con monitoreo continuo",
      "Riesgo medio: Evaluación semestral",
      "Bajo riesgo: Evaluación anual",
      "Cambios significativos: Reevaluación inmediata dentro de 30 días",
    ],
  },
  {
    title: "Retención de evidencias",
    icon: CalendarDays,
    items: [
      "Sistemas críticos: 7 años",
      "Sistemas no críticos: 5 años",
      "Siempre según requisitos regulatorios específicos del sector",
    ],
  },
  {
    title: "Actualización del checklist",
    icon: RefreshCcw,
    items: [
      "Revisión anual o cuando se publiquen actualizaciones normativas",
      "Incorporación de lecciones aprendidas semestralmente",
    ],
  },
]

const storageKey = "transparencyExplainabilityChecklists"

const buildInitialSections = (): ChecklistSectionResponse[] =>
  sections.map((section) => ({
    sectionId: section.id,
    items: section.items.map((item) => ({
      itemId: item.id,
      rating: "",
      evidenceNotes: "",
      actionPlan: "",
      justification: "",
    })),
  }))

const createInitialRecord = (): ChecklistRecord => ({
  id: "",
  evaluationName: "",
  aiSystem: "",
  frameworks: [],
  riskLevel: "",
  evaluationCycle: "",
  evaluationDate: "",
  stakeholders: "",
  leadEvaluator: "",
  objectives: "",
  notes: "",
  sections: buildInitialSections(),
  createdAt: "",
  updatedAt: "",
})

const normalizeSections = (savedSections: ChecklistSectionResponse[] | undefined): ChecklistSectionResponse[] => {
  const existingSections = savedSections ?? []
  return sections.map((section) => {
    const storedSection = existingSections.find((item) => item.sectionId === section.id)
    return {
      sectionId: section.id,
      items: section.items.map((item) => {
        const storedItem = storedSection?.items.find((response) => response.itemId === item.id)
        return {
          itemId: item.id,
          rating: (storedItem?.rating as Rating) || "",
          evidenceNotes: storedItem?.evidenceNotes || "",
          actionPlan: storedItem?.actionPlan || "",
          justification: storedItem?.justification || "",
        }
      }),
    }
  })
}

const getRecordMetrics = (record: ChecklistRecord) => {
  const totalItems = sections.reduce((acc, section) => acc + section.items.length, 0)
  const completedItems = record.sections.reduce((acc, section) => {
    const completed = section.items.filter((item) => item.rating && item.rating !== "").length
    return acc + completed
  }, 0)
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  const distribution = record.sections.reduce(
    (acc, section) => {
      section.items.forEach((item) => {
        if (item.rating) {
          acc[item.rating as Exclude<Rating, "">] += 1
        }
      })
      return acc
    },
    { C: 0, PC: 0, NC: 0, NA: 0 },
  )

  return { totalItems, completedItems, progress, distribution }
}

export default function TransparencyExplainabilityPage() {
  const { toast } = useToast()
  const [view, setView] = useState<"capture" | "history">("capture")
  const [formData, setFormData] = useState<ChecklistRecord>(createInitialRecord())
  const [savedRecords, setSavedRecords] = useState<ChecklistRecord[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const parsed: ChecklistRecord[] = JSON.parse(stored)
        setSavedRecords(
          parsed.map((record) => ({
            ...record,
            sections: normalizeSections(record.sections),
          })),
        )
      } catch (error) {
        console.error("Error parsing stored checklists", error)
      }
    }
  }, [])

  useEffect(() => {
    if (savedRecords.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(savedRecords))
    } else {
      localStorage.removeItem(storageKey)
    }
  }, [savedRecords])

  const totalItems = useMemo(() => sections.reduce((acc, section) => acc + section.items.length, 0), [])

  const completedItems = useMemo(() => {
    return formData.sections.reduce((acc, section) => {
      const completed = section.items.filter((item) => item.rating && item.rating !== "").length
      return acc + completed
    }, 0)
  }, [formData.sections])

  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  const ratingSummary = useMemo(
    () =>
      formData.sections.reduce(
        (acc, section) => {
          section.items.forEach((item) => {
            if (item.rating && item.rating !== "") {
              acc[item.rating as Exclude<Rating, "">] += 1
            }
          })
          return acc
        },
        { C: 0, PC: 0, NC: 0, NA: 0 },
      ),
    [formData.sections],
  )

  const handleTopLevelChange = (field: keyof Omit<ChecklistRecord, "id" | "sections" | "createdAt" | "updatedAt">, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFrameworkToggle = (framework: string, checked: boolean | string) => {
    const isChecked = checked === true
    setFormData((prev) => ({
      ...prev,
      frameworks: isChecked
        ? [...prev.frameworks, framework]
        : prev.frameworks.filter((item) => item !== framework),
    }))
  }

  const handleItemChange = (
    sectionId: string,
    itemId: string,
    field: ChecklistItemField,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.sectionId !== sectionId) return section
        return {
          ...section,
          items: section.items.map((item) => {
            if (item.itemId !== itemId) return item
            return {
              ...item,
              [field]: value,
            }
          }),
        }
      }),
    }))
  }

  const validateForm = () => {
    if (!formData.evaluationName || !formData.aiSystem || !formData.evaluationDate) {
      toast({
        title: "Completa los campos obligatorios",
        description: "Incluye el nombre de la evaluación, el sistema de IA y la fecha de evaluación.",
        variant: "destructive",
      })
      return false
    }

    if (formData.frameworks.length === 0) {
      toast({
        title: "Selecciona al menos un marco normativo",
        description: "El checklist se basa en ISO/IEC 23894, ISO/IEC 42001 y NIST AI RMF.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSave = () => {
    if (!validateForm()) return

    const timestamp = new Date().toISOString()

    if (editingId) {
      setSavedRecords((prev) =>
        prev.map((record) =>
          record.id === editingId
            ? {
                ...formData,
                id: editingId,
                createdAt: record.createdAt,
                updatedAt: timestamp,
              }
            : record,
        ),
      )
      toast({
        title: "Checklist actualizado",
        description: "La evaluación se guardó correctamente.",
      })
    } else {
      const newRecord: ChecklistRecord = {
        ...formData,
        id: crypto.randomUUID(),
        createdAt: timestamp,
        updatedAt: timestamp,
      }
      setSavedRecords((prev) => [...prev, newRecord])
      toast({
        title: "Checklist guardado",
        description: "La evaluación se registró correctamente.",
      })
    }

    setFormData(createInitialRecord())
    setEditingId(null)
  }

  const handleResetForm = () => {
    setFormData(createInitialRecord())
    setEditingId(null)
  }

  const handleEdit = (record: ChecklistRecord) => {
    setFormData({
      ...record,
      sections: normalizeSections(record.sections),
    })
    setEditingId(record.id)
    setView("capture")
    toast({
      title: "Checklist cargado",
      description: "Puedes continuar con la edición y actualización de la evaluación.",
    })
  }

  const handleDelete = (id: string) => {
    setSavedRecords((prev) => prev.filter((record) => record.id !== id))
    if (editingId === id) {
      setFormData(createInitialRecord())
      setEditingId(null)
    }
    toast({
      title: "Checklist eliminado",
      description: "La evaluación fue eliminada del historial.",
    })
  }

  const handleExport = (record?: ChecklistRecord) => {
    const data = record ?? formData
    const fileName = `checklist-transparencia-${(data.aiSystem || "evaluacion").replace(/\s+/g, "-")}.json`
    const element = document.createElement("a")
    element.setAttribute("href", `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`)
    element.setAttribute("download", fileName)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-0">
              Transparencia y explicabilidad
            </Badge>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Checklist unificado de transparencia y explicabilidad en sistemas de IA
            </h1>
            <p className="mt-4 text-base md:text-lg text-blue-50/90">
              Integra los estándares ISO/IEC 23894:2023, ISO/IEC 42001:2023 y NIST AI RMF 1.0 para evaluar la madurez de tu
              organización y proporcionar evidencia objetiva de cumplimiento normativo.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 space-y-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle>Descripción y objetivos</CardTitle>
              <CardDescription>
                Utiliza este checklist para evaluar de forma integral la transparencia y explicabilidad de tus sistemas de IA
                y establecer un plan de mejora continua alineado con marcos regulatorios internacionales.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Objetivos principales</h3>
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  <li>• Verificar implementación de características de IA confiable</li>
                  <li>• Evaluar conformidad con marcos regulatorios internacionales</li>
                  <li>• Identificar brechas en gobernanza de transparencia</li>
                  <li>• Facilitar mejora continua en explicabilidad de sistemas IA</li>
                  <li>• Proporcionar evidencia objetiva de cumplimiento normativo</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Metodología de calificación</h3>
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  <li>
                    • Conforme (C): Cumplimiento total con evidencia suficiente
                  </li>
                  <li>
                    • Parcialmente Conforme (PC): Cumplimiento incompleto requiere mejoras
                  </li>
                  <li>
                    • No Conforme (NC): Incumplimiento significativo requiere acción inmediata
                  </li>
                  <li>
                    • No Aplicable (NA): Criterio no relevante para el sistema evaluado
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Instrucciones iniciales</CardTitle>
              <CardDescription>Configura la evaluación, asigna responsables y define alcance antes de calificar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div>
                <h4 className="font-medium text-slate-700">1. Configuración del proyecto</h4>
                <p>
                  Define el sistema de IA a auditar, el marco regulatorio aplicable, el contexto de uso, los stakeholders
                  involucrados y el cronograma.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-slate-700">2. Asignación de responsabilidades</h4>
                <p>
                  Designa roles clave: líder de evaluación, auditor técnico, auditor de gobernanza, representante de usuarios y
                  gestor de evidencias.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-slate-700">3. Reglas de evaluación</h4>
                <p>
                  Toda respuesta positiva debe estar sustentada con evidencia documental. Registra planes de acción y justifica
                  los elementos considerados no aplicables.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex gap-2">
            <Button variant={view === "capture" ? "default" : "outline"} onClick={() => setView("capture")}>
              Formulario activo
            </Button>
            <Button variant={view === "history" ? "default" : "outline"} onClick={() => setView("history")}>
              Historial de evaluaciones
            </Button>
          </div>
          <div className="text-xs md:text-sm text-slate-500">
            Seguimiento en tiempo real del cumplimiento y acciones correctivas.
          </div>
        </div>

        {view === "capture" ? (
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Datos generales de la evaluación</CardTitle>
                  <CardDescription>
                    Establece el alcance y los responsables antes de calificar cada criterio del checklist.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="evaluationName">Nombre de la evaluación *</Label>
                      <Input
                        id="evaluationName"
                        value={formData.evaluationName}
                        onChange={(event) => handleTopLevelChange("evaluationName", event.target.value)}
                        placeholder="Ej. Auditoría transparencia Q2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aiSystem">Sistema de IA evaluado *</Label>
                      <Input
                        id="aiSystem"
                        value={formData.aiSystem}
                        onChange={(event) => handleTopLevelChange("aiSystem", event.target.value)}
                        placeholder="Nombre del sistema"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evaluationDate">Fecha de evaluación *</Label>
                      <Input
                        id="evaluationDate"
                        type="date"
                        value={formData.evaluationDate}
                        onChange={(event) => handleTopLevelChange("evaluationDate", event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evaluationCycle">Cronograma / ciclo</Label>
                      <Input
                        id="evaluationCycle"
                        value={formData.evaluationCycle}
                        onChange={(event) => handleTopLevelChange("evaluationCycle", event.target.value)}
                        placeholder="Ej. Reevaluación semestral"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="leadEvaluator">Líder de evaluación</Label>
                      <Input
                        id="leadEvaluator"
                        value={formData.leadEvaluator}
                        onChange={(event) => handleTopLevelChange("leadEvaluator", event.target.value)}
                        placeholder="Nombre y cargo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stakeholders">Stakeholders relevantes</Label>
                      <Input
                        id="stakeholders"
                        value={formData.stakeholders}
                        onChange={(event) => handleTopLevelChange("stakeholders", event.target.value)}
                        placeholder="Ej. usuarios finales, reguladores"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Marcos regulatorios aplicables *</Label>
                    <div className="grid gap-3 md:grid-cols-3">
                      {frameworks.map((framework) => (
                        <label
                          key={framework}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
                        >
                          <Checkbox
                            checked={formData.frameworks.includes(framework)}
                            onCheckedChange={(checked) => handleFrameworkToggle(framework, checked)}
                          />
                          <span>{framework}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Clasificación de riesgo</Label>
                      <Select
                        value={formData.riskLevel}
                        onValueChange={(value) => handleTopLevelChange("riskLevel", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el nivel de riesgo" />
                        </SelectTrigger>
                        <SelectContent>
                          {riskLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="objectives">Objetivos específicos de la evaluación</Label>
                      <Textarea
                        id="objectives"
                        value={formData.objectives}
                        onChange={(event) => handleTopLevelChange("objectives", event.target.value)}
                        placeholder="Describe focos particulares de transparencia y explicabilidad que se evaluarán"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas generales y alcance</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(event) => handleTopLevelChange("notes", event.target.value)}
                      placeholder="Incluye consideraciones de alcance, decisiones previas o aspectos relevantes del contexto"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {editingId ? "Actualizar checklist" : "Guardar checklist"}
                    </Button>
                    <Button variant="outline" onClick={handleResetForm} className="flex items-center gap-2">
                      <RefreshCcw className="h-4 w-4" />
                      Reiniciar formulario
                    </Button>
                    <Button variant="outline" onClick={() => handleExport()} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Exportar borrador
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {sections.map((section) => {
                const sectionState = formData.sections.find((item) => item.sectionId === section.id)
                return (
                  <Card key={section.id} className="border-slate-200/80 shadow-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg font-semibold text-slate-900">{section.title}</CardTitle>
                          <CardDescription className="text-sm text-slate-600">
                            {section.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-white/80">
                          {section.items.length} criterios
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {section.items.map((item) => {
                        const itemState = sectionState?.items.find((response) => response.itemId === item.id)
                        const ratingValue = itemState?.rating ?? ""
                        return (
                          <div key={item.id} className="rounded-xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                  <h4 className="text-base font-semibold text-slate-900">{item.title}</h4>
                                  <p className="mt-1 text-sm text-slate-600">{item.question}</p>
                                </div>
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600">
                                  Criterio {item.id}
                                </Badge>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {item.references.map((reference) => (
                                  <Badge key={reference} variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">
                                    {reference}
                                  </Badge>
                                ))}
                              </div>

                              <div>
                                <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Evidencias obligatorias
                                </h5>
                                <ul className="mt-2 space-y-1 text-sm text-slate-600 list-disc pl-5">
                                  {item.evidences.map((evidence) => (
                                    <li key={evidence}>{evidence}</li>
                                  ))}
                                </ul>
                              </div>

                              {item.evaluationCriteria && (
                                <div>
                                  <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Criterios de evaluación
                                  </h5>
                                  <ul className="mt-2 space-y-1 text-sm text-slate-600 list-disc pl-5">
                                    {item.evaluationCriteria.map((criteria) => (
                                      <li key={criteria}>{criteria}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {item.recommendations && (
                                <div>
                                  <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Recomendaciones técnicas
                                  </h5>
                                  <ul className="mt-2 space-y-1 text-sm text-slate-600 list-disc pl-5">
                                    {item.recommendations.map((recommendation) => (
                                      <li key={recommendation}>{recommendation}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <Label>Calificación del criterio</Label>
                                  <Select
                                    value={ratingValue}
                                    onValueChange={(value) =>
                                      handleItemChange(section.id, item.id, "rating", value as Rating)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecciona la calificación" />
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
                                  <Label>Justificación técnica / NA</Label>
                                  <Textarea
                                    value={itemState?.justification ?? ""}
                                    onChange={(event) =>
                                      handleItemChange(section.id, item.id, "justification", event.target.value)
                                    }
                                    placeholder="Describe la evidencia, excepciones o fundamentos técnicos que respaldan la calificación"
                                    className="min-h-[100px]"
                                  />
                                </div>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <Label>Evidencias aportadas</Label>
                                  <Textarea
                                    value={itemState?.evidenceNotes ?? ""}
                                    onChange={(event) =>
                                      handleItemChange(section.id, item.id, "evidenceNotes", event.target.value)
                                    }
                                    placeholder="Detalla documentos, repositorios o registros cargados como evidencia"
                                    className="min-h-[100px]"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Plan de acción / seguimiento</Label>
                                  <Textarea
                                    value={itemState?.actionPlan ?? ""}
                                    onChange={(event) =>
                                      handleItemChange(section.id, item.id, "actionPlan", event.target.value)
                                    }
                                    placeholder="Define responsables, plazos y acciones correctivas para cerrar brechas"
                                    className="min-h-[100px]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="space-y-6">
              <Card className="border-slate-200/70 shadow-sm">
                <CardHeader>
                  <CardTitle>Progreso de cumplimiento</CardTitle>
                  <CardDescription>
                    {completedItems} de {totalItems} criterios evaluados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Avance total</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="mt-2 h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-green-100 bg-green-50 p-3">
                      <p className="text-xs uppercase text-green-600">Conformes</p>
                      <p className="mt-1 text-lg font-semibold text-green-700">{ratingSummary.C}</p>
                    </div>
                    <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                      <p className="text-xs uppercase text-amber-600">Parciales</p>
                      <p className="mt-1 text-lg font-semibold text-amber-700">{ratingSummary.PC}</p>
                    </div>
                    <div className="rounded-lg border border-rose-100 bg-rose-50 p-3">
                      <p className="text-xs uppercase text-rose-600">No conformes</p>
                      <p className="mt-1 text-lg font-semibold text-rose-700">{ratingSummary.NC}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs uppercase text-slate-600">No aplicables</p>
                      <p className="mt-1 text-lg font-semibold text-slate-700">{ratingSummary.NA}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-slate-500">
                    <p>• Guarda evidencia documental para cada respuesta conforme.</p>
                    <p>• Define un plan de acción y responsables para criterios parciales o no conformes.</p>
                    <p>• Documenta la justificación técnica para cada criterio marcado como no aplicable.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/70 shadow-sm">
                <CardHeader>
                  <CardTitle>Matriz de implementación según riesgo</CardTitle>
                  <CardDescription>
                    Ajusta la profundidad de controles de transparencia en función del impacto potencial del sistema de IA.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {riskImplementationGuidelines.map((item) => (
                    <div key={item.level} className="rounded-lg border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800 uppercase">{item.level}</p>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </div>
                      </div>
                      <ul className="mt-3 space-y-1 text-sm text-slate-600 list-disc pl-5">
                        {item.requirements.map((requirement) => (
                          <li key={requirement}>{requirement}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-slate-200/70 shadow-sm">
                <CardHeader>
                  <CardTitle>Consideraciones para implementación</CardTitle>
                  <CardDescription>
                    Configura la plataforma para asegurar trazabilidad, métricas y gestión de evidencias.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {platformCapabilities.map((item) => (
                    <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-indigo-500" />
                        <h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>
                      </div>
                      <ul className="mt-3 space-y-1 text-sm text-slate-600 list-disc pl-5">
                        {item.items.map((entry) => (
                          <li key={entry}>{entry}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-slate-200/70 shadow-sm">
                <CardHeader>
                  <CardTitle>Cronograma y retención de evidencias</CardTitle>
                  <CardDescription>
                    Mantén la periodicidad adecuada y conserva la documentación conforme a los requisitos regulatorios.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {evaluationSchedule.map((item) => (
                    <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-indigo-500" />
                        <h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>
                      </div>
                      <ul className="mt-3 space-y-1 text-sm text-slate-600 list-disc pl-5">
                        {item.items.map((entry) => (
                          <li key={entry}>{entry}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {savedRecords.length === 0 ? (
              <Card className="border-dashed border-2 border-slate-300 bg-slate-50">
                <CardHeader>
                  <CardTitle>Sin evaluaciones registradas</CardTitle>
                  <CardDescription>
                    Guarda tu primera evaluación de transparencia y explicabilidad para visualizar el historial y comparativos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setView("capture")}>Crear nueva evaluación</Button>
                </CardContent>
              </Card>
            ) : (
              savedRecords.map((record) => {
                const metrics = getRecordMetrics(record)
                return (
                  <Card key={record.id} className="border-slate-200/80 shadow-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg font-semibold text-slate-900">
                            {record.evaluationName || "Evaluación de transparencia"}
                          </CardTitle>
                          <CardDescription className="text-sm text-slate-600">
                            Sistema evaluado: <span className="font-medium text-slate-700">{record.aiSystem || "N/D"}</span>
                          </CardDescription>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {record.frameworks.map((framework) => (
                              <Badge key={framework} variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">
                                {framework}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right text-xs text-slate-500 space-y-1">
                          <p>Creado: {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "N/D"}</p>
                          <p>Actualizado: {record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : "N/D"}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-lg border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500 uppercase">Avance</p>
                          <p className="text-lg font-semibold text-slate-800">{metrics.progress}%</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500 uppercase">Calificados</p>
                          <p className="text-lg font-semibold text-slate-800">
                            {metrics.completedItems}/{metrics.totalItems}
                          </p>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500 uppercase">Nivel de riesgo</p>
                          <p className="text-sm font-medium text-slate-800">{record.riskLevel || "Sin definir"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs text-slate-600">
                        <div className="rounded-md border border-green-100 bg-green-50 p-2 text-center">
                          C: <span className="font-semibold text-green-700">{metrics.distribution.C}</span>
                        </div>
                        <div className="rounded-md border border-amber-100 bg-amber-50 p-2 text-center">
                          PC: <span className="font-semibold text-amber-700">{metrics.distribution.PC}</span>
                        </div>
                        <div className="rounded-md border border-rose-100 bg-rose-50 p-2 text-center">
                          NC: <span className="font-semibold text-rose-700">{metrics.distribution.NC}</span>
                        </div>
                        <div className="rounded-md border border-slate-200 bg-white p-2 text-center">
                          NA: <span className="font-semibold text-slate-700">{metrics.distribution.NA}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => handleEdit(record)}>
                          Editar evaluación
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleExport(record)}>
                          Exportar JSON
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(record.id)}>
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
