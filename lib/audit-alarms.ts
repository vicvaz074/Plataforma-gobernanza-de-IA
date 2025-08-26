// Tipos para los recordatorios de auditoría
export type AuditPriority = "alta" | "media" | "baja"
export type AuditStatus = "pendiente" | "en-progreso" | "completada" | "vencida"

export interface AuditReminder {
  id: string
  title: string
  description: string
  dueDate: Date
  createdAt: Date
  priority: AuditPriority
  status: AuditStatus
  assignedTo: string[]
  category: string
  documents?: string[]
  notes?: string
  completedAt?: Date
}

// Datos de ejemplo para los recordatorios
export const auditReminders: AuditReminder[] = [
  {
    id: "1",
    title: "Auditoría anual de cumplimiento RGPD",
    description: "Revisión completa de políticas y procedimientos de protección de datos",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 45)),
    priority: "alta",
    status: "pendiente",
    assignedTo: ["María López", "Juan Rodríguez"],
    category: "Cumplimiento RGPD",
  },
  {
    id: "2",
    title: "Revisión de contratos con proveedores",
    description: "Verificar cláusulas de protección de datos en contratos con terceros",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 25)),
    priority: "media",
    status: "en-progreso",
    assignedTo: ["Carlos Sánchez"],
    category: "Contratos",
    notes: "Se han identificado 3 contratos que requieren actualización",
  },
  {
    id: "3",
    title: "Auditoría de seguridad de acceso a datos",
    description: "Revisar permisos y controles de acceso a datos personales",
    dueDate: new Date(new Date().setDate(new Date().getDate() - 10)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 60)),
    priority: "alta",
    status: "vencida",
    assignedTo: ["Ana Martínez", "Pedro Gómez"],
    category: "Seguridad",
  },
  {
    id: "4",
    title: "Evaluación de impacto - Nuevo sistema CRM",
    description: "Realizar EIPD para la implementación del nuevo sistema CRM",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 15)),
    priority: "alta",
    status: "pendiente",
    assignedTo: ["Laura Fernández"],
    category: "EIPD",
  },
  {
    id: "5",
    title: "Revisión de políticas de retención de datos",
    description: "Verificar cumplimiento de plazos de conservación de datos personales",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 45)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    priority: "media",
    status: "pendiente",
    assignedTo: ["Roberto Díaz"],
    category: "Políticas",
  },
  {
    id: "6",
    title: "Auditoría de registros de actividades de tratamiento",
    description: "Revisar y actualizar el registro de actividades de tratamiento",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 20)),
    priority: "alta",
    status: "pendiente",
    assignedTo: ["Carmen Ruiz", "Miguel Álvarez"],
    category: "RAT",
  },
  {
    id: "7",
    title: "Revisión de medidas técnicas y organizativas",
    description: "Evaluar la efectividad de las medidas de seguridad implementadas",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 20)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
    priority: "media",
    status: "en-progreso",
    assignedTo: ["Javier Torres"],
    category: "Seguridad",
    notes: "Se está elaborando informe de recomendaciones",
  },
  {
    id: "8",
    title: "Auditoría de procedimientos de ejercicio de derechos ARCO",
    description: "Verificar la correcta gestión de solicitudes de derechos ARCO",
    dueDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 35)),
    priority: "baja",
    status: "completada",
    assignedTo: ["Sofía Navarro"],
    category: "Derechos ARCO",
    completedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
]

// Funciones para gestionar los recordatorios
export function getAuditReminders() {
  return [...auditReminders].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
}

export function getAuditRemindersByStatus(status: AuditStatus) {
  return getAuditReminders().filter((reminder) => reminder.status === status)
}

export function getAuditRemindersByPriority(priority: AuditPriority) {
  return getAuditReminders().filter((reminder) => reminder.priority === priority)
}

export function getUpcomingAuditReminders(days = 7) {
  const today = new Date()
  const futureDate = new Date()
  futureDate.setDate(today.getDate() + days)

  return getAuditReminders().filter(
    (reminder) => reminder.status !== "completada" && reminder.dueDate > today && reminder.dueDate <= futureDate,
  )
}

export function getOverdueAuditReminders() {
  const today = new Date()

  return getAuditReminders().filter((reminder) => reminder.status !== "completada" && reminder.dueDate < today)
}

export function addAuditReminder(reminder: Omit<AuditReminder, "id" | "createdAt">) {
  const newReminder: AuditReminder = {
    ...reminder,
    id: (auditReminders.length + 1).toString(),
    createdAt: new Date(),
  }

  auditReminders.push(newReminder)
  return newReminder
}

export function updateAuditReminder(id: string, updates: Partial<AuditReminder>) {
  const index = auditReminders.findIndex((reminder) => reminder.id === id)
  if (index !== -1) {
    auditReminders[index] = { ...auditReminders[index], ...updates }
    return auditReminders[index]
  }
  return null
}

export function deleteAuditReminder(id: string) {
  const index = auditReminders.findIndex((reminder) => reminder.id === id)
  if (index !== -1) {
    const deleted = auditReminders.splice(index, 1)
    return deleted[0]
  }
  return null
}

export function completeAuditReminder(id: string) {
  return updateAuditReminder(id, {
    status: "completada",
    completedAt: new Date(),
  })
}

// Función para obtener el color de prioridad
export function getPriorityColor(priority: AuditPriority) {
  switch (priority) {
    case "alta":
      return "text-primary"
    case "media":
      return "text-primary/80"
    case "baja":
      return "text-primary/60"
    default:
      return ""
  }
}

// Función para obtener el color de estado
export function getStatusColor(status: AuditStatus) {
  switch (status) {
    case "pendiente":
      return "bg-primary/10 text-primary border-none"
    case "en-progreso":
      return "bg-primary/20 text-primary border-none"
    case "completada":
      return "bg-primary/30 text-primary border-none"
    case "vencida":
      return "bg-primary/15 text-primary border-none"
    default:
      return ""
  }
}

// Función para formatear fechas
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

// Función para calcular días restantes
export function getDaysRemaining(dueDate: Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)

  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}
