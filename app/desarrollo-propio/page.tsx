"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/LanguageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Search, FileText, Code } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { desarrolloPropioTranslations } from "@/lib/desarrollo-propio-translations"

interface OwnDevelopment {
  id: string
  name: string
  description: string
  technology: string
  status: string
  startDate: string
  endDate?: string
  team: string
  repository?: string
  documentation?: string
  createdAt: string
  updatedAt: string
}

export default function DesarrolloPropioPage() {
  const { language } = useLanguage()
  const t = desarrolloPropioTranslations[language]
  const { toast } = useToast()

  const [activeCard, setActiveCard] = useState<"register" | "manage">("register")
  const [developments, setDevelopments] = useState<OwnDevelopment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    technology: "",
    status: "",
    startDate: "",
    endDate: "",
    team: "",
    repository: "",
    documentation: "",
  })

  useEffect(() => {
    const stored = localStorage.getItem("ownDevelopments")
    if (stored) {
      setDevelopments(JSON.parse(stored))
    }
  }, [])

  const saveDevelopments = (newDevelopments: OwnDevelopment[]) => {
    setDevelopments(newDevelopments)
    localStorage.setItem("ownDevelopments", JSON.stringify(newDevelopments))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.technology || !formData.status) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const now = new Date().toISOString()

    if (editingId) {
      const updated = developments.map((dev) => (dev.id === editingId ? { ...dev, ...formData, updatedAt: now } : dev))
      saveDevelopments(updated)
      setEditingId(null)
      toast({
        title: "Éxito",
        description: "Desarrollo actualizado correctamente",
      })
    } else {
      const newDevelopment: OwnDevelopment = {
        id: Date.now().toString(),
        ...formData,
        createdAt: now,
        updatedAt: now,
      }
      saveDevelopments([...developments, newDevelopment])
      toast({
        title: "Éxito",
        description: "Desarrollo registrado correctamente",
      })
    }

    setFormData({
      name: "",
      description: "",
      technology: "",
      status: "",
      startDate: "",
      endDate: "",
      team: "",
      repository: "",
      documentation: "",
    })
  }

  const handleEdit = (development: OwnDevelopment) => {
    setFormData(development)
    setEditingId(development.id)
    setActiveCard("register")
  }

  const handleDelete = (id: string) => {
    const updated = developments.filter((dev) => dev.id !== id)
    saveDevelopments(updated)
    toast({
      title: "Éxito",
      description: "Desarrollo eliminado correctamente",
    })
  }

  const filteredDevelopments = developments.filter((dev) => {
    const matchesSearch =
      dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || dev.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-yellow-100 text-yellow-800"
      case "development":
        return "bg-blue-100 text-blue-800"
      case "testing":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Desarrollo propio</h1>
        <p className="text-gray-600">Gestión y documentación de desarrollos internos de IA</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card
          className={`cursor-pointer transition-all ${activeCard === "register" ? "ring-2 ring-green-500" : ""}`}
          onClick={() => setActiveCard("register")}
        >
          <CardHeader className="text-center">
            <Code className="h-12 w-12 mx-auto text-green-600 mb-2" />
            <CardTitle>Registrar desarrollo</CardTitle>
          </CardHeader>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${activeCard === "manage" ? "ring-2 ring-green-500" : ""}`}
          onClick={() => setActiveCard("manage")}
        >
          <CardHeader className="text-center">
            <FileText className="h-12 w-12 mx-auto text-green-600 mb-2" />
            <CardTitle>Gestionar desarrollos</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {activeCard === "register" && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar desarrollo" : "Registrar nuevo desarrollo"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre del proyecto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="technology">Tecnología principal *</Label>
                  <Input
                    id="technology"
                    value={formData.technology}
                    onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                    placeholder="ej. Python, TensorFlow, React"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Estado *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planificación</SelectItem>
                      <SelectItem value="development">En desarrollo</SelectItem>
                      <SelectItem value="testing">En pruebas</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                      <SelectItem value="paused">Pausado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Fecha de inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Fecha de finalización</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="team">Equipo responsable</Label>
                  <Input
                    id="team"
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    placeholder="ej. Equipo de IA, Desarrollo Frontend"
                  />
                </div>
                <div>
                  <Label htmlFor="repository">Repositorio</Label>
                  <Input
                    id="repository"
                    value={formData.repository}
                    onChange={(e) => setFormData({ ...formData, repository: e.target.value })}
                    placeholder="URL del repositorio"
                  />
                </div>
                <div>
                  <Label htmlFor="documentation">Documentación</Label>
                  <Input
                    id="documentation"
                    value={formData.documentation}
                    onChange={(e) => setFormData({ ...formData, documentation: e.target.value })}
                    placeholder="URL de la documentación"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {editingId ? "Actualizar" : "Registrar"} desarrollo
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null)
                      setFormData({
                        name: "",
                        description: "",
                        technology: "",
                        status: "",
                        startDate: "",
                        endDate: "",
                        team: "",
                        repository: "",
                        documentation: "",
                      })
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {activeCard === "manage" && (
        <Card>
          <CardHeader>
            <CardTitle>Gestionar desarrollos ({developments.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar desarrollos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="planning">Planificación</SelectItem>
                  <SelectItem value="development">En desarrollo</SelectItem>
                  <SelectItem value="testing">En pruebas</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="paused">Pausado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredDevelopments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No se encontraron desarrollos</div>
            ) : (
              <div className="space-y-4">
                {filteredDevelopments.map((development) => (
                  <div key={development.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{development.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{development.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className={getStatusColor(development.status)}>
                            {development.status === "planning" && "Planificación"}
                            {development.status === "development" && "En desarrollo"}
                            {development.status === "testing" && "En pruebas"}
                            {development.status === "completed" && "Completado"}
                            {development.status === "paused" && "Pausado"}
                          </Badge>
                          <Badge variant="outline">{development.technology}</Badge>
                          {development.team && <Badge variant="outline">{development.team}</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(development)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(development.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                      {development.startDate && (
                        <div>
                          <span className="font-medium">Inicio:</span>{" "}
                          {new Date(development.startDate).toLocaleDateString()}
                        </div>
                      )}
                      {development.endDate && (
                        <div>
                          <span className="font-medium">Fin:</span> {new Date(development.endDate).toLocaleDateString()}
                        </div>
                      )}
                      {development.repository && (
                        <div>
                          <span className="font-medium">Repo:</span>
                          <a
                            href={development.repository}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline ml-1"
                          >
                            Ver código
                          </a>
                        </div>
                      )}
                      {development.documentation && (
                        <div>
                          <span className="font-medium">Docs:</span>
                          <a
                            href={development.documentation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline ml-1"
                          >
                            Ver documentación
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
