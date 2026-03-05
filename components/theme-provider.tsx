"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
<<<<<<< HEAD
import type { ThemeProviderProps } from "next-themes/dist/types"
=======
import { type ThemeProviderProps } from "next-themes"
>>>>>>> be37263 (fix: modify EIA module and upgrade it)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
