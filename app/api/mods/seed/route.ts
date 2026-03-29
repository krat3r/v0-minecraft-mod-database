import { Redis } from "@upstash/redis"
import { NextResponse } from "next/server"
import { mods } from "@/lib/mods-data"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const MODS_KEY = "mctools:mods"

// POST - Seed the database with default mods (run once)
export async function POST() {
  try {
    const existingMods = await redis.get(MODS_KEY)
    
    if (existingMods) {
      return NextResponse.json({ 
        message: "Database already seeded", 
        count: Array.isArray(existingMods) ? existingMods.length : 0 
      })
    }

    await redis.set(MODS_KEY, mods)

    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully",
      count: mods.length 
    })
  } catch (error) {
    console.error("Failed to seed database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
