import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

// Helper to verify admin password from Authorization header
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false
  }
  const password = authHeader.slice(7) // Remove "Bearer " prefix
  return password === process.env.ADMIN_PASSWORD
}

export async function POST(request: NextRequest) {
  // Verify admin password
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // "jar" or "logo"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (type === "jar" && !file.name.endsWith(".jar")) {
      return NextResponse.json(
        { error: "Only .jar files are allowed for mods" },
        { status: 400 }
      )
    }

    if (type === "logo" && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed for logos" },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const folder = type === "jar" ? "mods" : "logos"
    const blob = await put(`${folder}/${file.name}`, file, {
      access: "public",
    })

    return NextResponse.json({ url: blob.url, pathname: blob.pathname })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
