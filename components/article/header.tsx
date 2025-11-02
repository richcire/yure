import { ArticleFilters } from "./article-filters";
import { Suspense } from "react";
export function Header() {
  return (
    <header className="container mx-auto px-4 md:px-8 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">📷 유레 매거진</h1>
      <p className="mb-12 text-muted-foreground mt-2">
        유레의 최신 소식과 업데이트를 확인해보세요!
      </p>
      <Suspense>
        <ArticleFilters />
      </Suspense>
    </header>
  );
}
