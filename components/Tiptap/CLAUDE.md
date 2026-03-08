# CLAUDE.md — components/Tiptap/

> Tiptap v3 리치 텍스트 에디터 구조, 에디터 종류, 커스텀 확장, 이미지 업로드 가이드.
> 이 에디터는 **어드민 패널에서만 사용**됩니다.

---

## 에디터 종류

| 파일 | 용도 | 사용 위치 |
|---|---|---|
| `Editor.tsx` | 가사 번역 에디터 | `/admin/translation-upload`, `/admin/translation-modify/[id]` |
| `ArticleEditor.tsx` | 아티클 에디터 | `/admin/article/upload`, `/admin/article/modify/[id]` |
| `NewsEditor.tsx` | 뉴스 에디터 | `/admin/news/upload`, `/admin/news/modify/[id]` |
| `TestEditor.tsx` | 테스트용 에디터 | 개발용 |
| `Toolbar.tsx` | 에디터 툴바 (Editor.tsx 전용) | Editor.tsx 내부 |
| `TipTapContentSkeleton.tsx` | 콘텐츠 로딩 스켈레톤 | 콘텐츠 상세 페이지 |

---

## Editor.tsx (번역 에디터)

가사 번역 콘텐츠를 위한 에디터. `id` prop이 있으면 수정 모드, 없으면 신규 생성 모드.

```tsx
// 신규 생성
<TiptapEditor />

// 수정
<TiptapEditor id={translationId} />
```

### 메타데이터 필드
- `title` — 노래 제목
- `artist` — 아티스트명
- `selectedCategoriesIds` — 카테고리 (멀티 선택)
- `releaseDate` — 발매일 (DatePicker)
- `thumbnail` — 썸네일 이미지
- `permalink` — URL 퍼마링크

### 저장 동작
- `translations` 테이블에 upsert
- `translation_categories` 연결 테이블도 함께 업데이트
- Supabase 클라이언트: `utils/supabase/client.ts` (클라이언트 컴포넌트)

---

## ArticleEditor.tsx / NewsEditor.tsx

아티클과 뉴스 에디터는 shadcn/ui의 새로운 Tiptap 통합 방식을 사용합니다.

```tsx
// id prop이 있으면 수정 모드
<ArticleEditor id={articleId} />
<NewsEditor id={newsId} />
```

### 메타데이터 필드 (Article)
- `title` — 아티클 제목
- `thumbnail_url` — 썸네일
- `banner_url` — 배너 이미지

### 메타데이터 필드 (News)
- `title` — 뉴스 제목
- `summary` — 요약
- `thumbnail_url` — 썸네일

---

## 커스텀 확장 (`extensions/`)

Editor.tsx에서 사용하는 커스텀 Tiptap 확장:

| 파일 | 역할 |
|---|---|
| `ImageExtension.tsx` | Supabase Storage 이미지 업로드 + 표시 |
| `YouTubeExtension.tsx` | YouTube 영상 임베드 |
| `InstagramExtension.tsx` | Instagram 포스트 임베드 |
| `GoogleAdExtension.tsx` | Google AdSense `<ins>` 광고 블록 삽입 |
| `CustomHighlightExtenstion.ts` | 커스텀 하이라이트 (`bg-[#FFD966] text-[#69140E]`) |

---

## 이미지 업로드

`ImageExtension.tsx`가 이미지 업로드를 처리합니다:
- Supabase Storage 버킷에 업로드
- 클라이언트: `utils/supabase/client.ts`의 `createClient()`
- 업로드 후 Public URL을 에디터에 삽입

---

## Tiptap 관련 폴더 전체 구조

```
components/
├── Tiptap/                    # ← 이 폴더 (에디터 진입점)
│   ├── Editor.tsx             # 번역 에디터
│   ├── ArticleEditor.tsx      # 아티클 에디터
│   ├── NewsEditor.tsx         # 뉴스 에디터
│   ├── Toolbar.tsx            # 번역 에디터 툴바
│   ├── TipTapContentSkeleton.tsx
│   └── extensions/            # 커스텀 Tiptap 확장
│
├── tiptap-ui/                 # shadcn Tiptap 툴바 컨트롤
│   ├── heading-button/        # 헤딩 버튼
│   ├── heading-dropdown-menu/ # 헤딩 드롭다운
│   ├── mark-button/           # Bold/Italic/Underline 등 마크
│   ├── list-button/           # 리스트 버튼
│   ├── list-dropdown-menu/    # 리스트 드롭다운
│   ├── blockquote-button/     # 인용구 버튼
│   ├── code-block-button/     # 코드 블록 버튼
│   ├── image-upload-button/   # 이미지 업로드 버튼
│   ├── link-popover/          # 링크 팝오버
│   ├── color-highlight-button/ # 색상 하이라이트 버튼
│   ├── color-highlight-popover/ # 색상 하이라이트 팝오버
│   └── undo-redo-button/      # 실행 취소/재실행
│
├── tiptap-ui-primitive/       # 툴바 기반 프리미티브
│   ├── button/                # 툴바 버튼
│   ├── toolbar/               # 툴바 컨테이너
│   ├── dropdown-menu/         # 드롭다운 메뉴
│   ├── popover/               # 팝오버
│   ├── tooltip/               # 툴팁
│   ├── badge/                 # 배지
│   ├── input/                 # 입력 필드
│   ├── separator/             # 구분선
│   └── spacer/                # 간격
│
├── tiptap-node/               # 커스텀 렌더링 노드 (SCSS 포함)
│   ├── blockquote-node/
│   ├── code-block-node/
│   ├── heading-node/
│   ├── image-node/
│   ├── image-upload-node/
│   ├── list-node/
│   ├── paragraph-node/
│   └── horizontal-rule-node/
│
├── tiptap-extension/          # 커스텀 Tiptap 확장
│   └── node-background-extension.ts  # 노드 배경색 확장
│
└── tiptap-icons/              # 툴바 SVG 아이콘 컴포넌트
```

---

## 번역 콘텐츠 HTML 포맷

AI 파이프라인(`utils/ai/auto-post.ts`)이 생성하는 번역 콘텐츠는 다음 구조를 따릅니다:

```html
<!-- 가사 한 블록 (일본어 원문 + 발음 + 번역) -->
<p style="text-align: center;"></p>
<p style="text-align: center;">日本語原文</p>
<p style="text-align: center;">한국어 발음</p>
<p style="text-align: center;"><mark class="bg-[#FFD966] text-[#69140E]">한국어 번역</mark></p>
<p style="text-align: center;"></p>

<!-- 10 블록마다 광고 삽입 -->
<ins class="rounded-md adsbygoogle"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-4738868818137222"
     data-ad-slot="2891582134"
     style="display: block; text-align: center;"></ins>
```

이 HTML이 `translations.content` 컬럼에 저장되고 에디터에서 편집됩니다.

---

## 에디터 지원 기능

- 헤딩 (H1~H6)
- Bold / Italic / Underline / Strike
- 리스트 (순서있음/없음/할일)
- 인용구 (Blockquote)
- 코드 블록
- 이미지 업로드 (Supabase Storage)
- 링크
- 텍스트 정렬 (좌/중/우/양쪽)
- 하이라이트 (색상 선택)
- 서브스크립트 / 슈퍼스크립트
- 수평선
- YouTube/Instagram 임베드
- Google AdSense 광고 블록
- 커스텀 배경색 (`node-background-extension.ts`)
- Undo / Redo
