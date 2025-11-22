# Phase 2 Refactoring Implementation Guide

## Overview

This document provides step-by-step implementation instructions for Phase 2 refactoring tasks.

## 1. Editor Component Consolidation

### Background

Three editor components (`Editor.tsx`, `ArticleEditor.tsx`, `NewsEditor.tsx`) have ~95% duplicate code.

### Implementation Steps

#### Step 1: Create Generic Editor Configuration

Create: `components/Tiptap/useEditorConfig.ts`

```typescript
import { IArticles, INews, ITranslations } from "@/types/supabase-table";

export interface EditorConfig {
  entityId?: string;
  tableName: "articles" | "news" | "translations";
  storageFolder: "article" | "news" | "translation";
  useDialog?: boolean; // true for Dialog, false for Drawer
}

export type ContentEntity = IArticles | INews | ITranslations;

// Extract common editor configuration logic here
export const getEditorExtensions = () => {
  // Return all common extensions
};
```

#### Step 2: Create Universal Editor Component

Create: `components/Tiptap/UniversalEditor.tsx`

- Extract all common logic from existing editors
- Accept `EditorConfig` as prop
- Use generic types for entity data
- Keep UI structure identical

#### Step 3: Refactor Existing Editors

Update each editor to use the universal component:

```typescript
// ArticleEditor.tsx - BEFORE
export default function ArticleEditor({ id }: { id?: string }) {
  const [article, setArticle] = useState<IArticles>();
  // ... 500+ lines of code ...
}

// ArticleEditor.tsx - AFTER
import UniversalEditor from "./UniversalEditor";

export default function ArticleEditor({ id }: { id?: string }) {
  return (
    <UniversalEditor
      entityId={id}
      tableName="articles"
      storageFolder="article"
      useDialog={true}
    />
  );
}
```

#### Step 4: Apply to All Editors

1. Update `NewsEditor.tsx`
2. Update `Editor.tsx` (if still needed)
3. Verify all imports still work

### Estimated Outcome

- Reduce code: ~1000 lines → ~200 lines (80% reduction)
- Maintenance: 3 files → 1 file to update
- Time: ~2 hours

---

## 2. Ad Components Consolidation

### Background

6 different ad wrapper components with similar functionality can be unified.

### Implementation Steps

#### Step 1: Create AdContainer Component

Create: `components/google-adsense/AdContainer.tsx`

```typescript
"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface AdConfig {
  type: "bottom" | "sticky-mobile" | "infeed" | "sidebar";
  slot: string;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
  className?: string;
}

const adConfigs = {
  bottom: {
    format: "auto",
    layout: "in-article",
    responsive: true,
  },
  "sticky-mobile": {
    format: "auto",
    layout: "in-article",
    responsive: true,
  },
  infeed: {
    format: "fluid",
    layout: "in-article",
    responsive: true,
  },
  sidebar: {
    format: "auto",
    layout: "in-article",
    responsive: true,
  },
};

export function AdContainer({
  type,
  slot,
  mobileOnly,
  desktopOnly,
  className,
}: AdConfig) {
  const [isReady, setIsReady] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Handle mobile/desktop filtering
  if (mobileOnly && !isMobile) return null;
  if (desktopOnly && isMobile) return null;
  if (process.env.NODE_ENV !== "production") return null;

  useEffect(() => {
    setIsReady(true);
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  const config = adConfigs[type];

  return (
    <ins
      className={`adsbygoogle ${className || ""}`}
      style={{ display: "block" }}
      data-ad-client="ca-pub-4738868818137222"
      data-ad-slot={slot}
      data-ad-format={config.format}
      data-ad-layout={config.layout}
      data-full-width-responsive={config.responsive.toString()}
    />
  );
}
```

#### Step 2: Replace Old Components

1. Replace `BottomDisplayAdWrapper` usage with `<AdContainer type="bottom" />`
2. Replace `MobileStickyBottomAdWrapper` with `<AdContainer type="sticky-mobile" mobileOnly />`
3. Replace `MobileKaraokeInfeedAdWrapper` with `<AdContainer type="infeed" mobileOnly />`
4. Replace `SideVerticalDisplayAdWrapper` with `<AdContainer type="sidebar" desktopOnly />`

#### Step 3: Delete Old Files

```
components/google-adsense/bottom-display-ad.tsx
components/google-adsense/bottom-display-ad-wrapper.tsx
components/google-adsense/mobile-sticky-bottom-ad-wrapper.tsx
components/google-adsense/mobile-karaoke-infeed-ad-wrapper.tsx
components/google-adsense/side-vertical-display-ad.tsx
components/google-adsense/side-vertical-display-ad-wrapper.tsx
```

