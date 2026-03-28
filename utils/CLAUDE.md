# CLAUDE.md — utils/

> Supabase 클라이언트 선택 가이드, AI 자동 번역 파이프라인 설명.

---

## Supabase 클라이언트 종류 및 선택 기준

총 4가지 Supabase 클라이언트가 있습니다. 상황에 맞게 올바른 클라이언트를 선택하세요.

### 1. `utils/supabase/client.ts` — 브라우저 클라이언트

```ts
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
```

- **사용 위치**: `"use client"` 클라이언트 컴포넌트
- **특징**: `createBrowserClient` 기반, 쿠키에서 세션 자동 관리
- **용도**: 클라이언트 사이드 인증, 데이터 조회/변경 (Tiptap 에디터 저장 등)

### 2. `utils/supabase/server.ts` — 서버 클라이언트 (기본)

```ts
import { createClient } from "@/utils/supabase/server";
const supabase = await createClient();
```

- **사용 위치**: Server Component, Route Handler, Server Action
- **특징**: `createServerClient` 기반, Next.js cookies()로 세션 관리
- **용도**: 서버 사이드 인증 데이터 조회, 어드민 CMS 데이터 fetch

### 3. `utils/supabase/server.ts` — 서비스 역할 클라이언트

```ts
import { createClient } from "@/utils/supabase/server";
const supabase = await createClient("service_role");
```

- **사용 위치**: Server Action (신뢰된 서버 환경에서만)
- **특징**: `SUPABASE_SERVICE_ROLE_KEY` 사용, RLS 우회
- **용도**: 유저 계정 삭제, RLS로 제한된 관리자 작업
- **주의**: 절대 클라이언트 컴포넌트에서 사용 금지

### 4. `utils/supabase/public.ts` — 공개 클라이언트

```ts
import { createPublicClient } from "@/utils/supabase/public";
const supabase = createPublicClient();
```

- **사용 위치**: 서버 컴포넌트 (세션 불필요한 공개 페이지)
- **특징**: `persistSession: false`, `autoRefreshToken: false` — 쿠키 처리 없음
- **용도**: 가사 번역 상세 페이지 등 고성능 공개 데이터 읽기
- **장점**: 쿠키 오버헤드 없어 더 빠름

---

## 클라이언트 선택 결정 트리

```
컴포넌트에 "use client"가 있는가?
  ✅ Yes → utils/supabase/client.ts

  ❌ No (Server Component / Route Handler / Server Action)
    └─ 유저 세션/권한이 필요한가?
         ✅ Yes → utils/supabase/server.ts의 createClient()
         ❌ No (공개 데이터만 읽음)
              └─ utils/supabase/public.ts의 createPublicClient()
    
    └─ RLS를 우회하는 관리자 작업인가?
         ✅ Yes → createClient("service_role")
```

---

## AI 자동 번역 파이프라인 (`utils/ai/`)

### `auto-post.ts` — 메인 워크플로우

`runWorkflow()`를 export하는 멀티에이전트 파이프라인:

```ts
import { runWorkflow } from "@/utils/ai/auto-post";
const htmlContent = await runWorkflow({ input_as_text: "日本語歌詞..." });
```

**파이프라인 순서:**
1. **`japaneseLyricsTranslater` 에이전트** (GPT-5.1)
   - 입력: 일본어 가사 원문
   - 출력: 각 줄마다 `(일본어 원문 / 한국어 발음 / 한국어 번역)` 삼중 쌍

2. **`htmlConverter` 에이전트** (GPT-5.1)
   - 입력: 위 삼중 쌍 텍스트
   - 출력: 즉시 DB에 저장 가능한 HTML (10 블록마다 AdSense `<ins>` 태그 삽입)

**관찰**: `withTrace("Auto Translate", ...)` 로 OpenAI 대시보드에서 추적 가능

### `translate-insert-lyrics.ts` — 번역 + DB 삽입

가사 번역 후 직접 `translations` 테이블에 삽입하는 유틸리티.

---

## `utils/utils.ts` — 일반 유틸리티

```ts
import { encodedRedirect } from "@/utils/utils";
```

- `encodedRedirect(type, path, message)` — 에러/성공 메시지를 URL 파라미터로 인코딩해 리다이렉트 (Server Action 결과 전달 용)

---

## `utils/supabase/middleware.ts` — 세션 갱신

`updateSession()` 함수:
- 모든 요청에서 Supabase 세션 갱신
- `/protected/*` → 미인증 시 `/sign-in` 리다이렉트
- `/admin/*` → `user_info.role`이 `"admin"` 또는 `"employee"` 아니면 `/` 리다이렉트
- `middleware.ts`에서 직접 import하여 사용
