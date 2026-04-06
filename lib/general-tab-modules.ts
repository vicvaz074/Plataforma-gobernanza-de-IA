import {
  AlertTriangle,
  Brain,
  Building2,
  ClipboardList,
  FileLock2,
  FileSearch,
  Handshake,
  Info,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react"
import type { GeneralTabNavItem } from "@/components/general-tab-shell"

export type GeneralModuleKey =
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

interface GeneralModuleDefinition {
  key: GeneralModuleKey
  href: string
  label: string
  pageTitle: string
  pageDescription: string
  icon: LucideIcon
}

const modules: GeneralModuleDefinition[] = [
  {
    key: "registro-sistemas-ia",
    href: "/registro-sistemas-ia",
    label: "Registro de sistemas de IA",
    pageTitle: "Registro de sistemas de IA",
    pageDescription: "Centraliza el alta de sistemas propios y de terceros con trazabilidad documental.",
    icon: Building2,
  },
  {
    key: "incidentes-alto-riesgo",
    href: "/incidentes-alto-riesgo",
    label: "Reportes de incidentes de alto riesgo",
    pageTitle: "Reportes de incidentes de alto riesgo",
    pageDescription: "Gestiona reportes oficiales, seguimiento y evidencia de incidentes críticos.",
    icon: AlertTriangle,
  },
  {
    key: "evaluacion-impacto-algoritmico",
    href: "/evaluacion-impacto-algoritmico",
    label: "Evaluación de impacto algorítmico",
    pageTitle: "Evaluación de impacto algorítmico",
    pageDescription: "Documenta riesgos, controles y cumplimiento técnico de los modelos de IA.",
    icon: Brain,
  },
  {
    key: "evaluacion-riesgos-pdp",
    href: "/evaluacion-riesgos-pdp",
    label: "Evaluación de impacto en datos personales",
    pageTitle: "Evaluación de impacto en datos personales",
    pageDescription: "Evalúa tratamiento de datos personales, exposición y salvaguardas aplicables.",
    icon: ShieldCheck,
  },
  {
    key: "evaluacion-impacto-pi",
    href: "/evaluacion-impacto-pi",
    label: "Evaluación de impacto en propiedad intelectual",
    pageTitle: "Evaluación de impacto en propiedad intelectual",
    pageDescription: "Registra riesgos de PI en datasets, salidas generativas y uso de contenidos.",
    icon: FileLock2,
  },
  {
    key: "evaluacion-riesgos-proveedores",
    href: "/evaluacion-riesgos-proveedores",
    label: "Evaluación de proveedores",
    pageTitle: "Evaluación de proveedores",
    pageDescription: "Analiza terceros críticos, controles contractuales y riesgos operativos.",
    icon: Handshake,
  },
  {
    key: "politicas-procesos-gobernanza",
    href: "/politicas-procesos-gobernanza",
    label: "Políticas y procesos sistema de gobernanza",
    pageTitle: "Políticas y procesos de gobernanza",
    pageDescription: "Define, actualiza y controla el marco interno de gobernanza de IA.",
    icon: ClipboardList,
  },
  {
    key: "transparencia-explicabilidad",
    href: "/transparencia-explicabilidad",
    label: "Transparencia y explicabilidad",
    pageTitle: "Transparencia y explicabilidad",
    pageDescription: "Administra evidencias de transparencia, explicabilidad y trazabilidad del modelo.",
    icon: Info,
  },
  {
    key: "concientizacion-entrenamiento-ia",
    href: "/concientizacion-entrenamiento-ia",
    label: "Concientización y entrenamiento de IA",
    pageTitle: "Concientización y entrenamiento de IA",
    pageDescription: "Gestiona programas de formación, materiales y evidencia de capacitación.",
    icon: FileSearch,
  },
  {
    key: "comite-gobernanza-ia",
    href: "/comite-gobernanza-ia",
    label: "Comité de gobernanza de IA",
    pageTitle: "Comité de gobernanza de IA",
    pageDescription: "Coordina la operación del comité, acuerdos, roles y actas de seguimiento.",
    icon: Users,
  },
]

export function getGeneralTabNavItems(): GeneralTabNavItem[] {
  return modules.map((module) => ({
    id: module.key,
    href: module.href,
    label: module.label,
    icon: module.icon,
    activePaths: [module.href],
  }))
}

export function getGeneralModuleByKey(key: GeneralModuleKey) {
  return modules.find((module) => module.key === key)!
}


export function getGeneralModuleFromPath(pathname: string) {
  return modules.find((module) => pathname === module.href || pathname.startsWith(`${module.href}/`))
}
