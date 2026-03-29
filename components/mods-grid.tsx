"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { mods, categories } from "@/lib/mods-data"
import { ModCard } from "@/components/mod-card"
import { SearchInput } from "@/components/search-input"
import { CategoryFilter } from "@/components/category-filter"
import { Package } from "lucide-react"

export function ModsGrid() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({})

  // Fetch download counts on mount
  useEffect(() => {
    async function fetchDownloadCounts() {
      try {
        const response = await fetch("/api/downloads")
        if (response.ok) {
          const counts = await response.json()
          setDownloadCounts(counts)
        }
      } catch (error) {
        console.error("Failed to fetch download counts:", error)
      }
    }
    
    fetchDownloadCounts()
  }, [])

  // Handle download - increment count optimistically
  const handleDownload = useCallback(async (modId: string) => {
    // Optimistic update
    setDownloadCounts((prev) => ({
      ...prev,
      [modId]: (prev[modId] || 0) + 1,
    }))

    // Track download in backend
    try {
      await fetch(`/api/downloads/${modId}`, { method: "POST" })
    } catch (error) {
      console.error("Failed to track download:", error)
    }
  }, [])

  const filteredMods = useMemo(() => {
    return mods.filter((mod) => {
      const matchesSearch =
        mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.author.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === "All" || mod.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search mods by name, description, or author..."
        />
        <div className="text-sm text-muted-foreground">
          {filteredMods.length} mod{filteredMods.length !== 1 ? "s" : ""} found
        </div>
      </div>

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {filteredMods.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMods.map((mod) => (
            <ModCard 
              key={mod.id} 
              mod={mod} 
              downloadCount={downloadCounts[mod.id] || 0}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No mods found
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  )
}
