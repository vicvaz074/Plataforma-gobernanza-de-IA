"use client"

export type AISecurityDomainId = "D-1" | "D-2" | "D-3" | "D-4" | "D-5" | "D-6"

export type AISecurityControlWeight = "CRITICO" | "ALTO" | "ESTANDAR"
export type AISecurityImplementationType = "TECNICO" | "ORGANIZACIONAL" | "PROCEDIMENTAL" | "CONTRACTUAL"
export type AISecurityEnvironment = "ON_PREMISES" | "CLOUD_PRIVADO" | "HIBRIDO" | "TODOS"
export type AISecurityAssessmentMode = "complete" | "quick"
export type AISecurityEvidenceKind = "document" | "log" | "config" | "link" | "note"
export type AISecurityRemediationStatus = "pending" | "in_progress" | "completed"
export type AISecurityAlertSeverity = "critical" | "warning"

export interface AISecurityDomain {
  id: AISecurityDomainId
  name: string
  shortName: string
  description: string
  weight: number
  benchmarkScore: number
  reference: string
}

export interface AISecurityControl {
  controlId: string
  title: string
  question: string
  description: string
  domainId: AISecurityDomainId
  requiredLevel: number
  weight: AISecurityControlWeight
  threatCategories: string[]
  referenceFrameworks: string[]
  cpgReferences: string[]
  implementationType: AISecurityImplementationType
  applicableEnvironments: AISecurityEnvironment[]
  requiredEvidence: string[]
  implementationGuide: string
  suggestedTools: string[]
  active: boolean
  seeded: boolean
}

export interface AISecurityEvidenceRef {
  id: string
  name: string
  kind: AISecurityEvidenceKind
  note: string
}

export interface AISecurityControlResponse {
  level: number | null
  notes: string
  evidences: AISecurityEvidenceRef[]
  updatedAt: string | null
}

export interface AISecurityAlert {
  id: string
  controlId: string
  domainId: AISecurityDomainId
  title: string
  severity: AISecurityAlertSeverity
  currentLevel: number
  targetLevel: number
  message: string
}

export interface AISecurityRemediationItem {
  id: string
  controlId: string
  domainId: AISecurityDomainId
  title: string
  priority: AISecurityControlWeight
  gap: number
  recommendedWindow: string
  owner: string
  dueDate: string
  status: AISecurityRemediationStatus
  note: string
  reference: string
}

export interface AISecurityAssessmentDraft {
  assessmentId: string
  systemId: string
  selectedDomains: AISecurityDomainId[]
  mode: AISecurityAssessmentMode
  responses: Record<string, AISecurityControlResponse>
  remediationPlan: AISecurityRemediationItem[]
  createdAt: string
  lastSavedAt: string
}

export interface AISecurityAssessmentSnapshot {
  snapshotId: string
  systemId: string
  selectedDomains: AISecurityDomainId[]
  mode: AISecurityAssessmentMode
  responses: Record<string, AISecurityControlResponse>
  remediationPlan: AISecurityRemediationItem[]
  createdAt: string
}

export interface AISecurityAssessmentBucket {
  draft: AISecurityAssessmentDraft
  snapshots: AISecurityAssessmentSnapshot[]
}

export type AISecurityAssessmentStore = Record<string, AISecurityAssessmentBucket>

export interface AISecurityDomainScore {
  domain: AISecurityDomain
  score: number
  completion: number
  evaluatedControls: number
  totalControls: number
}

export interface AISecurityAssessmentSummary {
  domainScores: AISecurityDomainScore[]
  globalScore: number
  evaluatedControls: number
  totalControls: number
  completion: number
  alerts: AISecurityAlert[]
}

export interface AISecurityCrossReferenceRow {
  category: string
  nsaCisa: string
  nistAiRmf: string
  owasp: string
  euAiAct: string
  iso42001: string
}

export const AI_SECURITY_CATALOG_STORAGE_KEY = "aiSecurityCatalog"
export const AI_SECURITY_ASSESSMENTS_STORAGE_KEY = "aiSecurityAssessments"
export const AI_SECURITY_SELECTED_SYSTEM_KEY = "aiSecuritySelectedSystemId"

