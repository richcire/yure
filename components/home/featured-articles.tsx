import { createClient } from "@/utils/supabase/server";
import { ArticleCard } from "../article/article-card";
import { IArticles } from "@/types/supabase-table";

export async function FeaturedArticles() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("articles")
    .select("*, user_info(*)")
    .order("created_at", { ascending: false })
    .limit(6);

  if (!articles) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
