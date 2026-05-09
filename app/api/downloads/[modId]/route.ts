import { Redis } from "@upstash/redis"
import { NextResponse } from "next/server"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// POST - increment download count
export async function POST(
  request: Request,
  { params }: { params: Promise<{ modId: string }> }
) {
  try {
    const { modId } = await params
    const newCount = await redis.incr(`downloads:${modId}`)
    console.log(`[v0] Download count for ${modId} incremented to ${newCount}`)
    return NextResponse.json({ count: newCount })
  } catch (error) {
    console.error("[v0] Failed to increment download count:", error)
    return NextResponse.json({ error: "Failed to track download" }, { status: 500 })
  }
}

// GET - get single mod download count
export async function GET(
  request: Request,
  { params }: { params: Promise<{ modId: string }> }
) {
  try {
    const { modId } = await params
    const count = (await redis.get<number>(`downloads:${modId}`)) ?? 0
    return NextResponse.json({ count })
  } catch (error) {
    console.error("[v0] Failed to fetch download count:", error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}
