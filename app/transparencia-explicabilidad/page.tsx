"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/LanguageContext"
import { Download, Info, Target } from "lucide-react"
import jsPDF from "jspdf"

interface ChecklistItem {
  code: string
  title: string
  question: string
  evidences: string[]
  references: string[]
  criteria?: string[]
  recommendations?: string[]
  metrics?: string[]
}

interface ChecklistSection {
  id: string
  title: string
  description?: string
  items: ChecklistItem[]
}

const ratingScale = [
  { label: "C", description: "Conforme" },
  { label: "PC", description: "Parcialmente Conforme" },
  { label: "NC", description: "No Conforme" },
  { label: "NA", description: "No Aplicable" },
]

const baseContent = {
  title: "Checklist unificado de Transparencia y Explicabilidad en Sistemas de IA",
  subtitle:
    "Este checklist integra los estándares ISO/IEC 23894:2023, ISO/IEC 42001:2023 y NIST AI RMF 1.0 para evaluar el cumplimiento de requisitos de transparencia y explicabilidad en sistemas de inteligencia artificial.",
  objectives: [
    "Verificar la implementación de características de IA confiable (transparencia y explicabilidad)",
    "Evaluar conformidad con marcos regulatorios internacionales",
    "Identificar brechas en gobernanza de transparencia",
    "Facilitar mejora continua en explicabilidad de sistemas IA",
    "Proporcionar evidencia objetiva de cumplimiento normativo",
  ],
  usage: {
    title: "Instrucciones de uso en la plataforma",
    steps: [
      {
        title: "Configuración del proyecto",
        points: [
          "Crear nueva evaluación especificando el sistema de IA a auditar",
          "Seleccionar el marco regulatorio aplicable (ISO, NIST o ambos)",
          "Definir el contexto de aplicación y el nivel de riesgo",
          "Identificar stakeholders relevantes",
          "Establecer cronograma de evaluación",
        ],
      },
      {
        title: "Asignación de responsabilidades",
        points: [
          "Líder de evaluación: coordinación general y aprobación final",
          "Auditor técnico: evaluación de capacidades técnicas de explicabilidad",
          "Auditor de gobernanza: verificación de políticas y procesos",
          "Representante de usuarios: validación de comprensibilidad",
          "Gestor de evidencias: recolección y validación documental",
        ],
      },
      {
        title: "Metodología de evaluación",
        points: [
          "Escala de calificación conforme, parcialmente conforme, no conforme y no aplicable",
          "Evidencia documental obligatoria para toda respuesta positiva",
          "Plan de acción para no conformidades",
          "Justificación técnica para elementos no aplicables",
          "Revisión cruzada entre auditores",
        ],
      },
    ],
  },
  sections: [
    {
      id: "gobernanza",
      title: "Sección 1. Gobernanza organizacional",
      description:
        "Evalúa la alineación estratégica de la transparencia y explicabilidad dentro de la organización, así como la asignación clara de responsabilidades.",
      items: [
        {
          code: "1.1",
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
            "Política específica para IA con enfoque en transparencia",
            "Definición clara de información apropiada por stakeholder",
            "Excepciones justificadas (propiedad intelectual, seguridad)",
            "Alineación con objetivos organizacionales",
          ],
        },
        {
          code: "1.2",
          title: "Estructura de responsabilidades",
          question:
            "¿Se han definido y asignado roles específicos para gestionar transparencia y explicabilidad a lo largo del ciclo de vida del sistema?",
          evidences: [
            "Matriz RACI de responsabilidades para transparencia",
            "Descripciones de cargo con funciones específicas",
            "Autoridad asignada para decisiones de transparencia",
            "Canales de escalamiento y comunicación definidos",
          ],
          references: [
            "ISO/IEC 42001:2023 - Sección 5.3",
            "NIST AI RMF GOVERN 2.1",
          ],
        },
      ],
    },
    {
      id: "contexto",
      title: "Sección 2. Análisis contextual y mapeo de requisitos",
      description:
        "Profundiza en el entendimiento del contexto socio-técnico y de las necesidades de transparencia de cada stakeholder.",
      items: [
        {
          code: "2.1",
          title: "Comprensión del contexto operacional",
          question:
            "¿Se ha establecido un análisis completo del contexto operacional incluyendo necesidades diferenciadas de transparencia por stakeholder?",
          evidences: [
            "Análisis detallado del contexto de aplicación",
            "Mapeo de stakeholders con matriz de necesidades informativas",
            "Evaluación de impactos potenciales",
            "Consideraciones culturales y jurisdiccionales",
          ],
          references: [
            "ISO/IEC 23894:2023 - Sección 6.3",
            "NIST AI RMF MAP 1.1",
          ],
          recommendations: [
            "Realizar entrevistas estructuradas con usuarios finales",
            "Documentar niveles de explicación requeridos",
            "Considerar aspectos regulatorios específicos del sector",
            "Evaluar capacidades técnicas de explicabilidad requeridas",
          ],
        },
        {
          code: "2.2",
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
      ],
    },
    {
      id: "capacidades",
      title: "Sección 3. Capacidades técnicas de explicabilidad",
      description:
        "Verifica las capacidades técnicas implementadas para generar explicaciones comprensibles y útiles para los usuarios.",
      items: [
        {
          code: "3.1",
          title: "Implementación de explicabilidad",
          question:
            "¿El sistema implementa capacidades técnicas verificables para generar explicaciones comprensibles de sus decisiones?",
          evidences: [
            "Especificaciones técnicas de métodos explicativos",
            "Ejemplos documentados de explicaciones generadas",
            "Evaluaciones de comprensibilidad con usuarios reales",
            "Benchmarks de rendimiento explicabilidad vs. precisión",
          ],
          references: [
            "NIST AI RMF Sección 3.5",
            "ISO/IEC 23894:2023 - Anexo A.12",
          ],
          criteria: [
            "Implementación de técnicas XAI (SHAP, LIME, GRAD-CAM, etc.)",
            "Capacidad de explicación local y global",
            "Disponibilidad de explicaciones contrafactuales",
            "Incorporación de medidas de confianza",
          ],
        },
        {
          code: "3.2",
          title: "Calidad y adaptabilidad de explicaciones",
          question:
            "¿Las explicaciones se adaptan al contexto del usuario y proporcionan información relevante para la toma de decisiones?",
          evidences: [
            "Framework de personalización por tipo de usuario",
            "Pruebas de usabilidad con métricas específicas",
            "Sistemas de retroalimentación para mejorar calidad",
            "Validación con grupos de usuarios diversos",
          ],
          references: [
            "NIST AI RMF MEASURE 2.9",
            "ISO/IEC 42001:2023 - Sección A.8.2",
          ],
        },
        {
          code: "3.3",
          title: "Transparencia de factores determinantes",
          question:
            "¿Se identifican y comunican claramente los factores más importantes que influyen en las decisiones del sistema?",
          evidences: [
            "Análisis de importancia de características con visualizaciones",
            "Documentación de variables clave por tipo de decisión",
            "Métricas de confianza y rangos de incertidumbre",
            "Umbrales de confianza establecidos y comunicados",
          ],
          references: ["ISO/IEC 23894:2023 - Sección B.3"],
        },
      ],
    },
    {
      id: "documentacion",
      title: "Sección 4. Documentación y comunicación",
      description:
        "Garantiza la existencia de documentación técnica y materiales de comunicación diferenciados para cada audiencia.",
      items: [
        {
          code: "4.1",
          title: "Documentación técnica integral",
          question:
            "¿Existe documentación técnica completa que incluye arquitectura, decisiones de diseño y procesos de desarrollo con enfoque en transparencia?",
          evidences: [
            "Documentación de arquitectura con componentes de explicabilidad",
            "Registro de decisiones de diseño relacionadas",
            "Documentación de datos de entrenamiento y preparación",
            "Procedimientos de verificación y validación",
          ],
          references: [
            "ISO/IEC 42001:2023 - Sección A.6.2.7",
            "NIST AI RMF GOVERN 1.4",
          ],
        },
        {
          code: "4.2",
          title: "Comunicación diferenciada a usuarios",
          question:
            "¿Se proporciona información clara y diferenciada sobre capacidades, limitaciones y uso apropiado del sistema según la audiencia?",
          evidences: [
            "Manuales de usuario por nivel técnico",
            "Guías sobre interpretación de resultados",
            "Advertencias sobre limitaciones y usos inapropiados",
            "Material de capacitación por rol",
          ],
          references: [
            "ISO/IEC 42001:2023 - Sección A.8.2",
            "NIST AI RMF Sección 3.4",
          ],
        },
      ],
    },
    {
      id: "supervision",
      title: "Sección 5. Supervisión humana y control",
      description:
        "Evalúa la capacidad de intervención humana y la preparación del personal para interpretar y actuar sobre las explicaciones.",
      items: [
        {
          code: "5.1",
          title: "Mecanismos de intervención humana",
          question:
            "¿Existen mecanismos efectivos que permiten supervisión humana significativa e intervención en decisiones del sistema?",
          evidences: [
            "Procedimientos documentados de supervisión",
            "Interfaces para intervención y anulación",
            "Criterios de intervención obligatoria",
            "Registro de intervenciones realizadas",
          ],
          references: [
            "NIST AI RMF MAP 3.5",
            "ISO/IEC 42001:2023 - Sección A.3.2",
          ],
        },
        {
          code: "5.2",
          title: "Capacitación para interpretación",
          question:
            "¿Los supervisores y usuarios cuentan con capacitación adecuada para interpretar resultados y tomar decisiones informadas?",
          evidences: [
            "Programa de capacitación en interpretación de resultados",
            "Evaluaciones de competencia de supervisores",
            "Material didáctico sobre limitaciones y sesgos",
            "Métricas de efectividad de supervisión",
          ],
          references: [
            "ISO/IEC 42001:2023 - Sección 7.2",
            "NIST AI RMF Anexo C",
          ],
        },
      ],
    },
    {
      id: "medicion",
      title: "Sección 6. Medición y monitoreo continuo",
      description:
        "Revisa la existencia de métricas e instrumentos para supervisar la transparencia y la explicabilidad en el tiempo.",
      items: [
        {
          code: "6.1",
          title: "Métricas de transparencia",
          question:
            "¿Se han implementado métricas específicas para medir y monitorear la efectividad de la transparencia y explicabilidad del sistema?",
          evidences: [
            "Catálogo de métricas aplicadas",
            "Herramientas automatizadas de medición",
            "Reportes periódicos con análisis de tendencias",
            "Benchmarks internos y externos",
          ],
          references: [
            "NIST AI RMF MEASURE 2.8",
            "ISO/IEC 23894:2023 - Sección 6.4",
          ],
          metrics: [
            "Tiempo promedio de comprensión de explicaciones",
            "Porcentaje de decisiones anuladas por supervisores",
            "Satisfacción de usuarios con la explicabilidad",
            "Cobertura de explicaciones por tipo de decisión",
          ],
        },
        {
          code: "6.2",
          title: "Retroalimentación y mejora continua",
          question:
            "¿Existen mecanismos establecidos para capturar retroalimentación de usuarios sobre transparencia y explicabilidad?",
          evidences: [
            "Canales de retroalimentación implementados",
            "Proceso documentado de integración de feedback",
            "Métricas de mejora en satisfacción",
            "Plan de mejora continua con cronograma",
          ],
          references: [
            "NIST AI RMF MEASURE 3.3",
            "ISO/IEC 42001:2023 - Sección 10.1",
          ],
        },
      ],
    },
    {
      id: "riesgos",
      title: "Sección 7. Gestión de riesgos e incidentes",
      description:
        "Considera la identificación, tratamiento y respuesta ante riesgos o incidentes relacionados con transparencia y explicabilidad.",
      items: [
        {
          code: "7.1",
          title: "Identificación y tratamiento de riesgos",
          question:
            "¿Se han identificado, evaluado y tratado específicamente los riesgos relacionados con falta de transparencia o explicabilidad inadecuada?",
          evidences: [
            "Registro de riesgos específicos de transparencia",
            "Análisis de impacto y probabilidad",
            "Plan de tratamiento con controles",
            "Monitoreo de riesgos residuales",
          ],
          references: [
            "ISO/IEC 23894:2023 - Sección 6.1",
            "NIST AI RMF MANAGE 1.3",
          ],
        },
        {
          code: "7.2",
          title: "Gestión de incidentes de transparencia",
          question:
            "¿Existe un protocolo específico para gestionar incidentes relacionados con falta de transparencia o explicaciones inadecuadas?",
          evidences: [
            "Plan de comunicación de incidentes",
            "Procedimientos de escalamiento y respuesta",
            "Registro histórico de incidentes con análisis de causas",
            "Comunicación a stakeholders afectados",
          ],
          references: [
            "NIST AI RMF MANAGE 4.3",
            "ISO/IEC 42001:2023 - Sección A.8.4",
          ],
        },
      ],
    },
  ] satisfies ChecklistSection[],
  riskMatrix: {
    title: "Matriz de implementación por nivel de riesgo",
    levels: [
      {
        level: "Alto riesgo",
        description: "Sistemas críticos (salud, justicia, finanzas)",
        requirements: [
          "Explicabilidad por diseño desde la planificación",
          "Comité multidisciplinario de transparencia",
          "Explicaciones multinivel (técnico, regulatorio, usuario)",
          "Auditorías trimestrales de transparencia",
          "Documentación exhaustiva de todas las decisiones",
        ],
      },
      {
        level: "Riesgo medio",
        description: "Sistemas semi-críticos (recursos humanos, educación)",
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
        description: "Sistemas no críticos (recomendaciones, optimización)",
        requirements: [
          "Información básica sobre funcionamiento",
          "Limitaciones conocidas documentadas",
          "Canales de comunicación con usuarios",
          "Auditorías anuales",
          "Documentación técnica actualizada",
        ],
      },
    ],
  },
  platform: {
    title: "Consideraciones para implementación en la plataforma",
    features: [
      "Dashboard de cumplimiento con visualización por secciones",
      "Sistema de alertas para elementos críticos sin evidencia",
      "Workflow automatizado de evaluación y aprobación",
      "Repositorio centralizado de evidencias con trazabilidad",
      "Generación automática de reportes de cumplimiento",
      "Integración con sistemas de gestión de riesgos existentes",
    ],
    settings: [
      "Roles diferenciados con permisos específicos por sección",
      "Recordatorios automáticos para reevaluaciones",
      "Trazabilidad completa de cambios y versiones",
      "Notificaciones escaladas para no conformidades críticas",
    ],
    metrics: [
      "Tiempo promedio de completitud de evaluaciones",
      "Porcentaje de cumplimiento por sección y organización",
      "Tendencias de mejora en indicadores de transparencia",
      "Efectividad de planes de remediación",
    ],
  },
  schedule: {
    title: "Cronograma de evaluaciones y retención de evidencias",
    frequency: [
      "Alto riesgo: evaluación trimestral con monitoreo continuo",
      "Riesgo medio: evaluación semestral",
      "Bajo riesgo: evaluación anual",
      "Cambios significativos: reevaluación en máximo 30 días",
    ],
    retention: [
      "Sistemas críticos: retención mínima de evidencias por 7 años",
      "Sistemas no críticos: retención mínima de evidencias por 5 años",
      "Cumplir siempre con requisitos regulatorios sectoriales",
    ],
    updates: [
      "Revisión anual del checklist o tras actualizaciones normativas",
      "Incorporación de lecciones aprendidas semestralmente",
    ],
  },
}

