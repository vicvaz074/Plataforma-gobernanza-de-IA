export const AI_SYSTEMS_REGISTRY_STORAGE_KEY = "aiSystemsRegistry"
export const AI_REGISTRY_STORAGE_UPDATED_EVENT = "ai-registry-storage-updated"

export type AIRegistryMode = "third-party" | "own"

export interface AISystemData {
  id: string
  registryType: AIRegistryMode
  companyName: string
  corporateGroup: string
  mainJurisdiction: string
  systemName: string
  systemVersion: string
  createdAt: string
  lastUpdateDate: string
  lastUpdateResponsible: string
  nextReviewDate: string
  systemDescription: string
  responsibleArea: string
  internalOwner: string
  providerName: string
  implementationDate: string
  systemStage: string
  systemPurpose: string
  organizationUseCase: string[]
  problemSolved: string
  personImpactDecision: string
  finalUsersDescription: string
  affectedPeopleVolume: string
  sensitivePersonalData: string
  minorsData: string
  dataQualityProcess: string
  dataRepresentativeness: string
  outputPersonalDataReidentification: string
  inputDataTypes: string[]
  dataOrigin: string[]
  outputData: string
  aiType: string[]
  autonomyLevel: string
  decisionImpact: string
  endUserInteraction: string
  highRiskClassification: string
  impactEvaluation: string
  impactEvaluationJustification?: string
  dpiaEvaluation: string
  ipImpactEvaluation: string
  globalRiskLevel: string
  criticalSectorsList: string[]
  userInformed: string
  informationAssetRegistered: string
  technicalDocumentation: string
  internalDocumentation: string
  periodicAudit: string
  reviewResponsible: string
  reviewFrequency: string
  humanOversightLevel: string
  suspensionProcess: string
  assetInventoryStatus: string
  technicalAuditStatus: string
  committeeReviewStatus: string
  committeeReportingDuty: string
  securityTechnicalMeasures: string[]
  incidentResponsePlan: string
  auditLogsMonitoring: string
  externalProviderInvolvement: string
  providerRiskAssessment: string
  providerContractStatus: string
  internationalTransferStatus: string
  internationalTransferMechanisms: string[]
  trainingStatus: string
  trainingTopics: string[]
  trainingFrequency: string
  responsibleAIPolicy: string
  complianceMetricsDefined: string
  complianceMetrics: string[]
  continuousImprovementProcess: string
  incidentRegistryStatus: string
  additionalObservations: string
  reviewCommitments: string
  validatorResponsibleSignature: string
  governanceResponsibleSignature: string
  validationDate: string
  identifiedRisks: string[]
  biasDiscrimination: string
  legalImpact: string
  humanRightsImpact: string
  criticalSectors: string
  replacesHumanDecisions: string
  replacesHumanDecisionsPhase?: string
  explainable: string
  riskMitigationMeasures: string[]
  securityMeasures: string[]
  internationalTransfer: string
  transferMechanism: string
  raciArea: string
  raciAreaOther?: string
  raciOwnerName: string
  raciOwnerRole: string
  raciOwnerEmail: string
  raciOperationalName: string
  raciOperationalRole: string
  raciOperationalEmail: string
  raciTechnicalR: string
  raciTechnicalA: string
  raciTechnicalC: string
  raciTechnicalI: string
  raciLegalR: string
  raciLegalA: string
  raciLegalC: string
  raciLegalI: string
  raciPrivacyR: string
  raciPrivacyA: string
  raciPrivacyC: string
  raciPrivacyI: string
  raciEthicalR: string
  raciEthicalA: string
  raciEthicalC: string
  raciEthicalI: string
  raciSecurityR: string
  raciSecurityA: string
  raciSecurityC: string
  raciSecurityI: string
  raciReportFrequency: string
  raciReportRecipients: string[]
  raciReportRecipientsOther?: string
  raciApprovalsDocumented: string
  raciEscalationChannels: string[]
  raciEscalationChannelsOther?: string
  raciActExistence: string
  raciAcceptanceName: string
  raciAcceptanceRole: string
  raciAcceptanceDate: string
  complaintsChannel: string
  arcoRights: string
  xaiTechniques: string[]
  publicDocumentation: string
  responsibleAreaOther?: string
  systemStageOther?: string
  autonomyLevelOther?: string
  decisionImpactOther?: string
  transferMechanismOther?: string
  inputDataTypesOther?: string
  dataOriginOther?: string
  aiTypeOther?: string
  securityMeasuresOther?: string
  identifiedRisksOther?: string
  riskMitigationMeasuresOther?: string
  technicalDocumentationFile?: string
  internalDocumentationFile?: string
  transferMechanismFile?: string
  registrationEvidenceFile?: string
  criticalSectorType?: string
  securityDevelopment?: string[]
  securityProduction?: string[]
  securityModel?: string[]
  securityGovernance?: string[]
  securityOrganizational?: string[]
  securityGPAI?: string[]
  personalDataSubtypes?: string[]
  piSubtypes?: string[]
  algorithmicSubtypes?: string[]
  userAreas?: string[]
  userAreasOther?: string
  providerType?: string
  datasetSystem?: string
  noPersonalDataSubtypes?: string[]
  highRiskClassificationOther?: string
}

