"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
import { FileText, Users, Shield, Download, Edit, Trash2, Plus, Eye } from "lucide-react"
import jsPDF from "jspdf"

interface SupplierAssessment {
  id: string
  supplierName: string
  country: string
  thirdPartyType: string // "desarrollador" or "proveedor"
  developerType?: string // "interno", "externo", "mixto" - only for developers
  role: string
  subRole?: string
  serviceDescription: string
  contactPerson: string
  isHighRisk: string
  riskReason?: string
  autonomyLevel: string
  humanReview?: string
  sector: string
  sectorSpecific?: string
  documentation: string
  documentationType?: string
  qualitySystem: string
  certification?: string
  instructions: string
  includesProhibited?: string
  explainability: string
  explainabilityType?: string
  privacyImpact: string
  impactType?: string
  legalBasis: string
  contractClauses?: string
  dataLocation: string
  regions?: string
  retentionPolicies: string
  appliesToTraining?: string
  securityCertifications: string
  certificationPlan?: string
  securityControls: string
  encryptionType?: string
  incidentManagement: string
  testingFrequency?: string
  biasEvaluation: string
  metrics?: string
  dataGovernance: string
  includesValidation?: string
  contract: string
  contractClauses2?: string
  subprocessors: string
  updatedList?: string
  slaVersioning: string
  slaDefines?: string
  reportingFrequency: string
  reportingDecision?: string
  specificQuestions: { [key: string]: string }
  transversalQuestions: { [key: string]: string }
  documents: { [key: string]: string }
  score: number
  riskLevel: string
  createdAt: string
  updatedAt: string
}

const supplierTypes = [
  { value: "consultoria", label: "Consultoría / Discovery" },
  { value: "datos", label: "Proveedor de datos" },
  { value: "etiquetado", label: "Etiquetado / Anotación" },
  { value: "sinteticos", label: "Datos sintéticos" },
  { value: "llm", label: "Modelos fundacionales / LLM" },
  { value: "finetuning", label: "Fine-tuning / Adopción" },
  { value: "frameworks", label: "Frameworks / AutoML" },
  { value: "compute", label: "Compute / Cloud" },
  { value: "mlops", label: "MLOps / ModelOps" },
  { value: "vectordb", label: "Vector DB / RAG" },
  { value: "observabilidad", label: "Observabilidad / Monitoring" },
  { value: "explainability", label: "Explainability / Fairness" },
  { value: "seguridad", label: "Seguridad IA" },
  { value: "privacidad", label: "Privacidad (DP, federated learning)" },
  { value: "moderacion", label: "Moderación / Seguridad de contenido" },
  { value: "biometricos", label: "Identidad / Biométricos" },
  { value: "integracion", label: "Integración / Middleware" },
  { value: "hosting", label: "Hosting / Inferencia gestionada" },
  { value: "auditoria", label: "Auditoría / Conformidad" },
  { value: "formacion", label: "Formación / AI Literacy" },
  { value: "legales", label: "Legales / Compliance" },
]

