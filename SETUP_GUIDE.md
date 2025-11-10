# Notion 블로그 설정 가이드

이 가이드는 Notion을 CMS로 사용하는 블로그를 설정하고 실행하는 단계별 방법을 설명합니다.

## 📋 전제 조건

- Node.js 18.0 이상
- npm 또는 yarn
- Notion 계정

---

## 1️⃣ Notion 데이터베이스 설정

### 1.1 Notion 데이터베이스 생성

1. [Notion](https://www.notion.so)에 로그인합니다.
2. 새 페이지를 생성하고 "Database" 유형으로 선택합니다.
3. 데이터베이스 이름을 설정합니다 (예: "Blog Posts").

### 1.2 데이터베이스 속성 설정

다음 속성들을 생성합니다:

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `Name` | **제목 (Title)** | 게시글 제목 (기본값) |
| `Slug` | **텍스트 (Text)** | URL 경로 (예: `how-to-setup-notion-blog`) |
| `Published` | **체크박스 (Checkbox)** | 발행 여부 |
| `Published Date` | **날짜 (Date)** | 발행 날짜 |
| `Summary` | **텍스트 (Text)** | 게시글 요약 |
| `Category` | **선택 (Select)** | 카테고리 (예: Technology, Design, etc.) |
| `Files` | **파일과 미디어 (Files)** | 썸네일 이미지 |

### 1.3 Notion 통합 API 키 얻기

1. [Notion Developers](https://www.notion.com/my-integrations)로 이동합니다.
2. "새 통합 생성"을 클릭합니다.
3. 통합 이름을 입력하고 생성합니다.
4. "내부 통합 시크릿"을 복사합니다 (이것이 `NOTION_API_KEY`입니다).

### 1.4 데이터베이스에 통합 권한 부여

1. Notion의 데이터베이스 페이지로 돌아갑니다.
2. 우측 상단의 "공유"를 클릭합니다.
3. 만든 통합을 찾아 권한을 부여합니다.

### 1.5 데이터베이스 ID 얻기

1. 데이터베이스 URL을 확인합니다: `https://www.notion.so/[DATABASE_ID]?v=...`
2. 대시문자(`-`) 없이 DATABASE_ID를 추출합니다 (예: `a1b2c3d4e5f6...`).
3. 이것이 `NOTION_DATABASE_ID`입니다.

---

## 2️⃣ 프로젝트 설정

### 2.1 프로젝트 클론 및 의존성 설치

\`\`\`bash
# 프로젝트 클론
git clone <your-repository-url>
cd notion-blog

# 의존성 설치
npm install
# 또는
yarn install
\`\`\`

### 2.2 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음을 입력합니다:

\`\`\`env
NOTION_API_KEY="your_notion_integration_secret_here"
NOTION_DATABASE_ID="your_notion_database_id_here"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
\`\`\`

**주의**: 
- `NOTION_API_KEY`와 `NOTION_DATABASE_ID`는 반드시 올바른 값으로 설정해야 합니다.
- `NEXT_PUBLIC_BASE_URL`은 프로덕션 환경에서 실제 도메인으로 변경합니다.

---

## 3️⃣ 로컬 실행

\`\`\`bash
# 개발 서버 시작
npm run dev
# 또는
yarn dev
\`\`\`

브라우저에서 `http://localhost:3000`으로 이동하여 블로그를 확인합니다.

### 테스트 게시글 만들기

1. Notion 데이터베이스에 새 항목을 추가합니다.
2. 다음을 입력합니다:
   - **Name**: "첫 번째 게시글"
   - **Slug**: "first-post"
   - **Published**: 체크 (활성화)
   - **Published Date**: 오늘 날짜
   - **Summary**: "이것은 첫 번째 게시글입니다"
   - **Category**: "기술" (원하는 카테고리)
   - **Files**: 썸네일 이미지 업로드

3. 페이지 콘텐츠를 작성합니다.
4. 블로그를 새로고침하여 게시글이 표시되는지 확인합니다.

---

## 4️⃣ 프로덕션 배포 (Vercel)

### 4.1 GitHub에 푸시

\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

### 4.2 Vercel에 배포

1. [Vercel](https://vercel.com)에 로그인합니다.
2. "새 프로젝트 추가"를 클릭합니다.
3. GitHub 저장소를 선택합니다.
4. "환경 변수" 섹션에서 다음을 추가합니다:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
   - `NEXT_PUBLIC_BASE_URL` (예: `https://yourblog.vercel.app`)
5. "배포"를 클릭합니다.

### 4.3 사용자 정의 도메인 설정 (선택 사항)

1. Vercel 프로젝트 대시보드의 "Settings" → "Domains"로 이동합니다.
2. 사용자 정의 도메인을 추가합니다.
3. DNS 설정을 따릅니다.

---

## 5️⃣ 기능 설명

### 홈페이지 (`/`)
- Notion에서 `Published` 체크박스가 활성화된 모든 게시글을 표시합니다.
- `Published Date` 기준 최신순으로 정렬됩니다.

### 게시글 상세 페이지 (`/blog/[slug]`)
- Slug를 기반으로 게시글의 상세 내용을 표시합니다.
- Notion의 풍부한 포맷팅(제목, 이미지, 코드 블록 등)이 HTML로 렌더링됩니다.
- 동적 메타 태그로 SEO 최적화됩니다.

### SEO 기능
- **Sitemap** (`/sitemap.xml`): 모든 게시글을 포함한 동적 사이트맵 생성
- **Robots.txt** (`/robots.txt`): 검색 엔진 크롤링 설정
- **동적 메타 태그**: 각 게시글에 고유한 Open Graph 메타 데이터

---

## 🔧 커스터마이징

### 스타일 변경
`src/app/globals.css`에서 색상 및 스타일을 커스터마이징할 수 있습니다.

### 헤더/푸터 수정
`src/components/Header.tsx`와 `src/components/Footer.tsx`를 편집합니다.

### 블로그 레이아웃 변경
`src/app/page.tsx` (목록) 및 `src/app/blog/[slug]/page.tsx` (상세)를 편집합니다.

---

## ⚠️ 일반적인 문제 해결

### "데이터베이스를 찾을 수 없음" 오류
- `NOTION_DATABASE_ID`가 올바른지 확인하세요.
- 대시문자를 제거하고 올바른 형식으로 입력했는지 확인합니다.

### "권한 거부" 오류
- Notion 통합이 데이터베이스에 대한 액세스 권한이 있는지 확인합니다.
- 데이터베이스를 공유할 때 통합을 선택했는지 확인합니다.

### 게시글이 표시되지 않음
- Notion에서 `Published` 체크박스가 활성화되어 있는지 확인합니다.
- 블로그를 새로고침합니다 (캐시 무시: Ctrl+Shift+R).

---

## 📚 추가 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Notion API 문서](https://developers.notion.com/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

---

**행운을 빕니다! 문제가 발생하면 GitHub Issues를 통해 보고하세요. 🚀**
