import { Redis } from "@upstash/redis"
import { NextRequest, NextResponse } from "next/server"
import type { Mod } from "@/lib/mods-data"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const MODS_KEY = "mctools:mods"

// Helper to verify admin password from Authorization header
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false
  }
  const password = authHeader.slice(7) // Remove "Bearer " prefix
  return password === process.env.ADMIN_PASSWORD
}

// GET - Fetch all mods from Redis (public - no auth needed)
export async function GET() {
  try {
    const mods = await redis.get<Mod[]>(MODS_KEY)
    return NextResponse.json(mods || [])
  } catch (error) {
    console.error("Failed to fetch mods:", error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - Add a new mod (protected - requires admin password)
export async function POST(request: NextRequest) {
  // Verify admin password
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const newMod: Mod = await request.json()
    
    // Validate required fields
    if (!newMod.id || !newMod.name || !newMod.downloadUrl) {
      return NextResponse.json(
        { error: "Missing required fields: id, name, downloadUrl" },
        { status: 400 }
      )
    }

    // Get existing mods
    const existingMods = await redis.get<Mod[]>(MODS_KEY) || []
    
    // Check if mod with same ID exists
    if (existingMods.some((mod) => mod.id === newMod.id)) {
      return NextResponse.json(
        { error: "Mod with this ID already exists" },
        { status: 409 }
      )
    }

    // Add new mod
    const updatedMods = [...existingMods, newMod]
    await redis.set(MODS_KEY, updatedMods)

    return NextResponse.json({ success: true, mod: newMod })
  } catch (error) {
    console.error("Failed to add mod:", error)
    return NextResponse.json({ error: "Failed to add mod" }, { status: 500 })
  }
}

// DELETE - Remove a mod by ID (protected - requires admin password)
export async function DELETE(request: NextRequest) {
  // Verify admin password
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: "Missing mod ID" }, { status: 400 })
    }

    const existingMods = await redis.get<Mod[]>(MODS_KEY) || []
    const updatedMods = existingMods.filter((mod) => mod.id !== id)
    
    await redis.set(MODS_KEY, updatedMods)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete mod:", error)
    return NextResponse.json({ error: "Failed to delete mod" }, { status: 500 })
  }
}