export function createEmptyAISystemData(registryMode: AIRegistryMode = "third-party"): AISystemData {
  return {
    id: "",
    registryType: registryMode,
    companyName: "",
    corporateGroup: "",
    mainJurisdiction: "",
    systemName: "",
    systemVersion: "",
    createdAt: "",
    lastUpdateDate: "",
    lastUpdateResponsible: "",
    nextReviewDate: "",
    systemDescription: "",
    responsibleArea: "",
    internalOwner: "",
    providerName: registryMode === "own" ? "Desarrollo interno" : "",
    implementationDate: "",
    systemStage: "",
    systemPurpose: "",
    organizationUseCase: [],
    problemSolved: "",
    personImpactDecision: "",
    finalUsersDescription: "",
    affectedPeopleVolume: "",
    sensitivePersonalData: "",
    minorsData: "",
    dataQualityProcess: "",
    dataRepresentativeness: "",
    outputPersonalDataReidentification: "",
    inputDataTypes: [],
    dataOrigin: [],
    outputData: "",
    aiType: [],
    autonomyLevel: "",
    decisionImpact: "",
    endUserInteraction: "",
    highRiskClassification: "",
    impactEvaluation: "",
    impactEvaluationJustification: "",
    dpiaEvaluation: "",
    ipImpactEvaluation: "",
    globalRiskLevel: "",
    criticalSectorsList: [],
    userInformed: "",
    informationAssetRegistered: "",
    technicalDocumentation: "",
    internalDocumentation: "",
    periodicAudit: "",
    reviewResponsible: "",
    reviewFrequency: "",
    humanOversightLevel: "",
    suspensionProcess: "",
    assetInventoryStatus: "",
    technicalAuditStatus: "",
    committeeReviewStatus: "",
    committeeReportingDuty: "",
    securityTechnicalMeasures: [],
    incidentResponsePlan: "",
    auditLogsMonitoring: "",
    externalProviderInvolvement: "",
    providerRiskAssessment: "",
    providerContractStatus: "",
    internationalTransferStatus: "",
    internationalTransferMechanisms: [],
    trainingStatus: "",
    trainingTopics: [],
    trainingFrequency: "",
    responsibleAIPolicy: "",
    complianceMetricsDefined: "",
    complianceMetrics: [],
    continuousImprovementProcess: "",
    incidentRegistryStatus: "",
    additionalObservations: "",
    reviewCommitments: "",
    validatorResponsibleSignature: "",
    governanceResponsibleSignature: "",
    validationDate: "",
    identifiedRisks: [],
    biasDiscrimination: "",
    legalImpact: "",
    humanRightsImpact: "",
    criticalSectors: "",
    replacesHumanDecisions: "",
    replacesHumanDecisionsPhase: "",
    explainable: "",
    riskMitigationMeasures: [],
    securityMeasures: [],
    internationalTransfer: "",
    transferMechanism: "",
    raciArea: "",
    raciAreaOther: "",
    raciOwnerName: "",
    raciOwnerRole: "",
    raciOwnerEmail: "",
    raciOperationalName: "",
    raciOperationalRole: "",
    raciOperationalEmail: "",
    raciTechnicalR: "",
    raciTechnicalA: "",
    raciTechnicalC: "",
    raciTechnicalI: "",
    raciLegalR: "",
    raciLegalA: "",
    raciLegalC: "",
    raciLegalI: "",
    raciPrivacyR: "",
    raciPrivacyA: "",
    raciPrivacyC: "",
    raciPrivacyI: "",
    raciEthicalR: "",
    raciEthicalA: "",
    raciEthicalC: "",
    raciEthicalI: "",
    raciSecurityR: "",
    raciSecurityA: "",
    raciSecurityC: "",
    raciSecurityI: "",
    raciReportFrequency: "",
    raciReportRecipients: [],
    raciReportRecipientsOther: "",
    raciApprovalsDocumented: "",
    raciEscalationChannels: [],
    raciEscalationChannelsOther: "",
    raciActExistence: "",
    raciAcceptanceName: "",
    raciAcceptanceRole: "",
    raciAcceptanceDate: "",
    complaintsChannel: "",
    arcoRights: "",
    xaiTechniques: [],
    publicDocumentation: "",
    responsibleAreaOther: "",
    systemStageOther: "",
    autonomyLevelOther: "",
    decisionImpactOther: "",
    transferMechanismOther: "",
    inputDataTypesOther: "",
    dataOriginOther: "",
    aiTypeOther: "",
    securityMeasuresOther: "",
    identifiedRisksOther: "",
    riskMitigationMeasuresOther: "",
    technicalDocumentationFile: "",
    internalDocumentationFile: "",
    transferMechanismFile: "",
    registrationEvidenceFile: "",
    criticalSectorType: "",
    securityDevelopment: [],
    securityProduction: [],
    securityModel: [],
    securityGovernance: [],
    securityOrganizational: [],
    securityGPAI: [],
    personalDataSubtypes: [],
    piSubtypes: [],
    algorithmicSubtypes: [],
    userAreas: [],
    userAreasOther: "",
    providerType: "",
    datasetSystem: "",
    noPersonalDataSubtypes: [],
    highRiskClassificationOther: "",
  }
}

