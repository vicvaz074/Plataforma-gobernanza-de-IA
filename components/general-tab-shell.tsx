"use client"

import { type ReactNode } from "react"
import { ChevronLeft, Menu, type LucideIcon } from "lucide-react"

export type GeneralTabShellNavItem = {
  id?: string
  href?: string
  label: string
  shortLabel?: string
  mobileLabel?: string
  icon: LucideIcon
  badge?: number | string
  activePaths?: string[]
}

type HeaderBadgeTone = "primary" | "positive" | "warning" | "critical" | "neutral"

type HeaderBadge = {
  label: string
  tone?: HeaderBadgeTone
}

type GeneralTabShellProps = {
  moduleLabel: string
  moduleTitle: string
  moduleDescription: string
  pageLabel: string
  pageTitle: string
  pageDescription?: string
  navItems: GeneralTabShellNavItem[]
  headerBadges?: HeaderBadge[]
  actions?: ReactNode
  children: ReactNode
  pathname?: string
  activeNavId?: string
  onNavSelect?: (itemId: string) => void
  onNavigate?: (href: string) => void
  backHref?: string
  backLabel?: string
  contentClassName?: string
}

function badgeToneClasses(tone: HeaderBadgeTone = "neutral") {
  if (tone === "positive") return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (tone === "warning") return "border-amber-200 bg-amber-50 text-amber-700"
  if (tone === "critical") return "border-red-200 bg-red-50 text-red-700"
  if (tone === "primary") return "border-[#9adad6] bg-[#e6f6f5] text-[#017d77]"
  return "border-slate-200 bg-slate-50 text-slate-700"
}

function isRouteItemActive(pathname: string, item: GeneralTabShellNavItem) {
  if (!item.href) return false
  const basePath = item.href.split("?")[0]
  const matchTargets = item.activePaths?.length ? item.activePaths : [basePath]

  return matchTargets.some((target) => {
    const normalized = target.endsWith("/") && target.length > 1 ? target.slice(0, -1) : target
    if (pathname === normalized) return true
    return pathname.startsWith(`${normalized}/`)
  })
}

export function GeneralTabShell({
  moduleLabel,
  moduleTitle,
  moduleDescription,
  pageLabel,
  pageTitle,
  pageDescription,
  navItems,
  headerBadges = [],
  actions,
  children,
  pathname = "",
  activeNavId,
  onNavSelect,
  onNavigate,
  backHref = "/dashboard",
  backLabel = "Volver",
  contentClassName = "",
}: GeneralTabShellProps) {
  const resolvedItems = navItems.map((item, index) => {
    const key = item.id || item.href || `${item.label}-${index}`
    const value = item.id || item.href || key
    const active = activeNavId ? activeNavId === value : isRouteItemActive(pathname, item)
    return { ...item, key, value, active }
  })

  const activeItem = resolvedItems.find((item) => item.active) || resolvedItems[0]

  const renderItem = (item: (typeof resolvedItems)[number], mobile = false) => {
    const Icon = item.icon
    const label = mobile ? item.mobileLabel || item.label : item.shortLabel || item.label
    const classes = [
      "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors",
      item.active
        ? "bg-white text-[#015f5b] shadow-[0_12px_24px_rgba(1,167,158,0.16)]"
        : "text-[#2e6b67] hover:bg-white/80 hover:text-[#015f5b]",
    ].join(" ")

    const content = (
      <>
        <span className={`h-2.5 w-2.5 rounded-full ${item.active ? "bg-[#01A79E]" : "bg-[#82d7d1]"}`} />
        <Icon className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {item.badge !== undefined ? (
          <span className="rounded-full bg-[#d7f4f1] px-2 py-0.5 text-[10px] font-semibold text-[#017d77]">
            {item.badge}
          </span>
        ) : null}
      </>
    )

    if (item.href) {
      return (
        <a
          key={item.key}
          href={item.href}
          className={classes}
          onClick={(e) => {
            if (!onNavigate) return
            e.preventDefault()
            onNavigate(item.href!)
          }}
        >
          {content}
        </a>
      )
    }

    return (
      <button key={item.key} type="button" className={classes} onClick={() => onNavSelect?.(item.value)}>
        {content}
      </button>
    )
  }

  return (
    <div className="min-h-[calc(100vh-7rem)] bg-[radial-gradient(circle_at_top_left,_rgba(1,167,158,0.08),_transparent_32%),linear-gradient(180deg,_#f6fffe_0%,_#ffffff_100%)]">
      <div className="mx-auto max-w-[1460px] px-4 py-6 lg:flex lg:gap-0">
        <aside className="hidden lg:flex lg:w-[260px] lg:shrink-0 lg:flex-col lg:rounded-l-[34px] lg:border lg:border-r-0 lg:border-[#c8ebe9] lg:bg-[#ebf8f7] lg:p-4">
          <a href={backHref} className="mb-4 inline-flex items-center gap-1 text-sm text-[#2e6b67]">
            <ChevronLeft className="h-4 w-4" />
            {backLabel}
          </a>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2e6b67]">{moduleLabel}</p>
          <p className="text-xs text-[#4f817d] mt-1">{moduleDescription}</p>
          <p className="mb-4 mt-2 text-xl font-semibold text-[#015f5b]">{moduleTitle}</p>
          <nav className="space-y-1">{resolvedItems.map((item) => renderItem(item))}</nav>
        </aside>

        <section className="min-w-0 flex-1 overflow-hidden rounded-[34px] border border-[#d2ebe9] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:rounded-l-none">
          <header className="border-b border-[#dcefed] px-4 py-4 sm:px-6">
            <details className="mb-4 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-2xl border border-[#cfeae8] bg-[#f6fffe] px-4 py-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2e6b67]">{moduleTitle}</p>
                  <p className="text-sm font-medium text-[#015f5b]">{activeItem?.mobileLabel || activeItem?.label}</p>
                </div>
                <Menu className="h-4 w-4 text-[#4f817d]" />
              </summary>
              <div className="mt-3 space-y-1 rounded-2xl bg-[#ebf8f7] p-3">{resolvedItems.map((item) => renderItem(item, true))}</div>
            </details>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#567874]">{pageLabel}</p>
                <h1 className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">{pageTitle}</h1>
                {pageDescription ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{pageDescription}</p> : null}
                {!!headerBadges.length && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {headerBadges.slice(0, 2).map((badge) => (
                      <span key={badge.label} className={`rounded-full border px-3 py-1 text-xs ${badgeToneClasses(badge.tone)}`}>
                        {badge.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
            </div>
          </header>

          <div className={`p-4 sm:p-6 ${contentClassName}`}>{children}</div>
        </section>
      </div>
    </div>
  )
}
