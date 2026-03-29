"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Pickaxe, Upload, Trash2, ArrowLeft, Plus, ImageIcon, FileArchive, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { categories, type Mod } from "@/lib/mods-data"

export default function AdminPage() {
  const [mods, setMods] = useState<Mod[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    version: "",
    category: "Utility",
    author: "",
    minecraftVersions: "",
  })
  const [jarFile, setJarFile] = useState<File | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  // Fetch mods on mount
  useEffect(() => {
    fetchMods()
  }, [])

  async function fetchMods() {
    try {
      const response = await fetch("/api/mods")
      if (response.ok) {
        const data = await response.json()
        setMods(data)
      }
    } catch (error) {
      console.error("Failed to fetch mods:", error)
    } finally {
      setLoading(false)
    }
  }

  async function seedDatabase() {
    try {
      const response = await fetch("/api/mods/seed", { method: "POST" })
      const data = await response.json()
      if (data.success) {
        fetchMods()
      }
      alert(data.message)
    } catch (error) {
      console.error("Failed to seed database:", error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!jarFile) {
      alert("Please upload a .jar file")
      return
    }

    setUploading(true)

    try {
      // Upload jar file
      const jarFormData = new FormData()
      jarFormData.append("file", jarFile)
      jarFormData.append("type", "jar")
      
      const jarResponse = await fetch("/api/upload", {
        method: "POST",
        body: jarFormData,
      })
      
      if (!jarResponse.ok) {
        throw new Error("Failed to upload .jar file")
      }
      
      const jarData = await jarResponse.json()

      // Upload logo if provided
      let logoUrl = "https://images.unsplash.com/photo-1633957897986-70e83293f3ff?w=128&h=128&fit=crop"
      
      if (logoFile) {
        const logoFormData = new FormData()
        logoFormData.append("file", logoFile)
        logoFormData.append("type", "logo")
        
        const logoResponse = await fetch("/api/upload", {
          method: "POST",
          body: logoFormData,
        })
        
        if (logoResponse.ok) {
          const logoData = await logoResponse.json()
          logoUrl = logoData.url
        }
      }

      // Create mod entry
      const newMod: Mod = {
        id: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: formData.name,
        description: formData.description,
        version: formData.version,
        category: formData.category,
        logo: logoUrl,
        downloadUrl: jarData.url,
        author: formData.author,
        minecraftVersions: formData.minecraftVersions.split(",").map((v) => v.trim()),
        downloads: 0,
      }

      const modResponse = await fetch("/api/mods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMod),
      })

      if (!modResponse.ok) {
        const error = await modResponse.json()
        throw new Error(error.error || "Failed to save mod")
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        version: "",
        category: "Utility",
        author: "",
        minecraftVersions: "",
      })
      setJarFile(null)
      setLogoFile(null)
      setLogoPreview(null)
      setShowForm(false)
      
      // Refresh mods list
      fetchMods()
      
      alert("Mod added successfully!")
    } catch (error) {
      console.error("Failed to add mod:", error)
      alert(error instanceof Error ? error.message : "Failed to add mod")
    } finally {
      setUploading(false)
    }
  }

  async function deleteMod(modId: string) {
    if (!confirm("Are you sure you want to delete this mod?")) return

    try {
      const response = await fetch("/api/mods", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: modId }),
      })

      if (response.ok) {
        setMods((prev) => prev.filter((mod) => mod.id !== modId))
      }
    } catch (error) {
      console.error("Failed to delete mod:", error)
    }
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Pickaxe className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">mctools</h1>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Site
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Manage Mods</h2>
            <p className="text-muted-foreground">Upload and manage your mod collection</p>
          </div>
          <div className="flex gap-2">
            {mods.length === 0 && (
              <Button variant="outline" onClick={seedDatabase}>
                Seed Default Mods
              </Button>
            )}
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Mod
            </Button>
          </div>
        </div>

        {/* Add Mod Form */}
        {showForm && (
          <Card className="mb-8 border-border">
            <CardHeader>
              <CardTitle>Add New Mod</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Mod Name *</label>
                    <Input
                      required
                      placeholder="e.g. OptiFine"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Author *</label>
                    <Input
                      required
                      placeholder="e.g. sp614x"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description *</label>
                  <textarea
                    required
                    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Describe what this mod does..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Version *</label>
                    <Input
                      required
                      placeholder="e.g. 1.0.0"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Category *</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.filter((c) => c !== "All").map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">MC Versions *</label>
                    <Input
                      required
                      placeholder="1.20.4, 1.20.1, 1.19.4"
                      value={formData.minecraftVersions}
                      onChange={(e) => setFormData({ ...formData, minecraftVersions: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Mod File (.jar) *</label>
                    <div className="flex items-center gap-2">
                      <label className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground">
                        <FileArchive className="h-4 w-4" />
                        {jarFile ? jarFile.name : "Choose .jar file"}
                        <input
                          type="file"
                          accept=".jar"
                          className="hidden"
                          onChange={(e) => setJarFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Logo Image (optional)</label>
                    <div className="flex items-center gap-2">
                      {logoPreview && (
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      )}
                      <label className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground">
                        <ImageIcon className="h-4 w-4" />
                        {logoFile ? logoFile.name : "Choose logo image"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={uploading} className="gap-2">
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload Mod
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Mods List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : mods.length === 0 ? (
          <Card className="border-border">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-4">
                <FileArchive className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">No mods yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Click &quot;Seed Default Mods&quot; to load example mods, or add your own.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {mods.map((mod) => (
              <Card key={mod.id} className="border-border">
                <CardContent className="flex items-center gap-4 p-4">
                  <img
                    src={mod.logo}
                    alt={`${mod.name} logo`}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{mod.name}</h3>
                      <Badge variant="secondary">{mod.category}</Badge>
                      <Badge variant="outline">v{mod.version}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">by {mod.author}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {mod.description}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteMod(mod.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-muted-foreground">
            made with ❤️ by graveman
          </p>
        </div>
      </footer>
    </div>
  )
}
