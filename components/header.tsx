"use client"

import type { CSSProperties } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/LanguageContext"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DESKTOP_SIDEBAR_COLLAPSED_WIDTH, DESKTOP_SIDEBAR_EXPANDED_WIDTH, useSidebar } from "@/lib/SidebarContext"
import { translations } from "@/lib/translations"
import { sortAlphabetically } from "@/lib/utils"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Moon, Sun, Globe, User, ChevronDown, LogOut, LayoutDashboard, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const { collapsed, setMobileOpen } = useSidebar()
  const router = useRouter()
  const t = translations[language]
  const [userName, setUserName] = useState("")
  const languageOptions = sortAlphabetically(["en", "es"])
  const sidebarOffset = collapsed ? DESKTOP_SIDEBAR_COLLAPSED_WIDTH : DESKTOP_SIDEBAR_EXPANDED_WIDTH

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName")
    if (storedUserName) {
      setUserName(storedUserName)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    router.push("/login")
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed left-0 right-0 top-0 z-30 border-b border-[hsl(var(--brand-border))] bg-white/92 backdrop-blur-md transition-all duration-300 ease-in-out dark:bg-gray-950/92 lg:left-[var(--header-offset)]"
      style={{ "--header-offset": `${sidebarOffset}px` } as CSSProperties}
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-[hsl(var(--brand-deep))] hover:bg-[hsl(var(--brand-muted))] lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          {collapsed && (
            <Link href="/" className="mr-2 hidden items-center lg:flex">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KCMkMWJluvEnrZ7kiJcIZwOaH63W1s.png"
                alt="Davara Governance"
                width={160}
                height={40}
                style={{ objectFit: "contain" }}
                priority
              />
            </Link>
          )}
          <div className="flex items-center">
            <h1 className="text-sm font-semibold text-[hsl(var(--brand-deep))] dark:text-white sm:text-lg">
              Plataforma de Gobernanza de IA
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Select value={language} onValueChange={(value: "es" | "en") => setLanguage(value)}>
            <SelectTrigger className="w-[76px] border-[hsl(var(--brand-border))] bg-white/80 sm:w-[100px]">
              <Globe className="mr-2 h-4 w-4" />
              <SelectValue placeholder={language.toUpperCase()} />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="gap-2 border-[hsl(var(--brand-border))] bg-white/70 text-[hsl(var(--brand-deep))] hover:bg-[hsl(var(--brand-muted))]"
            onClick={() => router.push("/")}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden lg:inline-block">Inicio</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 text-[hsl(var(--brand-deep))] hover:bg-[hsl(var(--brand-muted))]">
                <User className="h-4 w-4" />
                <span className="hidden md:inline-block">{userName || "Administrador"}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => router.push("/profile")}>{t.profile}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push("/settings")}>{t.settings}</DropdownMenuItem>
              <DropdownMenuItem onSelect={handleLogout}>
                <motion.div className="flex items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t.logout}
                </motion.div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className="text-[hsl(var(--brand-deep))] hover:bg-[hsl(var(--brand-muted))]"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: theme === "light" ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </motion.div>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
