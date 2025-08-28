"use client"

import AISystemRegistry from "../con-terceros/page"
import DesarrolloPropioSection from "./DesarrolloPropioSection"

export default function RegistroPropioPage() {
  return (
    <div className="space-y-8">
      <AISystemRegistry />
      <DesarrolloPropioSection />
    </div>
  )
}
