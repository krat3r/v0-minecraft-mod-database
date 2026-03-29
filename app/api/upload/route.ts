import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
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
