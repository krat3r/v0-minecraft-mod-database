import { Redis } from "@upstash/redis"
import { NextRequest, NextResponse } from "next/server"
import { mods } from "@/lib/mods-data"

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

// POST - Seed the database with default mods (protected - requires admin password)
export async function POST(request: NextRequest) {
  // Verify admin password
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

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
