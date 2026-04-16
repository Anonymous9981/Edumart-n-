"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

type ThemeMode = "light" | "dark"

interface WebThemeContextValue {
  mode: ThemeMode
  isDark: boolean
  toggleTheme: () => void
}

const WebThemeContext = createContext<WebThemeContextValue | null>(null)
const STORAGE_KEY = "edumart-web-theme"

function resolveInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light"
  }

  const persisted = window.localStorage.getItem(STORAGE_KEY)
  if (persisted === "dark" || persisted === "light") {
    return persisted
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function WebThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light")

  useEffect(() => {
    setMode(resolveInitialTheme())
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute("data-theme", mode)
    root.classList.remove("light", "dark")
    root.classList.add(mode)
    window.localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const value = useMemo<WebThemeContextValue>(
    () => ({
      mode,
      isDark: mode === "dark",
      toggleTheme: () => setMode((current) => (current === "dark" ? "light" : "dark")),
    }),
    [mode],
  )

  return <WebThemeContext.Provider value={value}>{children}</WebThemeContext.Provider>
}

export function useWebTheme() {
  const context = useContext(WebThemeContext)
  if (!context) {
    throw new Error("useWebTheme must be used inside WebThemeProvider")
  }

  return context
}
