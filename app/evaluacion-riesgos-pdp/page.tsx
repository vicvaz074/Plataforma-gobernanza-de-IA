"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GeneralTabShell, type GeneralTabShellBadge, type GeneralTabShellNavItem } from "@/components/general-tab-shell"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
import { Shield, FileText, Upload, Download, Edit, Trash2, Eye } from "lucide-react"
import jsPDF from "jspdf"

interface RiskQuestion {
  section: string
  id: string
  question: string
  options: string[]
  scores: number[]
}

interface RiskAssessmentData {
  id: string
  systemName: string
  assessmentDate: string
  responses: Record<string, { value: string; score: number; other?: string }>
  documents: Record<string, { name: string; data: string }>
  totalScore: number
  normalizedScore: number
  riskLevel: string
  riskLevelNumber: number
  recommendations: string[]
  createdAt: string
}

const sectionWeights: Record<string, number> = {
  "Gobernanza y propósito": 0.15,
  Datos: 0.25,
  "Transparencia y derechos": 0.15,
  "Modelo y operaciones": 0.15,
  Seguridad: 0.12,
  Transferencias: 0.08,
  "Conservación y borrado": 0.05,
  "Contexto y escala": 0.05,
}

const riskMultipliers = {
  specialCategories: 1.25,
  minors: 1.25,
  automatedDecisions: 1.25,
  internationalTransfers: 1.1,
}

