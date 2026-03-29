"use client"

import { useTheme } from "next-themes"
import { useEffect, useState, useMemo } from "react"

export function RainEffect() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate rain drops with stable random values
  const rainDrops = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${(i * 1.7) % 100}%`,
      delay: `${(i * 0.05) % 2}s`,
      duration: `${0.6 + (i % 5) * 0.1}s`,
      height: `${12 + (i % 4) * 4}px`,
    }))
  }, [])

  if (!mounted || resolvedTheme !== "midnight") {
    return null
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {rainDrops.map((drop) => (
        <div
          key={drop.id}
          className="absolute w-px bg-gradient-to-b from-transparent via-sky-400/40 to-sky-300/20"
          style={{
            left: drop.left,
            top: "-20px",
            height: drop.height,
            animation: `rain-fall ${drop.duration} linear infinite`,
            animationDelay: drop.delay,
          }}
        />
      ))}
    </div>
  )
}
