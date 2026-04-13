"use client"

import type { AISystemData } from "@/lib/ai-registry"

export type AIRiskCategory = "SEG" | "PRV" | "ETI" | "OPE" | "REG" | "REP" | "PI"
export type AIRiskSeverity = "Crítico" | "Alto" | "Medio" | "Bajo"
export type AIRiskStatus =
  | "Identificado"
  | "En evaluación"
  | "Mitigación en proceso"
  | "Mitigado"
  | "Aceptado"
  | "Cerrado"
export type AIRiskTreatmentStrategy = "Mitigar" | "Transferir" | "Aceptar" | "Evitar"
export type AIRiskTolerance = "Inaceptable" | "Tolerable con controles" | "Aceptable"
export type AIRiskSource = "Técnica" | "Datos" | "Operativa" | "Legal" | "Externa" | "Combinada"
export type AIRiskLifecyclePhase = "Diseño" | "Desarrollo" | "Validación" | "Despliegue" | "Operación" | "Retiro"
export type AIRiskImpactDimension =
  | "Personas"
  | "Organización"
  | "Legal"
  | "Reputacional"
  | "Financiero"
  | "Operativo"
export type AIRiskControlType = "Preventivo" | "Detectivo" | "Correctivo"
export type AIRiskControlEffectiveness = "Alta" | "Media" | "Baja" | "No evaluada"
export type AIRiskMitigationStatus = "Pendiente" | "En proceso" | "Completada"
export type AIRiskAlertType =
  | "critical_without_plan"
  | "plan_due_soon"
  | "review_overdue"
  | "system_updated"
  | "linked_incident"
  | "new_critical"

export interface AIRiskMitigationAction {
  id: string
  description: string
  owner: string
  dueDate: string
  status: AIRiskMitigationStatus
}

export interface AIRiskHistoryEntry {
  id: string
  timestamp: string
  user: string
  action: string
  field: string
  previousValue?: string
  nextValue?: string
}

export interface AIRiskAttachment {
  id: string
  name: string
  mimeType: string
  size: number
  dataUrl: string
}

export interface AIRiskControl {
  controlId: string
  category: AIRiskCategory
  title: string
  description: string
  type: AIRiskControlType
  evidenceRequired: string
  seeded: boolean
}

export interface AIRiskCategoryDefinition {
  id: AIRiskCategory
  title: string
  description: string
  examples: string[]
}

export interface AIRiskOperationalPhase {
  id: string
  title: string
  reference: string
  summary: string
  actions: string[]
}

export interface AIRiskRoleDefinition {
  title: string
  responsibilities: string[]
  permissions: string[]
}

export interface AIRiskIntegrationDefinition {
  title: string
  relationship: string
  receives: string[]
  sends: string[]
  trigger: string
}

export interface AIRiskAlignmentRow {
  functionality: string
  nist: string
  iso: string
  section: string
}

export interface AIRiskRecord {
  id: string
  riskId: string
  systemId: string
  systemName: string
  category: AIRiskCategory
  subcategory: string
  riskName: string
  description: string
  lifecyclePhase: AIRiskLifecyclePhase
  riskSource: AIRiskSource
  identifiedAt: string
  identifiedBy: string
  inherentProbability: number
  inherentImpact: number
  inherentScore: number
  inherentSeverity: AIRiskSeverity
  impactDimensions: AIRiskImpactDimension[]
  riskTolerance: AIRiskTolerance
  evaluationJustification: string
  evaluatedBy: string
  evaluationDate: string
  existingControlsDescription: string
  existingControlEffectiveness: AIRiskControlEffectiveness
  residualProbability: number
  residualImpact: number
  residualScore: number
  residualSeverity: AIRiskSeverity
  treatmentStrategy: AIRiskTreatmentStrategy
  mitigationActions: AIRiskMitigationAction[]
  selectedControlIds: string[]
  customControls: string[]
  riskOwner: string
  planDueDate: string
  status: AIRiskStatus
  linkedIncidentIds: string[]
  linkedAuditFindings: string[]
  linkedRequirement: string
  history: AIRiskHistoryEntry[]
  attachments: AIRiskAttachment[]
  comments: string
  nextReviewDate: string
  approvedBy: string
  createdAt: string
  updatedAt: string
}

export interface AIRiskAlert {
  id: string
  type: AIRiskAlertType
  severity: AIRiskSeverity
  title: string
  description: string
  riskId?: string
  systemId?: string
}

export interface AIRiskSystemSnapshot {
  id: string
  systemId: string
  systemName: string
  monthKey: string
  recordedAt: string
  globalSeverity: AIRiskSeverity | "Sin riesgos"
  activeRiskCount: number
  byCategory: Record<AIRiskCategory, number>
  controlsImplemented: number
  controlsInProgress: number
  controlsPending: number
}

export interface AIRiskStoredIncidentReport {
  id: string
  createdAt: string
  updatedAt: string
  report: {
    system?: {
      nombreSistema?: string
    }
    metadata?: {
      folioNumber?: string
      estadoReporte?: string
    }
  }
}

export interface AIRiskSystemOption {
  id: string
  name: string
  code: string
  lastUpdated: string
  owner: string
}

export const AI_RISK_RECORDS_STORAGE_KEY = "aiRiskRecords"
export const AI_RISK_CONTROL_CATALOG_STORAGE_KEY = "aiRiskControlCatalog"
export const AI_RISK_SYSTEM_SNAPSHOTS_STORAGE_KEY = "aiRiskSystemSnapshots"
export const AI_RISK_SELECTED_SYSTEM_STORAGE_KEY = "aiRiskSelectedSystemId"
export const AI_RISK_STORAGE_UPDATED_EVENT = "ai-risk-storage-updated"

const CATEGORY_ORDER: AIRiskCategory[] = ["SEG", "PRV", "ETI", "OPE", "REG", "REP", "PI"]
const ACTIVE_STATUSES: AIRiskStatus[] = ["Identificado", "En evaluación", "Mitigación en proceso", "Aceptado"]
const SEEDED_CONTROL_IDS = new Set<string>()

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function toIsoDate(date = new Date()) {
  return date.toISOString().split("T")[0]
}

function clampProbabilityImpact(value: number) {
  if (!Number.isFinite(value)) return 1
  return Math.max(1, Math.min(5, Math.round(value)))
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    const parsed = JSON.parse(value) as unknown
    return parsed as T
  } catch {
    return fallback
  }
}

