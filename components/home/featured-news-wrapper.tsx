import { createClient } from "@/utils/supabase/server";
import FeaturedNews from "./featured-news";
import { IFeaturedNews } from "@/types/supabase-table";

async function getNews(): Promise<IFeaturedNews[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("id, thumbnail_url, title, summary, slug")
    .order("created_at", { ascending: false })
    .limit(2);
  if (error) {
    console.error("Error fetching news:", error);
  }
  return data || [];
}

export default async function FeaturedNewsWrapper() {
  const news = await getNews();
  return (
    <section>
      <FeaturedNews news={news} />
    </section>
  );
}
