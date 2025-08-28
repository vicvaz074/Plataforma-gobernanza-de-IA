"use client"
import { useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Cpu, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import DesarrolloPropioSection from "@/app/registro-sistemas-ia/propio/DesarrolloPropioSection"

export default function RegistroGeneralPage() {
  const [showRegistroPropio, setShowRegistroPropio] = useState(false)

  if (showRegistroPropio) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowRegistroPropio(false)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a opciones de registro
          </Button>
        </div>
        <DesarrolloPropioSection />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Registro General de Sistemas de IA</h1>
        <p className="text-gray-600">Selecciona el tipo de sistema que deseas registrar</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/registro-sistemas-ia/con-terceros">
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-green-500/30 hover:-translate-y-1">
            <CardHeader className="text-center p-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-green-700 mb-3">Sistemas con Terceros</CardTitle>
              <CardDescription className="text-base leading-relaxed mb-4">
                Registra sistemas de IA desarrollados o proporcionados por terceros, incluyendo proveedores externos y
                soluciones comerciales
              </CardDescription>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  Externos
                </Badge>
                <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                  Comerciales
                </Badge>
                <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                  Proveedores
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Card
          className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-green-500/30 hover:-translate-y-1"
          onClick={() => setShowRegistroPropio(true)}
        >
          <CardHeader className="text-center p-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Cpu className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-green-700 mb-3">Desarrollos Propios</CardTitle>
            <CardDescription className="text-base leading-relaxed mb-4">
              Documenta sistemas de IA desarrollados internamente por tu organización, incluyendo modelos propios y
              soluciones personalizadas
            </CardDescription>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                Internos
              </Badge>
              <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200">
                Personalizados
              </Badge>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Propios
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