export const AI_SECURITY_DOMAINS: AISecurityDomain[] = [
  {
    id: "D-1",
    name: "Entorno de despliegue",
    shortName: "Entorno",
    description: "Gobernanza, arquitectura y configuración segura del entorno de despliegue.",
    weight: 20,
    benchmarkScore: 3,
    reference: "NSA/CISA §3 · CPG 1.B · 2.E · 2.F",
  },
  {
    id: "D-2",
    name: "Protección continua del modelo",
    shortName: "Modelo",
    description: "Validación criptográfica, cadena de suministro e inspección previa a producción.",
    weight: 25,
    benchmarkScore: 3,
    reference: "NSA/CISA §4 · OWASP ML Top 10",
  },
  {
    id: "D-3",
    name: "Seguridad de APIs e interfaces",
    shortName: "APIs",
    description: "Autenticación, autorización y sanitización de entradas y salidas.",
    weight: 20,
    benchmarkScore: 3,
    reference: "NSA/CISA §4.2 · CPG 2.C · 2.D · 2.G",
  },
  {
    id: "D-4",
    name: "Monitoreo y detección",
    shortName: "Monitoreo",
    description: "Logging, detección de patrones anómalos y alertamiento operativo.",
    weight: 15,
    benchmarkScore: 3,
    reference: "NSA/CISA §4.3 · CPG 2.T · 3.A",
  },
  {
    id: "D-5",
    name: "Protección de pesos del modelo",
    shortName: "Pesos",
    description: "Aislamiento y resguardo de artefactos y pesos sensibles.",
    weight: 10,
    benchmarkScore: 3,
    reference: "NSA/CISA §4.4 · CPG 2.L · 2.E",
  },
  {
    id: "D-6",
    name: "Operación y mantenimiento seguro",
    shortName: "Operación",
    description: "Accesos, auditoría, continuidad y borrado seguro durante la operación.",
    weight: 10,
    benchmarkScore: 3,
    reference: "NSA/CISA §5 · CPG 2.H · 2.I · 2.R",
  },
]

export const AI_SECURITY_CROSS_REFERENCE: AISecurityCrossReferenceRow[] = [
  {
    category: "Gobernanza y roles",
    nsaCisa: "§3 Governance",
    nistAiRmf: "GOVERN 1.1–1.7",
    owasp: "LLM GovernChk §2",
    euAiAct: "Art. 9, 17",
    iso42001: "6.1, 6.2",
  },
  {
    category: "Arquitectura segura",
    nsaCisa: "§3 Architecture",
    nistAiRmf: "MAP 1.5, MANAGE 2.4",
    owasp: "ML-SEC Top10 #7",
    euAiAct: "Art. 9(2)(d)",
    iso42001: "8.4",
  },
  {
    category: "Validación del modelo",
    nsaCisa: "§4 Validate AI",
    nistAiRmf: "MEASURE 2.5, 2.6",
    owasp: "ML-SEC Top10 #1, #2",
    euAiAct: "Art. 9(5)",
    iso42001: "8.5",
  },
  {
    category: "Seguridad de APIs",
    nsaCisa: "§4 APIs",
    nistAiRmf: "MANAGE 1.3",
    owasp: "LLM01 Prompt Injection",
    euAiAct: "Art. 9(7)",
    iso42001: "8.6",
  },
  {
    category: "Monitoreo continuo",
    nsaCisa: "§4 Monitor",
    nistAiRmf: "MEASURE 2.8, 2.9",
    owasp: "ML-SEC Top10 #5",
    euAiAct: "Art. 9(1)(f)",
    iso42001: "9.1",
  },
  {
    category: "Protección de datos y pesos",
    nsaCisa: "§4 Model Weights",
    nistAiRmf: "MAP 2.2",
    owasp: "ML-SEC Top10 #4",
    euAiAct: "Art. 10, 13",
    iso42001: "8.3",
  },
  {
    category: "Respuesta a incidentes",
    nsaCisa: "§5 DR/HA",
    nistAiRmf: "MANAGE 3.1–3.2",
    owasp: "LLM GovernChk §7",
    euAiAct: "Art. 62",
    iso42001: "10.2",
  },
]

