import { createClient } from "@/utils/supabase/server";
import { FeaturedArticle } from "./featured-article";
import { IFeaturedArticles } from "@/types/supabase-table";

async function getArticles(): Promise<IFeaturedArticles[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, thumbnail_url")
    .order("created_at", { ascending: false })
    .limit(5);
  if (error) {
    console.error("Error fetching articles:", error);
  }
  return data || [];
}

export default async function FeaturedArticleWrapper() {
  const articles = await getArticles();
  return (
    <section className="w-full max-w-7xl mx-auto relative overflow-hidden">
      <FeaturedArticle articles={articles} />
    </section>
  );
}
