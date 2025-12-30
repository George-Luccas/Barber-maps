"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Isso garante que o botão só apareça após a página carregar no celular/PC
  // Evitando erros de renderização
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="p-5" /> // Espaço reservado enquanto carrega
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-card border-border size-11 rounded-full"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Moon className="size-5 transition-all" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400 transition-all" />
      )}
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}