export const AI_SECURITY_SEEDED_CONTROLS: AISecurityControl[] = [
  {
    controlId: "D1-GOV-001",
    title: "Responsable de ciberseguridad del sistema",
    question: "¿Existe un responsable designado para la ciberseguridad del sistema de IA?",
    description: "Define propiedad clara sobre la ciberseguridad del sistema y su alineación con la seguridad corporativa.",
    domainId: "D-1",
    requiredLevel: 3,
    weight: "CRITICO",
    threatCategories: ["falta_gobernanza", "brecha_operativa"],
    referenceFrameworks: ["NSA/CISA", "NIST AI RMF", "ISO 42001"],
    cpgReferences: ["1.B"],
    implementationType: "ORGANIZACIONAL",
    applicableEnvironments: ["TODOS"],
    requiredEvidence: ["Nombramiento formal", "Matriz RACI", "Acta o política aprobada"],
    implementationGuide: "Nombrar responsable, definir alcance y aprobar la responsabilidad en gobierno corporativo.",
    suggestedTools: ["Matriz RACI", "Repositorio documental", "Workflow de aprobación"],
    active: true,
    seeded: true,
  },
  {
    controlId: "D1-GOV-002",
    title: "Tolerancia al riesgo documentada",
    question: "¿Se ha documentado formalmente el nivel de tolerancia al riesgo para este sistema?",
    description: "Establece el nivel de riesgo aceptable, los criterios de escalación y los umbrales de aceptación.",
    domainId: "D-1",
    requiredLevel: 3,
    weight: "CRITICO",
    threatCategories: ["riesgo_no_gestionado", "falta_escalacion"],
    referenceFrameworks: ["NSA/CISA", "NIST AI RMF", "EU AI Act"],
    cpgReferences: ["1.B"],
    implementationType: "ORGANIZACIONAL",
    applicableEnvironments: ["TODOS"],
    requiredEvidence: ["Apetito de riesgo", "Criterios de aceptación", "Aprobación del comité"],
    implementationGuide: "Definir tolerancia al riesgo con negocio, legal y seguridad; enlazar con revisiones periódicas.",
    suggestedTools: ["Registro de riesgos", "Comité de IA", "Plantilla de apetito de riesgo"],
    active: true,
    seeded: true,
  },
  {
    controlId: "D1-ARQ-001",
    title: "Zero Trust para despliegue",
    question: "¿Se ha implementado un enfoque Zero Trust en la arquitectura de despliegue?",
    description: "Aplica mínimo privilegio, microsegmentación y verificación continua en accesos al entorno de IA.",
    domainId: "D-1",
    requiredLevel: 2,
    weight: "ALTO",
    threatCategories: ["acceso_no_autorizado", "movimiento_lateral"],
    referenceFrameworks: ["NSA/CISA", "NIST Zero Trust", "ISO 42001"],
    cpgReferences: ["2.F", "2.E"],
    implementationType: "TECNICO",
    applicableEnvironments: ["ON_PREMISES", "CLOUD_PRIVADO", "HIBRIDO"],
    requiredEvidence: ["Diagrama de red", "Reglas de segmentación", "Políticas de acceso"],
    implementationGuide: "Separar accesos privilegiados, segmentar red y validar identidad de forma continua.",
    suggestedTools: ["IAM", "PAM", "Firewall", "Service Mesh"],
    active: true,
    seeded: true,
  },
  {
    controlId: "D1-ARQ-002",
    title: "Inventario de fuentes de entrenamiento con integridad",
    question: "¿Existe un catálogo de fuentes de datos de entrenamiento con verificación de integridad?",
    description: "Documenta datasets y verifica integridad para minimizar manipulación o envenenamiento de datos.",
    domainId: "D-1",
    requiredLevel: 2,
    weight: "ALTO",
    threatCategories: ["data_poisoning", "supply_chain"],
    referenceFrameworks: ["NSA/CISA", "NIST AI RMF"],
    cpgReferences: ["2.E"],
    implementationType: "PROCEDIMENTAL",
    applicableEnvironments: ["TODOS"],
    requiredEvidence: ["Inventario de datasets", "Hashes o firmas", "Proceso de validación"],
    implementationGuide: "Registrar fuentes, propietario, fecha y validación de integridad antes de uso.",
    suggestedTools: ["Data catalog", "Checksum registry", "Pipeline de validación"],
    active: true,
    seeded: true,
  },
  {
    controlId: "D2-MOD-001",
    title: "Validación criptográfica de artefactos",
    question: "¿Se validan hash y firma digital de los artefactos del modelo antes del despliegue?",
    description: "Reduce el riesgo de artefactos manipulados o sustituidos antes de producción.",
    domainId: "D-2",
    requiredLevel: 3,
    weight: "CRITICO",
    threatCategories: ["tampering", "supply_chain"],
    referenceFrameworks: ["NSA/CISA", "OWASP ML"],
    cpgReferences: ["2.K", "2.L"],
    implementationType: "TECNICO",
    applicableEnvironments: ["TODOS"],
    requiredEvidence: ["Procedimiento de firma", "Registro de hashes", "Pipeline de validación"],
    implementationGuide: "Firmar artefactos, validar hash en CI/CD y bloquear despliegue si la validación falla.",
    suggestedTools: ["Sigstore", "KMS", "CI/CD policy gates"],
    active: true,
    seeded: true,
  },
  {
    controlId: "D2-MOD-002",
    title: "Sandbox para modelos preentrenados",
    question: "¿Se inspeccionan modelos preentrenados en entorno aislado antes de pasarlos a producción?",
    description: "Evalúa modelos de terceros en entornos aislados antes de permitir su promoción a producción.",
    domainId: "D-2",
    requiredLevel: 3,
    weight: "CRITICO",
    threatCategories: ["malware_modelo", "supply_chain"],
    referenceFrameworks: ["NSA/CISA", "OWASP ML", "MITRE ATLAS"],
    cpgReferences: ["2.E"],
    implementationType: "TECNICO",
    applicableEnvironments: ["CLOUD_PRIVADO", "HIBRIDO", "ON_PREMISES"],
    requiredEvidence: ["Reporte de sandbox", "Checklist de aprobación", "Logs de análisis"],
    implementationGuide: "Cargar modelos externos en sandbox, validar comportamiento y aprobar explícitamente su promoción.",
    suggestedTools: ["Sandbox", "Antimalware", "Escáner de dependencias"],
    active: true,
    seeded: true,
  },
  {
    controlId: "D2-MOD-003",
    title: "Rollback automatizado del modelo",
    question: "¿Existe un mecanismo automatizado para regresar al último estado conocido bueno del modelo?",
    description: "Permite responder ante degradaciones o compromisos del modelo con recuperación rápida.",
    domainId: "D-2",
    requiredLevel: 2,
    weight: "ALTO",
    threatCategories: ["rollback_fallido", "incidente_operativo"],
    referenceFrameworks: ["NSA/CISA", "NIST AI RMF"],
    cpgReferences: ["2.R"],
    implementationType: "TECNICO",
    applicableEnvironments: ["TODOS"],
    requiredEvidence: ["Procedimiento de rollback", "Prueba reciente", "Historial de versiones"],
    implementationGuide: "Versionar artefactos, automatizar rollback y ensayar periódicamente el procedimiento.",
    suggestedTools: ["Registry de modelos", "Release manager", "Runbooks"],
    active: true,
    seeded: true,
  },
  {
    controlId: "D3-API-001",
    title: "Autenticación y autorización en APIs",
    question: "¿Todos los endpoints expuestos del sistema de IA requieren autenticación y autorización apropiadas?",
    description: "Protege las interfaces del sistema contra abuso, exposición y acceso indebido.",
    domainId: "D-3",
    requiredLevel: 3,
    weight: "CRITICO",
    threatCategories: ["api_abuse", "unauthorized_access"],
    referenceFrameworks: ["NSA/CISA", "OWASP API", "ISO 42001"],
    cpgReferences: ["2.C", "2.D"],
    implementationType: "TECNICO",
    applicableEnvironments: ["TODOS"],
    requiredEvidence: ["Política de authN/authZ", "Configuración de gateway", "Pruebas de acceso"],
    implementationGuide: "Aplicar autenticación fuerte, scopes y revisión periódica de permisos por endpoint.",
    suggestedTools: ["API Gateway", "IAM", "WAF"],
    active: true,
    seeded: true,
  },
  {
    controlId: "D3-API-002",
    title: "Sanitización y validación anti-prompt injection",
    question: "¿Se validan y sanitizan todos los inputs para reducir riesgos de prompt injection y entradas maliciosas?",
    description: "Minimiza la manipulación maliciosa de prompts, inyección de instrucciones y payloads inesperados.",
    domainId: "D-3",
    requiredLevel: 3,
    weight: "CRITICO",
    threatCategories: ["prompt_injection", "input_tampering"],
    referenceFrameworks: ["NSA/CISA", "OWASP LLM", "MITRE ATLAS"],
    cpgReferences: ["2.G"],
    implementationType: "TECNICO",
    applicableEnvironments: ["TODOS"],
    requiredEvidence: ["Reglas de validación", "Casos de prueba", "Logs de rechazo"],
    implementationGuide: "Validar estructura, filtrar instrucciones peligrosas y aplicar defensa en capas en inputs.",
    suggestedTools: ["Input validation", "Content filter", "API Gateway policy"],
    active: true,
    seeded: true,
  },
  {
    controlId: "D4-MON-001",
    title: "Logging integral de inputs y outputs",
    question: "¿Se registran inputs, outputs, estados intermedios y errores relevantes del sistema de IA?",
    description: "Proporciona trazabilidad suficiente para auditoría, investigación y respuesta a incidentes.",
    domainId: "D-4",
    requiredLevel: 3,
    weight: "CRITICO",
    threatCategories: ["falta_trazabilidad", "deteccion_tardia"],
    referenceFrameworks: ["NSA/CISA", "NIST AI RMF"],
    cpgReferences: ["2.T", "3.A"],
    implementationType: "TECNICO",
    applicableEnvironments: ["TODOS"],
    requiredEvidence: ["Política de logging", "Ejemplos de registros", "Retención definida"],
    implementationGuide: "Registrar eventos clave con controles de acceso, retención y revisión periódica.",
    suggestedTools: ["SIEM", "Observability stack", "Central log management"],
    active: true,
    seeded: true,
  },
  {
    controlId: "D4-MON-002",
    title: "Detección de drift y patrones anómalos",
    question: "¿Se detectan drift de datos y patrones anómalos o repetitivos de entradas?",
    description: "Ayuda a identificar abuso, degradación del modelo y señales tempranas de ataque.",
    domainId: "D-4",
    requiredLevel: 2,
    weight: "ALTO",
    threatCategories: ["data_drift", "abuse_patterns"],
    referenceFrameworks: ["NSA/CISA", "NIST AI RMF", "MITRE ATLAS"],
    cpgReferences: ["2.T"],
    implementationType: "TECNICO",
    applicableEnvironments: ["TODOS"],
    requiredEvidence: ["Alertas configuradas", "Thresholds definidos", "Reporte de monitoreo"],
    implementationGuide: "Definir umbrales, patrones de abuso y alertamiento para anomalías operativas.",
    suggestedTools: ["SIEM", "ML monitoring", "Alert manager"],
    active: true,
    seeded: true,
  },
  {
    controlId: "D5-MOD-001",
    title: "Protección de weights en HSM o HRZ",
    question: "¿Los model weights y artefactos sensibles se almacenan en HSM o zonas de alta restricción?",
    description: "Restringe el acceso a pesos del modelo para evitar exfiltración o uso no autorizado.",
    domainId: "D-5",
    requiredLevel: 3,
    weight: "CRITICO",
    threatCategories: ["model_exfiltration", "intellectual_property_loss"],
    referenceFrameworks: ["NSA/CISA", "EU AI Act", "ISO 42001"],
    cpgReferences: ["2.L", "2.E"],
    implementationType: "TECNICO",
    applicableEnvironments: ["ON_PREMISES", "CLOUD_PRIVADO", "HIBRIDO"],
    requiredEvidence: ["Arquitectura de almacenamiento", "Controles de acceso", "Política de cifrado"],
    implementationGuide: "Aislar pesos en HSM/HRZ, limitar accesos y registrar todo acceso privilegiado.",
    suggestedTools: ["HSM", "KMS", "Enclave", "Secret manager"],
    active: true,
    seeded: true,
  },
  {
    controlId: "D6-OPS-001",
    title: "RBAC/ABAC con MFA administrativo",
    question: "¿El acceso administrativo al sistema de IA está protegido con RBAC/ABAC y MFA?",
    description: "Reduce exposición de operaciones privilegiadas y endurece el acceso administrativo.",
    domainId: "D-6",
    requiredLevel: 3,
    weight: "CRITICO",
    threatCategories: ["privileged_access", "account_takeover"],
    referenceFrameworks: ["NSA/CISA", "NIST AI RMF", "ISO 42001"],
    cpgReferences: ["2.H"],
    implementationType: "TECNICO",
    applicableEnvironments: ["TODOS"],
    requiredEvidence: ["Configuración MFA", "Matriz de roles", "Revisión de privilegios"],
    implementationGuide: "Aplicar MFA resistente a phishing y revisión continua de privilegios administrativos.",
    suggestedTools: ["IAM", "MFA", "PAM"],
    active: true,
    seeded: true,
  },
  {
    controlId: "D6-OPS-002",
    title: "Auditorías y pentesting periódico",
    question: "¿Existe un programa de auditorías y penetration testing periódico por terceros?",
    description: "Asegura revisiones independientes sobre la superficie de ataque del sistema y su operación.",
    domainId: "D-6",
    requiredLevel: 2,
    weight: "ALTO",
    threatCategories: ["vulnerabilidades", "configuracion_insegura"],
    referenceFrameworks: ["NSA/CISA", "OWASP ML", "ISO 42001"],
    cpgReferences: ["2.I"],
    implementationType: "PROCEDIMENTAL",
    applicableEnvironments: ["TODOS"],
    requiredEvidence: ["Plan anual", "Último reporte", "Seguimiento de hallazgos"],
    implementationGuide: "Programar auditorías externas, priorizar hallazgos y cerrar brechas con evidencia.",
    suggestedTools: ["Vulnerability scanner", "Pentest provider", "Issue tracker"],
    active: true,
    seeded: true,
  },
  {
    controlId: "D6-OPS-003",
    title: "Borrado seguro de modelos y claves",
    question: "¿Existen capacidades de borrado seguro e irreversible de modelos y claves criptográficas?",
    description: "Permite retirada segura de modelos, pesos y secretos conforme a políticas de retención.",
    domainId: "D-6",
    requiredLevel: 2,
    weight: "ALTO",
    threatCategories: ["residual_data", "retention_failure"],
    referenceFrameworks: ["NSA/CISA", "EU AI Act", "ISO 42001"],
    cpgReferences: ["2.R", "2.L"],
    implementationType: "PROCEDIMENTAL",
    applicableEnvironments: ["TODOS"],
    requiredEvidence: ["Procedimiento de borrado", "Bitácora de eliminación", "Política de retención"],
    implementationGuide: "Definir runbooks de borrado, aprobación dual y trazabilidad de ejecuciones.",
    suggestedTools: ["KMS", "Secret manager", "Runbooks", "Retention workflows"],
    active: true,
    seeded: true,
  },
]

