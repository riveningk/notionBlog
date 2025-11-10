import { getAllPosts } from "@/lib/notion"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { NotionSetupHelper } from "@/components/notion-setup-helper"

export default async function Home() {
  let posts
  let error = null

  try {
    posts = await getAllPosts()
  } catch (err) {
    error = err
    posts = []
  }

  return (
    <div className="min-h-screen">
      {/* Header section */}
      <section className="px-4 py-16 md:py-24 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Blog</h1>
            <p className="text-lg text-muted-foreground text-balance">
              Insights and stories about development, design, and technology.
            </p>
          </div>
          <a
            href="/write"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors whitespace-nowrap ml-4"
          >
            새 글 작성
          </a>
        </div>
      </section>

      {/* Posts section */}
      <section className="px-4 pb-16 max-w-4xl mx-auto">
        {posts && posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="group border-b border-border pb-8 last:border-b-0">
                <Link href={`/blog/${post.slug}`}>
                  <div className="space-y-3">
                    {/* Thumbnail */}
                    {post.thumbnail && (
                      <div className="relative w-full h-48 md:h-64 bg-muted rounded-lg overflow-hidden">
                        <img
                          src={post.thumbnail || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Category */}
                    {post.category && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                          {post.category}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors text-balance">
                      {post.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-muted-foreground text-base leading-relaxed">{post.summary}</p>

                    {/* Meta information */}
                    <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
                      <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : error ? (
          <NotionSetupHelper />
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-lg p-8">
            <p className="text-lg text-muted-foreground mb-4">No published posts yet.</p>
            <p className="text-sm text-muted-foreground">
              Create your first post in Notion and mark it as published to see it here.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
