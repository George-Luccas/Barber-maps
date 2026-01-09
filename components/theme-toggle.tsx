"use client"

import * as React from "react"
import { Moon, Sun, Eye } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="size-11" /> // Placeholder
  }

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("panther")
    } else {
      setTheme("light")
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-card border-border size-11 rounded-full relative overflow-hidden group"
      onClick={toggleTheme}
    >
        {theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 transition-all scale-100 rotate-0" />}
        {theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem] text-foreground transition-all scale-100 rotate-0" />}
        {theme === "panther" && <Eye className="h-[1.2rem] w-[1.2rem] text-neon-purple transition-all scale-100 rotate-0 animate-pulse" />}
      
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}