export const AI_SECURITY_LEVELS = [
  { level: 0, label: "Inexistente", color: "bg-red-100 text-red-700 border-red-200" },
  { level: 1, label: "Inicial", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { level: 2, label: "Definido", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { level: 3, label: "Gestionado", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { level: 4, label: "Optimizado", color: "bg-emerald-200 text-emerald-900 border-emerald-300" },
] as const

export function createAssessmentId(prefix: string) {
  return `${prefix}-${Date.now()}`
}

export function getLevelMeta(level: number | null | undefined) {
  const resolvedLevel = typeof level === "number" ? level : 0
  return AI_SECURITY_LEVELS.find((item) => item.level === resolvedLevel) || AI_SECURITY_LEVELS[0]
}

export function getWeightValue(weight: AISecurityControlWeight) {
  if (weight === "CRITICO") return 3
  if (weight === "ALTO") return 2
  return 1
}

export function formatScore(score: number) {
  return (Math.round(score * 10) / 10).toFixed(1)
}

export function getControlCatalog() {
  if (typeof window === "undefined") return AI_SECURITY_SEEDED_CONTROLS

  const stored = window.localStorage.getItem(AI_SECURITY_CATALOG_STORAGE_KEY)
  if (!stored) {
    window.localStorage.setItem(AI_SECURITY_CATALOG_STORAGE_KEY, JSON.stringify(AI_SECURITY_SEEDED_CONTROLS))
    return AI_SECURITY_SEEDED_CONTROLS
  }

  try {
    const parsed = JSON.parse(stored) as AISecurityControl[]
    const customControls = parsed.filter((control) => !AI_SECURITY_SEEDED_CONTROLS.some((seeded) => seeded.controlId === control.controlId))
    const merged = [...AI_SECURITY_SEEDED_CONTROLS, ...customControls]
    window.localStorage.setItem(AI_SECURITY_CATALOG_STORAGE_KEY, JSON.stringify(merged))
    return merged
  } catch {
    window.localStorage.setItem(AI_SECURITY_CATALOG_STORAGE_KEY, JSON.stringify(AI_SECURITY_SEEDED_CONTROLS))
    return AI_SECURITY_SEEDED_CONTROLS
  }
}

export function saveControlCatalog(catalog: AISecurityControl[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(AI_SECURITY_CATALOG_STORAGE_KEY, JSON.stringify(catalog))
}

export function getAssessmentStore(): AISecurityAssessmentStore {
  if (typeof window === "undefined") return {}
  const stored = window.localStorage.getItem(AI_SECURITY_ASSESSMENTS_STORAGE_KEY)
  if (!stored) return {}

  try {
    return JSON.parse(stored) as AISecurityAssessmentStore
  } catch {
    return {}
  }
}

export function saveAssessmentStore(store: AISecurityAssessmentStore) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(AI_SECURITY_ASSESSMENTS_STORAGE_KEY, JSON.stringify(store))
}

export function getSelectedSystemId() {
  if (typeof window === "undefined") return ""
  return window.localStorage.getItem(AI_SECURITY_SELECTED_SYSTEM_KEY) || ""
}

export function saveSelectedSystemId(systemId: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(AI_SECURITY_SELECTED_SYSTEM_KEY, systemId)
}

export function getApplicableControls(
  catalog: AISecurityControl[],
  mode: AISecurityAssessmentMode,
  selectedDomains: AISecurityDomainId[],
) {
  return catalog.filter((control) => {
    if (!control.active) return false
    if (!selectedDomains.includes(control.domainId)) return false
    if (mode === "quick" && control.weight !== "CRITICO") return false
    return true
  })
}

function getDefaultResponse(): AISecurityControlResponse {
  return {
    level: null,
    notes: "",
    evidences: [],
    updatedAt: null,
  }
}

export function createEmptyDraft(systemId: string): AISecurityAssessmentDraft {
  const now = new Date().toISOString()
  return {
    assessmentId: createAssessmentId("draft"),
    systemId,
    selectedDomains: AI_SECURITY_DOMAINS.map((domain) => domain.id),
    mode: "complete",
    responses: {},
    remediationPlan: [],
    createdAt: now,
    lastSavedAt: now,
  }
}

export function ensureDraftForSystem(
  store: AISecurityAssessmentStore,
  systemId: string,
): AISecurityAssessmentBucket {
  if (store[systemId]) return store[systemId]
  return {
    draft: createEmptyDraft(systemId),
    snapshots: [],
  }
}

export function withNormalizedResponses(
  draft: AISecurityAssessmentDraft,
  catalog: AISecurityControl[],
) {
  const nextResponses: Record<string, AISecurityControlResponse> = { ...draft.responses }

  catalog.forEach((control) => {
    if (!nextResponses[control.controlId]) {
      nextResponses[control.controlId] = getDefaultResponse()
    }
  })

  return {
    ...draft,
    responses: nextResponses,
  }
}

export function calculateAssessmentSummary(
  draft: AISecurityAssessmentDraft,
  catalog: AISecurityControl[],
): AISecurityAssessmentSummary {
  const applicableControls = getApplicableControls(catalog, draft.mode, draft.selectedDomains)
  const domainScores = AI_SECURITY_DOMAINS.filter((domain) => draft.selectedDomains.includes(domain.id)).map((domain) => {
    const domainControls = applicableControls.filter((control) => control.domainId === domain.id)
    const totalWeight = domainControls.reduce((sum, control) => sum + getWeightValue(control.weight), 0)
    const weightedLevelSum = domainControls.reduce((sum, control) => {
      const response = draft.responses[control.controlId]
      const level = response?.level ?? 0
      return sum + level * getWeightValue(control.weight)
    }, 0)
    const evaluatedControls = domainControls.filter((control) => draft.responses[control.controlId]?.level !== null).length
    const completion = domainControls.length > 0 ? Math.round((evaluatedControls / domainControls.length) * 100) : 0
    const score = totalWeight > 0 ? weightedLevelSum / totalWeight : 0

    return {
      domain,
      score,
      completion,
      evaluatedControls,
      totalControls: domainControls.length,
    }
  })

  const domainWeightTotal = domainScores.reduce((sum, item) => sum + item.domain.weight, 0)
  const globalScore =
    domainWeightTotal > 0
      ? domainScores.reduce((sum, item) => sum + item.score * item.domain.weight, 0) / domainWeightTotal
      : 0

  const totalControls = applicableControls.length
  const evaluatedControls = applicableControls.filter((control) => draft.responses[control.controlId]?.level !== null).length
  const completion = totalControls > 0 ? Math.round((evaluatedControls / totalControls) * 100) : 0
  const alerts = buildAlerts(draft, catalog)

  return {
    domainScores,
    globalScore,
    evaluatedControls,
    totalControls,
    completion,
    alerts,
  }
}

export function buildAlerts(draft: AISecurityAssessmentDraft, catalog: AISecurityControl[]): AISecurityAlert[] {
  return getApplicableControls(catalog, draft.mode, draft.selectedDomains)
    .filter((control) => control.weight === "CRITICO")
    .map((control) => {
      const currentLevel = draft.responses[control.controlId]?.level ?? 0
      const severity: AISecurityAlertSeverity = currentLevel <= 1 ? "critical" : "warning"

      return {
        id: `alert-${control.controlId}`,
        controlId: control.controlId,
        domainId: control.domainId,
        title: control.title,
        severity,
        currentLevel,
        targetLevel: control.requiredLevel,
        message:
          currentLevel <= 1
            ? `${control.controlId}: nivel ${currentLevel}. Requiere acción inmediata para alcanzar el nivel ${control.requiredLevel}.`
            : `${control.controlId}: revisar evidencia y madurez para alcanzar el nivel recomendado.`,
      }
    })
    .filter((alert) => alert.currentLevel <= 1)
}

function getRecommendedWindow(index: number, weight: AISecurityControlWeight) {
  if (weight === "CRITICO") return index === 0 ? "Semana 1-2" : index === 1 ? "Semana 2-3" : "Semana 3-4"
  if (weight === "ALTO") return "Mes 1"
  return "Mes 2"
}

function addDays(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export function buildRemediationPlan(
  draft: AISecurityAssessmentDraft,
  catalog: AISecurityControl[],
  owner = "Equipo responsable",
): AISecurityRemediationItem[] {
  const existingByControl = new Map(draft.remediationPlan.map((item) => [item.controlId, item]))

  return getApplicableControls(catalog, draft.mode, draft.selectedDomains)
    .filter((control) => (draft.responses[control.controlId]?.level ?? 0) <= 1)
    .sort((left, right) => {
      const weightDelta = getWeightValue(right.weight) - getWeightValue(left.weight)
      if (weightDelta !== 0) return weightDelta

      const leftDomain = AI_SECURITY_DOMAINS.find((domain) => domain.id === left.domainId)?.weight || 0
      const rightDomain = AI_SECURITY_DOMAINS.find((domain) => domain.id === right.domainId)?.weight || 0
      if (rightDomain !== leftDomain) return rightDomain - leftDomain

      return left.controlId.localeCompare(right.controlId)
    })
    .map((control, index) => {
      const existing = existingByControl.get(control.controlId)
      const currentLevel = draft.responses[control.controlId]?.level ?? 0
      const gap = Math.max(control.requiredLevel - currentLevel, 0)

      return {
        id: existing?.id || `rem-${control.controlId}`,
        controlId: control.controlId,
        domainId: control.domainId,
        title: control.title,
        priority: control.weight,
        gap,
        recommendedWindow: existing?.recommendedWindow || getRecommendedWindow(index, control.weight),
        owner: existing?.owner || owner,
        dueDate: existing?.dueDate || addDays(control.weight === "CRITICO" ? 14 : 30),
        status: existing?.status || "pending",
        note:
          existing?.note ||
          `Elevar ${control.controlId} del nivel ${currentLevel} al nivel ${control.requiredLevel}. ${control.implementationGuide}`,
        reference: existing?.reference || [control.referenceFrameworks[0], ...control.cpgReferences].filter(Boolean).join(" · "),
      }
    })
}

export function archiveDraft(
  draft: AISecurityAssessmentDraft,
  catalog: AISecurityControl[],
  owner?: string,
) {
  const normalizedDraft = {
    ...draft,
    remediationPlan: buildRemediationPlan(draft, catalog, owner),
    lastSavedAt: new Date().toISOString(),
  }

  const snapshot: AISecurityAssessmentSnapshot = {
    snapshotId: createAssessmentId("snapshot"),
    systemId: draft.systemId,
    selectedDomains: [...normalizedDraft.selectedDomains],
    mode: normalizedDraft.mode,
    responses: normalizedDraft.responses,
    remediationPlan: normalizedDraft.remediationPlan,
    createdAt: new Date().toISOString(),
  }

  return {
    draft: normalizedDraft,
    snapshot,
  }
}

export function getDomainById(domainId: AISecurityDomainId) {
  return AI_SECURITY_DOMAINS.find((domain) => domain.id === domainId) || AI_SECURITY_DOMAINS[0]
}

export function getControlsByDomain(catalog: AISecurityControl[], domainId: AISecurityDomainId) {
  return catalog.filter((control) => control.domainId === domainId && control.active)
}
