"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import {
  type AuditReminder,
  type AuditPriority,
  type AuditStatus,
  getAuditReminders,
  getUpcomingAuditReminders,
  getOverdueAuditReminders,
  addAuditReminder,
  deleteAuditReminder,
  completeAuditReminder,
} from "@/lib/audit-alarms"

export interface UseAuditRemindersReturn {
  reminders: AuditReminder[]
  filteredReminders: AuditReminder[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  statusFilter: AuditStatus | "all"
  setStatusFilter: (status: AuditStatus | "all") => void
  priorityFilter: AuditPriority | "all"
  setPriorityFilter: (priority: AuditPriority | "all") => void
  isAddDialogOpen: boolean
  setIsAddDialogOpen: (open: boolean) => void
  newReminder: NewReminderForm
  setNewReminder: (reminder: NewReminderForm) => void
  handleAddReminder: () => void
  handleCompleteReminder: (id: string) => void
  handleDeleteReminder: (id: string) => void
  upcomingReminders: AuditReminder[]
  overdueReminders: AuditReminder[]
}

export interface NewReminderForm {
  title: string
  description: string
  dueDate: string
  priority: AuditPriority
  assignedTo: string
  category: string
  notes: string
}

export const useAuditReminders = (): UseAuditRemindersReturn => {
  const { toast } = useToast()

  const [reminders, setReminders] = useState<AuditReminder[]>([])
  const [filteredReminders, setFilteredReminders] = useState<AuditReminder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<AuditStatus | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<AuditPriority | "all">("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newReminder, setNewReminder] = useState<NewReminderForm>({
    title: "",
    description: "",
    dueDate: "",
    priority: "media",
    assignedTo: "",
    category: "",
    notes: "",
  })

  // Load reminders on mount
  useEffect(() => {
    setReminders(getAuditReminders())
  }, [])

  // Filter reminders based on search and filters
  useEffect(() => {
    let filtered = reminders

    if (searchTerm) {
      filtered = filtered.filter(
        (reminder) =>
          reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reminder.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reminder.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((reminder) => reminder.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((reminder) => reminder.priority === priorityFilter)
    }

    setFilteredReminders(filtered)
  }, [reminders, searchTerm, statusFilter, priorityFilter])

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.dueDate) {
      toast({
        title: "Error",
        description: "Por favor completa los campos requeridos (Título y Fecha Límite)",
        variant: "destructive",
      })
      return
    }

    // Validate date is not in the past
    const selectedDate = new Date(newReminder.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      toast({
        title: "Error",
        description: "La fecha límite no puede ser anterior a hoy",
        variant: "destructive",
      })
      return
    }

    try {
      const reminder = addAuditReminder({
        ...newReminder,
        dueDate: selectedDate,
        assignedTo: newReminder.assignedTo
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        status: "pendiente",
      })

      setReminders(getAuditReminders())
      setNewReminder({
        title: "",
        description: "",
        dueDate: "",
        priority: "media",
        assignedTo: "",
        category: "",
        notes: "",
      })
      setIsAddDialogOpen(false)

      toast({
        title: "Recordatorio creado",
        description: `Se ha creado el recordatorio "${reminder.title}" exitosamente`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el recordatorio. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  const handleCompleteReminder = (id: string) => {
    try {
      completeAuditReminder(id)
      setReminders(getAuditReminders())

      toast({
        title: "Recordatorio completado",
        description: "El recordatorio se ha marcado como completado",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar el recordatorio",
        variant: "destructive",
      })
    }
  }

  const handleDeleteReminder = (id: string) => {
    try {
      deleteAuditReminder(id)
      setReminders(getAuditReminders())

      toast({
        title: "Recordatorio eliminado",
        description: "El recordatorio se ha eliminado exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el recordatorio",
        variant: "destructive",
      })
    }
  }

  const upcomingReminders = getUpcomingAuditReminders(7)
  const overdueReminders = getOverdueAuditReminders()

  return {
    reminders,
    filteredReminders,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    isAddDialogOpen,
    setIsAddDialogOpen,
    newReminder,
    setNewReminder,
    handleAddReminder,
    handleCompleteReminder,
    handleDeleteReminder,
    upcomingReminders,
    overdueReminders,
  }
}

// Helper functions for reminder management
export const getReminderStatusIcon = (status: AuditStatus) => {
  switch (status) {
    case "completada":
      return "✅"
    case "en-progreso":
      return "🔄"
    case "vencida":
      return "⚠️"
    default:
      return "⏳"
  }
}

export const getReminderPriorityIcon = (priority: AuditPriority) => {
  switch (priority) {
    case "alta":
      return "🔴"
    case "media":
      return "🟡"
    case "baja":
      return "🟢"
    default:
      return "⚪"
  }
}

export const generateReminderSuggestions = (moduleStatuses: any[]) => {
  const suggestions: Partial<NewReminderForm>[] = []

  // Suggest reminders for modules with low completion rates
  moduleStatuses.forEach((module) => {
    if (module.completionRate < 50) {
      suggestions.push({
        title: `Revisar ${module.name}`,
        description: `El módulo ${module.name} tiene una tasa de completitud baja (${module.completionRate}%). Se recomienda revisar y completar los registros faltantes.`,
        priority: "alta",
        category: "Cumplimiento",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      })
    }

    if (module.criticalIssues > 0) {
      suggestions.push({
        title: `Resolver problemas críticos en ${module.name}`,
        description: `Se encontraron ${module.criticalIssues} problemas críticos en ${module.name} que requieren atención inmediata.`,
        priority: "alta",
        category: "Problemas Críticos",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3 days from now
      })
    }
  })

  return suggestions
}