const contentByLanguage = {
  es: baseContent,
  en: baseContent,
}

export default function TransparenciaExplicabilidadPage() {
  const { toast } = useToast()
  const { language } = useLanguage()

  const content = useMemo(() => contentByLanguage[language as "es" | "en"] ?? baseContent, [language])

  const handleDownload = () => {
    const doc = new jsPDF({ unit: "pt" })
    doc.setFontSize(16)
    doc.text(content.title, 40, 60)
    doc.setFontSize(12)
    doc.text(
      "Consulta la plataforma para el detalle completo del checklist y la trazabilidad de evidencias.",
      40,
      90,
      { maxWidth: 520 },
    )
    doc.save("checklist-transparencia-explicabilidad.pdf")
    toast({
      title: "Checklist generado",
      description: "Se descargó una portada para documentar la evaluación en curso.",
    })
  }

  return (
    <div className="min-h-screen bg-muted/10 py-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
        <Card className="border-primary/20 bg-white/80 backdrop-blur">
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-primary">
                {content.title}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                {content.subtitle}
              </CardDescription>
            </div>
            <Button onClick={handleDownload} className="gap-2" variant="default">
              <Download className="h-4 w-4" /> Descargar checklist
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-[2fr_3fr]">
            <div className="space-y-3 rounded-lg bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-primary">
                <Target className="h-5 w-5" />
                <span className="font-medium uppercase tracking-wide">Objetivos</span>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                {content.objectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-3 rounded-lg bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-primary">
                <Info className="h-5 w-5" />
                <span className="font-medium uppercase tracking-wide">Escala de calificación</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {ratingScale.map((option) => (
                  <div
                    key={option.label}
                    className="flex items-center gap-2 rounded-lg border border-primary/20 bg-white px-3 py-2 shadow-sm"
                  >
                    <Badge className="bg-primary text-white">{option.label}</Badge>
                    <span className="text-sm text-muted-foreground">{option.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">{content.usage.title}</CardTitle>
            <CardDescription>
              Gestiona la evaluación siguiendo las fases recomendadas para garantizar cobertura integral y trazabilidad.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-3">
            {content.usage.steps.map((step) => (
              <div key={step.title} className="rounded-lg border border-primary/10 p-4 shadow-sm">
                <h3 className="text-lg font-medium text-primary">{step.title}</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {step.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {content.sections.map((section) => (
          <Card key={section.id} className="border-primary/10 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">{section.title}</CardTitle>
              {section.description && <CardDescription>{section.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-6">
              {section.items.map((item) => (
                <div key={item.code} className="rounded-lg border border-primary/10 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {item.code}. {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.question}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {ratingScale.map((option) => (
                        <Badge key={option.label} variant="outline" className="border-primary/40 text-primary">
                          {option.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">Evidencias obligatorias</h4>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {item.evidences.map((evidence) => (
                          <li key={evidence}>{evidence}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">Referencias normativas</h4>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {item.references.map((reference) => (
                          <li key={reference}>{reference}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {item.criteria && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">Criterios de evaluación</h4>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {item.criteria.map((criterion) => (
                          <li key={criterion}>{criterion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.recommendations && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">Recomendaciones técnicas</h4>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {item.recommendations.map((recommendation) => (
                          <li key={recommendation}>{recommendation}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.metrics && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">Métricas sugeridas</h4>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {item.metrics.map((metric) => (
                          <li key={metric}>{metric}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <Card className="border-primary/10 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">{content.riskMatrix.title}</CardTitle>
            <CardDescription>
              Adecua la exigencia del checklist según el nivel de criticidad y riesgo del sistema evaluado.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            {content.riskMatrix.levels.map((level) => (
              <div key={level.level} className="rounded-lg border border-primary/10 p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-primary">{level.level}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{level.description}</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {level.requirements.map((requirement) => (
                    <li key={requirement}>{requirement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">{content.platform.title}</CardTitle>
            <CardDescription>
              Configura la plataforma para habilitar trazabilidad, colaboración y mejora continua en transparencia y explicabilidad.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-lg border border-primary/10 p-4 shadow-sm">
              <h3 className="text-lg font-medium text-primary">Funcionalidades técnicas requeridas</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {content.platform.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-primary/10 p-4 shadow-sm">
              <h3 className="text-lg font-medium text-primary">Configuraciones administrativas</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {content.platform.settings.map((setting) => (
                  <li key={setting}>{setting}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-primary/10 p-4 shadow-sm">
              <h3 className="text-lg font-medium text-primary">Métricas de plataforma</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {content.platform.metrics.map((metric) => (
                  <li key={metric}>{metric}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">{content.schedule.title}</CardTitle>
            <CardDescription>
              Mantén vigente la gobernanza de transparencia mediante ciclos de evaluación y actualización periódicos.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-lg border border-primary/10 p-4 shadow-sm">
              <h3 className="text-lg font-medium text-primary">Frecuencia de evaluación</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {content.schedule.frequency.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-primary/10 p-4 shadow-sm">
              <h3 className="text-lg font-medium text-primary">Retención de evidencias</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {content.schedule.retention.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-primary/10 p-4 shadow-sm">
              <h3 className="text-lg font-medium text-primary">Actualización del checklist</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {content.schedule.updates.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