const specificQuestions = {
  consultoria: [
    { key: "scope", question: "¿Existe acta de alcance y límites de uso definidos?", weight: 2 },
    { key: "ethics", question: "¿Hay evaluación ética preliminar documentada?", weight: 3 },
    { key: "traceability", question: "¿Se estableció plan de trazabilidad y ownership del sistema?", weight: 2 },
  ],
  datos: [
    { key: "licenses", question: "¿Licencias y procedencia verificadas?", weight: 3 },
    { key: "bias", question: "¿Evaluación de sesgos y representatividad de datos realizada?", weight: 3 },
    { key: "reuse", question: "¿Existe cláusula contractual de no reuso no autorizado?", weight: 2 },
  ],
  etiquetado: [
    { key: "dpa", question: "¿DPA firmado y anonimización/pseudonimización aplicada?", weight: 3 },
    { key: "quality", question: "¿Controles de calidad de anotación (métricas, muestreo)?", weight: 2 },
    { key: "subprocessors", question: "¿Lista de subencargados y derecho de auditoría?", weight: 2 },
  ],
  sinteticos: [
    { key: "reidentification", question: "¿Técnicas contra reidentificación documentadas?", weight: 3 },
    { key: "bias_test", question: "¿Pruebas de sesgo entre real vs. sintético realizadas?", weight: 2 },
    { key: "usage_limits", question: "¿Declaración de límites de uso entregada?", weight: 2 },
  ],
  llm: [
    {
      key: "no_training",
      question: "¿Cláusula de no-entrenamiento con datos del cliente (opt-in/opt-out)?",
      weight: 3,
    },
    { key: "isolation", question: "¿Aislamiento lógico de sesiones/tenants garantizado?", weight: 3 },
    { key: "security", question: "¿Compromisos de seguridad frente a prompt injection/jailbreak?", weight: 3 },
  ],
  finetuning: [
    { key: "ownership", question: "¿Titularidad de los pesos ajustados definida?", weight: 2 },
    { key: "pipeline", question: "¿Pipeline de entrenamiento seguro y reproducible?", weight: 2 },
    { key: "retention", question: "¿Retención y borrado de datasets post-proyecto?", weight: 3 },
  ],
  frameworks: [
    { key: "versioning", question: "¿Control de versiones de modelos/datasets?", weight: 2 },
    { key: "sbom", question: "¿Lista SBOM y revisión de licencias OSS?", weight: 2 },
    { key: "reproducibility", question: "¿Reproducibilidad documentada (semillas, ambientes)?", weight: 1 },
  ],
  compute: [
    { key: "residency", question: "¿Residencia y transferencias internacionales definidas?", weight: 3 },
    { key: "encryption", question: "¿Cifrado en tránsito/reposo e IAM robusto?", weight: 3 },
    { key: "exit_plan", question: "¿Plan de salida y portabilidad establecido?", weight: 2 },
  ],
  mlops: [
    { key: "change_control", question: "¿Controles de cambio y aprobación (gates)?", weight: 2 },
    { key: "logging", question: "¿Logging/auditabilidad end-to-end?", weight: 2 },
    { key: "rollback", question: "¿Plan de rollback/versionado definido?", weight: 3 },
  ],
  vectordb: [
    { key: "injection_protection", question: "¿Protección contra inyección en retrieval?", weight: 3 },
    { key: "version_control", question: "¿Control de versiones y expiración de índices?", weight: 2 },
    { key: "selective_deletion", question: "¿Borrado selectivo/olvido de datos implementado?", weight: 3 },
  ],
  observabilidad: [
    { key: "kpis", question: "¿KPIs definidos (drift, latencia, error)?", weight: 2 },
    { key: "alerts", question: "¿Alertas y esquema de on-call documentados?", weight: 2 },
    { key: "reports", question: "¿Reportes periódicos al comité de IA?", weight: 1 },
  ],
  explainability: [
    { key: "xai_techniques", question: "¿Técnicas XAI adecuadas al público objetivo?", weight: 2 },
    { key: "bias_tests", question: "¿Pruebas de sesgo por subpoblación realizadas?", weight: 3 },
    { key: "ux_validation", question: "¿Validación UX de explicaciones?", weight: 1 },
  ],
  seguridad: [
    { key: "adversarial_tests", question: "¿Pruebas adversariales periódicas realizadas?", weight: 3 },
    { key: "vector_coverage", question: "¿Cobertura de vectores (prompt injection, exfiltración)?", weight: 3 },
    { key: "remediation", question: "¿Evidencias de remediación y SLAs definidos?", weight: 2 },
  ],
  privacidad: [
    { key: "reidentification_risk", question: "¿Evaluación de riesgo de reidentificación realizada?", weight: 3 },
    {
      key: "privacy_params",
      question: "¿Pruebas y parámetros de privacidad diferencial o federated learning documentados?",
      weight: 3,
    },
    { key: "dpo_validation", question: "¿Validación por DPO/Privacy Officer?", weight: 2 },
  ],
  moderacion: [
    { key: "taxonomy", question: "¿Taxonomía y umbrales de moderación aprobados?", weight: 2 },
    { key: "local_tests", question: "¿Pruebas con datos locales/culturales realizadas?", weight: 2 },
    { key: "appeal_process", question: "¿Proceso de apelación para usuarios establecido?", weight: 1 },
  ],
  biometricos: [
    { key: "precision_metrics", question: "¿Métricas de precisión por subpoblación disponibles?", weight: 3 },
    { key: "usage_limits", question: "¿Límites de uso y retención biométrica definidos?", weight: 3 },
    { key: "human_rights", question: "¿Evaluación de impacto en derechos humanos realizada?", weight: 3 },
  ],
  integracion: [
    { key: "secure_integration", question: "¿Pruebas de integración seguras documentadas?", weight: 2 },
    { key: "end_to_end", question: "¿Trazabilidad end-to-end (logs correlados)?", weight: 2 },
    { key: "least_privilege", question: "¿Principio de mínimo privilegio aplicado?", weight: 2 },
  ],
  hosting: [
    { key: "sla_slo", question: "¿SLA y SLO acordados con el cliente?", weight: 2 },
    { key: "hardening", question: "¿Endurecimiento de runtime e imágenes aplicado?", weight: 2 },
    { key: "cost_controls", question: "¿Controles de coste y escala definidos?", weight: 1 },
  ],
  auditoria: [
    { key: "independence", question: "¿Independencia y alcance definidos en auditoría?", weight: 3 },
    { key: "methodology", question: "¿Metodología validada y transparente?", weight: 2 },
    { key: "corrective_plan", question: "¿Plan de acciones correctivas establecido?", weight: 2 },
  ],
  formacion: [
    { key: "training_map", question: "¿Mapa de formación por rol definido?", weight: 2 },
    { key: "attendance", question: "¿Registro de asistencia y evaluación de capacitaciones?", weight: 1 },
    { key: "annual_update", question: "¿Actualización anual de contenidos realizada?", weight: 1 },
  ],
  legales: [
    {
      key: "ai_clauses",
      question: "¿Cláusulas IA incluidas en contratos (explicabilidad, auditoría, uso permitido)?",
      weight: 3,
    },
    { key: "dpa_transfers", question: "¿DPA y transferencias internacionales documentadas?", weight: 3 },
    { key: "dpia_closed", question: "¿DPIA/EIPD cerrada antes de go-live?", weight: 3 },
  ],
}

