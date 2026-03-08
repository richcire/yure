# DESIGN_SYSTEM.md — 유레 揺れ 디자인 시스템

> AI 에이전트 및 개발자가 UI 작업 시 반드시 참조해야 하는 디자인 토큰, 패턴, 금지사항 가이드입니다.

---

## 1. 색상 토큰 (Color Tokens)

### 브랜드 코어 컬러

| 역할 | 토큰 / 값 | Tailwind 클래스 | 비고 |
|---|---|---|---|
| **브랜드 Primary** | `#69140E` (HSL: `4 76% 23%`) | `text-primary`, `bg-primary` | 전체 사이트 기본 텍스트 · 보더 · UI 강조 |
| **배경 (기본)** | `#F5F5F5` (HSL: `0 0% 96%`) | `bg-background`, `bg-comfortWhite` | 페이지 기본 배경 |
| **배경 (한지)** | `#E4E0D5` | `bg-hanji` | 리스팅 페이지 카드 배경 |
| **배경 (한지 어두운)** | `#DAD6CB` | `bg-hanji-dark` | 캘린더 배경 |
| **배경 (아티클 본문)** | `#f8f5f0` | `bg-article-bg` | 아티클 상세 본문 영역 |
| **배너 초록** | `#214E34` | `bg-banner-green` | 번역·아티클 제목 배너 |
| **가사 하이라이트** | `#FFD966` | `bg-lyric-mark` | `<mark>` 번역 하이라이트 |
| **가사 하이라이트 (다크모드)** | `#84894A` | `bg-lyric-mark-dark` | 다크모드 `<mark>` 배경 |
| **가사 하이라이트 텍스트 (다크모드)** | `#FDF7C3` | `text-lyric-mark-text-dark` | 다크모드 `<mark>` 텍스트 |
| **외부 링크** | `#1976d2` | CSS 클래스 `.external-link` | `linkify()` 유틸이 생성하는 링크 |

### shadcn/ui 시맨틱 CSS 변수 (라이트모드 기준)

이 변수들은 `app/globals.scss`의 `:root`에 정의되며, Tailwind 클래스로 사용됩니다.

| CSS 변수 | 값 (HSL) | Tailwind 클래스 | 역할 |
|---|---|---|---|
| `--background` | `0 0% 96%` (`#F5F5F5`) | `bg-background` | 페이지 배경 |
| `--foreground` | `4 76.5% 23.3%` (`#69140E`) | `text-foreground` | 기본 텍스트 |
| `--primary` | `4 76% 23%` (`#69140E`) | `bg-primary`, `text-primary` | 주요 인터랙션 색상 |
| `--primary-foreground` | `0 0% 98%` (거의 흰색) | `text-primary-foreground` | primary 위의 텍스트 |
| `--muted-foreground` | `4 15% 45%` (웜 그레이) | `text-muted-foreground` | 보조 텍스트, 메타 정보 |
| `--border` | `0 0% 62%` (중간 회색) | `border-border` | 구분선·보더 |
| `--destructive` | `0 84.2% 60.2%` | `bg-destructive`, `text-destructive` | 삭제·경고 액션 |
| `--card` | `0 0% 100%` (흰색) | `bg-card` | 카드 배경 |
| `--radius` | `0.5rem (8px)` | `rounded-lg`, `rounded-md`, `rounded-sm` | 기본 모서리 반경 |

---

## 2. 색상 사용 규칙

### 반드시 지켜야 할 규칙

```
✅ 올바른 사용법
text-foreground          (기본 텍스트)
text-muted-foreground    (보조 텍스트, 날짜, 메타)
bg-background            (페이지 배경)
bg-comfortWhite          (명시적 흰빛 배경)
bg-hanji                 (한지 질감 배경)
bg-primary               (버튼, 강조)
text-primary             (브랜드 텍스트 강조)
border-border            (구분선)
bg-destructive           (삭제 버튼)
text-destructive         (삭제 텍스트)

❌ 금지 사용법
bg-[#F5F5F5]             → bg-comfortWhite 사용
bg-[#E4E0D5]             → bg-hanji 사용
bg-[#69140E]             → bg-primary 사용
text-[#69140E]           → text-primary 또는 text-foreground 사용
bg-white                 → bg-background 또는 bg-comfortWhite 사용
text-black               → text-foreground 사용
text-gray-600            → text-muted-foreground 사용
text-gray-300            → text-muted-foreground/50 또는 text-border 사용
bg-red-500               (파괴적 액션) → bg-destructive 사용
```

### 예외 허용 케이스

- **이미지·영상 오버레이**: `bg-black/50`, `bg-gradient-to-b from-black/60` 등 불투명도를 이용한 오버레이는 허용
- **캐러셀 인디케이터**: 어두운 배경 위 `bg-white`, `bg-white/50` 허용 (컨텍스트상 의도적)
- **개발용 더미 광고**: `NODE_ENV === 'development'`에서만 렌더되는 개발 전용 UI는 예외 허용
- **@tailwindcss/typography prose 스타일**: `tailwind.config.ts`에 이미 `#69140E`로 오버라이드 설정됨

