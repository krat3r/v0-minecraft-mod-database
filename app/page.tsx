import Link from "next/link"
import { Pickaxe } from "lucide-react"
import { ModsGrid } from "@/components/mods-grid"
import { ThemeToggle } from "@/components/theme-toggle"
import { RainEffect } from "@/components/rain-effect"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Pickaxe className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">mctools</h1>
              <p className="text-xs text-muted-foreground">Minecraft Mod Database</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative border-b border-border bg-gradient-to-b from-muted/50 to-background overflow-hidden">
        <RainEffect />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
              Find Your Perfect Mod
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
              Discover and download the best Minecraft mods. From performance optimizers to epic adventure expansions.
            </p>
            <Link 
              href="/tutorial" 
              className="mt-6 inline-block text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
            >
              New to mods? Learn how to install them
            </Link>
          </div>
        </div>
      </section>

      {/* Mods Grid Section */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ModsGrid />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Pickaxe className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">mctools</span>
              </div>
              <Link 
                href="/admin" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin Panel
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Not affiliated with Mojang or Microsoft.
            </p>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground sm:mt-0">
            made with ❤️ by graveman
          </p>
        </div>
      </footer>
    </div>
  )
}
