import { INews } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsTitleProps {
  slug: string;
}

export function NewsTitleSkeleton() {
  return (
    <header className="mb-8">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-6 w-40 animate-pulse" />
        <Skeleton className="h-5 w-24 animate-pulse" />
      </div>
      <Skeleton className="mb-4 h-10 w-3/4 animate-pulse" />
      <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-gray-300 pb-4 text-sm text-gray-600">
        <Skeleton className="h-5 w-28 animate-pulse" />
        <Skeleton className="h-5 w-28 animate-pulse" />
      </div>
    </header>
  );
}

async function fetchNews(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("title, user_info(name), created_at")
    .eq("slug", decodeURIComponent(slug))
    .single<INews>();

  if (error || !data) {
    throw new Error("News not found");
  }

  return data;
}

export async function NewsTitle({ slug }: NewsTitleProps) {
  const news = await fetchNews(slug);
  return (
    <header className="mb-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/news"
          className="flex items-center gap-2 text-sm font-medium hover:text-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
          뉴스 페이지로 돌아가기
        </Link>
        <div className="font-serif text-sm italic text-gray-600">YureNews</div>
      </div>
      <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
        {news.title}
      </h1>
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
  );
}
