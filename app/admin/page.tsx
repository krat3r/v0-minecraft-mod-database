"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Pickaxe, Upload, Trash2, ArrowLeft, Plus, ImageIcon, FileArchive, Loader2, CheckCircle, Lock, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { categories, type Mod } from "@/lib/mods-data"

export default function AdminPage() {
  // Auth state - store actual password for API calls, not just a boolean
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  // Store the verified password for API calls (kept in memory only, not in sessionStorage)
  const adminPasswordRef = useRef<string>("")

  const [mods, setMods] = useState<Mod[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  // Form state
  const [modName, setModName] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [version, setVersion] = useState("")
  const [category, setCategory] = useState("Utility")
  const [minecraftVersions, setMinecraftVersions] = useState("")
  const [jarFile, setJarFile] = useState<File | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  // Fetch mods when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMods()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError("")

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        // Store password in ref for API calls (memory only, not exposed to client)
        adminPasswordRef.current = password
        setIsAuthenticated(true)
        setPassword("") // Clear the input field
      } else {
        setAuthError("Invalid password")
      }
    } catch {
      setAuthError("Authentication failed")
    } finally {
      setAuthLoading(false)
    }
  }

  function handleLogout() {
    setIsAuthenticated(false)
    adminPasswordRef.current = ""
    setPassword("")
    setMods([])
  }

  // Helper to get auth headers
  function getAuthHeaders(): HeadersInit {
    return {
      "Authorization": `Bearer ${adminPasswordRef.current}`,
    }
  }

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
      const response = await fetch("/api/mods/seed", { 
        method: "POST",
        headers: getAuthHeaders(),
      })
      
      if (response.status === 401) {
        handleLogout()
        setAuthError("Session expired. Please log in again.")
        return
      }
      
      const data = await response.json()
      if (data.success) {
        fetchMods()
      }
      alert(data.message)
    } catch (error) {
      console.error("Failed to seed database:", error)
    }
  }

  function resetForm() {
    setModName("")
    setAuthor("")
    setDescription("")
    setVersion("")
    setCategory("Utility")
    setMinecraftVersions("")
    setJarFile(null)
    setLogoFile(null)
    setLogoPreview(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!jarFile) {
      alert("Please select a .jar file to upload")
      return
    }

    if (!modName.trim() || !author.trim()) {
      alert("Please fill in the Mod Name and Author fields")
      return
    }

    setUploading(true)
    setSuccess(false)

    try {
      // Upload jar file to Vercel Blob
      const jarFormData = new FormData()
      jarFormData.append("file", jarFile)
      jarFormData.append("type", "jar")
      
      const jarResponse = await fetch("/api/upload", {
        method: "POST",
        headers: getAuthHeaders(),
        body: jarFormData,
      })
      
      if (jarResponse.status === 401) {
        handleLogout()
        setAuthError("Session expired. Please log in again.")
        return
      }
      
      if (!jarResponse.ok) {
        const errorData = await jarResponse.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `Upload failed with status ${jarResponse.status}`)
      }
      
      const jarData = await jarResponse.json()

      // Upload logo if provided - use pathname for private blob
      let logoPathname = ""
      
      if (logoFile) {
        const logoFormData = new FormData()
        logoFormData.append("file", logoFile)
        logoFormData.append("type", "logo")
        
        const logoResponse = await fetch("/api/upload", {
          method: "POST",
          headers: getAuthHeaders(),
          body: logoFormData,
        })
        
        if (logoResponse.ok) {
          const logoData = await logoResponse.json()
          logoPathname = logoData.pathname
        }
      }

      // Create mod entry in database - use pathnames for private blob storage
      const newMod: Mod = {
        id: modName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: modName,
        description: description || "No description provided.",
        version: version || "1.0.0",
        category: category,
        logo: logoPathname ? `/api/file?pathname=${encodeURIComponent(logoPathname)}` : "https://images.unsplash.com/photo-1633957897986-70e83293f3ff?w=128&h=128&fit=crop",
        downloadUrl: `/api/file?pathname=${encodeURIComponent(jarData.pathname)}`,
        author: author,
        minecraftVersions: minecraftVersions ? minecraftVersions.split(",").map((v) => v.trim()) : ["1.20.4"],
        downloads: 0,
      }

      const modResponse = await fetch("/api/mods", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMod),
      })

      if (modResponse.status === 401) {
        handleLogout()
        setAuthError("Session expired. Please log in again.")
        return
      }

      if (!modResponse.ok) {
        const error = await modResponse.json()
        throw new Error(error.error || "Failed to save mod")
      }

      // Success!
      setSuccess(true)
      resetForm()
      fetchMods()
      
      setTimeout(() => setSuccess(false), 3000)
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
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: modId }),
      })

      if (response.status === 401) {
        handleLogout()
        setAuthError("Session expired. Please log in again.")
        return
      }

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

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-xl">Admin Access</CardTitle>
            <CardDescription>
              Enter your admin password to manage mods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="h-11"
                  autoComplete="current-password"
                />
              </div>
              {authError && (
                <p className="text-sm text-destructive">{authError}</p>
              )}
              <Button type="submit" className="w-full h-11" disabled={authLoading}>
                {authLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Back to mctools
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin Panel (authenticated)
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Site</span>
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Add New Mod Section */}
        <Card className="mb-8 border-primary/20 bg-card">
          <CardHeader className="border-b border-border pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Add New Mod</CardTitle>
                <CardDescription>Upload a mod file and fill in the details below</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Main Fields: Mod Name and Author */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Mod Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="Enter mod name (e.g. OptiFine)"
                    value={modName}
                    onChange={(e) => setModName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Author <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="Enter author name (e.g. sp614x)"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>

              {/* File Uploads: .jar and Image */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Mod File (.jar) <span className="text-destructive">*</span>
                  </label>
                  <label className={`flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors ${jarFile ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}>
                    <FileArchive className={`h-6 w-6 ${jarFile ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm ${jarFile ? 'font-medium text-primary' : 'text-muted-foreground'}`}>
                      {jarFile ? jarFile.name : "Click to select .jar file"}
                    </span>
                    <input
                      type="file"
                      accept=".jar"
                      className="hidden"
                      onChange={(e) => setJarFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Mod Image <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <label className={`flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors ${logoFile ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}>
                    {logoPreview ? (
                      <img src={logoPreview} alt="Preview" className="h-12 w-12 rounded-lg object-cover" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    )}
                    <span className={`text-sm ${logoFile ? 'font-medium text-primary' : 'text-muted-foreground'}`}>
                      {logoFile ? logoFile.name : "Click to select image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
              </div>

              {/* Optional Details */}
              <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-sm font-medium text-muted-foreground">Optional Details</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm text-foreground">Version</label>
                    <Input
                      placeholder="1.0.0"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-foreground">Category</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-foreground">MC Versions</label>
                    <Input
                      placeholder="1.20.4, 1.20.1"
                      value={minecraftVersions}
                      onChange={(e) => setMinecraftVersions(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-foreground">Description</label>
                  <textarea
                    className="flex min-h-16 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="What does this mod do?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-4">
                <Button type="submit" disabled={uploading} size="lg" className="gap-2">
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Add Mod
                    </>
                  )}
                </Button>
                {success && (
                  <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Mod added successfully!
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Existing Mods Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Your Mods ({mods.length})</h2>
            {mods.length === 0 && (
              <Button variant="outline" size="sm" onClick={seedDatabase}>
                Load Example Mods
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : mods.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileArchive className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 font-semibold text-foreground">No mods yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add your first mod using the form above
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {mods.map((mod) => (
                <Card key={mod.id} className="border-border transition-colors hover:border-border/80">
                  <CardContent className="flex items-center gap-4 p-4">
                    <img
                      src={mod.logo}
                      alt={`${mod.name} logo`}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">{mod.name}</h3>
                        <Badge variant="secondary" className="text-xs">{mod.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">by {mod.author}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteMod(mod.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
