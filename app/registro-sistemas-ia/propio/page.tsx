"use client"

// Cuestionario de registro general reutilizado desde la sección con terceros
import AISystemRegistry from "../con-terceros/page"
// Cuestionario propio ya existente
import DesarrolloPropioSection from "./DesarrolloPropioSection"

export default function RegistroPropioPage() {
  return (
    <div className="space-y-8">
      {/* Primero, formulario de registro general */}
      <AISystemRegistry />
      {/* Luego, el cuestionario adicional de desarrollo propio */}
      <DesarrolloPropioSection />
    </div>
  )
}
