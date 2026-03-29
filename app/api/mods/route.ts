import { Redis } from "@upstash/redis"
import { NextResponse } from "next/server"
import type { Mod } from "@/lib/mods-data"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const MODS_KEY = "mctools:mods"

// GET - Fetch all mods from Redis
export async function GET() {
  try {
    const mods = await redis.get<Mod[]>(MODS_KEY)
    return NextResponse.json(mods || [])
  } catch (error) {
    console.error("Failed to fetch mods:", error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - Add a new mod
export async function POST(request: Request) {
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

// DELETE - Remove a mod by ID
export async function DELETE(request: Request) {
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
