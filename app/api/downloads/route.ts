import { Redis } from "@upstash/redis"
import { NextResponse } from "next/server"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const MODS_KEY = "mctools:mods"

// GET all download counts
export async function GET() {
  try {
    // Get all mods from Redis
    const mods = await redis.get<any[]>(MODS_KEY) || []
    
    if (!mods.length) {
      return NextResponse.json({})
    }
    
    const modIds = mods.map((mod) => mod.id)
    const keys = modIds.map((id) => `downloads:${id}`)
    
    // Get all download counts in a single request
    const counts = await redis.mget<(number | null)[]>(...keys)
    
    const downloadCounts: Record<string, number> = {}
    modIds.forEach((id, index) => {
      downloadCounts[id] = (counts[index] as number | null) ?? 0
    })
    
    console.log("[v0] Download counts from Redis:", downloadCounts)
    return NextResponse.json(downloadCounts)
  } catch (error) {
    console.error("[v0] Failed to fetch download counts:", error)
    return NextResponse.json({}, { status: 500 })
  }
}
