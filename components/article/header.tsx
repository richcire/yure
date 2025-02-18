import _ from "lodash";
import { ArticleFilters } from "./article-filters";
export function Header() {
  return (
    <header className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">유레 매거진</h1>
      <p className="text-lg mb-8 text-muted-foreground">
        유레 매거진에서 유레의 최신 소식과 업데이트를 확인해보세요.
      </p>
      <ArticleFilters />
    </header>
  );
}
