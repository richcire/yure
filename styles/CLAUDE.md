# CLAUDE.md — styles/

> 디자인 시스템, 색상 토큰, 폰트, SCSS 파일 구조, Tailwind 커스텀 설정, 다크모드 패턴.

---

## 디자인 토큰 (브랜드 색상)

| 이름 | 헥스 | Tailwind 클래스 | 용도 |
|---|---|---|---|
| Primary | `#69140E` | `text-[#69140E]` / `border-[#69140E]` | 메인 텍스트, 테두리, 포인트 색상 |
| comfortWhite | `#F5F5F5` | `bg-comfortWhite` | 기본 배경색 |
| hanji | `#E4E0D5` | `bg-hanji` | 한지 느낌의 보조 배경색 |
| 번역 하이라이트 배경 | `#FFD966` | `bg-[#FFD966]` | 번역 마크 배경 (가사 콘텐츠) |

**기본 body 텍스트**: `text-[#69140E]` (root layout의 `<body>`에 전역 설정됨)

---

## Tailwind 커스텀 설정 (`tailwind.config.ts`)

### 커스텀 색상

```ts
colors: {
  comfortWhite: "#F5F5F5",   // bg-comfortWhite
  border: "#69140E",          // 기본 border 색상 오버라이드
  input: "#69140E",           // 기본 input 색상 오버라이드
}

backgroundColor: {
  hanji: "#E4E0D5",           // bg-hanji
}
```

### @tailwindcss/typography 오버라이드

`prose` 클래스 내 모든 텍스트 요소(h1~h6, a, strong, em, blockquote 등)의 기본 색상이 `#69140E`로 설정되어 있습니다.

### 커스텀 스크린 브레이크포인트

```ts
screens: {
  "2xl": "1400px",
  "3xl": "1600px",
  "4xl": "1800px",
}
```

### 커스텀 애니메이션

```ts
animation: {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
  shimmer: "shimmer 2s infinite linear",
}
```

---

## SCSS 파일 구조

```
styles/
├── _variables.scss           # Tiptap CSS 변수 (색상, 그림자, 반지름, 트랜지션)
└── _keyframe-animations.scss # CSS 키프레임 애니메이션
```

두 파일은 `app/globals.scss`의 최상단에서 import됩니다:

```scss
@import "../styles/_variables.scss";
@import "../styles/_keyframe-animations.scss";
```

### `_variables.scss`
Tiptap 에디터의 테마 CSS 변수를 정의합니다:
- `--tt-gray-*` — 라이트/다크 모드 회색 스케일
- `--tt-brand-color-*` — Tiptap 브랜드 색상
- `--tt-color-text-*` — 텍스트 하이라이트 색상
- `--tt-color-highlight-*` — Tiptap 하이라이트 배경 색상
- `--tt-shadow-*` — 그림자 변수
- `--tt-radius-*` — 반지름 변수
- `--tt-transition-*` — 트랜지션 변수

> 이 변수들은 Tiptap 에디터 내부에서만 사용됩니다. 일반 UI 개발 시에는 사용하지 마세요.

### `_keyframe-animations.scss`
전역 CSS 키프레임 애니메이션을 정의합니다. `globals.scss`에서 사용됩니다.

---

## `app/globals.scss` CSS 변수 (shadcn/ui 테마)

### 라이트 모드 (`:root`)

| CSS 변수 | 값 | 설명 |
|---|---|---|
| `--background` | `0 0% 96%` (`#F5F5F5`) | 배경색 |
| `--foreground` | `4 76.5% 23.3%` | 기본 텍스트 |
| `--primary` | `4, 76%, 23%` (`#69140E`) | 프라이머리 색상 |
| `--radius` | `0.5rem` | 기본 보더 반지름 |

### 다크 모드 (`.dark`)

shadcn/ui 표준 다크 모드 변수가 `.dark` 클래스에 정의됩니다.

---

## 폰트

**Gothic A1** — 한국어/라틴 웹폰트 (자체 호스팅)

- 위치: `public/fonts/Gothic_A1/`
- 포맷: `.woff2`
- 웨이트: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold)
- `next/font/local`로 로드 (root layout에서)
- `display: swap` 설정

```tsx
// app/layout.tsx에 이미 설정되어 있음
const gothica1Font = localFont({ src: [...] });
// <html className={gothica1Font.className}>
```

---

## 다크모드

- 라이브러리: `next-themes`
- 방식: `attribute="class"` (`.dark` 클래스를 `<html>`에 토글)
- 기본 테마: 라이트 모드 (`defaultTheme="light"`)
- `app/layout.tsx`의 `ThemeProvider`에서 설정
- 토글 컴포넌트: `components/theme-switcher.tsx`

다크모드 조건부 스타일링:
```tsx
// Tailwind dark 변형 사용
<div className="bg-white dark:bg-gray-900" />
```

---

## 전역 스타일 규칙 (`globals.scss`)

- **스크롤바**: 전역 숨김 (webkit + Firefox)
- **sticky video**: `.sticky-video` 클래스로 플로팅 비디오 플레이어
- **sticky ad**: 반응형 가시성 분기점이 있는 사이드 광고 CSS

---

## 스타일 추가 시 규칙

1. **유틸리티 클래스 우선**: Tailwind 유틸리티 클래스를 최대한 활용
2. **커스텀 CSS 최소화**: 꼭 필요한 경우에만 `globals.scss`에 추가
3. **SCSS 파셜**: 새 전역 스타일은 `styles/` 폴더에 `_name.scss`로 추가 후 `globals.scss`에서 import
4. **Tiptap 변수**: `_variables.scss`의 `--tt-*` 변수는 Tiptap 전용이므로 일반 UI에서 사용하지 말 것
5. **색상 하드코딩**: 브랜드 색상 `#69140E`는 Tailwind 유틸리티 `text-[#69140E]` 또는 CSS 변수 `hsl(var(--primary))`로 참조
