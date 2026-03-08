# CLAUDE.md — app/

> Next.js 15 App Router 라우팅 구조, 데이터 페칭 패턴, 미들웨어, Server Actions 가이드.

---

## Route Group 구조

괄호로 묶인 폴더는 URL에 영향을 주지 않는 레이아웃 그룹입니다.

```
app/
├── (with-navigation)/         # 상단 네비게이션 + 푸터 + 사이드 배너 광고 포함
│   ├── layout.tsx             # Navigation, Footer, SideBannerAd wrapping
│   ├── page.tsx               # 홈 (/)
│   ├── translation/           # 가사 번역 (/translation, /translation/[permalink])
│   ├── article/               # 아티클 (/article, /article/[slug])
│   ├── news/                  # 뉴스 (/news, /news/[slug])
│   ├── karaoke/               # 노래방 검색 (/karaoke, /karaoke/application)
│   ├── schedule/              # 이벤트 스케줄 (/schedule)
│   └── terms/                 # 약관 (/terms/privacy-policy, /terms/terms-of-service)
│
├── (auth-pages)/              # 인증 페이지 (네비게이션 없음)
│   ├── sign-in/page.tsx
│   ├── _sign-up/page.tsx      # _ 접두사 = 비활성화된 라우트
│   └── _forgot-password/page.tsx
│
├── (without-navigation)/      # 네비게이션 없는 레이아웃
│
├── protected/                 # 로그인 필수 페이지
│   ├── page.tsx
│   └── myPage/page.tsx
│
├── admin/                     # 어드민 CMS (admin 또는 employee role 필수)
│   └── → app/admin/CLAUDE.md 참조
│
├── auth/callback/route.ts     # OAuth 콜백 Route Handler
├── sitemap-index.xml/route.ts # 사이트맵 인덱스 XML
├── sitemap.ts                 # 루트 정적 사이트맵
├── layout.tsx                 # 루트 레이아웃 (폰트, ThemeProvider, AdSense, Toaster)
├── globals.scss               # 전역 스타일
├── actions.ts                 # 전역 Server Actions (auth 관련)
├── error.tsx                  # 전역 에러 바운더리
├── loading.tsx                # 전역 로딩 상태
└── not-found.tsx              # 404 페이지
```

---

## 라우트 보호

`middleware.ts` → `utils/supabase/middleware.ts`의 `updateSession`이 처리:

| 경로 | 조건 |
|---|---|
| `/protected/*` | 로그인 필요 (미인증 시 `/sign-in` 리다이렉트) |
| `/admin/*` | `user_info.role`이 `"admin"` 또는 `"employee"` 필요 |

---

## 데이터 페칭 패턴

### 기본 패턴: async Server Component + Suspense

```tsx
// page.tsx (Server Component)
export default function Page() {
  return (
    <Suspense fallback={<SkeletonComponent />}>
      <AsyncDataComponent />
    </Suspense>
  );
}

// AsyncDataComponent.tsx (Server Component)
async function AsyncDataComponent() {
  const supabase = await createClient();
  const { data } = await supabase.from("translations").select("*");
  return <UI data={data} />;
}
```

### Supabase 클라이언트 선택

- **서버 컴포넌트 / Route Handler / Server Action**: `utils/supabase/server.ts`의 `createClient()`
- **클라이언트 컴포넌트**: `utils/supabase/client.ts`의 `createClient()`
- **공개 데이터 (세션 불필요)**: `utils/supabase/public.ts` 참조
- **어드민 작업 (서비스 역할)**: `createClient("service_role")`

> 자세한 내용은 `utils/CLAUDE.md` 참조

### URL 기반 필터/페이지네이션

listing 페이지는 `searchParams`를 URL query parameter로 받아 서버에서 Supabase 쿼리로 변환합니다:

```tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category, page } = await searchParams;
  // Supabase 쿼리에서 category, page 사용
}
```

---

## Server Actions (`app/actions.ts`)

전역 Server Actions는 auth 관련 기능만 포함합니다:
- `signInAction` — 이메일/비밀번호 로그인
- `signUpAction` — 회원가입
- `signOutAction` — 로그아웃
- `forgotPasswordAction` — 비밀번호 재설정 이메일
- `resetPasswordAction` — 비밀번호 변경
- `deleteAccountAction` — 계정 삭제 (service_role 사용)

콘텐츠 CRUD는 Server Actions 대신 직접 Supabase 클라이언트를 사용합니다.

---

## Suspense + Skeleton 패턴

각 페이지의 비동기 섹션은 로딩 skeleton을 fallback으로 제공합니다:

```tsx
// Skeleton 컴포넌트는 같은 파일 내 로컬 함수로 정의
function TranslationsLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="w-full h-48" />
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<TranslationsLoading />}>
      <FeaturedTranslations />
    </Suspense>
  );
}
```

---

## 사이트맵

- `app/sitemap.ts` — 루트 정적 페이지 사이트맵
- `app/translation/sitemap.ts` — 번역 동적 사이트맵
- `app/article/sitemap.ts` — 아티클 동적 사이트맵
- `app/news/sitemap.ts` — 뉴스 동적 사이트맵
- `app/sitemap-index.xml/route.ts` — 사이트맵 인덱스 XML Route Handler

---

## Metadata (SEO)

각 페이지에서 `generateMetadata` 함수로 동적 메타데이터 생성:

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchData(params.slug);
  return {
    title: `${data.title} | 유레 揺れ`,
    description: data.summary,
    openGraph: {
      title: data.title,
      images: [data.thumbnail_url],
      locale: "ko_KR",
      type: "article",
    },
  };
}
```

---

## 캐시 헤더

`next.config.ts`에서 정의된 캐시 설정:
- 이미지: 1개월 캐시
- 사이트맵: 1시간 캐시
- 번역 페이지: 1시간 캐시

---

## OAuth 콜백 (`auth/callback/route.ts`)

Google OAuth 로그인 후 코드를 세션으로 교환하고, 최초 로그인 시 `user_info` 레코드를 자동 생성합니다.
