# CLAUDE.md — app/admin/

> 어드민 CMS 패널 구조, 콘텐츠 관리 패턴, 접근 제어 가이드.

---

## 접근 제어

`middleware.ts`에서 `/admin/*` 경로에 대해 자동으로 보호됩니다:
- 미로그인 → `/sign-in` 리다이렉트
- `user_info.role`이 `"admin"` 또는 `"employee"`가 아닌 경우 → `/` 리다이렉트

---

## 레이아웃 구조

두 개의 route group이 어드민 패널을 구성합니다:

```
app/admin/
├── (with-sidebar)/          # 사이드바 있는 레이아웃 (목록/대시보드 페이지)
│   ├── layout.tsx           # AppSidebar 포함
│   ├── page.tsx             # 대시보드 (/)
│   ├── translation/         # 번역 목록 + 데이터테이블
│   ├── article/             # 아티클 목록 + 데이터테이블
│   ├── news/                # 뉴스 목록 + 데이터테이블
│   ├── karaoke/             # 노래방 곡 목록
│   ├── category/            # 카테고리 관리
│   └── schedule/            # 스케줄 관리
│
└── (without-sidebar)/       # 사이드바 없는 레이아웃 (업로드/수정 페이지)
    ├── layout.tsx
    ├── translation-upload/page.tsx
    ├── translation-modify/[id]/page.tsx
    ├── article/upload/page.tsx
    ├── article/modify/[id]/page.tsx
    ├── news/upload/page.tsx
    ├── news/modify/[id]/page.tsx
    ├── schedule/upload/page.tsx
    └── schedule/modify/[id]/page.tsx
```

---

## 콘텐츠 타입별 CRUD 패턴

모든 콘텐츠 타입 (번역, 아티클, 뉴스)은 동일한 패턴을 따릅니다:

### 1. 목록 페이지 (with-sidebar)

```
/admin/translation     → (with-sidebar)/translation/page.tsx
/admin/article         → (with-sidebar)/article/page.tsx
/admin/news            → (with-sidebar)/news/page.tsx
```

- async Server Component로 데이터 fetch
- `@tanstack/react-table`의 `DataTable` + `columns` 구성
- 우측 하단 고정 버튼으로 업로드 페이지 이동

### 2. 업로드/수정 페이지 (without-sidebar)

```
/admin/translation-upload         → Tiptap Editor
/admin/translation-modify/[id]    → Tiptap Editor (기존 데이터 로드)
/admin/article/upload             → ArticleEditor
/admin/article/modify/[id]        → ArticleEditor (기존 데이터 로드)
/admin/news/upload                → NewsEditor
/admin/news/modify/[id]           → NewsEditor (기존 데이터 로드)
```

- Tiptap 에디터로 콘텐츠 작성
- 에디터 상단에 메타데이터 입력 필드 (제목, 아티스트, 썸네일 등)
- 저장 시 Supabase에 직접 insert/update

> Tiptap 에디터 사용 방법은 `components/Tiptap/CLAUDE.md` 참조

---

## 데이터테이블 구성 패턴

각 목록 페이지는 세 파일로 구성됩니다:

| 파일 | 역할 |
|---|---|
| `page.tsx` | async 서버 컴포넌트, 데이터 fetch 후 DataTable에 전달 |
| `columns.tsx` | `@tanstack/react-table`의 `ColumnDef[]` 정의 |
| `data-table.tsx` | `"use client"` 클라이언트 컴포넌트, 테이블 렌더링 + 필터/정렬 |

```tsx
// page.tsx 패턴
async function getData(): Promise<ITranslations[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("translations")
    .select("id, title, artist, keyword, is_hidden")
    .order("created_at", { ascending: false })
    .returns<ITranslations[]>();
  return data ?? [];
}

export default async function TranslationPage() {
  const data = await getData();
  return <DataTable columns={columns} data={data} />;
}
```

---

## 노래방 (Karaoke) 관리

노래방은 일반 upload/modify 페이지 대신 **다이얼로그** 방식을 사용합니다:
- `song-upload-dialog.tsx` — 신규 곡 등록 다이얼로그
- `song-modify-dialog.tsx` — 곡 수정 다이얼로그
- `admin-karaoke-card.tsx` — 목록에서 각 곡 카드

---

## 카테고리 관리

번역 카테고리는 `(with-sidebar)/category/` 에서 관리합니다:
- 다이얼로그 방식으로 생성 (`upload-dialog.tsx`)
- `categories` 테이블 + `translation_categories` 연결 테이블 사용

---

## 스케줄 관리

`(with-sidebar)/schedule/` — 이벤트 목록
`(without-sidebar)/schedule/upload` — 이벤트 등록 (`ScheduleEditor` 컴포넌트 사용)
`(without-sidebar)/schedule/modify/[id]` — 이벤트 수정

---

## 어드민 사이드바 (`components/app-sidebar.tsx`)

shadcn/ui의 `Sidebar` 컴포넌트 기반. 네비게이션 항목:
- 대시보드
- 번역 관리
- 아티클 관리
- 뉴스 관리
- 노래방 관리
- 카테고리 관리
- 스케줄 관리