---

## 3. 타이포그래피

### 폰트 패밀리

**Gothic A1** — 한국어 + 라틴 문자 전용 로컬 웹폰트 (`next/font/local`)

| Weight | 클래스 | 용도 |
|---|---|---|
| 400 (Regular) | `font-normal` | 본문 |
| 500 (Medium) | `font-medium` | 중간 강조 |
| 600 (SemiBold) | `font-semibold` | 소제목, UI 버튼 |
| 700 (Bold) | `font-bold` | 제목, 헤딩 |

### 헤딩 스케일 (Tailwind 표준 스케일만 사용)

| 용도 | 클래스 | 비고 |
|---|---|---|
| 히어로 제목 (H1) | `text-4xl md:text-5xl font-bold` | 번역·아티클 상세 히어로 |
| 섹션 제목 | `text-3xl font-bold` | 홈 섹션, 리스팅 페이지 |
| 카드 제목 | `text-2xl font-semibold` | 뉴스·아티클 상세 H1 |
| 서브 제목 | `text-xl font-medium` | |
| 메타 정보 | `text-sm text-muted-foreground` | 날짜, 작성자 |
| 뱃지·태그 | `text-xs` | |

```
❌ 금지: text-[30px], text-[11px], text-[14px] 등 임의 픽셀값
✅ 허용: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl, text-5xl, text-9xl
```

---

## 4. 레이아웃 패턴

### 리스팅 페이지 컨테이너 (표준)

```tsx
// 번역, 아티클, 뉴스 리스팅 페이지 표준 패턴
<div className="w-full max-w-6xl mx-auto min-h-screen bg-hanji pt-32 lg:my-20 rounded-lg shadow-lg">
```

| 속성 | 값 | 비고 |
|---|---|---|
| 최대 너비 | `max-w-6xl` | 리스팅 페이지 |
| 배경 | `bg-hanji` | 한지 배경 |
| 상단 패딩 | `pt-32` | 고정 네비게이션 높이 고려 |
| 마진 | `lg:my-20` | 데스크탑에서 카드 여백 |
| 모서리 | `rounded-lg shadow-lg` | 카드 느낌 |

### 예외 페이지

| 페이지 | 컨테이너 | 배경 | 이유 |
|---|---|---|---|
| 노래방 (`/karaoke`) | `max-w-5xl` | `bg-background` | 검색 특성상 전체 너비 활용 |
| 일정 (`/schedule`) | `max-w-5xl` | `bg-background` | 캘린더 특성상 전체 너비 활용 |
| 아티클 상세 본문 | `max-w-3xl` | `bg-article-bg` | 가독성을 위한 좁은 컬럼 |
| 번역 상세 본문 | `max-w-4xl` | `bg-background` | |

### 콘텐츠 너비

```
max-w-6xl   리스팅 페이지 외부 컨테이너
max-w-5xl   노래방, 일정, 홈 섹션
max-w-4xl   번역 상세 본문
max-w-3xl   아티클 상세 본문
```

### 커스텀 브레이크포인트

```
2xl: 1400px  (컨테이너 최대 너비)
3xl: 1600px
4xl: 1800px
```

---

## 5. 모서리 반경 (Border Radius)

| 클래스 | 값 | 용도 |
|---|---|---|
| `rounded-sm` | `4px` | 소형 UI (뱃지, 인풋 내부) |
| `rounded-md` | `6px` | 버튼, 드롭다운 |
| `rounded-lg` | `8px` | 카드, 패널 |
| `rounded-full` | `9999px` | 아바타, 원형 버튼 |

---

## 6. 컴포넌트 패턴

### 제목 배너 (번역·아티클 상세)

```tsx
// 배너 초록 배경 + 한지 텍스트
<div className="bg-banner-green shadow-lg p-4 rounded-md mb-8">
  <h1 className="text-2xl sm:text-3xl text-hanji font-bold mb-2">{title}</h1>
  <h2 className="text-lg sm:text-xl text-hanji">{subtitle}</h2>
</div>
```

### 가사 하이라이트 (`<mark>`)

```tsx
// 에디터 설정 (Tiptap Highlight 확장)
Highlight.configure({
  HTMLAttributes: {
    class: "bg-lyric-mark text-primary dark:bg-lyric-mark-dark dark:text-lyric-mark-text-dark",
  },
})

// 저장된 HTML (레거시 - DB에 이미 저장된 콘텐츠)
<mark class="bg-[#FFD966] text-[#69140E]">번역 텍스트</mark>
// → tailwind.config.ts safelist에 등록되어 빌드 시 포함됨
```

### 외부 링크 (linkify 유틸)

