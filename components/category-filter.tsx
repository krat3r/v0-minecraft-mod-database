"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(category)}
          className={cn(
            "transition-all",
            selected === category
              ? "bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
