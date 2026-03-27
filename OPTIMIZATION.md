# 유레 揺れ — 현재 적용된 성능/SEO/최적화 코드 정리

> 프로젝트에 적용된 모든 성능, SEO, 최적화 패턴을 정리한 문서입니다.
> 마지막 업데이트: 2026-03-15

---

## 목차

1. [Metadata & SEO](#1-metadata--seo)
2. [구조화된 데이터 (JSON-LD)](#2-구조화된-데이터-json-ld)
3. [사이트맵](#3-사이트맵)
4. [캐싱 전략](#4-캐싱-전략)
5. [이미지 최적화](#5-이미지-최적화)
6. [폰트 최적화](#6-폰트-최적화)
7. [코드 스플리팅 & Dynamic Import](#7-코드-스플리팅--dynamic-import)
8. [Suspense & Streaming](#8-suspense--streaming)
9. [정적 생성 & ISR](#9-정적-생성--isr)
10. [robots.txt](#10-robotstxt)
11. [번들 최적화](#11-번들-최적화)
12. [CSS 최적화](#12-css-최적화)
13. [Preloading & Prefetching](#13-preloading--prefetching)
14. [서드파티 스크립트](#14-서드파티-스크립트)
15. [미들웨어](#15-미들웨어)
16. [API/데이터 최적화](#16-api데이터-최적화)
17. [로딩 상태 & 에러 처리](#17-로딩-상태--에러-처리)
18. [콘텐츠 최적화](#18-콘텐츠-최적화)

---

## 1. Metadata & SEO

### 루트 메타데이터 (`app/layout.tsx`)

```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://yure.me"),
  title: "유레 揺れ",
  description: "...",
  openGraph: {
    locale: "ko_KR",
    // ...
  },
};
```

### 동적 메타데이터 (`generateMetadata`)

모든 상세 페이지에서 `generateMetadata` 함수로 동적 메타데이터를 생성합니다:

| 페이지 | 파일 |
|---|---|
| 번역 상세 | `app/(with-navigation)/translation/[permalink]/page.tsx` |
| 아티클 상세 | `app/(with-navigation)/article/[slug]/page.tsx` |
| 뉴스 상세 | `app/(with-navigation)/news/[slug]/page.tsx` |
| 번역 리스트 | `app/(with-navigation)/translation/page.tsx` |
| 뉴스 리스트 | `app/(with-navigation)/news/page.tsx` |

**적용 패턴:**
- 아티스트/제목 조합 (번역 페이지)
- OpenGraph 이미지 + 폴백 로고
- 적절한 `siteName`과 `locale` 설정
- 메타데이터 쿼리 시 필요한 필드만 선택 (예: `title, artist, thumbnail_url`)

---

## 2. 구조화된 데이터 (JSON-LD)

**파일:** `app/(with-navigation)/article/[slug]/page.tsx`

```tsx
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: data.title,
  image: [data.thumbnail_url],
  datePublished: data.created_at,
  dateModified: data.updated_at,
  author: { "@type": "Person", name: data.user_info.name },
};
```

- `<script type="application/ld+json">`으로 삽입
- 아티클 상세 페이지에 Article 스키마 적용

---

## 3. 사이트맵

| 파일 | 설명 | Revalidation |
|---|---|---|
| `app/sitemap.ts` | 루트 정적 사이트맵 (6개 메인 URL) | 3600s |
| `app/(with-navigation)/translation/sitemap.ts` | 번역 동적 사이트맵 (이미지 URL 포함) | 3600s |
| `app/(with-navigation)/article/sitemap.ts` | 아티클 동적 사이트맵 | 3600s |
| `app/(with-navigation)/news/sitemap.ts` | 뉴스 동적 사이트맵 | 3600s |
| `app/sitemap-index.xml/route.ts` | 사이트맵 인덱스 XML Route Handler | Cache-Control 1h + stale-while-revalidate 1d |

### 루트 사이트맵 URL 목록 (`app/sitemap.ts`)

```
https://yure.me           (priority: 1.0)
https://yure.me/translation  (priority: 0.9)
https://yure.me/article      (priority: 0.9)
https://yure.me/karaoke      (priority: 0.9)
https://yure.me/news         (priority: 0.9)
https://yure.me/schedule     (priority: 0.9)
```

### 사이트맵 인덱스 (`app/sitemap-index.xml/route.ts`)

```
baseUrl: https://yure.me (www 없음)
├── /sitemap.xml
├── /translation/sitemap.xml
├── /article/sitemap.xml
└── /news/sitemap.xml
```

**최적화 포인트:**
- 모든 사이트맵에 `revalidate = 3600` (ISR 1시간)
- 번역/아티클 사이트맵에 이미지 URL 포함
- 최소 필드만 조회 (slug, thumbnail_url 등)

---

## 4. 캐싱 전략

### 이미지 캐시 (`next.config.ts`)

```ts
images: {
  minimumCacheTTL: 2678400,  // 31일
  formats: ["image/avif", "image/webp"],
}
```

### HTTP 캐시 헤더 (`next.config.ts` headers)

| 대상 | 캐시 설정 |
|---|---|
| 정적 폰트 (`/_next/static/media/*`) | `public, max-age=31536000, immutable` |
| 사이트맵 (`/sitemap.xml`, `/(.*)/sitemap.xml`) | `public, s-maxage=3600, stale-while-revalidate=86400` |
| 메인 페이지 (`/article`, `/translation`, `/news`, `/schedule`) | `public, s-maxage=3600, stale-while-revalidate=86400` |
| 상세 페이지 (`/article/:slug*`, `/translation/:permalink*` 등) | `public, s-maxage=3600, stale-while-revalidate=86400` |

---

## 5. 이미지 최적화

### LCP 이미지 우선 로딩

| 컴포넌트 | 기법 |
|---|---|
| `components/translation/song-card.tsx` | `priority={index < 2}` (처음 2개 카드만 우선 로딩) |
| `components/news/news-card.tsx` | `priority={index === 0}` (첫 번째 뉴스 카드만 우선) |
| `app/(with-navigation)/page.tsx` | 홈 히어로 이미지 `priority`, `placeholder="blur"` |
| `app/(with-navigation)/translation/[permalink]/page.tsx` | 배경 히어로 `priority`, `fill`, `sizes="100vw"` |
| `app/(with-navigation)/article/[slug]/page.tsx` | 히어로 이미지 `priority` |

### 이미지 Preload

```tsx
// components/translation/translation-list.tsx
<link
  rel="preload"
  as="image"
  href={firstImageUrl}
  fetchPriority="high"
/>
```

### Responsive Image Sizes

```tsx
// 상세 페이지 (전체 폭)
sizes="100vw"

// 캐러셀 카드
sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

// 관련 포스트
sizes="(max-width: 768px) 100vw, 50vw"

// 홈 히어로
sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
```

### 최적화 요약
- Above-the-fold 이미지는 `priority` 적용
- Below-the-fold 이미지는 lazy loading (기본값)
- 모든 이미지에 적절한 `sizes` 속성
- 번역 리스트 첫 이미지는 `<link rel="preload">` 적용
- AVIF/WebP 포맷 자동 변환

---

## 6. 폰트 최적화

**파일:** `app/layout.tsx`

```tsx
const gothica1Font = localFont({
  src: [
    { path: "...gothic-a1-v18-korean_latin-regular.woff2", weight: "400" },
    { path: "...gothic-a1-v18-korean_latin-500.woff2", weight: "500" },
    { path: "...gothic-a1-v18-korean_latin-600.woff2", weight: "600" },
    { path: "...gothic-a1-v18-korean_latin-700.woff2", weight: "700" },
  ],
  display: "swap",
});
```

**최적화 포인트:**
- 로컬 폰트만 사용 (Google Fonts 네트워크 레이턴시 제거)
- WOFF2 포맷 (최신 압축 포맷)
- 4가지 웨이트 프리로드
- `display: "swap"` (폴백 폰트 먼저 표시 → FOUT 전략)

---

## 7. 코드 스플리팅 & Dynamic Import

프로젝트 전체에 **20개 이상**의 dynamic import가 적용되어 있습니다.

### 주요 패턴

```tsx
const BottomDisplayAdWrapper = dynamic(() =>
  import("@/components/google-adsense/bottom-display-ad-wrapper").then(
    (mod) => ({ default: mod.BottomDisplayAdWrapper })
  )
);
```

### 주요 적용 파일

| 파일 | Dynamic Import 대상 | 목적 |
|---|---|---|
| `translation/[permalink]/page.tsx` | ViewCounter, BottomDisplayAdWrapper, CommentSection | 무거운 컴포넌트 지연 로딩 |
| `(with-navigation)/page.tsx` | ScrollDownInstructor, TextAnimate, BottomDisplayAd, Search, FeaturedSchedule | 홈 페이지 분할 |
| `translation/translation-list.tsx` | BottomDisplayAdWrapper | 광고 지연 렌더링 |
| `news/news-list.tsx` | BottomDisplayAdWrapper, PaginationControl | 비핵심 UI 지연 |
| `schedule/schedule-card-wrapper.tsx` | 캘린더 컴포넌트 | 무거운 캘린더 분할 |
| `article/article-list.tsx` | 아티클 그리드 | 리스트 분할 |

---

## 8. Suspense & Streaming

프로젝트 전체에 **55개 이상**의 Suspense 바운더리가 적용되어 있습니다.

### 패턴

```tsx
<Suspense fallback={<TranslationRelatedPostsSkeleton />}>
  <TranslationRelatedPosts permalink={permalink} />
</Suspense>
```

### Full-page Loading States (`loading.tsx`)

| 파일 | 스켈레톤 구성 |
|---|---|
| `translation/loading.tsx` | 8개 카드 스켈레톤 |
| `news/loading.tsx` | 그리드 + 사이드바 레이아웃 |
| `article/loading.tsx` | 6개 아이템 그리드 |
| `schedule/loading.tsx` | 캘린더 그리드 |
| `karaoke/loading.tsx` | 검색 + 결과 목록 |
| `translation/[permalink]/loading.tsx` | 상세 페이지 레이아웃 |
| `news/[slug]/loading.tsx` | 뉴스 상세 레이아웃 |
| `article/[slug]/loading.tsx` | 아티클 상세 레이아웃 |
| `community/loading.tsx` | 커뮤니티 레이아웃 |
| `app/loading.tsx` | 글로벌 스피너 |

**최적화 포인트:**
- `@/components/ui/skeleton` 컴포넌트 사용 (Tailwind 애니메이션)
- 실제 콘텐츠 레이아웃과 동일한 비율/간격
- Pulse 애니메이션으로 시각적 피드백

---

## 9. 정적 생성 & ISR

| 파일 | `revalidate` 값 | 목적 |
|---|---|---|
| `app/sitemap.ts` | 3600s | 사이트맵 1시간 갱신 |
| `translation/sitemap.ts` | 3600s | 번역 URL 갱신 |
| `article/sitemap.ts` | 3600s | 아티클 URL 갱신 |
| `news/sitemap.ts` | 3600s | 뉴스 URL 갱신 |
| `admin/article/page.tsx` | 60s | 어드민 리스트 갱신 |
| `admin/news/page.tsx` | 60s | 어드민 리스트 갱신 |

상세 페이지는 `generateMetadata()` + SSR로 처리 (동적 라우트)

---

## 10. robots.txt

**파일:** `app/robots.txt`

```
User-Agent: *
Disallow: /admin/
Disallow: /terms/
Disallow: /*?*category=
Disallow: /*?*page=
Disallow: /*?*sort=

Sitemap: https://yure.me/sitemap-index.xml
```

**최적화 포인트:**
- 어드민 라우트 차단
- 쿼리 파라미터 차단 (중복 콘텐츠 방지)
- 사이트맵 인덱스 참조

---

## 11. 번들 최적화

| 기법 | 설명 |
|---|---|
| Dynamic Import | 20개 이상의 컴포넌트 지연 로딩 |
| Server Components 기본 | `"use client"` 없으면 서버 컴포넌트 → 클라이언트 번들 없음 |
| 선택적 Client Components | 댓글, 필터, 테마 스위처 등 인터랙티브 기능만 |
| RPC 함수 | 복잡한 쿼리는 DB 레벨에서 처리 |
| 필드 선택 | 리스트 페이지에서 `select("*")` 미사용 |

### Tailwind 설정 (`tailwind.config.ts`)

- Content paths 설정으로 사용하지 않는 CSS 퍼지
- Safelist: 레거시 하이라이트 클래스 보존
- 플러그인: `tailwindcss-animate`, `@tailwindcss/typography`

---

## 12. CSS 최적화

- Tailwind CSS 유틸리티 퍼스트 접근
- SCSS 파셜로 복잡한 레이아웃 처리 (`styles/` 폴더)
- CSS Grid/Flexbox로 반응형 레이아웃
- Tailwind 빌드 시 미사용 CSS 자동 제거

---

## 13. Preloading & Prefetching

| 타입 | 위치 | 대상 |
|---|---|---|
| Preconnect | `app/layout.tsx` | Supabase Storage URL |
| DNS Prefetch | `app/layout.tsx` | Supabase Storage URL |
| Image Preload | `components/translation/translation-list.tsx` | LCP 이미지 (`fetchPriority="high"`) |

```tsx
// app/layout.tsx
<link rel="preconnect" href="https://[supabase-storage-url]" />
<link rel="dns-prefetch" href="https://[supabase-storage-url]" />
```

---

## 14. 서드파티 스크립트

**파일:** `components/google-adsense/adsense-code-snippet.tsx`

```tsx
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=..."
  crossOrigin="anonymous"
  strategy="lazyOnload"
/>
```

**최적화 포인트:**
- `strategy="lazyOnload"` — 페이지 렌더링 차단 방지
- 프로덕션 환경에서만 로드 (개발 모드 스킵)
- `app/layout.tsx`에서 단일 글로벌 삽입

---

## 15. 미들웨어

**파일:** `middleware.ts`, `utils/supabase/middleware.ts`

```ts
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets/|fonts/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2|txt)$).*)"
  ],
};
```

**최적화 포인트:**
- 정적 에셋(이미지, 폰트, SVG) 제외하는 스마트 매처
- 모든 요청에서 세션 갱신
- 라우트 보호: `/protected/*` (로그인 필요), `/admin/*` (관리자 권한 필요)
- `NextResponse.next()` 사용으로 경량화

---

## 16. API/데이터 최적화

### Supabase 쿼리 패턴

| 패턴 | 효과 | 예시 |
|---|---|---|
| 필드 선택 | 페이로드 감소 | `.select("title, artist, thumbnail_url")` |
| Count 쿼리 | 추가 쿼리 없이 페이지네이션 | `.select(..., { count: "exact" })` |
| RPC 함수 | DB 레벨 서버사이드 필터링 | `.rpc("new_search_translations", {...})` |
| Public Client | 세션 오버헤드 제거 | `createPublicClient()` (공개 페이지) |
| Promise.all | 병렬 요청 | 관련 포스트 가져오기 |
| 중첩 Select | 단일 쿼리로 관계 데이터 | `.select("*, categories(...)")` |

### 페이지별 최적화

| 페이지 | 쿼리 최적화 |
|---|---|
| 뉴스 리스트 | `content` 필드 제외 (무거운 데이터), Public Client 사용 |
| 번역 리스트 | RPC 함수로 검색 + 카테고리 필터링 최적화 |
| 관련 포스트 | `title, slug, thumbnail_url` 3개 필드만 조회 |
| 번역 상세 | `select("*, categories(id, name)")` — 12개 필드 |
| 뉴스 리스트 | `select("id, title, slug, summary, thumbnail_url, user_info!inner(name), created_at, updated_at")` — 8개 필드 |

---

## 17. 로딩 상태 & 에러 처리

### 글로벌 에러 핸들러 (`app/error.tsx`)
- 친화적인 에러 UI
- Reset 버튼으로 재시도
- 홈 네비게이션 옵션
- 콘솔 에러 로깅

### 글로벌 로딩 (`app/loading.tsx`)
- 스피너 + 펄스 텍스트
- 전체 페이지 로더

### 라우트별 `loading.tsx`
- 총 9개 파일
- 실제 콘텐츠 레이아웃과 동일한 스켈레톤
- 적절한 aspect ratio와 spacing

---

## 18. 콘텐츠 최적화

### 리스트 페이지 필드 제외

| 페이지 | 제외된 필드 | 이유 |
|---|---|---|
| 뉴스 리스트 | `content` (대용량) | 리스트 뷰에서 불필요 |
| 번역 리스트 | `content` (RPC 경유) | RPC가 UI 필드만 반환 |
| 아티클 사이트맵 | 대부분 필드 | `slug, thumbnail_url`만 필요 |
| 관련 포스트 | 대부분 필드 | `title, slug, thumbnail_url` 3개만 필요 |

**핵심 원칙:** 리스트 페이지에서 `select("*")` 미사용, 모든 곳에서 명시적 필드 선택

---

## 종합 현황표

| 카테고리 | 상태 | 핵심 기법 |
|---|---|---|
| Metadata/SEO | ✅ | 동적 generateMetadata, OpenGraph, locale |
| 구조화된 데이터 | ✅ | JSON-LD Article 스키마 |
| 사이트맵 | ✅ | ISR (3600s), 이미지 URL, 최소 필드 |
| 캐싱 | ✅ | 31일 이미지, 1시간 페이지, s-maxage |
| 이미지 | ✅ | priority, lazy loading, responsive sizes, preload |
| 폰트 | ✅ | 로컬 WOFF2, swap 전략 |
| 코드 스플리팅 | ✅ | 20개+ dynamic import |
| Suspense/Streaming | ✅ | 55개+ 바운더리, 스켈레톤 폴백 |
| 정적 생성 | ✅ | ISR (3600s/60s revalidate) |
| robots.txt | ✅ | 어드민/쿼리 파라미터 차단, Sitemap 참조 |
| 번들 | ✅ | Server Components, RPC, dynamic import |
| CSS | ✅ | Tailwind 유틸리티 퍼스트, 미사용 CSS 퍼지 |
| Preloading | ✅ | preconnect, DNS prefetch, 이미지 preload |
| 서드파티 | ✅ | AdSense lazyOnload |
| 미들웨어 | ✅ | 스마트 매처, 세션 갱신 |
| API 최적화 | ✅ | 필드 선택, RPC, Public Client |
| 로딩 상태 | ✅ | 9개 loading.tsx, 스켈레톤 |
| 에러 처리 | ✅ | 글로벌 error.tsx, reset |
| 콘텐츠 | ✅ | 리스트에서 content 필드 제외 |
