# CLAUDE.md — components/

> 컴포넌트 폴더 구조, 각 도메인 역할, shadcn/ui 사용법, 광고 컴포넌트 가이드.

---

## 폴더 구조 개요

```
components/
├── ui/                        # shadcn/ui 기본 컴포넌트 (수정 금지)
├── home/                      # 홈 페이지 전용 섹션 컴포넌트
├── translation/               # 가사 번역 기능 컴포넌트
├── article/                   # 아티클 기능 컴포넌트
├── news/                      # 뉴스 기능 컴포넌트
├── karaoke/                   # 노래방 검색 컴포넌트
├── schedule/                  # 이벤트 스케줄 컴포넌트
├── comments/                  # 공유 댓글 시스템
├── navigation-section/        # 상단 네비게이션 바, 모바일 사이드바, 알림
├── google-adsense/            # Google AdSense 광고 컴포넌트
├── advertisement/             # 사이드 배너 광고
├── magicui/                   # Magic UI 애니메이션 컴포넌트
├── Tiptap/                    # Tiptap 에디터 (어드민용) → Tiptap/CLAUDE.md 참조
├── tiptap-ui/                 # Tiptap 툴바 UI 컨트롤
├── tiptap-ui-primitive/       # Tiptap 기반 프리미티브
├── tiptap-node/               # 커스텀 Tiptap 노드
├── tiptap-extension/          # 커스텀 Tiptap 확장
├── tiptap-icons/              # Tiptap 툴바 SVG 아이콘
├── tiptap-templates/          # 에디터 프리셋 템플릿
├── typography/                # 타이포그래피 유틸리티 (InlineCode)
├── app-sidebar.tsx            # 어드민 사이드바
├── footer.tsx                 # 사이트 푸터
├── date-picker.tsx            # 날짜 선택기
├── form-message.tsx           # 폼 에러/성공 메시지
├── submit-button.tsx          # 로딩 상태 포함 제출 버튼
├── theme-switcher.tsx         # 다크/라이트 모드 토글
└── web-vitals.tsx             # Web Vitals 리포팅 컴포넌트
```

---

## shadcn/ui 컴포넌트 (`components/ui/`)

shadcn/ui의 기본 컴포넌트들이 위치합니다. **직접 수정하지 마세요.**

자주 사용하는 컴포넌트:
- `Button` — 버튼
- `Card` — 카드 레이아웃
- `Dialog` — 모달 다이얼로그
- `Drawer` — 모바일 드로어
- `Select` — 셀렉트 박스
- `Table` — 테이블 (어드민 DataTable 기반)
- `Sidebar` — 어드민 사이드바 기반
- `Skeleton` — 로딩 스켈레톤
- `Toaster` / `sonner` — 토스트 알림
- `Label`, `Input`, `Textarea` — 폼 요소
- `Accordion` — 아코디언

사용법:
```tsx
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
```

---

## 도메인별 컴포넌트

### `translation/`
| 컴포넌트 | 역할 |
|---|---|
| `SongCard` | 개별 번역 카드 (썸네일, 제목, 아티스트) |
| `SongGrid` | 번역 카드 그리드 레이아웃 |
| `TranslationList` | 번역 목록 (필터 포함) |
| `TranslationContent` | 번역 상세 페이지 콘텐츠 |
| `TranslationFilter` | 카테고리/정렬 필터 |
| `ViewCounter` | 조회수 카운터 (클라이언트 사이드) |
| `TranslationCommentSection` | 번역 페이지 댓글 섹션 |
| `RelatedPosts` | 관련 번역 목록 |

### `article/`
| 컴포넌트 | 역할 |
|---|---|
| `ArticleCard` | 아티클 카드 |
| `ArticleGrid` | 아티클 그리드 (캐러셀 포함) |
| `ArticleContent` | 아티클 상세 콘텐츠 |
| `ArticleFilters` | 아티클 필터 |
| `ArticleCommentSection` | 아티클 댓글 섹션 |
| `RelatedPosts` | 관련 아티클 |

### `news/`
| 컴포넌트 | 역할 |
|---|---|
| `NewsCard` | 뉴스 카드 |
| `NewsGrid` | 뉴스 그리드 |
| `NewsContent` | 뉴스 상세 콘텐츠 |
| `NewsBanner` | 뉴스 배너 |
| `NewsActions` | 뉴스 액션 버튼 |
| `NewsCommentSection` | 뉴스 댓글 섹션 |

