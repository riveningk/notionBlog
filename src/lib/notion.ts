const NOTION_API_BASE = "https://api.notion.com/v1"

async function makeNotionRequest(endpoint: string, method: "GET" | "POST" | "PATCH" = "GET", body?: any) {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID

  if (!apiKey) {
    throw new Error("NOTION_API_KEY is not set. Please add it to the Vars section in the sidebar.")
  }
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not set. Please add it to the Vars section in the sidebar.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Notion-Version": "2022-06-28", // ← 이 버전으로 낮추는 게 안정적입니다
    "Content-Type": "application/json",
  }

  const options: RequestInit = {
    method,
    headers,
  }

  if (body) {
    options.body = JSON.stringify(body)
    console.log("[DEBUG] Request body:", JSON.stringify(body, null, 2))
  }

  const fullUrl = `${NOTION_API_BASE}${endpoint}`
  console.log("[DEBUG] Full URL:", fullUrl)
  console.log("[DEBUG] Method:", method)
  console.log("[DEBUG] Headers:", headers)

  const response = await fetch(fullUrl, options)

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`[ERROR] Notion API (${response.status}):`, errorText)
    throw new Error(`Notion API error: ${response.status} - ${errorText}`)
  }

  return response.json()
}

export async function getAllPosts() {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID
    if (!databaseId) {
      throw new Error("NOTION_DATABASE_ID is not set")
    }

    const data = await makeNotionRequest(`/databases/${databaseId}/query`, "POST", {
      filter: {
        property: "Published",
        checkbox: { equals: true },
      },
      sorts: [
        {
          property: "Published Date",
          direction: "descending",
        },
      ],
    })

    return data.results.map((page: any) => {
      const prop = page.properties
      return {
        id: page.id,
        title: prop.Name?.title?.[0]?.plain_text || "",
        slug: prop.Slug?.rich_text?.[0]?.plain_text || "",
        summary: prop.Summary?.rich_text?.[0]?.plain_text || "",
        category: prop.Category?.select?.name || "",
        publishedDate: prop["Published Date"]?.date?.start || "",
        thumbnail: prop.Files?.files?.[0]?.file?.url || prop.Files?.files?.[0]?.external?.url || "",
      }
    })
  } catch (error) {
    console.error("[ERROR] Error fetching posts from Notion:", error)
    return []
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID
    if (!databaseId) {
      throw new Error("NOTION_DATABASE_ID is not set")
    }

    const data = await makeNotionRequest(`/databases/${databaseId}/query`, "POST", {
      filter: {
        and: [
          { property: "Slug", rich_text: { equals: slug } },
          { property: "Published", checkbox: { equals: true } },
        ],
      },
    })

    if (!data.results || data.results.length === 0) {
      return null
    }

    const page = data.results[0]
    const prop = page.properties

    return {
      id: page.id,
      title: prop.Name?.title?.[0]?.plain_text || "",
      slug: prop.Slug?.rich_text?.[0]?.plain_text || "",
      summary: prop.Summary?.rich_text?.[0]?.plain_text || "",
      category: prop.Category?.select?.name || "",
      publishedDate: prop["Published Date"]?.date?.start || "",
      thumbnail: prop.Files?.files?.[0]?.file?.url || prop.Files?.files?.[0]?.external?.url || "",
      pageId: page.id,
    }
  } catch (error) {
    console.error("[ERROR] Error fetching post from Notion:", error)
    return null
  }
}

export async function getPostContent(pageId: string) {
  try {
    const data = await makeNotionRequest(`/blocks/${pageId}/children`)

    let markdown = ""
    for (const block of data.results) {
      markdown += blockToMarkdown(block) + "\n\n"
    }
    return markdown.trim()
  } catch (error) {
    console.error("[ERROR] Error fetching post content from Notion:", error)
    return ""
  }
}

function blockToMarkdown(block: any): string {
  const type = block.type
  const content = block[type]
  switch (type) {
    case "heading_1":
      return `# ${content.rich_text.map((t: any) => t.plain_text).join("")}`
    case "heading_2":
      return `## ${content.rich_text.map((t: any) => t.plain_text).join("")}`
    case "heading_3":
      return `### ${content.rich_text.map((t: any) => t.plain_text).join("")}`
    case "paragraph":
      return content.rich_text.map((t: any) => t.plain_text).join("")
    case "bulleted_list_item":
      return `- ${content.rich_text.map((t: any) => t.plain_text).join("")}`
    case "numbered_list_item":
      return `1. ${content.rich_text.map((t: any) => t.plain_text).join("")}`
    case "code":
      return `\`\`\`${content.language || ""}\n${content.rich_text.map((t: any) => t.plain_text).join("")}\n\`\`\``
    case "image":
      const url = content.file?.url || content.external?.url
      return `![](${url})`
    case "divider":
      return "---"
    default:
      return ""
  }
}

export async function getAllSlugs() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function createNewPost(data: {
  title: string
  slug: string
  summary: string
  content: string
  category?: string
  publishedDate?: string
}) {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID
    if (!databaseId) {
      throw new Error("NOTION_DATABASE_ID is not set")
    }

    // 새 페이지 생성
    const pageData = await makeNotionRequest(`/pages`, "POST", {
      parent: {
        database_id: databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: data.title,
              },
            },
          ],
        },
        Slug: {
          rich_text: [
            {
              text: {
                content: data.slug,
              },
            },
          ],
        },
        Summary: {
          rich_text: [
            {
              text: {
                content: data.summary,
              },
            },
          ],
        },
        Category: data.category
          ? {
              select: {
                name: data.category,
              },
            }
          : undefined,
        "Published Date": data.publishedDate
          ? {
              date: {
                start: data.publishedDate,
              },
            }
          : undefined,
        Published: {
          checkbox: false,
        },
      },
    })

    // 페이지 컨텐츠 추가 (마크다운을 블록으로 변환)
    if (data.content) {
      await addContentToPage(pageData.id, data.content)
    }

    return pageData
  } catch (error) {
    console.error("[ERROR] Error creating post in Notion:", error)
    throw error
  }
}

async function addContentToPage(pageId: string, markdown: string) {
  const lines = markdown.split("\n").filter((line) => line.trim())
  const blocks = []

  for (const line of lines) {
    if (line.startsWith("# ")) {
      blocks.push({
        object: "block",
        type: "heading_1",
        heading_1: {
          rich_text: [{ type: "text", text: { content: line.replace("# ", "") } }],
        },
      })
    } else if (line.startsWith("## ")) {
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: line.replace("## ", "") } }],
        },
      })
    } else if (line.startsWith("- ")) {
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: line.replace("- ", "") } }],
        },
      })
    } else if (line.trim()) {
      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: line } }],
        },
      })
    }
  }

  if (blocks.length > 0) {
    await makeNotionRequest(`/blocks/${pageId}/children`, "PATCH", {
      children: blocks.slice(0, 100), // Notion API는 한 번에 100개까지만 허용
    })
  }
}