const transversalQuestions = [
  // C. Preguntas transversales para todos los proveedores
  {
    key: "technical_documentation_complete",
    question: "¿El proveedor entrega documentación técnica completa del sistema?",
    weight: 2,
    section: "C",
    options: ["si", "parcial", "no"],
  },
  {
    key: "explainability_mechanisms",
    question: "¿Existen mecanismos de explicabilidad disponibles?",
    weight: 2,
    section: "C",
    options: ["si", "parcial", "no"],
  },
  {
    key: "bias_quality_evaluations",
    question: "¿Evaluaciones de sesgo y métricas de calidad disponibles?",
    weight: 2,
    section: "C",
    options: ["si", "parcial", "no"],
  },
  {
    key: "data_retention_policies",
    question: "¿Políticas de retención y borrado de datos definidas?",
    weight: 2,
    section: "C",
    options: ["si", "parcial", "no"],
  },
  {
    key: "security_controls",
    question: "¿Controles de seguridad implementados (cifrado, accesos, registros)?",
    weight: 2,
    section: "C",
    options: ["si", "parcial", "no"],
  },
  {
    key: "audit_rights",
    question: "¿Derechos de auditoría incluidos en contrato?",
    weight: 2,
    section: "C",
    options: ["si", "parcial", "no"],
  },
  {
    key: "subprocessors_list",
    question: "¿Lista de subprocesadores/subproveedores declarada y actualizada?",
    weight: 2,
    section: "C",
    options: ["si", "parcial", "no"],
  },

  {
    key: "system_classification",
    question: "¿Cómo clasifica el proveedor el sistema de IA?",
    weight: 3,
    section: "D",
    options: ["alto_riesgo", "riesgo_limitado", "minimo_riesgo", "no_clasificado"],
    subQuestion: {
      condition: "alto_riesgo",
      question: "¿En qué anexo del AI Act se basa?",
      options: ["anexo_ii", "anexo_iii", "anexo_iv", "otro"],
    },
  },
  {
    key: "intended_use",
    question: "¿El uso previsto está claramente documentado?",
    weight: 2,
    section: "D",
    options: ["si_completo", "parcial", "no"],
    subQuestion: {
      condition: "si_completo",
      question: "¿Incluye limitaciones y contraindicaciones?",
      options: ["si", "parcial", "no"],
    },
  },
  {
    key: "deployment_context",
    question: "¿Se especifica el contexto de despliegue?",
    weight: 2,
    section: "D",
    options: ["si_detallado", "basico", "no"],
  },

  {
    key: "technical_documentation",
    question: "¿El proveedor entrega documentación técnica?",
    weight: 2,
    section: "E",
    options: ["si_completa", "parcial", "no", "proceso"],
    subQuestion: {
      condition: "si_completa",
      question: "¿Qué tipo de documentación?",
      options: ["arquitectura", "manual_usuario", "guia_limitaciones", "model_card", "otro"],
    },
  },
  {
    key: "quality_system",
    question: "¿Cuenta con un sistema de gestión de calidad?",
    weight: 2,
    section: "E",
    options: ["si_certificado", "si_interno", "parcial", "no"],
    subQuestion: {
      condition: "si_certificado",
      question: "¿Cuál?",
      options: ["iso_9001", "iso_27001", "iso_27701", "otro"],
    },
  },

  {
    key: "transparency_measures",
    question: "¿Qué medidas de transparencia implementa?",
    weight: 2,
    section: "F",
    options: ["completas", "basicas", "minimas", "ninguna"],
    subQuestion: {
      condition: "completas",
      question: "¿Incluye explicaciones automatizadas?",
      options: ["si", "parcial", "no"],
    },
  },
  {
    key: "user_rights",
    question: "¿Se facilita el ejercicio de derechos de usuarios?",
    weight: 2,
    section: "F",
    options: ["si_automatizado", "si_manual", "limitado", "no"],
  },

  {
    key: "data_minimization",
    question: "¿Se aplican principios de minimización de datos?",
    weight: 3,
    section: "G",
    options: ["si_estricto", "si_basico", "parcial", "no"],
  },
  {
    key: "consent_management",
    question: "¿Cómo gestiona el consentimiento?",
    weight: 2,
    section: "G",
    options: ["granular", "basico", "implicito", "no_aplica"],
    subQuestion: {
      condition: "granular",
      question: "¿Permite revocación fácil?",
      options: ["si", "complejo", "no"],
    },
  },
  {
    key: "data_subject_rights",
    question: "¿Facilita derechos de interesados?",
    weight: 2,
    section: "G",
    options: ["automatizado", "semi_automatizado", "manual", "no"],
  },
  {
    key: "cross_border_transfers",
    question: "¿Realiza transferencias internacionales?",
    weight: 2,
    section: "G",
    options: ["no", "si_adecuacion", "si_salvaguardas", "si_sin_proteccion"],
    subQuestion: {
      condition: "si_salvaguardas",
      question: "¿Qué salvaguardas utiliza?",
      options: ["scc", "bcr", "certificacion", "otro"],
    },
  },

  {
    key: "security_measures",
    question: "¿Qué medidas de seguridad implementa?",
    weight: 3,
    section: "H",
    options: ["avanzadas", "estandar", "basicas", "minimas"],
    subQuestion: {
      condition: "avanzadas",
      question: "¿Incluye cifrado end-to-end?",
      options: ["si", "parcial", "no"],
    },
  },
  {
    key: "incident_response",
    question: "¿Cuenta con plan de respuesta a incidentes?",
    weight: 2,
    section: "H",
    options: ["si_probado", "si_documentado", "basico", "no"],
  },
  {
    key: "business_continuity",
    question: "¿Tiene plan de continuidad de negocio?",
    weight: 2,
    section: "H",
    options: ["si_probado", "si_documentado", "basico", "no"],
  },
  {
    key: "vulnerability_management",
    question: "¿Gestiona vulnerabilidades proactivamente?",
    weight: 2,
    section: "H",
    options: ["si_automatizado", "si_periodico", "reactivo", "no"],
  },

  {
    key: "bias_testing",
    question: "¿Realiza pruebas de sesgo regularmente?",
    weight: 3,
    section: "I",
    options: ["si_continuo", "si_periodico", "inicial", "no"],
    subQuestion: {
      condition: "si_continuo",
      question: "¿Qué métricas utiliza?",
      options: ["fairness", "equalized_odds", "demographic_parity", "otro"],
    },
  },
  {
    key: "performance_monitoring",
    question: "¿Monitorea el rendimiento en producción?",
    weight: 2,
    section: "I",
    options: ["tiempo_real", "periodico", "manual", "no"],
  },
  {
    key: "model_drift",
    question: "¿Detecta y corrige deriva del modelo?",
    weight: 2,
    section: "I",
    options: ["automatico", "semi_automatico", "manual", "no"],
  },

  {
    key: "contract_clauses",
    question: "¿El contrato incluye cláusulas específicas de IA?",
    weight: 2,
    section: "J",
    options: ["si_completas", "si_basicas", "genericas", "no"],
    subQuestion: {
      condition: "si_completas",
      question: "¿Incluye responsabilidades por decisiones automatizadas?",
      options: ["si", "parcial", "no"],
    },
  },
  {
    key: "liability_allocation",
    question: "¿Está clara la asignación de responsabilidades?",
    weight: 3,
    section: "J",
    options: ["si_detallada", "si_basica", "ambigua", "no"],
  },
  {
    key: "supply_chain_visibility",
    question: "¿Proporciona visibilidad de la cadena de suministro?",
    weight: 2,
    section: "J",
    options: ["completa", "parcial", "limitada", "no"],
  },
  {
    key: "third_party_dependencies",
    question: "¿Declara dependencias de terceros?",
    weight: 2,
    section: "J",
    options: ["si_completa", "si_parcial", "limitada", "no"],
  },

  {
    key: "monitoring_reporting",
    question: "¿Proporciona capacidades de monitoreo y reporte?",
    weight: 2,
    section: "K",
    options: ["avanzadas", "estandar", "basicas", "no"],
    subQuestion: {
      condition: "avanzadas",
      question: "¿Incluye dashboards en tiempo real?",
      options: ["si", "parcial", "no"],
    },
  },
]