type SeedResult = {
  seeded: boolean
  systems: AISystemData[]
}

const deepCloneSystems = (systems: AISystemData[]): AISystemData[] =>
  JSON.parse(JSON.stringify(systems)) as AISystemData[]

const createSeedSystem = (
  registryType: AIRegistryMode,
  id: string,
  overrides: Partial<AISystemData>,
): AISystemData => {
  const base = createEmptyAISystemData(registryType)

  return {
    ...base,
    id,
    registryType,
    companyName: "Davara México, S.A. de C.V.",
    corporateGroup: "Davara Governance Group",
    mainJurisdiction: "México",
    createdAt: "2026-03-10T10:00:00.000Z",
    lastUpdateDate: "2026-03-26",
    lastUpdateResponsible: "Laura Mendoza, Oficial de Gobernanza de IA",
    nextReviewDate: "2026-09-30",
    responsibleArea: "juridico_compliance",
    internalOwner: "Laura Mendoza, Oficial de Gobernanza de IA",
    implementationDate: "2025-11-18",
    systemStage: "produccion",
    systemPurpose:
      "Apoyar procesos internos con automatización asistida, trazabilidad documental y controles de gobernanza para decisiones supervisadas.",
    organizationUseCase: ["Legal / Compliance / Gobernanza"],
    problemSolved:
      "Reduce tiempos de análisis, estandariza criterios de revisión y mejora la trazabilidad de decisiones internas.",
    personImpactDecision: "si_no_vinculantes",
    finalUsersDescription:
      "Equipos internos de jurídico, privacidad, compliance y responsables operativos que utilizan recomendaciones para su análisis.",
    affectedPeopleVolume: "100_1000",
    sensitivePersonalData: "no",
    minorsData: "no",
    dataQualityProcess: "si_formal",
    dataRepresentativeness: "si_verificado",
    outputPersonalDataReidentification: "no",
    inputDataTypes: ["Datos públicos / fuentes abiertas", "Datos sintéticos o de prueba"],
    dataOrigin: ["Generados internamente por la organización", "Datos abiertos / fuentes públicas"],
    outputData:
      "Reportes de análisis, clasificaciones temáticas, alertas de riesgo y recomendaciones de seguimiento para revisión humana.",
    aiType: ["NLP"],
    autonomyLevel: "asistido",
    decisionImpact: "apoyo",
    endUserInteraction: "sin_interaccion",
    highRiskClassification: "no_limitado_minimo",
    impactEvaluation: "si_completa",
    impactEvaluationJustification:
      "Se documentó el contexto de uso, los impactos previsibles y las salvaguardas de supervisión humana antes de pasar a producción.",
    dpiaEvaluation: "no_requiere",
    ipImpactEvaluation: "si_completa",
    globalRiskLevel: "limitado",
    criticalSectorsList: ["Ninguno de los anteriores"],
    userInformed: "si_clara_previa",
    informationAssetRegistered: "si-completo",
    technicalDocumentation: "si",
    internalDocumentation: "si",
    periodicAudit: "si",
    reviewResponsible: "Laura Mendoza, Oficial de Gobernanza de IA, con acompañamiento de Tecnología y Privacidad.",
    reviewFrequency: "trimestral",
    humanOversightLevel: "si_total",
    suspensionProcess: "si_formal",
    assetInventoryStatus: "si_completo",
    technicalAuditStatus: "si_formales",
    committeeReviewStatus: "si_aprobado",
    committeeReportingDuty: "trimestral",
    securityTechnicalMeasures: [
      "Cifrado de datos en tránsito (TLS/SSL)",
      "Control de acceso basado en roles (RBAC)",
      "Registros de auditoría y trazabilidad (logs)",
      "Monitoreo continuo de seguridad",
    ],
    incidentResponsePlan: "si_general",
    auditLogsMonitoring: "si_completo",
    externalProviderInvolvement: registryType === "own" ? "no_interno" : "si",
    providerRiskAssessment: registryType === "own" ? "no_aplica" : "si_completa",
    providerContractStatus: registryType === "own" ? "no_aplica" : "si_especifico_dpa",
    internationalTransferStatus: registryType === "own" ? "no" : "si_con_mecanismo",
    internationalTransferMechanisms:
      registryType === "own"
        ? ["No aplica"]
        : ["Cláusulas contractuales tipo (CCT / SCC)"],
    trainingStatus: "si_formal",
    trainingTopics: [
      "Fundamentos de IA y machine learning",
      "Ética en IA y principios de IA responsable",
      "Riesgos específicos del sistema (sesgos, privacidad, seguridad)",
      "Procedimientos ante fallos, anomalías o incidentes",
    ],
    trainingFrequency: "anual_o_mas",
    responsibleAIPolicy: "si_aprobada",
    complianceMetricsDefined: "si_formales",
    complianceMetrics: [
      "Tiempo de respuesta y disponibilidad del sistema",
      "Número de reclamaciones o impugnaciones recibidas",
      "Número de incidentes de seguridad relacionados con el sistema",
    ],
    continuousImprovementProcess: "si_pdca",
    incidentRegistryStatus: "si_formal",
    additionalObservations:
      "Registro demo para pruebas funcionales del inventario y de los módulos dependientes.",
    reviewCommitments:
      "Revalidar riesgos, métricas y controles técnicos antes del cierre del siguiente trimestre.",
    validatorResponsibleSignature: "Laura Mendoza, Oficial de Gobernanza de IA",
    governanceResponsibleSignature: "Víctor Salinas, Compliance & DPO",
    validationDate: "2026-03-26",
    identifiedRisks: [
      "Falta de transparencia o explicabilidad",
      "Dependencia tecnológica o de proveedor (lock-in)",
      "Legal / regulatorio / incumplimiento normativo",
    ],
    biasDiscrimination: "no_descartado",
    legalImpact: "no",
    humanRightsImpact: "no",
    criticalSectors: "",
    replacesHumanDecisions: "no",
    replacesHumanDecisionsPhase: "",
    explainable: "si_claras",
    riskMitigationMeasures: [
      "Evaluación de Impacto Algorítmico (EIA)",
      "Supervisión humana en el ciclo de decisión",
      "Auditorías técnicas periódicas",
      "Monitoreo continuo del desempeño del modelo",
    ],
    securityMeasures: [],
    internationalTransfer: registryType === "own" ? "No" : "Sí",
    transferMechanism: registryType === "own" ? "No aplica" : "CCT / SCC",
    raciArea: "comite",
    raciOwnerName: "Laura Mendoza",
    raciOwnerRole: "Oficial de Gobernanza de IA",
    raciOwnerEmail: "laura.mendoza@davara.mx",
    raciOperationalName: "Carlos Rivera",
    raciOperationalRole: "Líder Operativo del Sistema",
    raciOperationalEmail: "carlos.rivera@davara.mx",
    raciTechnicalR: "Equipo de Ingeniería de IA",
    raciTechnicalA: "Dirección de Tecnología",
    raciTechnicalC: "Arquitectura y Seguridad",
    raciTechnicalI: "Auditoría Interna",
    raciLegalR: "Compliance",
    raciLegalA: "Dirección Jurídica",
    raciLegalC: "Privacidad",
    raciLegalI: "Comité de IA",
    raciPrivacyR: "DPO",
    raciPrivacyA: "Compliance",
    raciPrivacyC: "Tecnología",
    raciPrivacyI: "Comité de IA",
    raciEthicalR: "Gobernanza de IA",
    raciEthicalA: "Comité de IA",
    raciEthicalC: "Compliance",
    raciEthicalI: "Dirección General",
    raciSecurityR: "Ciberseguridad",
    raciSecurityA: "Dirección de Tecnología",
    raciSecurityC: "Ingeniería de IA",
    raciSecurityI: "Gobernanza de IA",
    raciReportFrequency: "trimestral",
    raciReportRecipients: ["Comité de IA", "Dirección General"],
    raciApprovalsDocumented: "si",
    raciEscalationChannels: ["Comité de IA", "Mesa de servicio de seguridad"],
    raciActExistence: "si",
    raciAcceptanceName: "Laura Mendoza",
    raciAcceptanceRole: "Oficial de Gobernanza de IA",
    raciAcceptanceDate: "2026-03-26",
    complaintsChannel: "si_general",
    arcoRights: "si_completos",
    xaiTechniques: ["Explicaciones en lenguaje natural generadas por el sistema"],
    publicDocumentation: "si_solicitud",
    ...overrides,
  }
}