### Estimated Outcome

- Reduce files: 6 → 1
- Reduce code: ~400 lines → ~100 lines
- Time: ~1 hour

---

## 3. Utility File Consolidation

### Current Structure

```
lib/
  └── utils.ts (cn, makeCommentTree)

utils/
  ├── utils.ts (encodedRedirect)
  ├── ai/
  └── supabase/
```

### Proposed Structure

```
lib/
  ├── utils.ts (main utilities export)
  ├── classnames.ts (cn function)
  ├── comments.ts (makeCommentTree)
  └── redirect.ts (encodedRedirect)

utils/
  ├── supabase/
  └── ai/
```

### Implementation

#### Step 1: Create New Utility Files

```
lib/classnames.ts
lib/comments.ts
lib/redirect.ts
```

#### Step 2: Update Main Export

Update `lib/utils.ts`:

```typescript
export { cn } from "./classnames";
export { makeCommentTree } from "./comments";
export { encodedRedirect } from "./redirect";
```

#### Step 3: Update All Imports

Replace:

- `import { cn } from "@/lib/utils"` → already works (re-export)
- `import { encodedRedirect } from "@/utils/utils"` → `import { encodedRedirect } from "@/lib/redirect"`

#### Step 4: Delete Old Files

- `utils/utils.ts`

### Estimated Outcome

- Better organization and discoverability
- Time: ~30 minutes

---

## 4. Related Posts Component Unification

### Current State

- `article/article-related-posts.tsx`
- `news/news-related-posts.tsx`
- `translation/translation-related-posts.tsx`

### Implementation

#### Step 1: Analyze Similarities

Check what's different between these components

#### Step 2: Create Generic Component

Create: `components/RelatedPosts.tsx`

```typescript
interface RelatedPostsProps<T> {
  currentId: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  className?: string;
}

export function RelatedPosts<T extends { id: string }>(
  props: RelatedPostsProps<T>
) {
  // Generic implementation
}
```

#### Step 3: Update Specific Components

Make them thin wrappers:

```typescript
// article-related-posts.tsx
import { RelatedPosts } from "@/components/RelatedPosts";

export default function ArticleRelatedPosts(props: ArticleRelatedPostsProps) {
  return (
    <RelatedPosts
      {...props}
      renderItem={(article) => (
        <ArticlePostCard key={article.id} article={article} />
      )}
    />
  );
}
```

### Estimated Outcome

- Reduce duplication
- Time: ~1.5 hours

---

## 5. Comment Section Component Unification

### Current State

Already has good structure (documented in `components/comments/README.md`)

### Enhancement Recommendations

1. Create unified interface for all comment sections
2. Extract Supabase RPC calls to shared utility
3. Create `CommentSectionProvider` for shared state

### Implementation

```typescript
// components/comments/useCommentSection.ts
export interface CommentSectionConfig {
  entityType: "article" | "news" | "translation" | "karaoke";
  entityId: string;
  rpcFunctions: {
    getComments: string;
    addComment: string;
    deleteComment: string;
  };
}

export function useCommentSection(config: CommentSectionConfig) {
  // Shared logic for all comment sections
}
```

### Estimated Outcome

- Better code reuse
- Easier maintenance
- Time: ~2 hours

---

## Implementation Priority

### Phase 2A (High Priority, High Impact)

1. ✅ Editor consolidation (2 hours)
2. ✅ Ad component consolidation (1 hour)

### Phase 2B (Medium Priority, Medium Impact)

1. Utility file consolidation (30 min)
2. Related posts unification (1.5 hours)

### Phase 2C (Nice to Have)

1. Comment section enhancements (2 hours)

---

## Testing Strategy

After each refactoring:

1. **Unit Tests**

   - Test component props
   - Test data transformations

2. **Integration Tests**

   - Test with real data
   - Test user interactions

3. **Visual Regression**

   - Verify UI looks same
   - Test mobile responsiveness

4. **Performance**
   - Check bundle size changes
   - Measure render times

---

## Rollback Plan

Each step should be committed separately:

```bash
git add components/Tiptap/UniversalEditor.tsx
git commit -m "feat: Create universal editor component (non-breaking)"

git add components/Tiptap/ArticleEditor.tsx
git commit -m "refactor: Update ArticleEditor to use UniversalEditor"

# If issues occur, revert last commit
git revert HEAD
```

---

## Completion Checklist

- [ ] All Phase 2A tasks completed
- [ ] All tests passing
- [ ] Bundle size verified
- [ ] Code review completed
- [ ] Merged to main branch
- [ ] Begin Phase 2B tasks

---

Generated: November 19, 2025
