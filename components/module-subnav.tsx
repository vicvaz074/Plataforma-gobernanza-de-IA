"use client"

import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type ModuleSubnavItem = {
  id: string
  label: string
  icon?: LucideIcon
  badge?: number | string
}

type ModuleSubnavProps = {
  items: ModuleSubnavItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

export function ModuleSubnav({ items, activeId, onChange, className }: ModuleSubnavProps) {
  return (
    <div className={cn("rounded-[28px] border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))] p-2", className)}>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const Icon = item.icon
          const active = item.id === activeId

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-white text-[hsl(var(--brand-deep))] shadow-[0_12px_24px_rgba(2,48,46,0.12)]"
                  : "text-[hsl(var(--brand-deep))]/72 hover:bg-white/75 hover:text-[hsl(var(--brand-deep))]",
              )}
            >
              {Icon ? <Icon className="h-4 w-4" /> : null}
              <span>{item.label}</span>
              {item.badge !== undefined ? (
                <span className="rounded-full bg-[hsl(var(--primary))]/12 px-2 py-0.5 text-[10px] font-semibold text-[hsl(var(--brand-deep))]">
                  {item.badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
