import { IArticles } from "@/types/supabase-table";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/server";

interface ArticleTitleProps {
  slug: string;
}

export function ArticleTitleSkeleton() {
  return (
    <div className="bg-banner-green backdrop-blur-sm shadow-sm p-4 rounded-md mb-8">
      <Skeleton className="h-9 w-3/4 mb-2 animate-pulse bg-gray-300/10" />
      <Skeleton className="h-7 w-1/2 mb-8 animate-pulse bg-gray-300/10" />
      <div className="w-full flex justify-between">
        <Skeleton className="h-6 w-40 animate-pulse bg-gray-300/10" />
      </div>
    </div>
  );
}

async function fetchArticle(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("title, user_info(name), created_at")
    .eq("slug", decodeURIComponent(slug))
    .single<IArticles>();

  if (error || !data) {
    throw new Error("Article not found");
  }

  return data;
}

export async function ArticleTitle({ slug }: ArticleTitleProps) {
  const article = await fetchArticle(slug);
  return (
    <div className="bg-banner-green backdrop-blur-sm shadow-sm p-4 rounded-md mb-8 h-40 flex flex-col">
      <h1 className="text-3xl text-hanji font-bold">{article.title}</h1>
      <div className="w-full flex justify-between mt-auto">
        <h2 className="text-l text-hanji">{article.user_info.name}</h2>
        <h3 className="text-hanji">
          작성일: {new Date(article.created_at).toLocaleDateString()}
        </h3>
      </div>
    </div>
  );
}
