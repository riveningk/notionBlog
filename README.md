# Notion Blog (Next.js)

Notion을 CMS로 사용하는 블로그 템플릿입니다. Notion 데이터베이스에서 게시글을 읽고, 상세 페이지를 렌더링하며, 간단한 폼으로 새 글을 Notion에 생성할 수도 있습니다. SEO를 위한 `sitemap.xml`, `robots.txt`를 동적으로 생성합니다.

## 주요 기능

- 홈 목록 페이지(`/`): Notion의 게시글을 최신순으로 표시
- 게시글 상세(`/blog/[slug]`): Notion 블록을 마크다운으로 변환해 렌더링
- 새 글 작성(`/write`): 폼 제출로 Notion 데이터베이스에 새 페이지 생성
- API
  - `GET /api/notion-status`: 환경 변수 확인 및 Notion 접근 상태 점검
  - `POST /api/posts/create`: 새 글 생성
- SEO
  - 동적 사이트맵(`GET /sitemap.xml`)
  - 동적 robots.txt(`GET /robots.txt`)

## 기술 스택

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Notion API (`@notionhq/client`는 간접 사용, fetch로 호출)
- UI 컴포넌트: Radix UI 기반 커스텀 컴포넌트
- 마크다운 렌더링: `react-markdown`, `remark-gfm`

## 프로젝트 구조(요약)

```
src/
  app/
    page.tsx                # 홈(게시글 목록)
    blog/[slug]/page.tsx    # 상세 페이지
    write/page.tsx          # 새 글 작성 폼
    api/
      posts/create/route.ts # 새 글 생성 API
      notion-status/route.ts# 연결 상태 체크 API
    sitemap.xml/route.ts    # 사이트맵
    robots.txt/route.ts     # robots.txt
  components/
    write-post-form.tsx     # 작성 폼 UI
    Header.tsx / Footer.tsx
  lib/
    notion.ts               # Notion 연동 로직
    utils.ts                # 유틸 함수
```

루트에는 `app/` 및 `components/` 폴더가 추가로 있으며, 스타일 및 UI 컴포넌트가 포함되어 있습니다.

## 동작 방식

- `src/lib/notion.ts`
  - `getAllPosts()`: Notion DB를 쿼리하여 발행(Published=true)된 글 목록을 가져옵니다.
  - `getPostBySlug(slug)`: 슬러그에 해당하는 단일 글 메타데이터를 가져옵니다.
  - `getPostContent(pageId)`: Notion 블록을 간단한 마크다운으로 변환합니다.
  - `createNewPost(data)`: 제목/슬러그/요약 등으로 Notion에 새 페이지를 생성하고 본문을 블록으로 추가합니다.
- 페이지
  - 홈(`page.tsx`): 목록 렌더링 및 Notion 미설정 시 가이드 컴포넌트 노출
  - 상세(`[slug]/page.tsx`): `generateMetadata`로 OG/Twitter 메타 생성, 본문 마크다운 렌더
  - 작성(`write/page.tsx`): `WritePostForm` 로컬 폼 → `POST /api/posts/create` 호출
- SEO
  - `sitemap.xml/route.ts`: 전체 글 기반 동적 사이트맵
  - `robots.txt/route.ts`: 사이트맵 경로와 블로그 URL 나열

## 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성하고 아래를 설정하세요.

```
NOTION_API_KEY="your_notion_integration_secret_here"
NOTION_DATABASE_ID="your_notion_database_id_here"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

참고: `NOTION_DATABASE_ID`는 대시(`-`) 없는 형태여야 하며, Notion 통합에 데이터베이스 공유 권한을 부여해야 합니다.

## 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# 프로덕션 빌드/실행
npm run build
npm start
```

브라우저에서 `http://localhost:3000`으로 접속합니다.
