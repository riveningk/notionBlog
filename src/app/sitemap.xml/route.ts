import { getAllPosts } from "@/lib/notion"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const posts = await getAllPosts()

  const postUrls = posts
    .map(
      (post) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.publishedDate}</lastmod>
    <priority>0.8</priority>
  </url>`,
    )
    .join("")

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <priority>1.0</priority>
  </url>
${postUrls}
</urlset>`

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}
