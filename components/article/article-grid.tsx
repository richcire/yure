import { IArticles } from "@/types/supabase-table";
import { ArticleCard } from "./article-card";

interface ArticleGridProps {
  articles: IArticles[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  // Show only the first 9 articles (3 rows x 3 columns)
  const displayedArticles = articles.slice(0, 9);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedArticles.map((article, index) => (
        <ArticleCard key={article.id} article={article} index={index} />
      ))}
    </div>
  );
}
