import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
// import RelatedNews from "@/components/news/related-news";
import { createClient } from "@/utils/supabase/server";
import { INews } from "@/types/supabase-table";
import NewsContent from "@/components/news/news-content";
import NewsActions from "@/components/news/news-actions";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

async function fetchNews(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*, user_info(name)")
    .eq("slug", decodeURIComponent(slug))
    .single<INews>();

  if (error || !data) {
    throw new Error("News not found");
  }

  return data;
}

export default async function NewsPage({ params }: Props) {
  const { slug } = await params;
  const news = await fetchNews(slug);

  // Get related news (excluding current one)
  // const related = news
  //   .filter((a) => a.id !== newsArticle.id)
  // .filter((a) => a.category === newsArticle.category || Math.random() > 0.5)
  // .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with navigation */}
        <header className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/news"
              className="flex items-center gap-2 text-sm font-medium hover:text-gray-600"
            >
              <ArrowLeft className="h-4 w-4" />
              뉴스 페이지로 돌아가기
            </Link>
            <div className="font-serif text-sm italic text-gray-600">
              YureNews
            </div>
          </div>

          {/* News title */}
          <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            {news.title}
          </h1>

          {/* News metadata */}
          <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-gray-300 pb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="text-xs">By {news.user_info.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">
                {new Date(news.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </header>

        {/* News content */}
        <div className="article-content mb-12">
          <NewsContent slug={slug} />
        </div>

        {/* News actions */}
        <NewsActions />

        {/* Related news */}
        {/* <div className="mb-12">
          <h2 className="mb-6 border-b-2 border-black pb-2 text-2xl font-bold">
            관련 뉴스
          </h2>
          <RelatedNews news={related} />
        </div> */}
      </div>
    </div>
  );
}
