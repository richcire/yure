# CLAUDE.md — 유레 揺れ 프로젝트

> 이 파일은 AI 에이전트가 프로젝트 전체를 파악하기 위한 루트 가이드입니다.
> 각 하위 폴더에 더 구체적인 `CLAUDE.md`가 있으니 해당 폴더 작업 시 반드시 참조하세요.

---

## 프로젝트 개요

**유레 揺れ (yure.me)** — 한국어 J-POP 팬 커뮤니티 플랫폼.

주요 기능:
- **가사 번역**: 일본어 J-POP 가사를 한국어 발음 + 번역으로 제공
- **매거진 아티클**: J-POP 관련 심층 기사
- **뉴스**: 최신 J-POP 소식
- **노래방 검색**: TJ/KY/JS 노래방 번호 검색
- **이벤트 스케줄**: 콘서트/이벤트 캘린더
- **댓글 시스템**: 모든 콘텐츠에 스레드형 댓글

---

## 기술 스택

| 레이어 | 기술 |
|---|---|
| 프레임워크 | Next.js 15 (App Router) + React 19 |
| 언어 | TypeScript 5.7 (strict mode) |
| 스타일 | Tailwind CSS 3.4 + SCSS (sass) |
| UI 라이브러리 | shadcn/ui (Radix UI + CVA) |
| 백엔드/DB | Supabase (PostgreSQL + Auth + Storage) |
| 리치 텍스트 에디터 | Tiptap v3 |
| 인증 | Supabase Auth (이메일/비밀번호 + Google OAuth) |
| 패키지 매니저 | **pnpm** |
| 배포 | Vercel |
| AI | @openai/agents (GPT-5.1 가사 자동 번역) |
| 광고 | Google AdSense |

---

## 환경 변수

```
NEXT_PUBLIC_SUPABASE_URL          # Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # 공개 anon key (클라이언트/서버 공통)
SUPABASE_SERVICE_ROLE_KEY  # service role key (어드민 전용)
OPENAI_API_KEY                    # OpenAI API key (AI 번역 파이프라인)
VERCEL_URL                        # Vercel 배포 URL (자동 설정)
```

---

## 폴더 구조 및 역할

```
/yure
├── app/                   # Next.js App Router 페이지 & 라우트 → app/CLAUDE.md 참조
│   └── admin/             # 어드민 CMS → app/admin/CLAUDE.md 참조
├── components/            # React 컴포넌트 (도메인별 구성) → components/CLAUDE.md 참조
│   └── Tiptap/            # Tiptap 에디터 → components/Tiptap/CLAUDE.md 참조
├── hooks/                 # 커스텀 React hooks
├── lib/                   # 유틸리티 (cn, makeCommentTree)
├── public/                # 정적 자산 (폰트, 이미지)
├── styles/                # SCSS 파셜 → styles/CLAUDE.md 참조
├── types/                 # TypeScript 타입 정의
├── utils/                 # 서버 유틸리티 (Supabase 클라이언트, AI) → utils/CLAUDE.md 참조
├── middleware.ts           # 인증 미들웨어 (세션 갱신 + 라우트 보호)
├── next.config.ts          # Next.js 설정 (이미지, 캐시 헤더)
├── tailwind.config.ts      # Tailwind 설정
└── tsconfig.json           # TypeScript 설정
```

---

## 데이터베이스 테이블 (Supabase PostgreSQL)

| 테이블 | 설명 |
|---|---|
| `translations` | J-POP 가사 번역 |
| `categories` | 번역 카테고리 |
| `translation_categories` | 번역-카테고리 연결 테이블 |
| `articles` | 매거진 아티클 |
| `news` | 뉴스 포스트 |
| `karaoke_songs` | 노래방 곡 정보 |
| `comments` | 댓글 (스레드형, parent_comment_id로 중첩) |
| `user_info` | 유저 프로필 및 역할 |
| `events` | 이벤트/스케줄 |
| `event_types` | 이벤트 유형 (색상 포함) |
| `notifications` | 인앱 알림 |

---

## 공통 타입 (`types/supabase-table.ts`)

모든 DB 타입은 `types/supabase-table.ts`에 정의됩니다. 주요 인터페이스:

- `ITranslations` — 가사 번역 (id, title, artist, content, categories[], permalink, views, thumbnail_url, release_date)
- `IArticles` — 아티클 (id, title, content, slug, thumbnail_url, banner_url, user_info)
- `INews` — 뉴스 (id, title, slug, content, summary, thumbnail_url, user_info)
- `IKaraokeSongs` — 노래방 곡 (id, song_title, singer, tj, ky, js, keyword)
- `IComments` — 댓글 (id, content, author_id, author_name, parent_comment_id)
- `IUserInfo` — 유저 (id, name, role)
- `IEvents` — 이벤트 (id, title, description, start_date, end_date, event_types)
- `ICategories` — 카테고리 (id, name)
- `INotifications` — 알림 (id, recipient_user_id, message, type, relevant_url, is_read)

---

## 유저 역할 (Role)

`user_info.role` 값:
- `"admin"` — 전체 어드민 권한
- `"employee"` — 어드민 패널 접근 가능 (콘텐츠 관리)
- `"none"` — 일반 사용자

라우트 보호는 `middleware.ts` → `utils/supabase/middleware.ts`에서 처리됩니다.

---

## 디자인 시스템

> **UI 작업 전 반드시 [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)를 먼저 읽으세요.**

색상 토큰, 타이포그래피, 레이아웃 패턴, 컴포넌트 패턴, 금지사항이 모두 정리되어 있습니다.

### 핵심 토큰 요약

| 역할 | Tailwind 클래스 |
|---|---|
| 기본 텍스트 | `text-foreground` |
| 보조 텍스트 | `text-muted-foreground` |
| 페이지 배경 | `bg-background` |
| 밝은 배경 | `bg-comfortWhite` |
| 한지 배경 | `bg-hanji` |
| 브랜드 강조 | `bg-primary`, `text-primary` |
| 보더 | `border-border` |
| 파괴적 액션 | `bg-destructive`, `text-destructive` |

---

## 공통 컨벤션

- **컴포넌트**: `"use client"` 지시어가 없으면 기본적으로 Server Component
- **임포트 alias**: `@/` (프로젝트 루트 기준)
- **패키지 설치**: 항상 `pnpm`으로 설치
- **유틸리티 함수**: `cn()` (clsx + tailwind-merge) — `lib/utils.ts`에서 import
- **폼 토스트**: `sonner` 라이브러리 (`components/ui/sonner`)
- **아이콘**: `lucide-react`
- **날짜 처리**: `date-fns`
- **TypeScript**: 모든 파일은 TypeScript (`.ts`, `.tsx`), `any` 사용 금지
- **외부 링크 변환**: `utils/linkify.ts`의 `linkify()` 함수 사용 (직접 구현 금지)
