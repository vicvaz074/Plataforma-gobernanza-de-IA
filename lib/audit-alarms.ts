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

const STORAGE_KEY = "audit-reminders"

// Funciones para gestionar los recordatorios
export function getAuditReminders(): AuditReminder[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const reminders = JSON.parse(stored)
    // Convert date strings back to Date objects
    return reminders
      .map((reminder: any) => ({
        ...reminder,
        dueDate: new Date(reminder.dueDate),
        createdAt: new Date(reminder.createdAt),
        completedAt: reminder.completedAt ? new Date(reminder.completedAt) : undefined,
      }))
      .sort((a: AuditReminder, b: AuditReminder) => a.dueDate.getTime() - b.dueDate.getTime())
  } catch (error) {
    console.error("Error loading audit reminders:", error)
    return []
  }
}

function saveAuditReminders(reminders: AuditReminder[]) {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
  } catch (error) {
    console.error("Error saving audit reminders:", error)
  }
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
  const reminders = getAuditReminders()
  const newReminder: AuditReminder = {
    ...reminder,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
  }

  reminders.push(newReminder)
  saveAuditReminders(reminders)
  return newReminder
}

export function updateAuditReminder(id: string, updates: Partial<AuditReminder>) {
  const reminders = getAuditReminders()
  const index = reminders.findIndex((reminder) => reminder.id === id)
  if (index !== -1) {
    reminders[index] = { ...reminders[index], ...updates }
    saveAuditReminders(reminders)
    return reminders[index]
  }
  return null
}

export function deleteAuditReminder(id: string) {
  const reminders = getAuditReminders()
  const index = reminders.findIndex((reminder) => reminder.id === id)
  if (index !== -1) {
    const deleted = reminders.splice(index, 1)
    saveAuditReminders(reminders)
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