const SEEDED_AI_SYSTEMS: AISystemData[] = [
  createSeedSystem("third-party", "seed-third-party-1", {
    systemName: "Asistente de Atención Omnicanal GPT",
    systemVersion: "v3.4.1",
    providerName: "OpenAI / Integración gestionada por Davara Cloud",
    responsibleArea: "comercial_marketing",
    internalOwner: "Mariana Ponce, Gerente de Experiencia de Cliente",
    systemDescription:
      "Asistente conversacional de terceros integrado en canales web y correo para responder preguntas frecuentes y generar borradores de atención.",
    systemPurpose:
      "Atender consultas recurrentes de clientes y asistir a agentes humanos con respuestas sugeridas y resúmenes de conversación.",
    organizationUseCase: ["Atención al cliente / Chatbot", "Marketing / Publicidad / Personalización"],
    problemSolved:
      "Disminuye tiempos de primera respuesta y homogeniza la calidad del soporte de primer nivel sin automatizar decisiones finales.",
    finalUsersDescription:
      "Clientes externos que consultan por canales digitales y agentes de atención que revisan y aprueban respuestas sugeridas.",
    affectedPeopleVolume: "1000_10000",
    sensitivePersonalData: "en_evaluacion",
    inputDataTypes: [
      "Datos de contacto (correo, teléfono, domicilio)",
      "Datos de comunicaciones (correos, chats)",
    ],
    dataOrigin: [
      "Proporcionados directamente por el titular",
      "Generados internamente por la organización",
    ],
    outputData:
      "Respuestas sugeridas, resúmenes automáticos y etiquetas de intención para canalización operativa.",
    aiType: ["NLP", "Generativa"],
    endUserInteraction: "directa_tiempo_real",
    dataQualityProcess: "no_aplica",
    dataRepresentativeness: "no_aplica",
    dpiaEvaluation: "si_parcial",
    ipImpactEvaluation: "si_parcial",
    userInformed: "si_generica",
    reviewResponsible: "Mariana Ponce, Gerente de Experiencia de Cliente, con soporte de Compliance.",
    identifiedRisks: [
      "Privacidad y protección de datos personales",
      "Errores de modelo / alucinaciones (IA generativa)",
      "Dependencia tecnológica o de proveedor (lock-in)",
    ],
    biasDiscrimination: "en_evaluacion",
    legalImpact: "en_evaluacion",
    riskMitigationMeasures: [
      "Evaluación de Impacto Algorítmico (EIA)",
      "Supervisión humana en el ciclo de decisión",
      "Controles de acceso y autenticación",
      "Monitoreo continuo del desempeño del modelo",
    ],
    providerRiskAssessment: "si_parcial",
    providerContractStatus: "si_general",
    complaintsChannel: "si_especifico_ia",
    arcoRights: "parcialmente",
    publicDocumentation: "si_publica",
  }),
  createSeedSystem("third-party", "seed-third-party-2", {
    systemName: "VendorShield Scoring",
    systemVersion: "2026.02",
    providerName: "RiskPulse Analytics, Inc.",
    responsibleArea: "finanzas",
    internalOwner: "Diego Estrada, Director de Compras y Riesgos",
    systemDescription:
      "Motor analítico externo para priorizar proveedores y detectar señales tempranas de riesgo reputacional, financiero y de continuidad.",
    systemPurpose:
      "Calificar el riesgo de terceros y apoyar decisiones de debida diligencia con puntajes y alertas basadas en fuentes externas e internas.",
    organizationUseCase: ["Análisis financiero / Scoring crediticio", "Operaciones / Cadena de suministro"],
    problemSolved:
      "Centraliza el análisis de proveedores críticos y acelera la priorización de revisiones reforzadas en compras y abastecimiento.",
    finalUsersDescription:
      "Usuarios internos de procurement, finanzas y compliance que revisan recomendaciones antes de aceptar, suspender o escalar un proveedor.",
    affectedPeopleVolume: "menos_100",
    personImpactDecision: "no_interno",
    inputDataTypes: ["Datos financieros / patrimoniales", "Datos públicos / fuentes abiertas"],
    dataOrigin: [
      "Recabados de proveedores externos de datos",
      "Datos abiertos / fuentes públicas",
      "Generados internamente por la organización",
    ],
    outputData:
      "Puntajes de riesgo, alertas por eventos adversos y recomendaciones de seguimiento para revisión del comité de terceros.",
    aiType: ["ML"],
    autonomyLevel: "parcial",
    decisionImpact: "operacional",
    highRiskClassification: "posiblemente_evaluacion",
    impactEvaluation: "si_parcial",
    globalRiskLevel: "alto",
    criticalSectorsList: ["Servicios financieros / Crediticios"],
    identifiedRisks: [
      "Dependencia tecnológica o de proveedor (lock-in)",
      "Legal / regulatorio / incumplimiento normativo",
      "Reputacional / daño a la imagen corporativa",
    ],
    biasDiscrimination: "si_con_mitigacion",
    legalImpact: "si",
    reviewFrequency: "mensual",
    committeeReportingDuty: "incidentes_cambios",
  }),
  createSeedSystem("own", "seed-own-1", {
    systemName: "Clasificador Interno de Incidentes Regulatorios",
    systemVersion: "1.8.0",
    providerName: "Desarrollo interno",
    systemDescription:
      "Modelo interno de PLN que clasifica reportes regulatorios, identifica temas críticos y sugiere rutas de escalamiento para equipos de cumplimiento.",
    systemPurpose:
      "Priorizar incidentes regulatorios y distribuirlos al equipo correcto con criterios consistentes y auditables.",
    organizationUseCase: ["Legal / Compliance / Gobernanza", "Investigación y desarrollo"],
    problemSolved:
      "Reduce el tiempo de triage de reportes y mejora la consistencia en la atención temprana de incidentes de cumplimiento.",
    finalUsersDescription:
      "Analistas internos de cumplimiento, privacidad y auditoría que validan el resultado antes de iniciar acciones.",
    personImpactDecision: "no_interno",
    inputDataTypes: [
      "Datos de comunicaciones (correos, chats)",
      "Datos públicos / fuentes abiertas",
      "Datos sintéticos o de prueba",
    ],
    dataOrigin: [
      "Generados internamente por la organización",
      "Datos abiertos / fuentes públicas",
      "Datos sintéticos generados para entrenamiento",
    ],
    outputData:
      "Etiquetas de severidad, categorías normativas, alertas de prioridad y borradores de ruta de atención.",
    aiType: ["NLP", "ML"],
    endUserInteraction: "mediada_diferida",
    dpiaEvaluation: "si_parcial",
    identifiedRisks: [
      "Falta de transparencia o explicabilidad",
      "Ciberseguridad y vulnerabilidades técnicas",
      "Legal / regulatorio / incumplimiento normativo",
    ],
    riskMitigationMeasures: [
      "Evaluación de Impacto Algorítmico (EIA)",
      "Evaluación de Impacto en Protección de Datos (EIPD/DPIA)",
      "Supervisión humana en el ciclo de decisión",
      "Pruebas de sesgo y equidad algorítmica",
      "Monitoreo continuo del desempeño del modelo",
    ],
    externalProviderInvolvement: "no_interno",
    providerRiskAssessment: "no_aplica",
    providerContractStatus: "no_aplica",
    internationalTransferStatus: "no",
    publicDocumentation: "no_interna",
  }),
  createSeedSystem("own", "seed-own-2", {
    systemName: "Copiloto Jurídico Interno LexiOps",
    systemVersion: "0.9.3-beta",
    providerName: "Desarrollo interno",
    responsibleArea: "producto_innovacion",
    internalOwner: "Ana Trejo, Product Manager LegalTech",
    systemDescription:
      "Copiloto interno para abogados que resume expedientes, propone checklists de revisión contractual y genera borradores sujetos a aprobación humana.",
    systemPurpose:
      "Acelerar la preparación de análisis jurídicos rutinarios y estandarizar checklists documentales en equipos legales.",
    organizationUseCase: ["Legal / Compliance / Gobernanza", "Investigación y desarrollo"],
    problemSolved:
      "Disminuye el tiempo dedicado a lectura preliminar y a elaboración de borradores repetitivos para asuntos de baja complejidad.",
    systemStage: "piloto",
    implementationDate: "2026-02-04",
    finalUsersDescription:
      "Abogados internos y paralegales que utilizan sugerencias como insumo no vinculante para su trabajo cotidiano.",
    affectedPeopleVolume: "menos_100",
    inputDataTypes: [
      "Datos de comunicaciones (correos, chats)",
      "Datos públicos / fuentes abiertas",
      "Datos sintéticos o de prueba",
    ],
    dataOrigin: [
      "Generados internamente por la organización",
      "Datos abiertos / fuentes públicas",
      "Datos sintéticos generados para entrenamiento",
    ],
    outputData:
      "Resúmenes, propuestas de cláusulas, checklists de cumplimiento y preguntas sugeridas para revisión adicional.",
    aiType: ["NLP", "Generativa"],
    endUserInteraction: "mediada_diferida",
    impactEvaluation: "si_parcial",
    ipImpactEvaluation: "si_parcial",
    identifiedRisks: [
      "Errores de modelo / alucinaciones (IA generativa)",
      "Falta de transparencia o explicabilidad",
      "Legal / regulatorio / incumplimiento normativo",
    ],
    biasDiscrimination: "en_evaluacion",
    technicalAuditStatus: "si_internas_informales",
    committeeReviewStatus: "si_pendiente",
    trainingStatus: "si_informal",
    trainingFrequency: "ante_cambios",
    complaintsChannel: "no_pendiente",
    arcoRights: "no_aplica",
    publicDocumentation: "no_interna",
  }),
]

