import { INews } from "@/types/supabase-table";
import Image from "next/image";
import Link from "next/link";

interface NewsGridProps {
  news: INews[];
}

export default async function NewsGrid({ news }: NewsGridProps) {
  // Featured news is the first one
  const featuredNews = news[0];

  // Rest of the news
  const restOfNews = news.slice(1);

  return (
    <div className="grid gap-8 md:grid-cols-12">
      {/* Featured News - spans full width on mobile, 8 columns on desktop */}
      {news.length > 0 && (
        <div className="relative group border-b-2 pb-8 md:col-span-8 md:border-b-0 md:border-r-2 md:pr-8 md:h-[664px] transition-colors hover:text-muted-foreground">
          <Link
            href={`/news/${featuredNews.slug}`}
            className="absolute inset-0 z-10"
          >
            <span className="sr-only">
              {featuredNews.title}에 대한 내용 더 읽기
            </span>
          </Link>
          <div className="mb-4">
            <span className="inline-block bg-primary px-3 py-1 font-serif text-sm font-bold uppercase text-white">
              Latest News
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold leading-tight md:text-4xl line-clamp-2">
            {featuredNews.title}
          </h2>
          <div className="mb-4 text-sm font-medium text-gray-600">
            By {featuredNews.user_info.name} |{" "}
            {new Date(featuredNews.created_at).toLocaleDateString()}
          </div>
          <div className="mb-6">
            <Image
              src={
                featuredNews.thumbnail_url || "/assets/logos/square_high.jpeg"
              }
              alt={featuredNews.title}
              width={800}
              height={400}
              className="h-auto w-full rounded-sm object-cover transition-opacity group-hover:opacity-90"
              priority
            />
          </div>
          <p className="mb-4 text-lg leading-relaxed line-clamp-4">
            {featuredNews.summary}
          </p>
        </div>
      )}

      {/* Sidebar News - spans full width on mobile, 4 columns on desktop */}
      <div className="space-y-8 md:col-span-4 md:h-[664px]">
        {restOfNews.slice(0, 3).map((news) => (
          <div
            key={news.id}
            className="relative group border-b border-gray-300 pb-6 last:border-0 md:h-[200px] transition-colors hover:text-muted-foreground"
          >
            <Link href={`/news/${news.slug}`} className="absolute inset-0 z-10">
              <span className="sr-only">{news.title}에 대한 내용 더 읽기</span>
            </Link>
            <h3 className="mb-2 text-xl font-bold leading-tight line-clamp-2">
              {news.title}
            </h3>
            <div className="mb-2 text-xs text-gray-600">
              By {news.user_info.name} |{" "}
              {new Date(news.created_at).toLocaleDateString()}
            </div>
            <p className="mb-3 text-sm leading-relaxed line-clamp-4">
              {news.summary}
            </p>
          </div>
        ))}
      </div>

      {/* Secondary News - spans full width, 3 columns layout on desktop */}
      {restOfNews.length > 3 && (
        <div className="grid gap-6 border-t-2 pt-8 md:col-span-12 md:grid-cols-1 lg:grid-cols-3">
          {restOfNews.slice(3, 6).map((news) => (
            <div
              key={news.id}
              className="relative group border-r border-gray-300 pr-6 last:border-0 md:h-[200px] transition-colors hover:text-muted-foreground"
            >
              <Link
                href={`/news/${news.slug}`}
                className="absolute inset-0 z-10"
              >
                <span className="sr-only">
                  {news.title}에 대한 내용 더 읽기
                </span>
              </Link>
              <h3 className="mb-2 text-xl font-bold leading-tight line-clamp-3">
                {news.title}
              </h3>
              <div className="mb-2 text-xs text-gray-600">
                By {news.user_info.name}
              </div>
              <p className="mb-3 text-sm leading-relaxed line-clamp-4">
                {news.summary}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Bottom News - spans full width, 2 columns layout */}
      {restOfNews.length > 6 && (
        <div className="grid gap-8 border-t-2 pt-8 md:col-span-12 md:grid-cols-2">
          {restOfNews.slice(6, 8).map((news) => (
            <div
              key={news.id}
              className="relative group border-r border-gray-300 pr-6 last:border-0 flex gap-4 transition-colors hover:text-muted-foreground"
            >
              <Link
                href={`/news/${news.slug}`}
                className="absolute inset-0 z-10"
              >
                <span className="sr-only">
                  {news.title}에 대한 내용 더 읽기
                </span>
              </Link>
              <div className="flex-shrink-0">
                <Image
                  src={news.thumbnail_url || "/assets/logos/square.jpeg"}
                  alt={news.title}
                  width={120}
                  height={120}
                  className="h-24 w-24 rounded-sm object-cover transition-opacity group-hover:opacity-90"
                />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-bold leading-tight line-clamp-1">
                  {news.title}
                </h3>
                <div className="mb-1 text-xs text-gray-600">
                  By {news.user_info.name}
                </div>
                <p className="mb-2 text-sm leading-relaxed line-clamp-2">
                  {news.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
