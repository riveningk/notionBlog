import { createNewPost } from "@/lib/notion"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { title, slug, summary, content, category, publishedDate } = body

    if (!title || !slug || !summary) {
      return NextResponse.json({ message: "Missing required fields: title, slug, summary" }, { status: 400 })
    }

    const result = await createNewPost({
      title,
      slug,
      summary,
      content,
      category,
      publishedDate,
    })

    return NextResponse.json({ message: "Post created successfully", id: result.id }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to create post",
      },
      { status: 500 },
    )
  }
}