export function getAISystemRegistryMode(system: Partial<Pick<AISystemData, "registryType" | "providerName">>): AIRegistryMode {
  if (system.registryType === "own" || system.registryType === "third-party") {
    return system.registryType
  }

  return system.providerName?.trim().toLowerCase() === "desarrollo interno" ? "own" : "third-party"
}

export function filterAISystemsByMode(systems: AISystemData[], registryMode: AIRegistryMode) {
  return systems.filter((system) => getAISystemRegistryMode(system) === registryMode)
}

export function readAISystemsFromStorage(storage: Storage): AISystemData[] {
  const stored = storage.getItem(AI_SYSTEMS_REGISTRY_STORAGE_KEY)

  if (!stored) {
    return []
  }

  try {
    const parsed = JSON.parse(stored) as unknown
    return Array.isArray(parsed) ? (parsed as AISystemData[]) : []
  } catch {
    return []
  }
}

export function ensureAISystemsRegistrySeeded(storage: Storage): SeedResult {
  const existingSystems = readAISystemsFromStorage(storage)

  if (existingSystems.length > 0) {
    return { seeded: false, systems: existingSystems }
  }

  const systems = deepCloneSystems(SEEDED_AI_SYSTEMS)
  storage.setItem(AI_SYSTEMS_REGISTRY_STORAGE_KEY, JSON.stringify(systems))

  return { seeded: true, systems }
}
