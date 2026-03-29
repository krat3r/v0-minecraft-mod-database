import { redis } from "@/lib/redis"
import { NextResponse } from "next/server"

// POST - increment download count
export async function POST(
  request: Request,
  { params }: { params: Promise<{ modId: string }> }
) {
  try {
    const { modId } = await params
    const newCount = await redis.incr(`downloads:${modId}`)
    return NextResponse.json({ count: newCount })
  } catch (error) {
    console.error("Failed to increment download count:", error)
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
    const count = await redis.get<number>(`downloads:${modId}`) ?? 0
    return NextResponse.json({ count })
  } catch (error) {
    console.error("Failed to fetch download count:", error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}