### `karaoke/`
| 컴포넌트 | 역할 |
|---|---|
| `KaraokeCard` | 노래방 곡 카드 (TJ/KY/JS 번호 표시) |
| `KaraokeAccordion` | 아코디언 방식 노래방 목록 |
| `KaraokeSongs` | 노래방 곡 전체 목록 |
| `Search` | 서버 사이드 노래방 검색 |
| `ClientSideSearch` | 클라이언트 사이드 검색 필터 |
| `KaraokeCommentSection` | 노래방 댓글 섹션 |

### `schedule/`
| 컴포넌트 | 역할 |
|---|---|
| `Calendar` | FullCalendar 기반 캘린더 |
| `CalendarWrapper` | 캘린더 클라이언트 래퍼 |
| `ScheduleCard` | 이벤트 카드 |
| `ScheduleEditor` | 이벤트 생성/수정 폼 (어드민) |
| `ScheduleFilters` | 이벤트 필터 |
| `ScheduleList` | 이벤트 목록 |

### `home/`
홈 페이지 전용 섹션 컴포넌트:
- `FeaturedTranslations` — 추천 번역 섹션
- `FeaturedArticleWrapper` — 추천 아티클 캐러셀
- `FeaturedNewsWrapper` — 추천 뉴스 섹션
- `FeaturedSchedule` — 다가오는 이벤트
- `CDCarousel` — CD 케이스 형태 캐러셀
- `VideoTape` — 비디오테이프 모양 UI
- `ScrollDownInstructor` — 스크롤 유도 애니메이션

---

## 댓글 시스템 (`comments/`)

스레드형 댓글 시스템 (parent_comment_id로 중첩):

| 컴포넌트 | 역할 |
|---|---|
| `comment-section.tsx` | 특정 콘텐츠의 댓글 섹션 전체 |
| `comment.tsx` | 개별 댓글 렌더링 |
| `comment-refactory.tsx` | 리팩토링된 범용 댓글 컴포넌트 |
| `comments-refactory.tsx` | 리팩토링된 범용 댓글 목록 |
| `reply-refactory.tsx` | 리팩토링된 답글 컴포넌트 |

댓글 트리 빌드 유틸리티: `lib/utils.ts`의 `makeCommentTree()`

---

## 광고 컴포넌트

### Google AdSense (`google-adsense/`)

| 컴포넌트 | 사용 위치 |
|---|---|
| `BottomDisplayAd` | 페이지 하단 디스플레이 광고 |
| `bottom-display-ad-wrapper.tsx` | Suspense 래퍼 버전 |
| `SideVerticalDisplayAd` | 사이드 세로 광고 |
| `side-vertical-display-ad-wrapper.tsx` | Suspense 래퍼 버전 |
| `mobile-sticky-bottom-ad-wrapper.tsx` | 모바일 하단 고정 광고 |
| `mobile-karaoke-infeed-ad-wrapper.tsx` | 노래방 인피드 광고 |
| `AdSenseCodeSnippet` | AdSense 스크립트 (root layout `<head>`에만 삽입) |

AdSense 클라이언트 ID: `ca-pub-4738868818137222`

### 사이드 배너 광고 (`advertisement/`)

- `SideBannerAd` — `(with-navigation)/layout.tsx`에서 사용하는 우측 고정 사이드 배너

---

## Magic UI 애니메이션 (`magicui/`)

| 컴포넌트 | 역할 |
|---|---|
| `Marquee` | 수평 무한 스크롤 텍스트/카드 |
| `ShineBorder` | 빛나는 테두리 애니메이션 |
| `TextAnimate` | 텍스트 등장 애니메이션 (blurInUp, slideUp 등) |

---

## 공유 컴포넌트

| 컴포넌트 | 역할 |
|---|---|
| `footer.tsx` | 사이트 푸터 |
| `app-sidebar.tsx` | 어드민 패널 사이드바 (shadcn/ui Sidebar 기반) |
| `date-picker.tsx` | 날짜 선택기 (react-day-picker 기반) |
| `form-message.tsx` | 폼 에러/성공 메시지 표시 |
| `submit-button.tsx` | 로딩 상태 포함 제출 버튼 (`useFormStatus`) |
| `theme-switcher.tsx` | 다크/라이트 모드 토글 |

---

## 새 컴포넌트 추가 시 규칙

1. **도메인 관련 컴포넌트** → 해당 도메인 폴더에 추가 (`translation/`, `article/` 등)
2. **여러 도메인에서 사용** → 루트 `components/`에 추가
3. **shadcn/ui 신규 컴포넌트** → `pnpm dlx shadcn@latest add [component-name]`으로 추가, `ui/` 폴더에 자동 생성
4. **`"use client"` 지시어** → 클라이언트 사이드 상태/이벤트가 필요한 경우만 사용
5. **클라이언트 컴포넌트에서 Supabase** → `utils/supabase/client.ts`의 `createClient()` 사용
