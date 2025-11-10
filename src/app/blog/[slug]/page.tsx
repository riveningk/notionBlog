import { getPostBySlug, getPostContent, getAllSlugs } from "@/lib/notion"
import { notFound } from "next/navigation"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post not found",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url: `${baseUrl}/blog/${post.slug}`,
      images: post.thumbnail
        ? [
            {
              url: post.thumbnail,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
      publishedTime: post.publishedDate,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  }
}

// 정적 생성을 위한 경로 미리 생성
export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const content = await getPostContent(post.pageId)

  return (
    <article className="min-h-screen">
      {/* 썸네일 */}
      {post.thumbnail && (
        <div className="relative w-full h-96 bg-muted overflow-hidden">
          <img src={post.thumbnail || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* 콘텐츠 */}
      <div className="px-4 py-12 md:py-16 max-w-3xl mx-auto">
        {/* 메타 정보 */}
        <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
          {post.category && (
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">{post.category}</span>
          )}
          <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
        </div>

        {/* 제목 */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">{post.title}</h1>

        {/* 요약 */}
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{post.summary}</p>

        {/* Markdown 콘텐츠 */}
        <div className="blog-content">
          <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </div>
      </div>
    </article>
  )
}
