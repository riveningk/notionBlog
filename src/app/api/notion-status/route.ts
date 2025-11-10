export async function GET() {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID?.replace(/-/g, "")

  if (!apiKey || !databaseId) {
    return Response.json(
      {
        status: "error",
        message: "Missing environment variables",
        apiKeySet: !!apiKey,
        databaseIdSet: !!databaseId,
      },
      { status: 400 },
    )
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/2a4cf942288d818d999ed921b839b163/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2025-09-03",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return Response.json(
        {
          status: "error",
          message: data.message || "Failed to access database",
          code: data.code,
          details: data,
        },
        { status: response.status },
      )
    }

    return Response.json({
      status: "success",
      message: "Successfully connected to Notion database",
      databaseTitle: data.title?.[0]?.plain_text || "Untitled",
      databaseId: data.id,
    })
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
