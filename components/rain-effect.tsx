"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function RainEffect() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || resolvedTheme !== "midnight") {
    return null
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="rain-drop absolute h-4 w-px bg-gradient-to-b from-transparent via-primary/30 to-primary/10"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.8 + Math.random() * 0.4}s`,
          }}
        />
      ))}
    </div>
  )
}