```tsx
// utils/linkify.ts - 반드시 이 유틸을 사용할 것 (중복 구현 금지)
import { linkify } from "@/utils/linkify";

// 생성되는 HTML
<a href="..." target="_blank" rel="noopener noreferrer" class="external-link">...</a>
// .external-link 스타일은 globals.scss에 정의됨
```

### 버튼 패턴

```tsx
// 주요 액션 버튼
<Button className="bg-primary text-primary-foreground hover:opacity-80">저장</Button>

// 로그인 링크
<Link className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-70 transition-all text-sm font-medium">
  로그인
</Link>

// 파괴적 액션 (삭제, 로그아웃)
<button className="text-destructive border-destructive hover:bg-destructive/10">
  삭제
</button>
```

### 드롭다운 패널

```tsx
<div className="bg-comfortWhite backdrop-blur-sm shadow-sm border rounded-md py-2">
  {/* 메뉴 항목 */}
</div>
```

### 스켈레톤

```tsx
// shadcn/ui Skeleton 컴포넌트 사용
<Skeleton className="h-9 w-3/4 animate-pulse" />

// 배너 위 스켈레톤 (어두운 배경용)
<Skeleton className="h-9 w-3/4 animate-pulse bg-gray-300/10" />
```

---

## 7. shadcn/ui 컴포넌트 사용 규칙

- `components/ui/` 폴더의 파일은 **원칙적으로 수정 금지**
- 새 컴포넌트 추가: `pnpm dlx shadcn@latest add [component-name]`
- 커스텀이 꼭 필요하면: `className` prop으로 오버라이드, 파일 자체 수정 지양
- `Switch` 체크 상태: `bg-primary` (✅), `bg-red-500` (❌)

---

## 8. 애니메이션 토큰

### Tailwind 애니메이션 (tailwind.config.ts)

| 클래스 | 동작 |
|---|---|
| `animate-accordion-down` | 아코디언 열기 |
| `animate-accordion-up` | 아코디언 닫기 |
| `animate-shimmer` | 로딩 shimmer 효과 |

### CSS 유틸 클래스 (globals.scss)

| 클래스 | 동작 |
|---|---|
| `animate-bounce-slow` | 느린 바운스 (에러 페이지) |
| `animate-fade-in` | 페이드인 + 위로 등장 |
| `animate-shine` | 빛 스윕 효과 |
| `animate-marquee` | 수평 무한 스크롤 |
| `animate-marquee-vertical` | 수직 무한 스크롤 |

### SCSS 애니메이션 (styles/_keyframe-animations.scss)

Tiptap 에디터 내부에서 사용하는 등장 효과 (`fadeIn`, `zoomIn`, `slideFromTop` 등).

---

## 9. 금지사항 요약

| 카테고리 | 금지 | 대체 |
|---|---|---|
| 색상 | `text-[#69140E]` | `text-foreground` 또는 `text-primary` |
| 색상 | `bg-[#F5F5F5]` | `bg-comfortWhite` |
| 색상 | `bg-[#E4E0D5]` | `bg-hanji` |
| 색상 | `bg-[#DAD6CB]` | `bg-hanji-dark` |
| 색상 | `bg-[#214E34]` | `bg-banner-green` |
| 색상 | `bg-[#FFD966]` | `bg-lyric-mark` |
| 색상 | `bg-[#84894A]` | `bg-lyric-mark-dark` |
| 색상 | `bg-[#f8f5f0]` | `bg-article-bg` |
| 색상 | `bg-white` | `bg-background` 또는 `bg-comfortWhite` |
| 색상 | `text-black` | `text-foreground` |
| 색상 | `text-gray-600` | `text-muted-foreground` |
| 색상 | `bg-red-500` (파괴적 액션) | `bg-destructive` |
| 인라인 스타일 | `style={{ color: '#1976d2' }}` | `class="external-link"` (linkify 유틸) |
| 타이포 | `text-[30px]`, `text-[11px]` | `text-3xl`, `text-xs` 등 표준 스케일 |
| 레이아웃 | 임의 `max-w-` 혼용 | 섹션별 권장 max-width 준수 |
| 함수 | `linkify()` 직접 구현 | `@/utils/linkify` import |
| TypeScript | `any` 사용 | 명시적 타입 정의 |

---

## 10. 파일 참조

| 파일 | 역할 |
|---|---|
| `tailwind.config.ts` | 모든 색상 토큰, 브레이크포인트, 애니메이션 정의 |
| `app/globals.scss` | shadcn/ui CSS 변수, 전역 유틸 클래스 |
| `styles/_variables.scss` | Tiptap 에디터 전용 CSS 변수 (`--tt-*`) |
| `styles/_keyframe-animations.scss` | Tiptap 에디터 전용 애니메이션 |
| `styles/calendar.css` | FullCalendar 오버라이드 |
| `utils/linkify.ts` | URL → `<a>` 변환 공통 유틸 |
| `types/supabase-table.ts` | 모든 DB 관련 TypeScript 타입 |
