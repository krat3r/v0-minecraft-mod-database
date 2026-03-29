import { redis } from "@/lib/redis"
import { NextResponse } from "next/server"
import { mods } from "@/lib/mods-data"

// GET all download counts
export async function GET() {
  try {
    const modIds = mods.map((mod) => mod.id)
    const keys = modIds.map((id) => `downloads:${id}`)
    
    // Get all download counts in a single request
    const counts = await redis.mget<(number | null)[]>(...keys)
    
    const downloadCounts: Record<string, number> = {}
    modIds.forEach((id, index) => {
      downloadCounts[id] = counts[index] ?? 0
    })
    
    return NextResponse.json(downloadCounts)
  } catch (error) {
    console.error("Failed to fetch download counts:", error)
    return NextResponse.json({}, { status: 500 })
  }
}
