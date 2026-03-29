"use client"

import { Download } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Mod } from "@/lib/mods-data"

interface ModCardProps {
  mod: Mod
}

function formatDownloads(num: number | undefined): string {
  if (!num) return "N/A"
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function ModCard({ mod }: ModCardProps) {
  return (
    <Card className="group overflow-hidden border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            <img
              src={mod.logo}
              alt={`${mod.name} logo`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {mod.name}
              </h3>
              <Badge variant="secondary" className="shrink-0 bg-secondary text-secondary-foreground">
                {mod.category}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              by {mod.author}
            </p>
          </div>
        </div>
        <p className="mt-4 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
          {mod.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs border-border">
            v{mod.version}
          </Badge>
          {mod.minecraftVersions.slice(0, 2).map((version) => (
            <Badge key={version} variant="outline" className="text-xs border-border">
              MC {version}
            </Badge>
          ))}
          {mod.minecraftVersions.length > 2 && (
            <Badge variant="outline" className="text-xs border-border">
              +{mod.minecraftVersions.length - 2} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t border-border bg-muted/30 px-6 py-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Download className="h-4 w-4" />
            <span>{formatDownloads(mod.downloads)}</span>
          </div>
          <Button asChild size="sm" className="gap-2">
            <a href={mod.downloadUrl} download>
              Download .jar
              <Download className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