export default function SupplierRiskAssessment() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const t = translations[language]

  const [activeCard, setActiveCard] = useState<"register" | "view">("register")
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [assessments, setAssessments] = useState<SupplierAssessment[]>([])

  const [formData, setFormData] = useState<Partial<SupplierAssessment>>({
    supplierName: "",
    country: "",
    thirdPartyType: "",
    developerType: "",
    role: "",
    serviceDescription: "",
    contactPerson: "",
    isHighRisk: "",
    autonomyLevel: "",
    sector: "",
    sectorSpecific: "",
    documentation: "",
    qualitySystem: "",
    instructions: "",
    explainability: "",
    privacyImpact: "",
    legalBasis: "",
    dataLocation: "",
    retentionPolicies: "",
    securityCertifications: "",
    securityControls: "",
    incidentManagement: "",
    biasEvaluation: "",
    dataGovernance: "",
    contract: "",
    subprocessors: "",
    slaVersioning: "",
    reportingFrequency: "",
    specificQuestions: {},
    transversalQuestions: {},
    documents: {},
  })

  useEffect(() => {
    loadAssessments()
  }, [])

  const loadAssessments = () => {
    const saved = localStorage.getItem("supplierAssessments")
    if (saved) {
      setAssessments(JSON.parse(saved))
    }
  }

  const saveAssessments = (newAssessments: SupplierAssessment[]) => {
    localStorage.setItem("supplierAssessments", JSON.stringify(newAssessments))
    setAssessments(newAssessments)
  }

  const calculateScore = (assessment: Partial<SupplierAssessment>) => {
    let totalScore = 0
    let maxScore = 0

    // Preguntas específicas por tipología
    if (assessment.role && specificQuestions[assessment.role as keyof typeof specificQuestions]) {
      const questions = specificQuestions[assessment.role as keyof typeof specificQuestions]
      questions.forEach((q) => {
        const answer = assessment.specificQuestions?.[q.key] || ""
        const points = answer === "si" ? 0 : answer === "parcial" ? 1 : 2
        totalScore += points * q.weight
        maxScore += 2 * q.weight
      })
    }

    // Preguntas transversales
    transversalQuestions.forEach((q) => {
      const answer = assessment.transversalQuestions?.[q.key] || ""
      const points = answer === "si" ? 0 : answer === "parcial" ? 1 : 2
      totalScore += points * q.weight
      maxScore += 2 * q.weight
    })

    return Math.round((totalScore / maxScore) * 100)
  }

  const getRiskLevel = (score: number) => {
    if (score <= 30) return { level: "Bajo", color: "bg-green-500", textColor: "text-green-700" }
    if (score <= 60) return { level: "Medio", color: "bg-yellow-500", textColor: "text-yellow-700" }
    return { level: "Alto", color: "bg-red-500", textColor: "text-red-700" }
  }

  const validateForm = () => {
    const required = ["supplierName", "country", "thirdPartyType", "serviceDescription", "contactPerson"]
    const missing = required.filter((field) => !formData[field as keyof typeof formData])

    if (missing.length > 0) {
      toast({
        title: "Campos requeridos",
        description: `Por favor complete: ${missing.join(", ")}`,
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const score = calculateScore(formData)
    const riskLevel = getRiskLevel(score)

    const assessment: SupplierAssessment = {
      id: editingId || Date.now().toString(),
      ...(formData as SupplierAssessment),
      score,
      riskLevel: riskLevel.level,
      createdAt: editingId
        ? assessments.find((a) => a.id === editingId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    let newAssessments
    if (editingId) {
      newAssessments = assessments.map((a) => (a.id === editingId ? assessment : a))
      toast({ title: "Evaluación actualizada", description: "La evaluación se ha actualizado correctamente." })
    } else {
      newAssessments = [...assessments, assessment]
      toast({ title: "Evaluación guardada", description: "La evaluación se ha guardado correctamente." })
    }

    saveAssessments(newAssessments)
    resetForm()
    setActiveCard("view")
  }

  const resetForm = () => {
    setFormData({
      supplierName: "",
      country: "",
      thirdPartyType: "",
      developerType: "",
      role: "",
      serviceDescription: "",
      contactPerson: "",
      isHighRisk: "",
      autonomyLevel: "",
      sector: "",
      sectorSpecific: "",
      documentation: "",
      qualitySystem: "",
      instructions: "",
      explainability: "",
      privacyImpact: "",
      legalBasis: "",
      dataLocation: "",
      retentionPolicies: "",
      securityCertifications: "",
      securityControls: "",
      incidentManagement: "",
      biasEvaluation: "",
      dataGovernance: "",
      contract: "",
      subprocessors: "",
      slaVersioning: "",
      reportingFrequency: "",
      specificQuestions: {},
      transversalQuestions: {},
      documents: {},
    })
    setIsEditing(false)
    setEditingId(null)
  }

  const handleEdit = (assessment: SupplierAssessment) => {
    setFormData(assessment)
    setIsEditing(true)
    setEditingId(assessment.id)
    setActiveCard("register")
  }

  const handleDelete = (id: string) => {
    const newAssessments = assessments.filter((a) => a.id !== id)
    saveAssessments(newAssessments)
    toast({ title: "Evaluación eliminada", description: "La evaluación se ha eliminado correctamente." })
  }

  const generatePDFReport = (assessment: SupplierAssessment) => {
    const doc = new jsPDF()
    const pageHeight = doc.internal.pageSize.height
    let yPosition = 20

    // Encabezado
    doc.setFillColor(27, 182, 126)
    doc.rect(0, 0, 210, 25, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.text("Reporte de Evaluación de Riesgos de Proveedores", 20, 15)

    yPosition = 35
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)

    // Información básica
    doc.setFontSize(14)
    doc.text("Información del Tercero", 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.text(`Proveedor: ${assessment.supplierName}`, 20, yPosition)
    yPosition += 5
    doc.text(`País: ${assessment.country}`, 20, yPosition)
    yPosition += 5
    doc.text(`Tipo de Tercero: ${assessment.thirdPartyType}`, 20, yPosition)
    yPosition += 5
    if (assessment.thirdPartyType === "desarrollador") {
      doc.text(`Tipo de Desarrollador: ${assessment.developerType}`, 20, yPosition)
      yPosition += 5
    } else {
      doc.text(
        `Rol: ${supplierTypes.find((t) => t.value === assessment.role)?.label || assessment.role}`,
        20,
        yPosition,
      )
      yPosition += 5
    }
    doc.text(`Servicio: ${assessment.serviceDescription}`, 20, yPosition)
    yPosition += 10

    // Puntuación y nivel de riesgo
    doc.setFontSize(14)
    doc.text("Evaluación de Riesgo", 20, yPosition)
    yPosition += 10

    const riskLevel = getRiskLevel(assessment.score)
    doc.setFontSize(12)
    doc.text(`Puntuación: ${assessment.score}/100`, 20, yPosition)
    yPosition += 5
    doc.text(`Nivel de Riesgo: ${riskLevel.level}`, 20, yPosition)
    yPosition += 10

    // Preguntas específicas
    if (assessment.role && specificQuestions[assessment.role as keyof typeof specificQuestions]) {
      doc.setFontSize(14)
      doc.text("Evaluación Específica por Tipología", 20, yPosition)
      yPosition += 10

      const questions = specificQuestions[assessment.role as keyof typeof specificQuestions]
      questions.forEach((q) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = 20
        }

        const answer = assessment.specificQuestions[q.key]
        const status = answer === "si" ? "✓" : answer === "parcial" ? "◐" : "✗"

        doc.setFontSize(10)
        doc.text(`${status} ${q.question}`, 20, yPosition)
        yPosition += 5
      })
      yPosition += 5
    }

    // Preguntas transversales
    doc.setFontSize(14)
    doc.text("Evaluación Transversal", 20, yPosition)
    yPosition += 10

    transversalQuestions.forEach((q) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage()
        yPosition = 20
      }

      const answer = assessment.transversalQuestions[q.key]
      const status = answer === "si" ? "✓" : answer === "parcial" ? "◐" : "✗"

      doc.setFontSize(10)
      doc.text(`${status} ${q.question}`, 20, yPosition)
      yPosition += 5
    })

    // Recomendaciones
    yPosition += 10
    doc.setFontSize(14)
    doc.text("Recomendaciones", 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    if (riskLevel.level === "Alto") {
      doc.text("• Requiere remediación antes de contratación", 20, yPosition)
      yPosition += 5
      doc.text("• Implementar controles adicionales de seguridad", 20, yPosition)
      yPosition += 5
      doc.text("• Auditoría externa recomendada", 20, yPosition)
    } else if (riskLevel.level === "Medio") {
      doc.text("• Monitoreo continuo requerido", 20, yPosition)
      yPosition += 5
      doc.text("• Revisión trimestral de controles", 20, yPosition)
    } else {
      doc.text("• Proveedor aprobado para contratación", 20, yPosition)
      yPosition += 5
      doc.text("• Revisión anual recomendada", 20, yPosition)
    }

    // Pie de página
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.text(`Página ${i} de ${pageCount}`, 180, pageHeight - 10)
      doc.text(`Generado: ${new Date().toLocaleDateString()}`, 20, pageHeight - 10)
    }

    doc.save(`evaluacion-proveedor-${assessment.supplierName.replace(/\s+/g, "-")}.pdf`)
  }

  const handleFileUpload = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setFormData((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            [field]: base64,
          },
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadDocument = (field: string, fileName: string) => {
    const base64 = formData.documents?.[field]
    if (base64) {
      const link = document.createElement("a")
      link.href = base64
      link.download = fileName
      link.click()
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Evaluación de Riesgos de Proveedores</h1>
          <p className="text-gray-600 mt-2">Evalúa y gestiona los riesgos asociados con proveedores de IA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card de Registro */}
        <Card
          className={`cursor-pointer transition-all duration-200 ${activeCard === "register" ? "ring-2 ring-[#1bb67e] shadow-lg" : "hover:shadow-md"}`}
          onClick={() => setActiveCard("register")}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-[#1bb67e] rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">{isEditing ? "Editar Evaluación" : "Nueva Evaluación"}</CardTitle>
            <CardDescription>
              {isEditing ? "Modifica la evaluación existente" : "Registra una nueva evaluación de proveedor de IA"}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Card de Visualización */}
        <Card
          className={`cursor-pointer transition-all duration-200 ${activeCard === "view" ? "ring-2 ring-[#1bb67e] shadow-lg" : "hover:shadow-md"}`}
          onClick={() => setActiveCard("view")}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-[#1bb67e] rounded-full flex items-center justify-center mb-4">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">Evaluaciones Registradas</CardTitle>
            <CardDescription>Visualiza, edita y gestiona las evaluaciones guardadas</CardDescription>
            <div className="flex justify-center gap-4 mt-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {assessments.length} evaluaciones
              </span>
              <span className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Reportes PDF
              </span>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Contenido del formulario */}
      {activeCard === "register" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#1bb67e]" />
              {isEditing ? "Editar Evaluación de Proveedor" : "Nueva Evaluación de Proveedor"}
            </CardTitle>
            <CardDescription>Complete la información del proveedor para evaluar los riesgos asociados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sección A: Identificación del tercero */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">A. Identificación del tercero</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplierName">Nombre legal del proveedor *</Label>
                  <Input
                    id="supplierName"
                    value={formData.supplierName || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, supplierName: e.target.value }))}
                    placeholder="Nombre completo del proveedor"
                  />
                </div>

                <div>
                  <Label htmlFor="country">País de establecimiento *</Label>
                  <Input
                    id="country"
                    value={formData.country || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                    placeholder="País donde está establecido"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="thirdPartyType">Tipo de tercero *</Label>
                <Select
                  value={formData.thirdPartyType || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      thirdPartyType: value,
                      developerType: "",
                      role: "",
                      specificQuestions: {},
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de tercero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desarrollador">Desarrollador</SelectItem>
                    <SelectItem value="proveedor">Proveedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.thirdPartyType === "desarrollador" && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label htmlFor="developerType">¿El desarrollador es interno, externo, mixto? *</Label>
                  <Select
                    value={formData.developerType || ""}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, developerType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo de desarrollador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interno">Interno</SelectItem>
                      <SelectItem value="externo">Externo</SelectItem>
                      <SelectItem value="mixto">Mixto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.thirdPartyType === "proveedor" && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label htmlFor="role">Categoría de proveedor *</Label>
                  <Select
                    value={formData.role || ""}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value, specificQuestions: {} }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione la categoría del proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {supplierTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="otro">Otro (especifique)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="serviceDescription">Descripción del servicio/solución de IA *</Label>
                <Textarea
                  id="serviceDescription"
                  value={formData.serviceDescription || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, serviceDescription: e.target.value }))}
                  placeholder="Describa detalladamente el servicio o solución de IA proporcionada"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="contactPerson">Persona de contacto responsable *</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
                  placeholder="Nombre, cargo y email del responsable"
                />
              </div>
            </div>

            {/* Preguntas específicas por tipología */}
            {formData.thirdPartyType === "proveedor" &&
              formData.role &&
              specificQuestions[formData.role as keyof typeof specificQuestions] && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    B. Preguntas específicas - {supplierTypes.find((t) => t.value === formData.role)?.label}
                  </h3>

                  {specificQuestions[formData.role as keyof typeof specificQuestions].map((question, index) => (
                    <div key={question.key} className="space-y-2">
                      <Label className="flex items-center gap-2">
                        {question.question}
                        <Badge variant="outline" className="text-xs">
                          Peso: {question.weight}
                        </Badge>
                      </Label>
                      <Select
                        value={formData.specificQuestions?.[question.key] || ""}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            specificQuestions: {
                              ...prev.specificQuestions,
                              [question.key]: value,
                            },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una respuesta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="parcial">Parcial</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              )}

            {/* Preguntas transversales */}
            {formData.thirdPartyType && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  {formData.thirdPartyType === "desarrollador" ? "B" : "C"}. Preguntas transversales para todos los{" "}
                  {formData.thirdPartyType === "desarrollador" ? "desarrolladores" : "proveedores"}
                </h3>

                {["B", "C", "D", "E", "F", "G", "H", "I"].map((sectionLetter) => {
                  const sectionQuestions = transversalQuestions.filter((q) => q.section === sectionLetter)
                  if (sectionQuestions.length === 0) return null

                  const sectionTitles = {
                    B: "Clasificación y uso del sistema",
                    C: "Conformidad y documentación",
                    D: "Transparencia y derechos",
                    E: "Privacidad y gobernanza de datos",
                    F: "Seguridad y resiliencia",
                    G: "Calidad y sesgo",
                    H: "Contratos y cadena de suministro",
                    I: "Supervisión y reportes",
                  }

                  return (
                    <div key={sectionLetter} className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900">
                        {sectionLetter}. {sectionTitles[sectionLetter as keyof typeof sectionTitles]}
                      </h4>

                      {sectionQuestions.map((question) => (
                        <div key={question.key} className="space-y-3">
                          <Label className="flex items-center gap-2">
                            {question.question}
                            <Badge variant="outline" className="text-xs">
                              Peso: {question.weight}
                            </Badge>
                          </Label>
                          <Select
                            value={formData.transversalQuestions?.[question.key] || ""}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                transversalQuestions: {
                                  ...prev.transversalQuestions,
                                  [question.key]: value,
                                },
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una respuesta" />
                            </SelectTrigger>
                            <SelectContent>
                              {question.options.map((option) => {
                                const optionLabels: { [key: string]: string } = {
                                  si: "Sí",
                                  no: "No",
                                  parcial: "Parcial",
                                  evaluacion: "En evaluación",
                                  si_completa: "Sí, completa",
                                  proceso: "En proceso",
                                  si_certificado: "Sí certificado",
                                  si_interno: "Sí interno",
                                  asistido: "Asistido",
                                  pleno: "Pleno",
                                  atencion_cliente: "Atención al cliente",
                                  rrhh: "RRHH",
                                  marketing: "Marketing",
                                  finanzas: "Finanzas",
                                  seguridad: "Seguridad",
                                  salud: "Salud",
                                  legal: "Legal/Compliance",
                                  operaciones: "Operaciones",
                                  sector_publico: "Sector público",
                                  datos_sensibles: "Procesa datos sensibles",
                                  decisiones_criticas: "Sustituye decisiones humanas críticas",
                                  impacto_legal: "Impacto legal/reputacional",
                                  otro: "Otro",
                                  arquitectura: "Arquitectura",
                                  manual_usuario: "Manual de usuario",
                                  guia_limitaciones: "Guía de limitaciones",
                                  model_card: "Model card/dataset card",
                                  iso_9001: "ISO 9001",
                                  iso_27001: "ISO 27001",
                                  iso_27701: "ISO 27701",
                                  explicaciones_locales: "Explicaciones locales por decisión",
                                  explicaciones_globales: "Explicaciones globales del modelo",
                                  visualizaciones: "Visualizaciones",
                                  no_requiere: "No requiere",
                                  interna: "Interna",
                                  externa: "Externa",
                                  mixta: "Mixta",
                                  contrato: "Contrato",
                                  consentimiento: "Consentimiento",
                                  interes_legitimo: "Interés legítimo",
                                  otra: "Otra",
                                  no_aplica: "No aplica",
                                  local_nacional: "Local/nacional",
                                  regional: "Regional",
                                  multipais: "Multipaís",
                                  ue_eee: "UE/EEE",
                                  eeuu: "EE.UU.",
                                  latam: "LatAm",
                                  apac: "APAC",
                                  definidas_auditables: "Definidas y auditables",
                                  parciales: "Parciales",
                                  vagas: "Vagas",
                                  no_definidas: "No definidas",
                                  soc_2: "SOC 2",
                                  ninguna: "Ninguna",
                                  cifrado: "Cifrado",
                                  control_acceso: "Control de acceso",
                                  registro_auditoria: "Registro/auditoría",
                                  segregacion: "Segregación de entornos",
                                  reposo: "En reposo",
                                  transito: "En tránsito",
                                  ambos: "Ambos",
                                  formal_probada: "Formal y probada",
                                  formal: "Formal",
                                  borrador: "Borrador",
                                  mensual: "Mensual",
                                  trimestral: "Trimestral",
                                  anual: "Anual",
                                  si_metricas: "Sí con métricas",
                                  basicas: "Básicas",
                                  minimas: "Mínimas",
                                  precision_recall: "Precision/recall",
                                  f1_score: "F1-score",
                                  equal_opportunity: "Equal opportunity",
                                  completa: "Completa",
                                  negociacion: "En negociación",
                                  auditoria: "Auditoría",
                                  subprocesadores: "Subprocesadores",
                                  sla: "SLA",
                                  portabilidad: "Portabilidad/reversibilidad",
                                  semestral: "Semestral",
                                  ad_hoc: "Ad hoc",
                                  proveedor: "Proveedor",
                                  cliente: "Cliente",
                                  diagnostico: "Diagnóstico",
                                  apoyo_clinico: "Apoyo clínico",
                                  administracion: "Administración hospitalaria",
                                  reclutamiento: "Reclutamiento",
                                  evaluacion: "Evaluación de desempeño",
                                  nomina: "Gestión de nómina",
                                }
                                return (
                                  <SelectItem key={option} value={option}>
                                    {optionLabels[option] || option}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>

                          {question.subQuestion &&
                            formData.transversalQuestions?.[question.key] === question.subQuestion.condition && (
                              <div className="ml-4 p-3 bg-white rounded border-l-4 border-[#1bb67e]">
                                <Label className="text-sm font-medium">{question.subQuestion.question}</Label>
                                <Select
                                  value={formData.transversalQuestions?.[`${question.key}_sub`] || ""}
                                  onValueChange={(value) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      transversalQuestions: {
                                        ...prev.transversalQuestions,
                                        [`${question.key}_sub`]: value,
                                      },
                                    }))
                                  }
                                >
                                  <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Seleccione una respuesta" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {question.subQuestion.options.map((option) => {
                                      const optionLabels: { [key: string]: string } = {
                                        si: "Sí",
                                        no: "No",
                                        parcial: "Parcial",
                                        datos_sensibles: "Procesa datos sensibles",
                                        decisiones_criticas: "Sustituye decisiones humanas críticas",
                                        impacto_legal: "Impacto legal/reputacional",
                                        otro: "Otro",
                                        arquitectura: "Arquitectura",
                                        manual_usuario: "Manual de usuario",
                                        guia_limitaciones: "Guía de limitaciones",
                                        model_card: "Model card/dataset card",
                                        iso_9001: "ISO 9001",
                                        iso_27001: "ISO 27001",
                                        iso_27701: "ISO 27701",
                                        explicaciones_locales: "Explicaciones locales por decisión",
                                        explicaciones_globales: "Explicaciones globales del modelo",
                                        visualizaciones: "Visualizaciones",
                                        interna: "Interna",
                                        externa: "Externa",
                                        mixta: "Mixta",
                                        ue_eee: "UE/EEE",
                                        eeuu: "EE.UU.",
                                        latam: "LatAm",
                                        apac: "APAC",
                                        reposo: "En reposo",
                                        transito: "En tránsito",
                                        ambos: "Ambos",
                                        mensual: "Mensual",
                                        trimestral: "Trimestral",
                                        anual: "Anual",
                                        precision_recall: "Precision/recall",
                                        f1_score: "F1-score",
                                        equal_opportunity: "Equal opportunity",
                                        auditoria: "Auditoría",
                                        subprocesadores: "Subprocesadores",
                                        sla: "SLA",
                                        portabilidad: "Portabilidad/reversibilidad",
                                        proveedor: "Proveedor",
                                        cliente: "Cliente",
                                        diagnostico: "Diagnóstico",
                                        apoyo_clinico: "Apoyo clínico",
                                        administracion: "Administración hospitalaria",
                                        reclutamiento: "Reclutamiento",
                                        evaluacion: "Evaluación de desempeño",
                                        nomina: "Gestión de nómina",
                                      }
                                      return (
                                        <SelectItem key={option} value={option}>
                                          {optionLabels[option] || option}
                                        </SelectItem>
                                      )
                                    })}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                          {question.subQuestions &&
                            formData.transversalQuestions?.[question.key] &&
                            question.subQuestions[formData.transversalQuestions[question.key]] && (
                              <div className="ml-4 p-3 bg-white rounded border-l-4 border-[#1bb67e]">
                                <Label className="text-sm font-medium">
                                  {question.subQuestions[formData.transversalQuestions[question.key]].question}
                                </Label>
                                <Select
                                  value={formData.transversalQuestions?.[`${question.key}_sub`] || ""}
                                  onChange={(value) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      transversalQuestions: {
                                        ...prev.transversalQuestions,
                                        [`${question.key}_sub`]: value,
                                      },
                                    }))
                                  }
                                >
                                  <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Seleccione una respuesta" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {question.subQuestions[formData.transversalQuestions[question.key]].options.map(
                                      (option) => {
                                        const optionLabels: { [key: string]: string } = {
                                          diagnostico: "Diagnóstico",
                                          apoyo_clinico: "Apoyo clínico",
                                          administracion: "Administración hospitalaria",
                                          reclutamiento: "Reclutamiento",
                                          evaluacion: "Evaluación de desempeño",
                                          nomina: "Gestión de nómina",
                                          otro: "Otro",
                                        }
                                        return (
                                          <SelectItem key={option} value={option}>
                                            {optionLabels[option] || option}
                                          </SelectItem>
                                        )
                                      },
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}

            <Separator />

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} className="bg-[#1bb67e] hover:bg-[#159f6e]">
                {isEditing ? "Actualizar Evaluación" : "Guardar Evaluación"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contenido de visualización */}
      {activeCard === "view" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#1bb67e]" />
              Evaluaciones de Proveedores Registradas
            </CardTitle>
            <CardDescription>{assessments.length} evaluaciones registradas</CardDescription>
          </CardHeader>
          <CardContent>
            {assessments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay evaluaciones registradas</p>
                <p className="text-sm">Cree una nueva evaluación para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assessments.map((assessment) => {
                  const riskLevel = getRiskLevel(assessment.score)
                  return (
                    <div key={assessment.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{assessment.supplierName}</h4>
                          <p className="text-gray-600">{assessment.country}</p>
                          <p className="text-sm text-gray-500">{assessment.thirdPartyType}</p>
                          {assessment.thirdPartyType === "desarrollador" && (
                            <p className="text-sm text-gray-500">{assessment.developerType}</p>
                          )}
                          {assessment.thirdPartyType === "proveedor" && (
                            <p className="text-sm text-gray-500">
                              {supplierTypes.find((t) => t.value === assessment.role)?.label || assessment.role}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${riskLevel.color} text-white`}>
                            {riskLevel.level} ({assessment.score}/100)
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">{assessment.serviceDescription}</p>

                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-xs text-gray-500">
                          Actualizado: {new Date(assessment.updatedAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => generatePDFReport(assessment)}>
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(assessment)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(assessment.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
