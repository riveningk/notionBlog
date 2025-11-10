"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"

export function WritePostForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    category: "",
    publishedDate: new Date().toISOString().split("T")[0],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // slug이 없으면 title에서 자동 생성
      const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-")

      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          slug,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create post")
      }

      // 성공 후 홈페이지로 리다이렉트
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">새 글 작성</h1>
        <p className="text-muted-foreground">새로운 블로그 글을 작성하세요.</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive">
              {error}
            </div>
          )}

          {/* 제목 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              제목 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="글의 제목을 입력하세요"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-2">
              Slug (URL 경로)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="제목을 입력하면 자동으로 생성됩니다"
            />
            <p className="text-xs text-muted-foreground mt-1">비워두면 제목에서 자동으로 생성됩니다</p>
          </div>

          {/* 요약 */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-foreground mb-2">
              요약 *
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="글의 요약을 입력하세요"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
              카테고리
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="예: Technology, Design, Development"
            />
          </div>

          {/* 발행 날짜 */}
          <div>
            <label htmlFor="publishedDate" className="block text-sm font-medium text-foreground mb-2">
              발행 날짜
            </label>
            <input
              type="date"
              id="publishedDate"
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* 컨텐츠 */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
              컨텐츠 (마크다운)
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-none"
              placeholder={`# 제목\n\n글의 내용을 마크다운 형식으로 입력하세요.\n\n## 소제목\n\n- 불릿 포인트 1\n- 불릿 포인트 2\n\n일반 텍스트...`}
            />
            <p className="text-xs text-muted-foreground mt-1">마크다운 형식을 지원합니다. (#, ##, ###, -, 1. 등)</p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex-1"
            >
              취소
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