const riskQuestions: RiskQuestion[] = [
  {
    section: "Gobernanza y propósito",
    id: "G1",
    question: "¿Existe un propósito específico, explícito y legítimo para el tratamiento con IA?",
    options: ["Sí y documentado", "Sí pero no documentado", "Definido vagamente", "No"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Gobernanza y propósito",
    id: "G2",
    question: "¿Se ha identificado la base jurídica aplicable para cada finalidad del tratamiento?",
    options: ["Sí, adecuada y justificada", "Sí pero con dudas", "No claramente", "No aplica/No"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Gobernanza y propósito",
    id: "G3",
    question: "¿Se ha realizado (o actualizado) una EIPD/DPIA específica del sistema de IA?",
    options: ["Sí y aprobada", "En proceso", "No, pero está planificada", "No"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Gobernanza y propósito",
    id: "G4",
    question: "¿Existe supervisión humana significativa sobre decisiones automatizadas?",
    options: ["Sí, supervisión previa y posterior", "Solo posterior", "Mínima", "Ninguna"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Datos",
    id: "D1",
    question: "¿Los datos utilizados están minimizados respecto del propósito?",
    options: ["Sí", "Parcialmente", "No", "Se desconoce"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Datos",
    id: "D2",
    question: "¿Hay datos de categorías especiales (sensibles) o biométricos?",
    options: ["No", "Sí, excepcional y justificado", "Sí, frecuente", "Sí, masivo"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Datos",
    id: "D3",
    question: "¿Se tratan datos de menores o grupos vulnerables?",
    options: ["No", "Sí, excepcional", "Sí, frecuente", "Sí, masivo"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Datos",
    id: "D4",
    question: "¿Se realiza combinación o enriquecimiento de múltiples fuentes de datos?",
    options: ["No", "Sí, con evaluación de impacto", "Sí, sin evaluación", "Sí, a gran escala"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Datos",
    id: "D5",
    question: "¿Existen garantías sobre la calidad y exactitud de los datos de entrenamiento y prueba?",
    options: ["Altas y verificadas", "Moderadas", "Bajas", "Desconocidas"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Datos",
    id: "D6",
    question: "¿Se han evaluado y mitigado sesgos en los datasets?",
    options: ["Sí, con métricas y umbrales", "Sí, de forma básica", "Mínimo", "No"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Transparencia y derechos",
    id: "T1",
    question: "¿Se informa de forma clara y accesible el uso de IA a los interesados?",
    options: ["Sí, información completa", "Parcial", "Limitada", "No"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Transparencia y derechos",
    id: "T2",
    question: "¿Se ofrece opción de intervención humana / impugnación de decisiones automatizadas?",
    options: ["Sí, efectiva", "Sí, limitada", "Difícil", "No"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Transparencia y derechos",
    id: "T3",
    question:
      "¿Se proporcionan explicaciones significativas del funcionamiento y factores principales de las decisiones?",
    options: ["Sí, comprensibles", "Parciales", "Técnicas complejas", "No"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Transparencia y derechos",
    id: "T4",
    question: "¿Los mecanismos para ejercer derechos ARCO/ARSRP son efectivos para entornos de IA?",
    options: ["Sí", "Parcialmente", "Limitados", "No"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Modelo y operaciones",
    id: "M1",
    question: "¿El sistema realiza perfilado o decisiones que producen efectos legales o similares?",
    options: ["No", "Sí, impacto bajo", "Sí, impacto medio", "Sí, impacto alto"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Modelo y operaciones",
    id: "M2",
    question: "¿Nivel de autonomía del sistema en el ciclo de decisión?",
    options: [
      "Bajo (asistencia)",
      "Medio (recomendación)",
      "Alto (decisión con revisión)",
      "Pleno (decisión sin revisión)",
    ],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Modelo y operaciones",
    id: "M3",
    question: "¿Existe documentación técnica (datasheets/model cards) del modelo y datasets?",
    options: ["Completa", "Parcial", "Mínima", "Inexistente"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Modelo y operaciones",
    id: "M4",
    question: "¿Se realizan pruebas de robustez, seguridad y resiliencia del modelo (incl. ataques/adversarial)?",
    options: ["Sí, periódicas", "Ocasionales", "Escasas", "No"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Modelo y operaciones",
    id: "M5",
    question: "¿Se monitoriza el rendimiento y deriva del modelo en producción?",
    options: ["Sí, con métricas y alertas", "Parcial", "Manual/ad hoc", "No"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Modelo y operaciones",
    id: "M6",
    question: "¿Existe procedimiento de retirada/parada segura (kill switch) y rollbacks?",
    options: ["Sí", "Parcial", "Plan sin probar", "No"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Seguridad",
    id: "S1",
    question: "¿Controles de seguridad para datos y modelos (cifrado, control de acceso, registros)?",
    options: ["Robustos", "Adecuados", "Limitados", "Insuficientes"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Seguridad",
    id: "S2",
    question: "¿Riesgo de fugas por entrada/salida del modelo (prompt injection, extracción de datos, memorización)?",
    options: ["Bajo", "Medio con mitigaciones", "Medio sin mitigaciones", "Alto"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Seguridad",
    id: "S3",
    question: "¿Plan de respuesta a incidentes de privacidad específicos de IA?",
    options: ["Sí, probado", "Sí", "Borrador", "No"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Transferencias",
    id: "X1",
    question: "¿Existen transferencias internacionales de datos (incl. inferencias) a terceros países?",
    options: ["No", "Sí con garantías adecuadas", "Sí con dudas", "Sí sin garantías"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Transferencias",
    id: "X2",
    question: "¿Participan proveedores externos (APIs, modelos fundacionales) con acceso a datos personales?",
    options: ["No", "Sí con DPA y auditorías", "Sí con DPA básico", "Sí sin DPA/auditoría"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Conservación y borrado",
    id: "R1",
    question: "¿Plazos de conservación definidos para datos, logs y artefactos del modelo?",
    options: ["Definidos y aplicados", "Definidos parcial", "Vagos", "No"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Conservación y borrado",
    id: "R2",
    question: "¿Es viable el borrado/supresión de datos en datasets/modelos (re-entrenamiento, unlearning)?",
    options: ["Sí, probado", "Parcial", "Complejo", "No"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Contexto y escala",
    id: "C1",
    question: "¿Escala del tratamiento (volumen de interesados, frecuencia, duración)?",
    options: ["Baja", "Media", "Alta", "Muy alta"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Contexto y escala",
    id: "C2",
    question: "¿Entorno sensible (salud, finanzas, empleo, sector público, seguridad)?",
    options: ["No", "Sí con mitigaciones", "Sí con mitigaciones parciales", "Sí sin mitigaciones"],
    scores: [0, 1, 2, 3],
  },
  {
    section: "Contexto y escala",
    id: "C3",
    question: "¿Existe posibilidad de efectos indirectos o uso secundario no previsto (function creep)?",
    options: ["Baja", "Media", "Alta", "Muy alta"],
    scores: [0, 1, 2, 3],
  },
]

export default function EvaluacionRiesgosPDP() {
  const { language } = useLanguage()
  const t = translations[language]
  const { toast } = useToast()

  const [activeCard, setActiveCard] = useState<"register" | "view">("register")
  const [questions] = useState<RiskQuestion[]>(riskQuestions) // Usando datos directos en lugar de cargar CSV
  const [loading] = useState(false) // No hay carga ya que los datos están embebidos
  const [formData, setFormData] = useState<any>({})
  const [documents, setDocuments] = useState<Record<string, File>>({})
  const [savedAssessments, setSavedAssessments] = useState<RiskAssessmentData[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadSavedAssessments()
  }, [])

  const loadSavedAssessments = () => {
    const saved = localStorage.getItem("riskAssessments")
    if (saved) {
      setSavedAssessments(JSON.parse(saved))
    }
  }

  const calculateRiskScore = (responses: Record<string, { value: string; score: number }>) => {
    // 1. Calcular puntuación por sección
    const sectionScores: Record<string, number> = {}
    const sectionMaxScores: Record<string, number> = {}

    questions.forEach((q) => {
      if (!sectionScores[q.section]) {
        sectionScores[q.section] = 0
        sectionMaxScores[q.section] = 0
      }

      const response = responses[q.id]
      if (response && !isNaN(response.score)) {
        sectionScores[q.section] += response.score
      }
      // Máximo score por pregunta es 3
      sectionMaxScores[q.section] += 3
    })

    // 2. Aplicar pesos por sección y normalizar
    let weightedScore = 0
    let totalWeight = 0

    Object.keys(sectionScores).forEach((section) => {
      const weight = sectionWeights[section] || 0.05
      const maxScore = sectionMaxScores[section]

      if (maxScore > 0) {
        const sectionPercentage = (sectionScores[section] / maxScore) * 100
        weightedScore += sectionPercentage * weight
        totalWeight += weight
      }
    })

    // Normalizar si no se usaron todos los pesos
    if (totalWeight > 0 && totalWeight < 1) {
      weightedScore = weightedScore / totalWeight
    }

    // 3. Aplicar multiplicadores de alto riesgo
    let finalScore = weightedScore

    // Verificar disparadores de alto riesgo basados en respuestas específicas
    const responseValues = Object.values(responses).map((r) => r.value.toLowerCase())

    const hasSpecialCategories = responseValues.some(
      (v) => v.includes("especial") || v.includes("biométrico") || v.includes("sensible") || v.includes("masivo"),
    )
    const hasMinors = responseValues.some(
      (v) => v.includes("menor") || v.includes("vulnerable") || v.includes("masivo"),
    )
    const hasAutomatedDecisions = responseValues.some(
      (v) => v.includes("automatizada") || v.includes("decisión") || v.includes("alto") || v.includes("pleno"),
    )
    const hasInternationalTransfers = responseValues.some(
      (v) =>
        v.includes("internacional") ||
        v.includes("transferencia") ||
        v.includes("tercero") ||
        v.includes("sin garantías"),
    )

    if (hasSpecialCategories) finalScore *= riskMultipliers.specialCategories
    if (hasMinors) finalScore *= riskMultipliers.minors
    if (hasAutomatedDecisions) finalScore *= riskMultipliers.automatedDecisions
    if (hasInternationalTransfers) finalScore *= riskMultipliers.internationalTransfers

    return Math.min(Math.max(finalScore, 0), 100) // Entre 0 y 100
  }

  const getRiskLevel = (score: number) => {
    if (score <= 24) return { level: "Bajo", number: 1, color: "bg-green-500" }
    if (score <= 49) return { level: "Medio", number: 2, color: "bg-yellow-500" }
    if (score <= 74) return { level: "Alto", number: 3, color: "bg-orange-500" }
    return { level: "Muy Alto", number: 4, color: "bg-red-500" }
  }

  const getRecommendations = (riskLevel: number) => {
    switch (riskLevel) {
      case 1:
        return [
          "Documentar controles existentes",
          "Revisar anualmente",
          "Mantener registro de actividades de tratamiento",
        ]
      case 2:
        return [
          "Crear plan de mitigación con fechas específicas",
          "Implementar pruebas de sesgo y explicabilidad mínima",
          "Revisión semestral de controles",
          "Documentar medidas técnicas y organizativas",
        ]
      case 3:
        return [
          "EIPD/DPIA obligatoria antes de producción",
          "Evaluación de sesgo con métricas específicas",
          "Prueba de robustez del sistema",
          "Gobernanza reforzada con supervisión continua",
          "Posible consulta previa a la autoridad si persiste alto riesgo residual",
        ]
      case 4:
        return [
          "Pausa/despliegue condicionado hasta mitigación",
          "Consulta previa obligatoria a autoridad (art. 36 RGPD)",
          "Considerar alternativas no automatizadas",
          "Implementar supervisión humana significativa",
          "Evaluación de impacto exhaustiva con expertos externos",
        ]
      default:
        return []
    }
  }

  const handleSubmit = () => {
    // Validar campos requeridos
    const requiredFields = ["systemName", "assessmentDate"]
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const answeredQuestions = questions.filter((q) => formData[q.id])
    if (answeredQuestions.length === 0) {
      toast({
        title: "Respuestas requeridas",
        description: "Por favor responda al menos una pregunta para continuar",
        variant: "destructive",
      })
      return
    }

    // Calcular puntuación y nivel de riesgo
    const responses: Record<string, { value: string; score: number; other?: string }> = {}
    questions.forEach((q) => {
      if (formData[q.id]) {
        const optionIndex = q.options.indexOf(formData[q.id])
        const score = optionIndex >= 0 && optionIndex < q.scores.length ? q.scores[optionIndex] : 0
        responses[q.id] = {
          value: formData[q.id],
          score: score,
          other: formData[`${q.id}_other`],
        }
      }
    })

    const normalizedScore = calculateRiskScore(responses)
    const riskInfo = getRiskLevel(normalizedScore)
    const recommendations = getRecommendations(riskInfo.number)

    // Procesar documentos
    const processedDocuments: Record<string, { name: string; data: string }> = {}
    Object.entries(documents).forEach(([key, file]) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        processedDocuments[key] = {
          name: file.name,
          data: e.target?.result as string,
        }
      }
      reader.readAsDataURL(file)
    })

    const totalScore = Object.values(responses).reduce((sum, r) => sum + (r.score || 0), 0)

    const assessmentData: RiskAssessmentData = {
      id: editingId || Date.now().toString(),
      systemName: formData.systemName,
      assessmentDate: formData.assessmentDate,
      responses,
      documents: processedDocuments,
      totalScore,
      normalizedScore,
      riskLevel: riskInfo.level,
      riskLevelNumber: riskInfo.number,
      recommendations,
      createdAt: editingId
        ? savedAssessments.find((a) => a.id === editingId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
    }

    // Guardar en localStorage
    const updated = editingId
      ? savedAssessments.map((a) => (a.id === editingId ? assessmentData : a))
      : [...savedAssessments, assessmentData]

    setSavedAssessments(updated)
    localStorage.setItem("riskAssessments", JSON.stringify(updated))

    // Limpiar formulario
    setFormData({})
    setDocuments({})
    setEditingId(null)
    setActiveCard("view")

    toast({
      title: editingId ? "Evaluación actualizada" : "Evaluación guardada",
      description: `Nivel de riesgo: ${riskInfo.level} (${normalizedScore.toFixed(1)}%)`,
    })
  }

  const generatePDFReport = (assessment: RiskAssessmentData) => {
    const doc = new jsPDF()
    let yPosition = 20

    // Encabezado
    doc.setFillColor(27, 182, 126)
    doc.rect(0, 0, 210, 30, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.text("EVALUACIÓN DE IMPACTO - PROTECCIÓN DE DATOS PERSONALES", 105, 20, { align: "center" })

    yPosition = 45
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)

    // Información general
    doc.text(`Sistema: ${assessment.systemName}`, 20, yPosition)
    yPosition += 10
    doc.text(`Fecha de evaluación: ${assessment.assessmentDate}`, 20, yPosition)
    yPosition += 10
    doc.text(`Fecha de creación: ${new Date(assessment.createdAt).toLocaleDateString()}`, 20, yPosition)
    yPosition += 20

    // Resultado de la evaluación con análisis detallado
    doc.setFontSize(14)
    doc.text("RESULTADO DE LA EVALUACIÓN", 20, yPosition)
    yPosition += 15

    const riskInfo = getRiskLevel(assessment.normalizedScore)
    doc.setFontSize(12)
    doc.text(`Puntuación total bruta: ${assessment.totalScore}`, 20, yPosition)
    yPosition += 10
    doc.text(`Puntuación normalizada: ${assessment.normalizedScore.toFixed(1)}%`, 20, yPosition)
    yPosition += 10
    doc.text(`Nivel de riesgo: ${assessment.riskLevel} (Nivel ${assessment.riskLevelNumber})`, 20, yPosition)
    yPosition += 20

    // Análisis por sección
    doc.setFontSize(14)
    doc.text("ANÁLISIS POR SECCIÓN", 20, yPosition)
    yPosition += 15

    const sections = [...new Set(questions.map((q) => q.section))]
    sections.forEach((section) => {
      const sectionQuestions = questions.filter((q) => q.section === section)
      const sectionResponses = sectionQuestions.filter((q) => assessment.responses[q.id])
      const sectionScore = sectionResponses.reduce((sum, q) => sum + (assessment.responses[q.id]?.score || 0), 0)
      const maxSectionScore = sectionQuestions.length * 3
      const sectionPercentage = maxSectionScore > 0 ? (sectionScore / maxSectionScore) * 100 : 0

      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(11)
      doc.text(`${section}: ${sectionScore}/${maxSectionScore} (${sectionPercentage.toFixed(1)}%)`, 20, yPosition)
      yPosition += 8
    })

    yPosition += 10

    // Recomendaciones
    doc.setFontSize(14)
    doc.text("RECOMENDACIONES ESPECÍFICAS", 20, yPosition)
    yPosition += 15

    doc.setFontSize(10)
    assessment.recommendations.forEach((rec, index) => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }
      doc.text(`${index + 1}. ${rec}`, 20, yPosition)
      yPosition += 8
    })

    yPosition += 10

    // Documentos de evidencia
    if (Object.keys(assessment.documents).length > 0) {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.text("DOCUMENTOS DE EVIDENCIA", 20, yPosition)
      yPosition += 15

      Object.entries(assessment.documents).forEach(([key, doc_info]) => {
        doc.setFontSize(10)
        doc.text(`✓ ${doc_info.name}`, 25, yPosition)
        yPosition += 8
      })
    } else {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }
      doc.setFontSize(14)
      doc.text("DOCUMENTOS DE EVIDENCIA", 20, yPosition)
      yPosition += 15
      doc.setFontSize(10)
      doc.text("✗ No se adjuntaron documentos de evidencia", 25, yPosition)
      yPosition += 8
    }

    // Pie de página
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: "center" })
      doc.text("DavaraGovernance AI - Evaluación Impacto PDP", 105, 285, { align: "center" })
    }

    doc.save(`Evaluacion_Riesgos_PDP_${assessment.systemName}_${assessment.assessmentDate}.pdf`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01A79E] mx-auto mb-4"></div>
          <p>Cargando preguntas de evaluación...</p>
        </div>
      </div>
    )
  }

  const sections = [...new Set(questions.map((q) => q.section))]
  const navItems: GeneralTabShellNavItem[] = [
    { id: "register", label: editingId ? "Editar evaluación" : "Registrar evaluación", mobileLabel: "Registrar", icon: FileText },
    { id: "view", label: "Evaluaciones guardadas", mobileLabel: "Guardadas", icon: Eye, badge: savedAssessments.length || undefined },
  ]
  const headerBadges: GeneralTabShellBadge[] = [
    { label: `${questions.length} preguntas`, tone: "neutral" },
    { label: `${savedAssessments.length} evaluaciones`, tone: "primary" },
  ]

  if (editingId) {
    headerBadges.push({ label: "Edición activa", tone: "warning" })
  }

  return (
    <GeneralTabShell
      moduleLabel="Gobernanza IA"
      moduleTitle="Evaluación de Impacto en Datos Personales"
      moduleDescription="Evaluación estructurada del impacto en privacidad, derechos y cumplimiento sobre sistemas de IA."
      pageLabel={activeCard === "register" ? "Registrar evaluación" : "Evaluaciones guardadas"}
      pageTitle={activeCard === "register" ? (editingId ? "Editar evaluación" : "Nueva evaluación de riesgos") : "Evaluaciones realizadas"}
      pageDescription={
        activeCard === "register"
          ? `Evalúa el impacto de protección de datos personales con ${questions.length} preguntas organizadas en ${sections.length} secciones.`
          : "Visualiza, edita y exporta las evaluaciones de riesgo guardadas."
      }
      navItems={navItems}
      activeNavId={activeCard}
      onNavSelect={(itemId) => setActiveCard(itemId as "register" | "view")}
      headerBadges={headerBadges}
      backHref="/dashboard"
      backLabel="Volver al panel"
    >

      {/* Contenido del formulario */}
      {activeCard === "register" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#01A79E]" />
              {editingId ? "Editar Evaluación" : "Nueva Evaluación"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Información general */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="systemName">Nombre del Sistema *</Label>
                <Input
                  id="systemName"
                  value={formData.systemName || ""}
                  onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                  placeholder="Nombre del sistema de IA"
                />
              </div>
              <div>
                <Label htmlFor="assessmentDate">Fecha de Evaluación *</Label>
                <Input
                  id="assessmentDate"
                  type="date"
                  value={formData.assessmentDate || ""}
                  onChange={(e) => setFormData({ ...formData, assessmentDate: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            {/* Preguntas por sección */}
            {sections.map((section, sectionIndex) => {
              const sectionQuestions = questions.filter((q) => q.section === section)
              return (
                <div key={section} className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#01A79E] flex items-center gap-2">
                    <span className="bg-[#01A79E] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      {String.fromCharCode(65 + sectionIndex)}
                    </span>
                    {section}
                  </h3>

                  {sectionQuestions.map((question) => (
                    <div key={question.id} className="space-y-2 p-4 border rounded-lg">
                      <Label className="text-sm font-medium">
                        {question.id}: {question.question}
                      </Label>
                      <Select
                        value={formData[question.id] || ""}
                        onValueChange={(value) => setFormData({ ...formData, [question.id]: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar respuesta" />
                        </SelectTrigger>
                        <SelectContent>
                          {question.options.map((option, index) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Campo "Otro" condicional */}
                      {formData[question.id] === "Otro" && (
                        <div className="mt-2">
                          <Label className="text-sm">Especificar:</Label>
                          <Input
                            value={formData[`${question.id}_other`] || ""}
                            onChange={(e) => setFormData({ ...formData, [`${question.id}_other`]: e.target.value })}
                            placeholder="Especifique su respuesta"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            })}

            <Separator />

            {/* Documentos de evidencia */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Documentos de Evidencia</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {["dpia", "policies", "contracts", "technical"].map((docType) => (
                  <div key={docType} className="space-y-2">
                    <Label className="text-sm">
                      {docType === "dpia" && "DPIA/EIPD"}
                      {docType === "policies" && "Políticas de privacidad"}
                      {docType === "contracts" && "Contratos con terceros"}
                      {docType === "technical" && "Documentación técnica"}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setDocuments({ ...documents, [docType]: file })
                          }
                        }}
                      />
                      {documents[docType] && (
                        <Badge variant="outline" className="text-xs">
                          <Upload className="h-3 w-3 mr-1" />
                          Subido
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setFormData({})
                  setDocuments({})
                  setEditingId(null)
                }}
              >
                Limpiar
              </Button>
              <Button onClick={handleSubmit} className="bg-[#01A79E] hover:bg-[#018b84]">
                {editingId ? "Actualizar Evaluación" : "Guardar Evaluación"}
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
              <Eye className="h-5 w-5 text-[#01A79E]" />
              Evaluaciones Guardadas ({savedAssessments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {savedAssessments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay evaluaciones guardadas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedAssessments.map((assessment) => {
                  const riskInfo = getRiskLevel(assessment.normalizedScore)
                  return (
                    <div key={assessment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{assessment.systemName}</h3>
                          <p className="text-sm text-gray-600">
                            Evaluado: {assessment.assessmentDate} | Creado:{" "}
                            {new Date(assessment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${riskInfo.color} text-white`}>
                            Nivel {assessment.riskLevelNumber}: {assessment.riskLevel}
                          </Badge>
                          <Badge variant="outline">{assessment.normalizedScore.toFixed(1)}%</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Puntuación: {assessment.totalScore}</span>
                          <span>Documentos: {Object.keys(assessment.documents).length}</span>
                          <span>Recomendaciones: {assessment.recommendations.length}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Cargar datos para edición
                              const editData: any = {
                                systemName: assessment.systemName,
                                assessmentDate: assessment.assessmentDate,
                              }
                              Object.entries(assessment.responses).forEach(([key, response]) => {
                                editData[key] = response.value
                                if (response.other) {
                                  editData[`${key}_other`] = response.other
                                }
                              })
                              setFormData(editData)
                              setEditingId(assessment.id)
                              setActiveCard("register")
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => generatePDFReport(assessment)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const updated = savedAssessments.filter((a) => a.id !== assessment.id)
                              setSavedAssessments(updated)
                              localStorage.setItem("riskAssessments", JSON.stringify(updated))
                              toast({
                                title: "Evaluación eliminada",
                                description: "La evaluación ha sido eliminada correctamente",
                              })
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
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
    </GeneralTabShell>
  )
}
