"use client"

import { useEffect, useState } from "react"
import { Bot, Building2, ChevronRight, Cpu, FileText, LayoutDashboard } from "lucide-react"

import AISystemRegistryForm from "@/app/registro-sistemas-ia/AISystemRegistryForm"
import DesarrolloPropioSection from "@/app/registro-sistemas-ia/propio/DesarrolloPropioSection"
import { GeneralTabShell, type GeneralTabShellBadge, type GeneralTabShellNavItem } from "@/components/general-tab-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AI_REGISTRY_STORAGE_UPDATED_EVENT,
  ensureAISystemsRegistrySeeded,
  filterAISystemsByMode,
} from "@/lib/ai-registry"

type RegistryWorkspaceTab = "home" | "third-party" | "own"
type OwnWorkspaceTab = "general" | "documentation"

type AIRegistryWorkspaceProps = {
  initialTab?: RegistryWorkspaceTab
  initialOwnTab?: OwnWorkspaceTab
}

export function AIRegistryWorkspace({
  initialTab = "home",
  initialOwnTab = "general",
}: AIRegistryWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<RegistryWorkspaceTab>(initialTab)
  const [thirdPartyCount, setThirdPartyCount] = useState(0)
  const [ownSystemsCount, setOwnSystemsCount] = useState(0)
  const [documentationCount, setDocumentationCount] = useState(0)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    const syncCounts = () => {
      const { systems } = ensureAISystemsRegistrySeeded(window.localStorage)
      const docs = localStorage.getItem("aiTechnicalDocuments")

      setThirdPartyCount(filterAISystemsByMode(systems, "third-party").length)
      setOwnSystemsCount(filterAISystemsByMode(systems, "own").length)
      setDocumentationCount(docs ? JSON.parse(docs).length : 0)
    }

    syncCounts()
    window.addEventListener("storage", syncCounts)
    window.addEventListener(AI_REGISTRY_STORAGE_UPDATED_EVENT, syncCounts as EventListener)

    return () => {
      window.removeEventListener("storage", syncCounts)
      window.removeEventListener(AI_REGISTRY_STORAGE_UPDATED_EVENT, syncCounts as EventListener)
    }
  }, [])

  const navItems: GeneralTabShellNavItem[] = [
    { id: "home", label: "Inicio", mobileLabel: "Inicio", icon: LayoutDashboard },
    { id: "third-party", label: "Con terceros", mobileLabel: "Con terceros", icon: Building2, badge: thirdPartyCount || undefined },
    { id: "own", label: "Desarrollo propio", mobileLabel: "Desarrollo propio", icon: Cpu, badge: ownSystemsCount || undefined },
  ]

  const shellMeta = {
    home: {
      pageLabel: "Resumen del módulo",
      pageTitle: "Registro de sistemas de IA",
      pageDescription:
        "Centraliza el inventario de sistemas de IA de terceros y desarrollos propios desde una misma workspace operativa.",
      badges: [
        { label: `${thirdPartyCount + ownSystemsCount} sistemas registrados`, tone: "primary" },
        { label: `${documentationCount} documentos técnicos`, tone: "neutral" },
      ] satisfies GeneralTabShellBadge[],
    },
    "third-party": {
      pageLabel: "Sistemas con terceros",
      pageTitle: "Registro y seguimiento de sistemas externos",
      pageDescription:
        "Documenta sistemas provistos por terceros, conserva evidencia regulatoria y consulta el inventario registrado.",
      badges: [{ label: `${thirdPartyCount} sistemas`, tone: "primary" }] satisfies GeneralTabShellBadge[],
    },
    own: {
      pageLabel: "Desarrollo propio",
      pageTitle: "Gestión de desarrollos internos de IA",
      pageDescription:
        "Agrupa el registro general y la documentación técnica para sistemas desarrollados internamente por la organización.",
      badges: [
        { label: `${ownSystemsCount} sistemas propios`, tone: "primary" },
        { label: `${documentationCount} documentos`, tone: "neutral" },
      ] satisfies GeneralTabShellBadge[],
    },
  }[activeTab]

  return (
    <GeneralTabShell
      moduleLabel="Gobernanza IA"
      moduleTitle="Registro de sistemas de IA"
      moduleDescription="Workspace central para inventario, trazabilidad y evidencia de sistemas de IA de terceros y desarrollos propios."
      pageLabel={shellMeta.pageLabel}
      pageTitle={shellMeta.pageTitle}
      pageDescription={shellMeta.pageDescription}
      navItems={navItems}
      activeNavId={activeTab}
      onNavSelect={(itemId) => setActiveTab(itemId as RegistryWorkspaceTab)}
      headerBadges={shellMeta.badges}
      backHref="/"
      backLabel="Volver al inicio"
      actions={
        activeTab !== "home" ? (
          <Button variant="outline" onClick={() => setActiveTab("home")}>
            <LayoutDashboard className="h-4 w-4" />
            Resumen
          </Button>
        ) : null
      }
    >
      {activeTab === "home" ? (
        <div className="grid gap-5 xl:grid-cols-[1.35fr,1fr]">
          <Card className="border-brand bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--brand-deep))]">
                <Bot className="h-5 w-5 text-[hsl(var(--primary))]" />
                Panorama operativo
              </CardTitle>
              <CardDescription>
                Selecciona la macroárea desde la que quieres operar el registro.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setActiveTab("third-party")}
                className="rounded-[28px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))] p-5 text-left transition-all hover:border-[hsl(var(--primary))]/40 hover:bg-white"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--primary))]/12 text-[hsl(var(--primary))]">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-[hsl(var(--brand-deep))]">Con terceros</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Registro regulatorio para sistemas externos, contratos, evaluaciones y responsables del proveedor.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="outline" className="border-[hsl(var(--brand-border))] bg-white">
                    {thirdPartyCount} sistemas
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-[hsl(var(--brand-deep))]" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("own")}
                className="rounded-[28px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))] p-5 text-left transition-all hover:border-[hsl(var(--primary))]/40 hover:bg-white"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--primary))]/12 text-[hsl(var(--primary))]">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-[hsl(var(--brand-deep))]">Desarrollo propio</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Consolidación de registro general, cuestionarios técnicos y documentos para sistemas creados internamente.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="outline" className="border-[hsl(var(--brand-border))] bg-white">
                    {ownSystemsCount} sistemas
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-[hsl(var(--brand-deep))]" />
                </div>
              </button>
            </CardContent>
          </Card>

          <Card className="border-brand bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--brand-deep))]">
                <FileText className="h-5 w-5 text-[hsl(var(--primary))]" />
                Alcance del módulo
              </CardTitle>
              <CardDescription>
                La workspace unifica los dos flujos del registro sin alterar la lógica documental existente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl bg-[hsl(var(--brand-muted))] p-4">
                <p className="font-medium text-[hsl(var(--brand-deep))]">Con terceros</p>
                <p className="mt-1">Registrar, consultar y actualizar sistemas de IA desarrollados por proveedores externos.</p>
              </div>
              <div className="rounded-2xl bg-[hsl(var(--brand-muted))] p-4">
                <p className="font-medium text-[hsl(var(--brand-deep))]">Desarrollo propio</p>
                <p className="mt-1">Gestionar el registro general y la documentación técnica de desarrollos internos.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {activeTab === "third-party" ? <AISystemRegistryForm registryMode="third-party" embedded /> : null}

      {activeTab === "own" ? <DesarrolloPropioSection initialTab={initialOwnTab} integrated /> : null}
    </GeneralTabShell>
  )
}