function serializeValue(value: unknown) {
  if (value === undefined || value === null) return ""
  if (Array.isArray(value)) return value.join(", ")
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

function addDays(baseDate: string, days: number) {
  const date = baseDate ? new Date(`${baseDate}T00:00:00`) : new Date()
  date.setDate(date.getDate() + days)
  return toIsoDate(date)
}

function getMonthKey(dateString: string) {
  const date = dateString ? new Date(dateString) : new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

export const AI_RISK_CATEGORY_DEFINITIONS: AIRiskCategoryDefinition[] = [
  {
    id: "SEG",
    title: "Seguridad del sistema",
    description: "Vulnerabilidades técnicas del modelo, infraestructura o pipeline que pueden ser explotadas.",
    examples: [
      "Ataques adversariales",
      "Envenenamiento de datos",
      "Acceso no autorizado a APIs",
      "Prompt injection",
    ],
  },
  {
    id: "PRV",
    title: "Privacidad y datos personales",
    description: "Riesgos que afectan derechos de titulares de datos y el tratamiento legítimo de información personal.",
    examples: [
      "Memorización de datos personales",
      "Uso de datos sin base legal",
      "Falta de mecanismos ARCO",
      "Reidentificación",
    ],
  },
  {
    id: "ETI",
    title: "Ético y discriminación",
    description: "Resultados injustos, sesgados o contrarios a derechos fundamentales.",
    examples: [
      "Sesgo por género o edad",
      "Falta de explicabilidad",
      "Supervisión humana insuficiente",
      "Vigilancia desproporcionada",
    ],
  },
  {
    id: "OPE",
    title: "Operativo",
    description: "Fallos de funcionamiento que afectan continuidad, calidad del servicio o desempeño esperado.",
    examples: [
      "Model drift",
      "Dependencia de terceros",
      "Fallos de integración",
      "Ausencia de monitoreo activo",
    ],
  },
  {
    id: "REG",
    title: "Regulatorio y legal",
    description: "Incumplimiento de marcos normativos aplicables al sistema de IA y a sus datos.",
    examples: [
      "EU AI Act",
      "LFPDPPP",
      "Falta de evaluación de impacto",
      "Incumplimiento de notificación",
    ],
  },
  {
    id: "REP",
    title: "Reputacional",
    description: "Daños a la confianza, imagen o relación con clientes, socios o sociedad.",
    examples: [
      "Cobertura mediática negativa",
      "Reclamaciones públicas",
      "Pérdida de confianza de clientes",
      "Outputs ofensivos",
    ],
  },
  {
    id: "PI",
    title: "Propiedad intelectual",
    description: "Riesgos relacionados con copyright, patentes o secretos industriales en el ciclo de vida del sistema.",
    examples: [
      "Datasets sin licencia",
      "Outputs protegidos",
      "Uso de tecnología patentada",
      "Falta de protección de invenciones",
    ],
  },
]

export const AI_RISK_OPERATIONAL_PHASES: AIRiskOperationalPhase[] = [
  {
    id: "F1",
    title: "Identificación del sistema de IA",
    reference: "GOVERN + MAP · ISO 42001 §6.1",
    summary: "Vincula el sistema del inventario a una evaluación y define responsable, alcance y nivel inicial.",
    actions: [
      "Seleccionar el sistema desde el Inventario",
      "Confirmar propósito, alcance y fase de ciclo de vida",
      "Designar Risk Owner",
      "Iniciar el Risk Register",
    ],
  },
  {
    id: "F2",
    title: "Identificación de riesgos",
    reference: "MAP · ISO 42001 §6.2",
    summary: "Registra riesgos usando la taxonomía del módulo, documentación previa y contexto de despliegue.",
    actions: [
      "Recorrer categorías SEG/PRV/ETI/OPE/REG/REP/PI",
      "Revisar riesgos predefinidos",
      "Documentar la fuente del riesgo",
      "Registrar riesgos nuevos del contexto operativo",
    ],
  },
  {
    id: "F3",
    title: "Evaluación del riesgo",
    reference: "MEASURE · ISO 42001 §6.3",
    summary: "Asigna probabilidad e impacto para calcular la severidad inherente y documentar supuestos.",
    actions: [
      "Asignar probabilidad 1-5",
      "Asignar impacto 1-5",
      "Calcular severidad automáticamente",
      "Documentar contexto y justificación",
    ],
  },
  {
    id: "F4",
    title: "Priorización",
    reference: "MEASURE + MANAGE · ISO 42001 §6.4",
    summary: "Ordena riesgos por severidad y define la estrategia de tratamiento aplicable.",
    actions: [
      "Ordenar riesgos por severidad",
      "Definir Mitigar / Transferir / Aceptar / Evitar",
      "Escalar los riesgos críticos",
      "Documentar tolerancia y aceptación residual",
    ],
  },
  {
    id: "F5",
    title: "Mitigación y controles",
    reference: "MANAGE · ISO 42001 §6.5",
    summary: "Asocia controles, responsables y plazos, y estima el nivel de riesgo residual.",
    actions: [
      "Seleccionar controles del catálogo",
      "Registrar acciones y responsables",
      "Distinguir controles existentes vs. nuevos",
      "Actualizar severidad residual y evidencias",
    ],
  },
  {
    id: "F6",
    title: "Monitoreo continuo",
    reference: "MANAGE + GOVERN · ISO 42001 §9.1",
    summary: "Mantiene alertas, revisiones y reevaluaciones durante todo el ciclo de vida del sistema.",
    actions: [
      "Establecer frecuencia de revisión",
      "Vincular incidentes y cambios regulatorios",
      "Reevaluar ante cambios del sistema",
      "Generar reportes para auditoría y dirección",
    ],
  },
]

export const AI_RISK_ROLES: AIRiskRoleDefinition[] = [
  {
    title: "AI Governance Officer",
    responsibilities: [
      "Aprueba la política de gestión de riesgos de IA",
      "Decide sobre suspensión ante riesgos críticos",
      "Aprueba aceptación residual fuera de tolerancia",
      "Presenta reportes al comité o alta dirección",
    ],
    permissions: ["Lectura/escritura total", "Aprobación de cierres", "Configuración de umbrales", "Reportes ejecutivos"],
  },
  {
    title: "Risk Manager (AI)",
    responsibilities: [
      "Coordina evaluaciones por sistema",
      "Asigna y supervisa Risk Owners",
      "Revisa coherencia de evaluaciones y planes",
      "Gestiona calendario de revisiones",
    ],
    permissions: ["Lectura/escritura en todos los registros", "Asignación de Risk Owners", "Exportación de reportes"],
  },
  {
    title: "Equipo Técnico de IA",
    responsibilities: [
      "Identifica riesgos técnicos",
      "Ejecuta pruebas de robustez y sesgo",
      "Implementa controles técnicos asignados",
      "Carga evidencias técnicas",
    ],
    permissions: ["Escritura en riesgos asignados", "Carga de evidencias", "Actualización de controles técnicos"],
  },
  {
    title: "Legal / Compliance",
    responsibilities: [
      "Gestiona riesgos REG y PI",
      "Valida requisitos normativos por sistema",
      "Aprueba estrategias regulatorias",
      "Actualiza el módulo ante cambios regulatorios",
    ],
    permissions: ["Escritura en REG y PI", "Vinculación con cumplimiento", "Aprobación regulatoria"],
  },
  {
    title: "Responsable de Protección de Datos",
    responsibilities: [
      "Gestiona riesgos PRV",
      "Aprueba EIPD/DPIA",
      "Supervisa controles de privacidad",
      "Verifica cumplimiento LFPDPPP/RGPD",
    ],
    permissions: ["Escritura en PRV", "Vinculación con ROPA/RETAD", "Aprobación de EIPD"],
  },
  {
    title: "Risk Owner",
    responsibilities: [
      "Implementa el plan de mitigación asignado",
      "Actualiza estado y evidencias",
      "Recibe alertas automáticas",
      "Solicita cierre del riesgo",
    ],
    permissions: ["Escritura en riesgos asignados", "Carga de evidencias", "Solicitud de cierre"],
  },
]

export const AI_RISK_INTEGRATIONS: AIRiskIntegrationDefinition[] = [
  {
    title: "Inventario de Sistemas de IA",
    relationship: "Bidireccional visual",
    receives: [
      "ID del sistema",
      "Propósito",
      "Tipo de modelo",
      "Fase del ciclo de vida",
      "Responsable y nivel base",
    ],
    sends: [
      "Nivel global del sistema",
      "Fecha de última evaluación",
      "Número de riesgos críticos activos",
    ],
    trigger: "Nuevo sistema en inventario -> evaluación pendiente visible en el dashboard.",
  },
  {
    title: "Auditoría de IA",
    relationship: "Vinculación manual + indicadores",
    receives: ["Hallazgos que generan riesgo", "Priorización de áreas auditables"],
    sends: ["Riesgos de mayor severidad", "Controles a verificar"],
    trigger: "Hallazgos se registran como referencia manual en el riesgo.",
  },
  {
    title: "Gestión de Incidentes",
    relationship: "Lectura y trazabilidad",
    receives: ["Incidentes vinculables al sistema", "Cambio de severidad ante eventos"],
    sends: ["Contexto del sistema y riesgos activos"],
    trigger: "Incidente Alto/Crítico en un sistema con riesgos activos -> alerta in-app.",
  },
  {
    title: "Cumplimiento Normativo",
    relationship: "Vinculación manual",
    receives: ["Requisitos aplicables", "Cambios regulatorios"],
    sends: ["Controles y evidencia para cumplimiento"],
    trigger: "Cambio regulatorio relevante -> revisión de riesgos REG.",
  },
  {
    title: "Monitoreo continuo",
    relationship: "Referencia operativa",
    receives: ["Eventos de drift, anomalías y cambios de distribución"],
    sends: ["Umbrales definidos en el registro"],
    trigger: "Cambio operacional significativo -> reevaluación del sistema.",
  },
]

export const AI_RISK_ALIGNMENT_ROWS: AIRiskAlignmentRow[] = [
  {
    functionality: "Política de riesgos de IA",
    nist: "GOVERN 1.2, 1.4",
    iso: "§5.2, §6.1.1",
    section: "F1",
  },
  {
    functionality: "Roles y responsabilidades",
    nist: "GOVERN 2.1, 2.2",
    iso: "§5.3, §7.2",
    section: "Sección 7",
  },
  {
    functionality: "Identificación de contexto y riesgos",
    nist: "MAP 1.1, 5.1",
    iso: "§6.1.2, §6.2",
    section: "F2",
  },
  {
    functionality: "Taxonomía de riesgos",
    nist: "MAP 2.1, 5.1",
    iso: "§6.1.2",
    section: "Sección 2",
  },
  {
    functionality: "Evaluación probabilidad x impacto",
    nist: "MEASURE 1.1, 2.3",
    iso: "§6.3",
    section: "Sección 4",
  },
  {
    functionality: "Priorización de riesgos",
    nist: "MEASURE 1.2 / MANAGE 1.2",
    iso: "§6.3, §6.4",
    section: "F4",
  },
  {
    functionality: "Risk Register",
    nist: "MANAGE 1.3, 1.4",
    iso: "§6.5",
    section: "Sección 5",
  },
  {
    functionality: "Catálogo de controles",
    nist: "MANAGE 2.2, 2.4",
    iso: "§8.4",
    section: "Sección 6",
  },
  {
    functionality: "Monitoreo continuo",
    nist: "MANAGE 4.1, 4.2",
    iso: "§9.1, §10.1",
    section: "F6 y Dashboard",
  },
]

export const AI_RISK_CONTROL_CATALOG_SEEDED: AIRiskControl[] = [
  {
    controlId: "CTL-SEG-01",
    category: "SEG",
    title: "Pruebas de adversarial robustness",
    description: "Evalúa resistencia del sistema frente a inputs o comportamientos adversariales.",
    type: "Preventivo",
    evidenceRequired: "Reporte de pruebas adversariales con métricas de robustez.",
    seeded: true,
  },
  {
    controlId: "CTL-SEG-02",
    category: "SEG",
    title: "Monitoreo de integridad del pipeline de datos",
    description: "Detecta modificaciones no autorizadas en fuentes o pipelines de entrenamiento.",
    type: "Preventivo",
    evidenceRequired: "Logs de integridad y alertas ante cambios no autorizados.",
    seeded: true,
  },
  {
    controlId: "CTL-SEG-03",
    category: "SEG",
    title: "Control de acceso a la API del modelo",
    description: "Aplica autenticación, autorización y rate limiting sobre interfaces expuestas.",
    type: "Preventivo",
    evidenceRequired: "Política de acceso documentada y logs de acceso.",
    seeded: true,
  },
  {
    controlId: "CTL-SEG-04",
    category: "SEG",
    title: "Análisis de vulnerabilidades del entorno de ejecución",
    description: "Verifica postura de seguridad del entorno productivo y sus dependencias.",
    type: "Detectivo",
    evidenceRequired: "Reporte de vulnerability scan del entorno de producción.",
    seeded: true,
  },
  {
    controlId: "CTL-SEG-05",
    category: "SEG",
    title: "Filtrado de prompts maliciosos",
    description: "Reduce riesgo de inyección y manipulación en modelos generativos.",
    type: "Preventivo",
    evidenceRequired: "Especificación del filtro y pruebas de red-teaming.",
    seeded: true,
  },
  {
    controlId: "CTL-PRV-01",
    category: "PRV",
    title: "EIPD / DPIA",
    description: "Evalúa impacto de privacidad y define medidas para el sistema de IA.",
    type: "Preventivo",
    evidenceRequired: "Documento EIPD aprobado por el responsable de protección de datos.",
    seeded: true,
  },
  {
    controlId: "CTL-PRV-02",
    category: "PRV",
    title: "Pruebas de memorización y leakage",
    description: "Evalúa riesgo de reproducción de datos personales desde el modelo.",
    type: "Detectivo",
    evidenceRequired: "Reporte técnico de pruebas de memorización con resultados.",
    seeded: true,
  },
  {
    controlId: "CTL-PRV-03",
    category: "PRV",
    title: "Anonimización y pseudonimización",
    description: "Limita la exposición de datos personales en entrenamiento y pruebas.",
    type: "Preventivo",
    evidenceRequired: "Certificación del proceso y análisis de reidentificación.",
    seeded: true,
  },
  {
    controlId: "CTL-PRV-04",
    category: "PRV",
    title: "Mecanismo ARCO",
    description: "Habilita atención efectiva de derechos en sistemas con IA.",
    type: "Correctivo",
    evidenceRequired: "Procedimiento documentado, canal habilitado y evidencia de atención.",
    seeded: true,
  },
  {
    controlId: "CTL-PRV-05",
    category: "PRV",
    title: "Differential privacy",
    description: "Aplica garantías técnicas de privacidad en el proceso de entrenamiento.",
    type: "Preventivo",
    evidenceRequired: "Especificación técnica del parámetro epsilon y reporte de implementación.",
    seeded: true,
  },
  {
    controlId: "CTL-ETI-01",
    category: "ETI",
    title: "Auditoría de sesgos algorítmicos",
    description: "Mide sesgos y diferencias de desempeño por subpoblación.",
    type: "Detectivo",
    evidenceRequired: "Reporte de evaluación con métricas por grupo demográfico.",
    seeded: true,
  },
  {
    controlId: "CTL-ETI-02",
    category: "ETI",
    title: "Supervisión humana",
    description: "Introduce revisión humana en decisiones de alto impacto.",
    type: "Correctivo",
    evidenceRequired: "Procedimiento de revisión humana y umbral de activación documentado.",
    seeded: true,
  },
  {
    controlId: "CTL-ETI-03",
    category: "ETI",
    title: "Documentación de explicabilidad",
    description: "Registra técnicas XAI y criterios de interpretación del modelo.",
    type: "Preventivo",
    evidenceRequired: "Model card y documentación de SHAP/LIME u otras técnicas.",
    seeded: true,
  },
  {
    controlId: "CTL-ETI-04",
    category: "ETI",
    title: "Evaluación de impacto en grupos vulnerables",
    description: "Analiza impactos diferenciales sobre personas o colectivos sensibles.",
    type: "Preventivo",
    evidenceRequired: "Análisis documentado de impacto diferencial por grupo afectado.",
    seeded: true,
  },
  {
    controlId: "CTL-ETI-05",
    category: "ETI",
    title: "Diversidad del equipo de diseño y validación",
    description: "Mejora la revisión del sistema incorporando perspectivas diversas.",
    type: "Preventivo",
    evidenceRequired: "Composición del equipo documentada y criterios aplicados.",
    seeded: true,
  },
  {
    controlId: "CTL-OPE-01",
    category: "OPE",
    title: "Monitoreo continuo del rendimiento",
    description: "Supervisa métricas operativas y degradación del modelo en producción.",
    type: "Detectivo",
    evidenceRequired: "Dashboard de métricas y alertas configuradas.",
    seeded: true,
  },
  {
    controlId: "CTL-OPE-02",
    category: "OPE",
    title: "Plan de contingencia y rollback",
    description: "Define restauración segura ante degradación o fallo del modelo.",
    type: "Correctivo",
    evidenceRequired: "Procedimiento de rollback documentado y probado.",
    seeded: true,
  },
  {
    controlId: "CTL-OPE-03",
    category: "OPE",
    title: "Evaluación periódica de model drift",
    description: "Mide pérdida de desempeño por cambio de datos o contexto.",
    type: "Detectivo",
    evidenceRequired: "Reporte mensual de drift y criterios de reentrenamiento.",
    seeded: true,
  },
  {
    controlId: "CTL-OPE-04",
    category: "OPE",
    title: "Gestión de dependencias de terceros",
    description: "Controla continuidad, SLAs y dependencias de proveedores de IA.",
    type: "Preventivo",
    evidenceRequired: "Inventario de dependencias y contratos con SLAs.",
    seeded: true,
  },
  {
    controlId: "CTL-OPE-05",
    category: "OPE",
    title: "Procedimiento de gestión de incidentes de IA",
    description: "Conecta riesgos, respuesta operativa y seguimiento de incidentes.",
    type: "Correctivo",
    evidenceRequired: "Procedimiento documentado y evidencia de simulacro.",
    seeded: true,
  },
  {
    controlId: "CTL-REG-01",
    category: "REG",
    title: "Mapeo de requisitos normativos",
    description: "Identifica obligaciones aplicables al sistema y su operación.",
    type: "Preventivo",
    evidenceRequired: "Matriz de cumplimiento vinculada al sistema en la plataforma.",
    seeded: true,
  },
  {
    controlId: "CTL-REG-02",
    category: "REG",
    title: "Evaluación de conformidad EU AI Act",
    description: "Analiza clasificación y requerimientos para sistemas de alto riesgo.",
    type: "Preventivo",
    evidenceRequired: "Análisis de clasificación de riesgo y evidencia de conformidad.",
    seeded: true,
  },
  {
    controlId: "CTL-REG-03",
    category: "REG",
    title: "Registro de actividades de tratamiento",
    description: "Vincula el sistema con el registro corporativo de tratamiento de datos.",
    type: "Preventivo",
    evidenceRequired: "Entrada en ROPA/RETAD con referencia al sistema.",
    seeded: true,
  },
  {
    controlId: "CTL-REG-04",
    category: "REG",
    title: "Revisión legal periódica",
    description: "Actualiza el estado regulatorio del sistema ante cambios de marco normativo.",
    type: "Detectivo",
    evidenceRequired: "Informe de revisión legal semestral y acciones derivadas.",
    seeded: true,
  },
]

AI_RISK_CONTROL_CATALOG_SEEDED.forEach((control) => SEEDED_CONTROL_IDS.add(control.controlId))

export function getAIRiskSeverity(score: number): AIRiskSeverity {
  if (score >= 20) return "Crítico"
  if (score >= 10) return "Alto"
  if (score >= 5) return "Medio"
  return "Bajo"
}

export function getAIRiskSeverityBadgeTone(severity: AIRiskSeverity) {
  if (severity === "Crítico") return "critical" as const
  if (severity === "Alto") return "warning" as const
  if (severity === "Medio") return "primary" as const
  return "positive" as const
}

export function getNextReviewDateForSeverity(severity: AIRiskSeverity, baseDate = toIsoDate()) {
  if (severity === "Crítico") return addDays(baseDate, 1)
  if (severity === "Alto") return addDays(baseDate, 7)
  if (severity === "Medio") return addDays(baseDate, 30)
  return addDays(baseDate, 90)
}

export function isAIRiskActive(status: AIRiskStatus) {
  return ACTIVE_STATUSES.includes(status)
}

export function getSystemDisplayName(system: Partial<AISystemData> | AIRiskSystemOption | undefined) {
  if (!system) return "Sin sistema"
  const registryName = "systemName" in system ? system.systemName?.trim() : ""
  const optionName = "name" in system ? system.name?.trim() : ""
  return registryName || optionName || system.id || "Sistema sin nombre"
}

export function deriveSystemCode(systemName: string, systemId = "") {
  const fromId = systemId.toUpperCase().replace(/[^A-Z0-9]/g, "")
  if (fromId.length >= 3) return fromId.slice(0, 8)

  const words = systemName
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)

  if (words.length === 0) return "GEN"
  if (words.length === 1) return words[0].slice(0, 8)
  return words
    .map((word) => word[0])
    .join("")
    .slice(0, 8)
}

export function buildRiskId(systemName: string, existingRecords: AIRiskRecord[], systemId = "", baseDate = toIsoDate()) {
  const year = baseDate.slice(0, 4)
  const code = deriveSystemCode(systemName, systemId)
  const count = existingRecords.filter((record) => record.riskId.startsWith(`RISK-${code}-${year}-`)).length + 1
  return `RISK-${code}-${year}-${String(count).padStart(4, "0")}`
}

export function createAIRiskHistoryEntry(params: {
  user: string
  action: string
  field: string
  previousValue?: unknown
  nextValue?: unknown
  timestamp?: string
}): AIRiskHistoryEntry {
  return {
    id: createId("history"),
    timestamp: params.timestamp || new Date().toISOString(),
    user: params.user || "Sistema",
    action: params.action,
    field: params.field,
    previousValue: serializeValue(params.previousValue),
    nextValue: serializeValue(params.nextValue),
  }
}

export function createEmptyAIRiskRecord(defaults?: Partial<Pick<AIRiskRecord, "systemId" | "systemName" | "identifiedBy" | "evaluatedBy">>): AIRiskRecord {
  const now = new Date().toISOString()
  const baseDate = toIsoDate()
  return {
    id: createId("risk"),
    riskId: "",
    systemId: defaults?.systemId || "",
    systemName: defaults?.systemName || "",
    category: "SEG",
    subcategory: "",
    riskName: "",
    description: "",
    lifecyclePhase: "Diseño",
    riskSource: "Técnica",
    identifiedAt: baseDate,
    identifiedBy: defaults?.identifiedBy || "",
    inherentProbability: 3,
    inherentImpact: 3,
    inherentScore: 9,
    inherentSeverity: "Medio",
    impactDimensions: ["Personas"],
    riskTolerance: "Tolerable con controles",
    evaluationJustification: "",
    evaluatedBy: defaults?.evaluatedBy || "",
    evaluationDate: baseDate,
    existingControlsDescription: "",
    existingControlEffectiveness: "No evaluada",
    residualProbability: 3,
    residualImpact: 3,
    residualScore: 9,
    residualSeverity: "Medio",
    treatmentStrategy: "Mitigar",
    mitigationActions: [],
    selectedControlIds: [],
    customControls: [],
    riskOwner: "",
    planDueDate: addDays(baseDate, 30),
    status: "Identificado",
    linkedIncidentIds: [],
    linkedAuditFindings: [],
    linkedRequirement: "",
    history: [],
    attachments: [],
    comments: "",
    nextReviewDate: getNextReviewDateForSeverity("Medio", baseDate),
    approvedBy: "",
    createdAt: now,
    updatedAt: now,
  }
}

export function normalizeAIRiskRecord(record: AIRiskRecord): AIRiskRecord {
  const inherentProbability = clampProbabilityImpact(record.inherentProbability)
  const inherentImpact = clampProbabilityImpact(record.inherentImpact)
  const residualProbability = clampProbabilityImpact(record.residualProbability)
  const residualImpact = clampProbabilityImpact(record.residualImpact)
  const inherentScore = inherentProbability * inherentImpact
  const residualScore = residualProbability * residualImpact
  const residualSeverity = getAIRiskSeverity(residualScore)
  const nextReviewDate = record.nextReviewDate || getNextReviewDateForSeverity(residualSeverity, record.evaluationDate || toIsoDate())

  return {
    ...record,
    category: record.category || "SEG",
    status: record.status || "Identificado",
    treatmentStrategy: record.treatmentStrategy || "Mitigar",
    inherentProbability,
    inherentImpact,
    inherentScore,
    inherentSeverity: getAIRiskSeverity(inherentScore),
    residualProbability,
    residualImpact,
    residualScore,
    residualSeverity,
    nextReviewDate,
    mitigationActions: Array.isArray(record.mitigationActions) ? record.mitigationActions : [],
    selectedControlIds: Array.isArray(record.selectedControlIds) ? record.selectedControlIds : [],
    customControls: Array.isArray(record.customControls) ? record.customControls : [],
    linkedIncidentIds: Array.isArray(record.linkedIncidentIds) ? record.linkedIncidentIds : [],
    linkedAuditFindings: Array.isArray(record.linkedAuditFindings) ? record.linkedAuditFindings : [],
    impactDimensions: Array.isArray(record.impactDimensions) ? record.impactDimensions : ["Personas"],
    history: Array.isArray(record.history) ? record.history : [],
    attachments: Array.isArray(record.attachments) ? record.attachments : [],
    createdAt: record.createdAt || new Date().toISOString(),
    updatedAt: record.updatedAt || new Date().toISOString(),
  }
}

export function createSystemOptions(systems: AISystemData[]) {
  return systems.map((system) => ({
    id: system.id,
    name: getSystemDisplayName(system),
    code: deriveSystemCode(getSystemDisplayName(system), system.id),
    lastUpdated: system.lastUpdateDate || system.createdAt || "",
    owner: system.internalOwner || system.reviewResponsible || system.lastUpdateResponsible || "",
  }))
}

export function readAIRiskRecords(storage: Storage) {
  const stored = safeJsonParse<AIRiskRecord[]>(storage.getItem(AI_RISK_RECORDS_STORAGE_KEY), [])
  return stored.map(normalizeAIRiskRecord)
}

export function readAIRiskControlCatalog(storage: Storage) {
  const stored = safeJsonParse<AIRiskControl[]>(storage.getItem(AI_RISK_CONTROL_CATALOG_STORAGE_KEY), [])
  const merged = [...AI_RISK_CONTROL_CATALOG_SEEDED]
  stored.forEach((control) => {
    if (!SEEDED_CONTROL_IDS.has(control.controlId)) {
      merged.push(control)
    }
  })
  return merged
}

export function readAIRiskSystemSnapshots(storage: Storage) {
  return safeJsonParse<AIRiskSystemSnapshot[]>(storage.getItem(AI_RISK_SYSTEM_SNAPSHOTS_STORAGE_KEY), [])
}

export function readAIRiskSelectedSystemId(storage: Storage) {
  return storage.getItem(AI_RISK_SELECTED_SYSTEM_STORAGE_KEY) || ""
}

export function writeAIRiskSelectedSystemId(storage: Storage, systemId: string) {
  storage.setItem(AI_RISK_SELECTED_SYSTEM_STORAGE_KEY, systemId)
}

export function ensureAIRiskControlCatalogSeeded(storage: Storage) {
  const catalog = readAIRiskControlCatalog(storage)
  storage.setItem(AI_RISK_CONTROL_CATALOG_STORAGE_KEY, JSON.stringify(catalog))
  return catalog
}

export function readStoredIncidentReports(storage: Storage) {
  return safeJsonParse<AIRiskStoredIncidentReport[]>(storage.getItem("highRiskIncidentReports"), [])
}

export function readStoredUsers(storage: Storage) {
  return safeJsonParse<Array<{ name?: string; email?: string; approved?: boolean }>>(storage.getItem("users"), [])
}

function getControlProgress(record: AIRiskRecord) {
  const completed = record.mitigationActions.filter((item) => item.status === "Completada").length
  const inProgress = record.mitigationActions.filter((item) => item.status === "En proceso").length
  const totalReferencedControls = record.selectedControlIds.length + record.customControls.length
  const pendingActions = record.mitigationActions.filter((item) => item.status === "Pendiente").length
  const pending = Math.max(totalReferencedControls - completed - inProgress, 0) + pendingActions

  return {
    implemented: completed,
    inProgress,
    pending,
  }
}

export function getRiskSystemGlobalSeverity(records: AIRiskRecord[]) {
  const active = records.filter((record) => isAIRiskActive(record.status))
  const critical = active.some((record) => record.residualSeverity === "Crítico")
  if (critical) return "Crítico" as const
  const high = active.some((record) => record.residualSeverity === "Alto")
  if (high) return "Alto" as const
  const medium = active.some((record) => record.residualSeverity === "Medio")
  if (medium) return "Medio" as const
  const low = active.some((record) => record.residualSeverity === "Bajo")
  if (low) return "Bajo" as const
  return "Sin riesgos" as const
}

export function upsertAIRiskSystemSnapshots(existing: AIRiskSystemSnapshot[], records: AIRiskRecord[]) {
  const bySystem = new Map<string, AIRiskRecord[]>()
  records.forEach((record) => {
    if (!record.systemId) return
    const current = bySystem.get(record.systemId) || []
    current.push(record)
    bySystem.set(record.systemId, current)
  })

  const snapshots = [...existing]
  bySystem.forEach((systemRecords, systemId) => {
    const latestRecord = systemRecords.reduce((latest, current) =>
      new Date(current.updatedAt).getTime() > new Date(latest.updatedAt).getTime() ? current : latest,
    )
    const monthKey = getMonthKey(latestRecord.updatedAt)
    const index = snapshots.findIndex((snapshot) => snapshot.systemId === systemId && snapshot.monthKey === monthKey)
    const controlSummary = systemRecords.reduce(
      (accumulator, record) => {
        const progress = getControlProgress(record)
        return {
          implemented: accumulator.implemented + progress.implemented,
          inProgress: accumulator.inProgress + progress.inProgress,
          pending: accumulator.pending + progress.pending,
        }
      },
      { implemented: 0, inProgress: 0, pending: 0 },
    )

    const byCategory = CATEGORY_ORDER.reduce(
      (accumulator, category) => {
        accumulator[category] = systemRecords.filter((record) => record.category === category).length
        return accumulator
      },
      {} as Record<AIRiskCategory, number>,
    )

    const snapshot: AIRiskSystemSnapshot = {
      id: index >= 0 ? snapshots[index].id : createId("snapshot"),
      systemId,
      systemName: latestRecord.systemName,
      monthKey,
      recordedAt: latestRecord.updatedAt,
      globalSeverity: getRiskSystemGlobalSeverity(systemRecords),
      activeRiskCount: systemRecords.filter((record) => isAIRiskActive(record.status)).length,
      byCategory,
      controlsImplemented: controlSummary.implemented,
      controlsInProgress: controlSummary.inProgress,
      controlsPending: controlSummary.pending,
    }

    if (index >= 0) {
      snapshots[index] = snapshot
    } else {
      snapshots.push(snapshot)
    }
  })

  return snapshots.sort((left, right) => (left.recordedAt < right.recordedAt ? -1 : 1))
}

export function persistAIRiskRecords(storage: Storage, records: AIRiskRecord[]) {
  const normalized = records.map(normalizeAIRiskRecord)
  const snapshots = upsertAIRiskSystemSnapshots(readAIRiskSystemSnapshots(storage), normalized)
  storage.setItem(AI_RISK_RECORDS_STORAGE_KEY, JSON.stringify(normalized))
  storage.setItem(AI_RISK_SYSTEM_SNAPSHOTS_STORAGE_KEY, JSON.stringify(snapshots))
  window.dispatchEvent(new Event(AI_RISK_STORAGE_UPDATED_EVENT))
  window.dispatchEvent(new Event("localStorageUpdate"))
}

export function saveAIRiskControlCatalog(storage: Storage, catalog: AIRiskControl[]) {
  storage.setItem(AI_RISK_CONTROL_CATALOG_STORAGE_KEY, JSON.stringify(catalog))
  window.dispatchEvent(new Event(AI_RISK_STORAGE_UPDATED_EVENT))
}

export function buildAIRiskRecord(params: {
  draft: AIRiskRecord
  existingRecords: AIRiskRecord[]
  actor: string
  previousRecord?: AIRiskRecord | null
}) {
  const timestamp = new Date().toISOString()
  const baseDate = params.draft.evaluationDate || params.draft.identifiedAt || toIsoDate()
  const riskId =
    params.draft.riskId ||
    buildRiskId(params.draft.systemName, params.previousRecord ? params.existingRecords.filter((record) => record.id !== params.previousRecord?.id) : params.existingRecords, params.draft.systemId, baseDate)

  const normalized = normalizeAIRiskRecord({
    ...params.draft,
    id: params.draft.id || createId("risk"),
    riskId,
    createdAt: params.previousRecord?.createdAt || params.draft.createdAt || timestamp,
    updatedAt: timestamp,
  })

  const history = [...(params.previousRecord?.history || params.draft.history || [])]

  if (!params.previousRecord) {
    history.unshift(
      createAIRiskHistoryEntry({
        user: params.actor || normalized.identifiedBy || "Usuario",
        action: "Creación",
        field: "registro",
        nextValue: `${normalized.riskId} - ${normalized.riskName}`,
        timestamp,
      }),
    )
  } else {
    const trackedFields: Array<keyof AIRiskRecord> = [
      "riskName",
      "category",
      "status",
      "riskOwner",
      "treatmentStrategy",
      "planDueDate",
      "residualSeverity",
      "linkedRequirement",
    ]
    trackedFields.forEach((field) => {
      if (serializeValue(params.previousRecord?.[field]) !== serializeValue(normalized[field])) {
        history.unshift(
          createAIRiskHistoryEntry({
            user: params.actor || normalized.evaluatedBy || "Usuario",
            action: "Actualización",
            field: String(field),
            previousValue: params.previousRecord?.[field],
            nextValue: normalized[field],
            timestamp,
          }),
        )
      }
    })
  }

  normalized.history = history.slice(0, 50)
  return normalized
}

export function duplicateAIRiskRecord(record: AIRiskRecord, existingRecords: AIRiskRecord[], actor: string) {
  const duplicated = createEmptyAIRiskRecord({
    systemId: record.systemId,
    systemName: record.systemName,
    identifiedBy: actor,
    evaluatedBy: actor,
  })

  return buildAIRiskRecord({
    draft: {
      ...duplicated,
      ...record,
      id: createId("risk"),
      riskId: "",
      riskName: `${record.riskName} (copia)`,
      status: "Identificado",
      approvedBy: "",
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    existingRecords,
    actor,
  })
}

export function getAIRiskAlerts(records: AIRiskRecord[], systems: AIRiskSystemOption[], incidents: AIRiskStoredIncidentReport[]) {
  const now = new Date()
  const alerts: AIRiskAlert[] = []

  records.forEach((record) => {
    const isCritical = record.residualSeverity === "Crítico"
    const noPlan = !record.mitigationActions.length || !record.planDueDate
    const createdRecently = now.getTime() - new Date(record.createdAt).getTime() <= 24 * 60 * 60 * 1000

    if (isCritical && noPlan) {
      alerts.push({
        id: `${record.id}-critical-plan`,
        type: "critical_without_plan",
        severity: "Crítico",
        title: "Riesgo crítico sin plan de mitigación",
        description: `${record.riskId} requiere plan de acción inmediato.`,
        riskId: record.id,
        systemId: record.systemId,
      })
    }

    if (isCritical && createdRecently) {
      alerts.push({
        id: `${record.id}-new-critical`,
        type: "new_critical",
        severity: "Crítico",
        title: "Nuevo riesgo crítico identificado",
        description: `${record.riskName} fue registrado durante las últimas 24 horas.`,
        riskId: record.id,
        systemId: record.systemId,
      })
    }

    const planDue = record.planDueDate ? new Date(`${record.planDueDate}T23:59:59`) : null
    if (planDue) {
      const diff = planDue.getTime() - now.getTime()
      if (diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000) {
        alerts.push({
          id: `${record.id}-due-soon`,
          type: "plan_due_soon",
          severity: record.residualSeverity,
          title: "Plan de mitigación próximo a vencer",
          description: `${record.riskId} vence el ${record.planDueDate}.`,
          riskId: record.id,
          systemId: record.systemId,
        })
      }
    }

    const reviewDate = record.nextReviewDate ? new Date(`${record.nextReviewDate}T23:59:59`) : null
    if (reviewDate && reviewDate.getTime() < now.getTime()) {
      alerts.push({
        id: `${record.id}-review-overdue`,
        type: "review_overdue",
        severity: record.residualSeverity,
        title: "Revisión vencida",
        description: `${record.riskId} debió revisarse el ${record.nextReviewDate}.`,
        riskId: record.id,
        systemId: record.systemId,
      })
    }

    const system = systems.find((item) => item.id === record.systemId)
    if (system?.lastUpdated && new Date(system.lastUpdated).getTime() > new Date(record.updatedAt).getTime()) {
      alerts.push({
        id: `${record.id}-system-updated`,
        type: "system_updated",
        severity: record.residualSeverity,
        title: "Sistema actualizado después de la evaluación",
        description: `${record.systemName} cambió tras la última actualización del riesgo.`,
        riskId: record.id,
        systemId: record.systemId,
      })
    }

    const linkedIncident = incidents.find((incident) => {
      const incidentSystemName = incident.report?.system?.nombreSistema?.trim().toLowerCase()
      return incidentSystemName && incidentSystemName === record.systemName.trim().toLowerCase()
    })

    if (linkedIncident) {
      alerts.push({
        id: `${record.id}-incident`,
        type: "linked_incident",
        severity: record.residualSeverity,
        title: "Incidente asociado al sistema",
        description: `Existe un incidente reportado para ${record.systemName}.`,
        riskId: record.id,
        systemId: record.systemId,
      })
    }
  })

  return alerts
}

export function getHeatMapMatrix(records: AIRiskRecord[], mode: "inherent" | "residual" = "residual") {
  const matrix = Array.from({ length: 5 }, (_, rowIndex) =>
    Array.from({ length: 5 }, (_, columnIndex) => ({
      probability: 5 - rowIndex,
      impact: columnIndex + 1,
      count: 0,
      severity: getAIRiskSeverity((5 - rowIndex) * (columnIndex + 1)),
      records: [] as AIRiskRecord[],
    })),
  )

  records.forEach((record) => {
    const probability = mode === "inherent" ? record.inherentProbability : record.residualProbability
    const impact = mode === "inherent" ? record.inherentImpact : record.residualImpact
    const row = 5 - probability
    const column = impact - 1

    if (matrix[row]?.[column]) {
      matrix[row][column].count += 1
      matrix[row][column].records.push(record)
    }
  })

  return matrix
}

export function getDashboardMetrics(records: AIRiskRecord[], systems: AIRiskSystemOption[]) {
  const now = new Date()
  const activeRecords = records.filter((record) => isAIRiskActive(record.status))
  const risksWithAssessment = new Set(records.map((record) => record.systemId).filter(Boolean))
  const mitigated = records.filter((record) => record.status === "Mitigado").length
  const newRisks = records.filter((record) => now.getTime() - new Date(record.createdAt).getTime() <= 30 * 24 * 60 * 60 * 1000).length
  const overdue = records.filter((record) => record.nextReviewDate && new Date(`${record.nextReviewDate}T23:59:59`).getTime() < now.getTime()).length
  const criticalWithoutPlan = activeRecords.filter(
    (record) => record.residualSeverity === "Crítico" && (!record.planDueDate || record.mitigationActions.length === 0),
  ).length

  return {
    totalSystems: systems.length,
    activeEvaluations: risksWithAssessment.size,
    totalActiveRisks: activeRecords.length,
    bySeverity: {
      Crítico: activeRecords.filter((record) => record.residualSeverity === "Crítico").length,
      Alto: activeRecords.filter((record) => record.residualSeverity === "Alto").length,
      Medio: activeRecords.filter((record) => record.residualSeverity === "Medio").length,
      Bajo: activeRecords.filter((record) => record.residualSeverity === "Bajo").length,
    } as Record<AIRiskSeverity, number>,
    criticalWithoutPlan,
    overdueReviews: overdue,
    mitigatedRate: records.length > 0 ? Math.round((mitigated / records.length) * 100) : 0,
    newRisksLast30Days: newRisks,
  }
}

export function getSystemRiskProfile(systemId: string, records: AIRiskRecord[], snapshots: AIRiskSystemSnapshot[]) {
  const systemRecords = records.filter((record) => record.systemId === systemId)
  const activeRecords = systemRecords.filter((record) => isAIRiskActive(record.status))
  const categoryCounts = CATEGORY_ORDER.reduce(
    (accumulator, category) => {
      accumulator[category] = systemRecords.filter((record) => record.category === category).length
      return accumulator
    },
    {} as Record<AIRiskCategory, number>,
  )

  const controls = systemRecords.reduce(
    (accumulator, record) => {
      const progress = getControlProgress(record)
      return {
        implemented: accumulator.implemented + progress.implemented,
        inProgress: accumulator.inProgress + progress.inProgress,
        pending: accumulator.pending + progress.pending,
      }
    },
    { implemented: 0, inProgress: 0, pending: 0 },
  )

  const timeline = snapshots
    .filter((snapshot) => snapshot.systemId === systemId)
    .sort((left, right) => left.monthKey.localeCompare(right.monthKey))
    .slice(-12)

  const nextReviews = systemRecords
    .filter((record) => record.nextReviewDate)
    .sort((left, right) => left.nextReviewDate.localeCompare(right.nextReviewDate))
    .slice(0, 5)

  return {
    globalSeverity: getRiskSystemGlobalSeverity(systemRecords),
    activeRiskCount: activeRecords.length,
    categoryCounts,
    controls,
    timeline,
    nextReviews,
    averageResolutionDays: getAverageResolutionDays(systemRecords),
    mitigationOnTimeRate: getMitigationOnTimeRate(systemRecords),
  }
}

export function getAverageResolutionDays(records: AIRiskRecord[]) {
  const closed = records.filter((record) => record.status === "Mitigado" || record.status === "Cerrado")
  if (!closed.length) return 0
  const totalDays = closed.reduce((sum, record) => {
    const created = new Date(record.createdAt).getTime()
    const closedAt = new Date(record.updatedAt).getTime()
    return sum + Math.max(Math.round((closedAt - created) / (24 * 60 * 60 * 1000)), 0)
  }, 0)
  return Math.round(totalDays / closed.length)
}

export function getMitigationOnTimeRate(records: AIRiskRecord[]) {
  const withPlans = records.filter((record) => record.planDueDate)
  if (!withPlans.length) return 0
  const onTime = withPlans.filter((record) => {
    if (record.status !== "Mitigado" && record.status !== "Cerrado") return false
    return new Date(record.updatedAt).getTime() <= new Date(`${record.planDueDate}T23:59:59`).getTime()
  }).length
  return Math.round((onTime / withPlans.length) * 100)
}

export function getRiskOwnerLoad(records: AIRiskRecord[]) {
  const owners = new Map<string, { owner: string; total: number; active: number }>()
  records.forEach((record) => {
    const owner = record.riskOwner || "Sin asignar"
    const current = owners.get(owner) || { owner, total: 0, active: 0 }
    current.total += 1
    if (isAIRiskActive(record.status)) current.active += 1
    owners.set(owner, current)
  })
  return Array.from(owners.values()).sort((left, right) => right.active - left.active)
}

export function getRecurringRisks(records: AIRiskRecord[]) {
  const names = new Map<string, number>()
  records.forEach((record) => {
    const key = `${record.systemId}-${record.riskName.trim().toLowerCase()}`
    names.set(key, (names.get(key) || 0) + 1)
  })
  return Array.from(names.values()).filter((count) => count > 1).length
}

export function getManagementMaturityIndex(records: AIRiskRecord[]) {
  if (!records.length) return 0
  const documented = records.filter((record) => record.evaluationJustification && record.riskOwner).length / records.length
  const controlled = records.filter((record) => record.selectedControlIds.length + record.customControls.length > 0).length / records.length
  const closed = records.filter((record) => record.status === "Mitigado" || record.status === "Cerrado").length / records.length
  return Math.round(((documented + controlled + closed) / 3) * 100)
}

export function getMonthlyTrendLabel(monthKey: string) {
  const [year, month] = monthKey.split("-")
  return `${month}/${year.slice(2)}`
}
