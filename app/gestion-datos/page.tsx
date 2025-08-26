"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/LanguageContext"
import { translations } from "@/lib/translations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Eye, Edit, Trash2, FileText, Table } from "lucide-react"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"

interface SavedData {
  id: string
  type: "aiSystemRegistry" | "governanceCommittee"
  data: any
  createdAt: string
  updatedAt: string
}

export default function GestionDatos() {
  const { language } = useLanguage()
  const t = translations[language]
  const { toast } = useToast()
  const [savedData, setSavedData] = useState<SavedData[]>([])
  const [selectedItem, setSelectedItem] = useState<SavedData | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  useEffect(() => {
    loadSavedData()
  }, [])

  const loadSavedData = () => {
    const aiSystems = JSON.parse(localStorage.getItem("aiSystems") || "[]")
    const committees = JSON.parse(localStorage.getItem("governanceCommittees") || "[]")

    const allData: SavedData[] = [
      ...aiSystems.map((item: any) => ({
        id: item.id || Date.now().toString(),
        type: "aiSystemRegistry" as const,
        data: item,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
      })),
      ...committees.map((item: any) => ({
        id: item.id || Date.now().toString(),
        type: "governanceCommittee" as const,
        data: item,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
      })),
    ]

    setSavedData(allData.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))
  }

  const deleteItem = (id: string, type: string) => {
    if (type === "aiSystemRegistry") {
      const aiSystems = JSON.parse(localStorage.getItem("aiSystems") || "[]")
      const updated = aiSystems.filter((item: any) => item.id !== id)
      localStorage.setItem("aiSystems", JSON.stringify(updated))
    } else {
      const committees = JSON.parse(localStorage.getItem("governanceCommittees") || "[]")
      const updated = committees.filter((item: any) => item.id !== id)
      localStorage.setItem("governanceCommittees", JSON.stringify(updated))
    }

    loadSavedData()
    toast({
      title: t.itemDeleted,
      description: t.itemDeletedSuccess,
    })
  }

  const exportToExcel = (items: SavedData[]) => {
    const workbook = XLSX.utils.book_new()

    // Separar por tipo
    const aiSystems = items.filter((item) => item.type === "aiSystemRegistry")
    const committees = items.filter((item) => item.type === "governanceCommittee")

    if (aiSystems.length > 0) {
      const aiData = aiSystems.map((item) => ({
        ID: item.id,
        [t.systemName]: item.data.systemName || "",
        [t.riskLevel]: item.data.riskLevel || "",
        [t.createdAt]: new Date(item.createdAt).toLocaleDateString(),
        [t.updatedAt]: new Date(item.updatedAt).toLocaleDateString(),
      }))
      const aiSheet = XLSX.utils.json_to_sheet(aiData)
      XLSX.utils.book_append_sheet(workbook, aiSheet, t.aiSystemRegistry)
    }

    if (committees.length > 0) {
      const committeeData = committees.map((item) => ({
        ID: item.id,
        [t.committeeName]: item.data.committeeName || "",
        [t.createdAt]: new Date(item.createdAt).toLocaleDateString(),
        [t.updatedAt]: new Date(item.updatedAt).toLocaleDateString(),
      }))
      const committeeSheet = XLSX.utils.json_to_sheet(committeeData)
      XLSX.utils.book_append_sheet(workbook, committeeSheet, t.governanceCommittee)
    }

    XLSX.writeFile(workbook, `governance-data-${new Date().toISOString().split("T")[0]}.xlsx`)

    toast({
      title: t.exportSuccess,
      description: t.exportSuccessDescription,
    })
  }

  const exportToPDF = (items: SavedData[]) => {
    const doc = new jsPDF()
    let yPosition = 20

    doc.setFontSize(16)
    doc.text("AI Governance Data Report", 20, yPosition)
    yPosition += 20

    items.forEach((item, index) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(12)
      doc.text(
        `${index + 1}. ${item.type === "aiSystemRegistry" ? t.aiSystemRegistry : t.governanceCommittee}`,
        20,
        yPosition,
      )
      yPosition += 10

      doc.setFontSize(10)
      doc.text(`ID: ${item.id}`, 25, yPosition)
      yPosition += 7
      doc.text(`${t.createdAt}: ${new Date(item.createdAt).toLocaleDateString()}`, 25, yPosition)
      yPosition += 7
      doc.text(`${t.updatedAt}: ${new Date(item.updatedAt).toLocaleDateString()}`, 25, yPosition)
      yPosition += 15
    })

    doc.save(`governance-report-${new Date().toISOString().split("T")[0]}.pdf`)

    toast({
      title: t.exportSuccess,
      description: t.exportSuccessDescription,
    })
  }

  const getTypeLabel = (type: string) => {
    return type === "aiSystemRegistry" ? t.aiSystemRegistry : t.governanceCommittee
  }

  const getTypeBadgeColor = (type: string) => {
    return type === "aiSystemRegistry" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.dataManagement}</h1>
          <p className="text-gray-600 mt-2">{t.dataManagementDescription}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportToExcel(savedData)} variant="outline" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            {t.exportExcel}
          </Button>
          <Button onClick={() => exportToPDF(savedData)} variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t.exportPDF}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">{t.allData}</TabsTrigger>
          <TabsTrigger value="aiSystemRegistry">{t.aiSystemRegistry}</TabsTrigger>
          <TabsTrigger value="governanceCommittee">{t.governanceCommittee}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {savedData.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {item.data.systemName ||
                        item.data.committeeName ||
                        `${getTypeLabel(item.type)} - ${item.id.slice(-8)}`}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeBadgeColor(item.type)}>{getTypeLabel(item.type)}</Badge>
                      {item.data.riskLevel && <Badge variant="outline">{item.data.riskLevel}</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{t.viewDetails}</DialogTitle>
                          <DialogDescription>
                            {getTypeLabel(selectedItem?.type || "")} - {selectedItem?.id}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {selectedItem && (
                            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                              {JSON.stringify(selectedItem.data, null, 2)}
                            </pre>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const route =
                          item.type === "aiSystemRegistry" ? "/registro-sistemas-ia" : "/comite-gobernanza-ia"
                        window.location.href = `${route}?edit=${item.id}`
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t.confirmDelete}</AlertDialogTitle>
                          <AlertDialogDescription>{t.confirmDeleteDescription}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteItem(item.id, item.type)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {t.delete}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>
                      {t.createdAt}: {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      {t.updatedAt}: {new Date(item.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {savedData.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">{t.noDataFound}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="aiSystemRegistry">
          <div className="grid gap-4">
            {savedData
              .filter((item) => item.type === "aiSystemRegistry")
              .map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{item.data.systemName || `AI System - ${item.id.slice(-8)}`}</CardTitle>
                    <CardDescription>
                      {t.riskLevel}: {item.data.riskLevel || t.notSpecified}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="governanceCommittee">
          <div className="grid gap-4">
            {savedData
              .filter((item) => item.type === "governanceCommittee")
              .map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{item.data.committeeName || `Committee - ${item.id.slice(-8)}`}</CardTitle>
                    <CardDescription>
                      {t.createdAt}: {new Date(item.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
