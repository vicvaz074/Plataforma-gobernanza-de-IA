"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, File, Eye, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface DocumentData {
  id: string
  name: string
  type: string
  size: number
  uploadDate: string
  category: string
  description?: string
  file?: File
}

export default function DocumentacionTecnicaPage() {
  const { toast } = useToast()
  const [documents, setDocuments] = useState<DocumentData[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [documentDescription, setDocumentDescription] = useState("")

  const documentCategories = [
    "Especificaciones técnicas",
    "Documentación de arquitectura",
    "Manuales de usuario",
    "Informes de pruebas",
    "Certificaciones",
    "Políticas de uso",
    "Otros",
  ]

  useEffect(() => {
    const storedDocs = localStorage.getItem("aiTechnicalDocuments")
    if (storedDocs) {
      setDocuments(JSON.parse(storedDocs))
    }
  }, [])

  const saveDocuments = (newDocuments: DocumentData[]) => {
    setDocuments(newDocuments)
    localStorage.setItem("aiTechnicalDocuments", JSON.stringify(newDocuments))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !selectedCategory) {
      toast({
        title: "Error",
        description: "Por favor selecciona una categoría antes de subir archivos",
        variant: "destructive",
      })
      return
    }

    Array.from(files).forEach((file) => {
      const newDocument: DocumentData = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        uploadDate: new Date().toISOString(),
        category: selectedCategory,
        description: documentDescription,
        file: file,
      }

      const updatedDocuments = [...documents, newDocument]
      saveDocuments(updatedDocuments)
    })

    setSelectedCategory("")
    setDocumentDescription("")
    event.target.value = ""

    toast({
      title: "Éxito",
      description: "Documentos subidos correctamente",
    })
  }

  const deleteDocument = (id: string) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== id)
    saveDocuments(updatedDocuments)
    toast({
      title: "Éxito",
      description: "Documento eliminado correctamente",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/registro-sistemas-ia/propio">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentación Técnica</h1>
          <p className="text-gray-600">Gestión de documentos técnicos para sistemas de IA</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subir documentación técnica</CardTitle>
          <CardDescription>
            Organiza y gestiona todos los documentos técnicos relacionados con tus sistemas de IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoría del documento *</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Descripción (opcional)</Label>
              <input
                id="description"
                className="w-full p-2 border rounded"
                value={documentDescription}
                onChange={(e) => setDocumentDescription(e.target.value)}
                placeholder="Breve descripción del documento"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="fileUpload">Seleccionar archivos</Label>
            <input
              id="fileUpload"
              type="file"
              multiple
              onChange={handleFileUpload}
              className="w-full p-2 border rounded"
              accept=".pdf,.doc,.docx,.txt,.md,.xlsx,.pptx,.png,.jpg,.jpeg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Formatos soportados: PDF, DOC, DOCX, TXT, MD, XLSX, PPTX, PNG, JPG, JPEG
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentos almacenados ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay documentos almacenados</p>
              <p className="text-sm">Sube tu primera documentación técnica</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <File className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{doc.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{doc.category}</Badge>
                          <Badge className="bg-blue-100 text-blue-800">{formatFileSize(doc.size)}</Badge>
                        </div>
                        {doc.description && <p className="text-sm text-gray-600 mt-1">{doc.description}</p>}
                        <p className="text-xs text-gray-500 mt-2">
                          Subido: {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (doc.file) {
                            const url = URL.createObjectURL(doc.file)
                            window.open(url, "_blank")
                          }
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteDocument(doc.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
