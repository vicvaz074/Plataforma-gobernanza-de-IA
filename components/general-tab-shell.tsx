"use client"

import Link from "next/link"
import { type ReactNode, useEffect, useRef, useState } from "react"
import { ChevronLeft, Menu, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export type GeneralTabShellNavItem = {
  id?: string
  href?: string
  label: string
  shortLabel?: string
  mobileLabel?: string
  icon: LucideIcon
  badge?: number | string
  activePaths?: string[]
  group?: string
}

export type GeneralTabShellBadgeTone = "primary" | "positive" | "warning" | "critical" | "neutral"

export type GeneralTabShellBadge = {
  label: string
  tone?: GeneralTabShellBadgeTone
}

type GeneralTabShellProps = {
  moduleLabel: string
  moduleTitle: string
  moduleDescription: string
  pageLabel: string
  pageTitle: string
  pageDescription?: string
  navItems: GeneralTabShellNavItem[]
  headerBadges?: GeneralTabShellBadge[]
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

type DesktopLayout = {
  height: number
  left: number
  top: number
  width: number
  sidebarWidth: number
}

const DESKTOP_BREAKPOINT = 1024
const HEADER_OFFSET = 96
const VIEWPORT_PADDING = 24

function badgeToneClasses(tone: GeneralTabShellBadgeTone = "neutral") {
  if (tone === "positive") return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (tone === "warning") return "border-amber-200 bg-amber-50 text-amber-700"
  if (tone === "critical") return "border-red-200 bg-red-50 text-red-700"
  if (tone === "primary") return "border-transparent bg-[hsl(var(--primary))]/12 text-[hsl(var(--brand-deep))]"
  return "border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))] text-[hsl(var(--brand-deep))]"
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
  backHref = "/",
  backLabel = "Volver",
  contentClassName = "",
}: GeneralTabShellProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [desktopLayout, setDesktopLayout] = useState<DesktopLayout | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const updateLayout = () => {
      if (!rootRef.current || typeof window === "undefined") return

      if (window.innerWidth < DESKTOP_BREAKPOINT) {
        setDesktopLayout(null)
        return
      }

      const rect = rootRef.current.getBoundingClientRect()
      const sidebarWidth = sidebarRef.current?.offsetWidth ?? 272
      const height = Math.max(window.innerHeight - HEADER_OFFSET - VIEWPORT_PADDING, 560)

      setDesktopLayout({
        height,
        left: rect.left,
        top: HEADER_OFFSET,
        width: rect.width,
        sidebarWidth,
      })
    }

    updateLayout()

    const resizeObserver = new ResizeObserver(updateLayout)

    if (rootRef.current) resizeObserver.observe(rootRef.current)
    if (sidebarRef.current) resizeObserver.observe(sidebarRef.current)

    window.addEventListener("resize", updateLayout)
    window.addEventListener("scroll", updateLayout, { passive: true })

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateLayout)
      window.removeEventListener("scroll", updateLayout)
    }
  }, [])

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
    const classes = cn(
      "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200",
      item.active
        ? "bg-white text-[hsl(var(--brand-deep))] shadow-[0_16px_32px_rgba(2,48,46,0.12)]"
        : "text-[hsl(var(--brand-deep))]/72 hover:bg-white/80 hover:text-[hsl(var(--brand-deep))]",
    )

    const content = (
      <>
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full transition-colors",
            item.active ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--primary))]/35",
          )}
        />
        <Icon className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {item.badge !== undefined ? (
          <span className="rounded-full bg-[hsl(var(--primary))]/12 px-2.5 py-0.5 text-[10px] font-semibold text-[hsl(var(--brand-deep))]">
            {item.badge}
          </span>
        ) : null}
      </>
    )

    if (item.href && !onNavigate && !onNavSelect) {
      return (
        <Link key={item.key} href={item.href} className={classes} onClick={() => setMobileNavOpen(false)}>
          {content}
        </Link>
      )
    }

    const handleClick = () => {
      if (item.href && onNavigate) {
        onNavigate(item.href)
      } else {
        onNavSelect?.(item.value)
      }
      setMobileNavOpen(false)
    }

    return (
      <button key={item.key} type="button" className={classes} onClick={handleClick}>
        {content}
      </button>
    )
  }

  const renderNav = (mobile = false) => {
    let lastGroup: string | undefined

    return (
      <nav className="space-y-1">
        {resolvedItems.map((item) => {
          const showGroup = item.group && item.group !== lastGroup
          lastGroup = item.group

          return (
            <div key={item.key}>
              {showGroup ? (
                <p className="px-3 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--brand-deep))]/50">
                  {item.group}
                </p>
              ) : null}
              {renderItem(item, mobile)}
            </div>
          )
        })}
      </nav>
    )
  }

  const panelHeader = (
    <header className="border-b border-[hsl(var(--brand-border))] px-4 py-4 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-3 lg:hidden">
            <Button
              variant="outline"
              size="icon"
              className="border-[hsl(var(--brand-border))] bg-white/90 text-[hsl(var(--brand-deep))]"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--brand-deep))]/55">
                {moduleTitle}
              </p>
              <p className="truncate text-sm font-medium text-[hsl(var(--brand-deep))]">
                {activeItem?.mobileLabel || activeItem?.label}
              </p>
            </div>
          </div>
          <p className="text-sm font-medium text-[hsl(var(--brand-deep))]/65">{pageLabel}</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">{pageTitle}</h1>
          {pageDescription ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{pageDescription}</p> : null}
          {!!headerBadges.length && (
            <div className="mt-4 flex flex-wrap gap-2">
              {headerBadges.map((badge) => (
                <span key={badge.label} className={cn("rounded-full border px-3 py-1 text-xs font-medium", badgeToneClasses(badge.tone))}>
                  {badge.label}
                </span>
              ))}
            </div>
          )}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )

  const panelBody = desktopLayout ? (
    <ScrollArea className="min-h-0 flex-1">
      <div className={cn("p-4 sm:p-6", contentClassName)}>{children}</div>
    </ScrollArea>
  ) : (
    <div className={cn("p-4 sm:p-6", contentClassName)}>{children}</div>
  )

  return (
    <div ref={rootRef} className="relative brand-shell-background">
      {desktopLayout ? <div className="hidden lg:block" style={{ height: desktopLayout.height }} /> : null}

      <div className="lg:hidden">
        <div className="rounded-[30px] border border-[hsl(var(--brand-border))] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          {panelHeader}
          {panelBody}
        </div>
      </div>

      {desktopLayout ? (
        <div className="hidden lg:block">
          <aside
            ref={sidebarRef}
            className="fixed overflow-hidden rounded-l-[34px] border border-r-0 border-[hsl(var(--brand-border))] bg-[linear-gradient(180deg,hsl(var(--brand-soft))_0%,hsl(var(--brand-muted))_100%)] p-4"
            style={{
              height: desktopLayout.height,
              left: desktopLayout.left,
              top: desktopLayout.top,
              width: desktopLayout.sidebarWidth,
            }}
          >
            <div className="flex h-full flex-col">
              <Link href={backHref} className="mb-4 inline-flex items-center gap-1 text-sm text-[hsl(var(--brand-deep))]/72">
                <ChevronLeft className="h-4 w-4" />
                {backLabel}
              </Link>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--brand-deep))]/55">{moduleLabel}</p>
              <p className="mt-2 text-2xl font-semibold text-[hsl(var(--brand-deep))]">{moduleTitle}</p>
              <p className="mt-3 text-sm leading-6 text-[hsl(var(--brand-deep))]/72">{moduleDescription}</p>
              <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1">{renderNav()}</div>
            </div>
          </aside>

          <section
            className="fixed flex overflow-hidden rounded-[34px] border border-[hsl(var(--brand-border))] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:rounded-l-none"
            style={{
              height: desktopLayout.height,
              left: desktopLayout.left + desktopLayout.sidebarWidth - 1,
              top: desktopLayout.top,
              width: desktopLayout.width - desktopLayout.sidebarWidth + 1,
            }}
          >
            <div className="flex min-h-0 flex-1 flex-col">
              {panelHeader}
              {panelBody}
            </div>
          </section>
        </div>
      ) : null}

      <Dialog open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DialogContent className="left-0 top-0 h-full w-[86vw] max-w-[320px] translate-x-0 translate-y-0 rounded-none border-r border-[hsl(var(--brand-border))] bg-white p-0 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
          <DialogTitle className="sr-only">{moduleTitle}</DialogTitle>
          <DialogDescription className="sr-only">{moduleDescription}</DialogDescription>
          <div className="flex h-full flex-col bg-[linear-gradient(180deg,hsl(var(--brand-soft))_0%,hsl(var(--brand-muted))_100%)] p-4">
            <Link href={backHref} className="mb-4 inline-flex items-center gap-1 text-sm text-[hsl(var(--brand-deep))]/72">
              <ChevronLeft className="h-4 w-4" />
              {backLabel}
            </Link>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--brand-deep))]/55">{moduleLabel}</p>
            <p className="mt-2 text-2xl font-semibold text-[hsl(var(--brand-deep))]">{moduleTitle}</p>
            <p className="mt-3 text-sm leading-6 text-[hsl(var(--brand-deep))]/72">{moduleDescription}</p>
            <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1">{renderNav(true)}</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
