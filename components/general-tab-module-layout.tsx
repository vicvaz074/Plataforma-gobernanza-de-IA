"use client"

import { type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { GeneralTabShell } from "@/components/general-tab-shell"
import {
  generalTabModuleMeta,
  generalTabNavItems,
  type GeneralTabModuleKey,
} from "@/components/general-tab-shell-config"

type GeneralTabModuleLayoutProps = {
  moduleKey: GeneralTabModuleKey
  children: ReactNode
}

export function GeneralTabModuleLayout({ moduleKey, children }: GeneralTabModuleLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const moduleMeta = generalTabModuleMeta[moduleKey]

  return (
    <GeneralTabShell
      moduleLabel="Sistema de gobernanza"
      moduleTitle="Módulos operativos"
      moduleDescription="Navegación funcional de gobierno de IA"
      pageLabel={moduleMeta.pageLabel}
      pageTitle={moduleMeta.pageTitle}
      pageDescription={moduleMeta.pageDescription}
      navItems={generalTabNavItems}
      pathname={pathname}
      onNavigate={(href) => router.push(href)}
      backHref="/dashboard"
      backLabel="Volver al inicio"
    >
      {children}
    </GeneralTabShell>
  )
}
