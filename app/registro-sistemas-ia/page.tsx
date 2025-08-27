"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function RegistroSistemasIndex() {
  return (
    <div className="p-6 space-y-4">
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/registro-sistemas-ia/terceros">
          <Card className="cursor-pointer hover:bg-gray-50">
            <CardHeader>
              <CardTitle>Registro de sistemas con terceros</CardTitle>
            </CardHeader>
            <CardContent>
              Registra sistemas de IA provistos por terceros.
            </CardContent>
          </Card>
        </Link>
        <Link href="/registro-sistemas-ia/propio">
          <Card className="cursor-pointer hover:bg-gray-50">
            <CardHeader>
              <CardTitle>Registro de sistemas propio</CardTitle>
            </CardHeader>
            <CardContent>
              Registra sistemas de IA desarrollados internamente.
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
