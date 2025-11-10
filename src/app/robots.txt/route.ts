import { getAllPosts } from "@/lib/notion"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const posts = await getAllPosts()

  const blogUrls = posts.map((post) => `${baseUrl}/blog/${post.slug}`).join("\n")

  const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

${blogUrls}`

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
