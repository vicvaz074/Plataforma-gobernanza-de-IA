import {
  AlertTriangle,
  BookOpen,
  Brain,
  Building2,
  Database,
  FileSearch,
  GraduationCap,
  Landmark,
  Scale,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import type { GeneralTabShellNavItem } from "@/components/general-tab-shell"

export type GeneralTabModuleKey =
  | "registro-sistemas-ia"
  | "incidentes-alto-riesgo"
  | "evaluacion-impacto-algoritmico"
  | "evaluacion-riesgos-pdp"
  | "evaluacion-impacto-pi"
  | "evaluacion-riesgos-proveedores"
  | "politicas-procesos-gobernanza"
  | "transparencia-explicabilidad"
  | "concientizacion-entrenamiento-ia"
  | "comite-gobernanza-ia"

export type GeneralTabModuleMeta = {
  pageLabel: string
  pageTitle: string
  pageDescription: string
}

type NavItemDefinition = {
  id: GeneralTabModuleKey
  label: string
  href: string
  icon: LucideIcon
}

const navDefinitions: NavItemDefinition[] = [
  { id: "registro-sistemas-ia", label: "Registro de sistemas de IA", href: "/registro-sistemas-ia", icon: Brain },
  {
    id: "incidentes-alto-riesgo",
    label: "Reportes de incidentes de alto riesgo",
    href: "/incidentes-alto-riesgo",
    icon: AlertTriangle,
  },
  {
    id: "evaluacion-impacto-algoritmico",
    label: "Evaluación de impacto algorítmico",
    href: "/evaluacion-impacto-algoritmico",
    icon: FileSearch,
  },
  {
    id: "evaluacion-riesgos-pdp",
    label: "Evaluación de Impacto en Datos Personales",
    href: "/evaluacion-riesgos-pdp",
    icon: Database,
  },
  {
    id: "evaluacion-impacto-pi",
    label: "Evaluación de impacto en propiedad intelectual",
    href: "/evaluacion-impacto-pi",
    icon: Scale,
  },
  {
    id: "evaluacion-riesgos-proveedores",
    label: "Evaluación de Proveedores",
    href: "/evaluacion-riesgos-proveedores",
    icon: Building2,
  },
  {
    id: "politicas-procesos-gobernanza",
    label: "Políticas y procesos sistema de gobernanza",
    href: "/politicas-procesos-gobernanza",
    icon: BookOpen,
  },
  {
    id: "transparencia-explicabilidad",
    label: "Transparencia y explicabilidad",
    href: "/transparencia-explicabilidad",
    icon: ShieldCheck,
  },
  {
    id: "concientizacion-entrenamiento-ia",
    label: "Concientización y entrenamiento de IA",
    href: "/concientizacion-entrenamiento-ia",
    icon: GraduationCap,
  },
  {
    id: "comite-gobernanza-ia",
    label: "Comité de Gobernanza de IA",
    href: "/comite-gobernanza-ia",
    icon: Landmark,
  },
]

export const generalTabNavItems: GeneralTabShellNavItem[] = navDefinitions.map((item) => ({
  id: item.id,
  label: item.label,
  href: item.href,
  icon: item.icon,
  activePaths: [item.href],
}))

export const generalTabModuleMeta: Record<GeneralTabModuleKey, GeneralTabModuleMeta> = {
  "registro-sistemas-ia": {
    pageLabel: "Registro",
    pageTitle: "Registro de sistemas de IA",
    pageDescription: "Administra sistemas propios y de terceros con trazabilidad, evidencia y seguimiento.",
  },
  "incidentes-alto-riesgo": {
    pageLabel: "Incidentes",
    pageTitle: "Reportes de incidentes de alto riesgo",
    pageDescription: "Documenta, consulta y da seguimiento a incidentes críticos asociados a sistemas de IA.",
  },
  "evaluacion-impacto-algoritmico": {
    pageLabel: "Evaluación",
    pageTitle: "Evaluación de impacto algorítmico",
    pageDescription: "Evalúa riesgos éticos, legales y técnicos de sistemas de IA con enfoque preventivo.",
  },
  "evaluacion-riesgos-pdp": {
    pageLabel: "Evaluación PDP",
    pageTitle: "Evaluación de Impacto en Datos Personales",
    pageDescription: "Analiza riesgos de privacidad y cumplimiento para tratamientos de datos en IA.",
  },
  "evaluacion-impacto-pi": {
    pageLabel: "Evaluación PI",
    pageTitle: "Evaluación de impacto en propiedad intelectual",
    pageDescription: "Gestiona cumplimiento y riesgos sobre uso de contenido, licencias y derechos de autor.",
  },
  "evaluacion-riesgos-proveedores": {
    pageLabel: "Proveedores",
    pageTitle: "Evaluación de Proveedores",
    pageDescription: "Califica riesgos de terceros y registra evidencias contractuales, técnicas y operativas.",
  },
  "politicas-procesos-gobernanza": {
    pageLabel: "Gobernanza",
    pageTitle: "Políticas y procesos sistema de gobernanza",
    pageDescription: "Define y controla políticas internas, responsables y ciclos de revisión de IA.",
  },
  "transparencia-explicabilidad": {
    pageLabel: "Checklist",
    pageTitle: "Transparencia y explicabilidad",
    pageDescription: "Mide madurez de transparencia y explicabilidad con criterios alineados a marcos internacionales.",
  },
  "concientizacion-entrenamiento-ia": {
    pageLabel: "Formación",
    pageTitle: "Concientización y entrenamiento de IA",
    pageDescription: "Registra programas de capacitación, materiales y evidencias de aprendizaje organizacional.",
  },
  "comite-gobernanza-ia": {
    pageLabel: "Comité",
    pageTitle: "Comité de Gobernanza de IA",
    pageDescription: "Documenta composición, funciones y acuerdos del comité de gobernanza de IA.",
  },
}
