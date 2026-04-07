import Image from "next/image"
import { ArrowUpRight, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const contactEmail = "alicia@davara.com.mx"
const contactHref = `mailto:${contactEmail}?subject=${encodeURIComponent("Quiero adquirir Alicia")}`

export default function AliciaPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Card className="relative overflow-hidden border-[hsl(var(--brand-border))] bg-white shadow-[0_24px_70px_rgba(15,118,110,0.12)] dark:bg-[hsl(var(--brand-surface))]">
          <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-soft blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[hsl(var(--brand-muted))] blur-3xl" />

          <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="space-y-8">
              <span className="inline-flex w-fit items-center rounded-full border border-[hsl(var(--brand-border))] bg-[hsl(var(--brand-muted))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[hsl(var(--brand-deep))]">
                Davara Governance
              </span>

              <div className="space-y-6">
                <div
                  className="inline-flex rounded-[28px] p-5 shadow-[0_22px_40px_rgba(15,118,110,0.18)]"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--brand-deep)) 100%)",
                  }}
                >
                  <div className="relative h-16 w-[220px] sm:h-20 sm:w-[280px]">
                    <Image
                      src="/images/Alicia_Sin_Despachos.png"
                      alt="Alicia"
                      fill
                      priority
                      sizes="(min-width: 640px) 280px, 220px"
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="max-w-2xl space-y-4">
                  <h1 className="text-3xl font-semibold tracking-tight text-[hsl(var(--brand-deep))] dark:text-white sm:text-4xl">
                    Tu asistente legal con IA
                  </h1>
                  <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
                    Asistente legal con IA desarrollado por Davara Governance, pensado para acompañar flujos jurídicos con una experiencia clara y segura.
                  </p>
                  <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
                    Para adquirir Alicia, contáctanos y te acompañamos en una implementación personalizada para tu operación.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-[28px] border border-white/10 p-6 text-white shadow-[0_18px_44px_rgba(15,118,110,0.2)]"
              style={{
                background: "linear-gradient(160deg, hsl(var(--primary)) 0%, hsl(var(--brand-deep)) 100%)",
              }}
            >
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.24em] text-white/70">
                <Mail className="h-4 w-4" />
                <span>Escríbenos a</span>
              </div>

              <a
                href={contactHref}
                className="mt-6 block break-all text-lg font-semibold tracking-tight text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white"
              >
                {contactEmail}
              </a>

              <p className="mt-4 text-sm leading-6 text-white/80">
                Implementación personalizada para tu operación, con acompañamiento directo del equipo de Davara Governance.
              </p>

              <Button
                asChild
                className="mt-8 h-11 w-full rounded-full bg-white text-[hsl(var(--brand-deep))] shadow-none hover:bg-[hsl(var(--brand-soft))]"
              >
                <a href={contactHref}>
                  Quiero adquirir Alicia
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
