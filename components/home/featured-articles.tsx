import { createClient } from "@/utils/supabase/server";
import { ArticleCard } from "../article/article-card";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">유레 매거진</h2>
          <Link href="/article" className="flex items-center transition-colors">
            <span className="mr-2">더보기</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
