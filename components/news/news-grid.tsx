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
        <div className="border-b-2 border-black pb-8 md:col-span-8 md:border-b-0 md:border-r-2 md:pr-8">
          <h2 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
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
              className="h-auto w-full rounded-sm object-cover"
            />
          </div>
          <Link href={`/news/${featuredNews.slug}`}>
            <p className="pb-4 text-lg leading-relaxed">
              {featuredNews.summary}
            </p>
            <div className="inline-block font-medium hover:text-gray-600">
              계속 읽기 →
            </div>
          </Link>
        </div>
      )}

      {/* Sidebar News - spans full width on mobile, 4 columns on desktop */}
      <div className="space-y-8 md:col-span-4">
        {restOfNews.slice(0, 3).map((news) => (
          <div
            key={news.id}
            className="border-b border-black pb-6 last:border-0"
          >
            <h3 className="mb-2 text-xl font-bold leading-tight">
              {news.title}
            </h3>
            <div className="mb-2 text-xs text-gray-600">
              By {news.user_info.name} |{" "}
              {new Date(news.created_at).toLocaleDateString()}
            </div>
            <Link href={`/news/${news.slug}`}>
              <p className="pb-3 text-sm leading-relaxed">{news.summary}</p>
              <div className="text-sm font-medium hover:text-gray-600">
                더 읽기 →
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Secondary News - spans full width, 3 columns layout on desktop */}
      {restOfNews.length > 3 && (
        <div className="grid gap-6 border-t-2 border-black pt-8 md:col-span-12 md:grid-cols-1 lg:grid-cols-3">
          {restOfNews.slice(3, 6).map((news) => (
            <div
              key={news.id}
              className="border-r border-black pr-6 last:border-0"
            >
              <h3 className="mb-2 text-xl font-bold leading-tight">
                {news.title}
              </h3>
              <div className="mb-2 text-xs text-gray-600">
                By {news.user_info.name}
              </div>
              <Link href={`/news/${news.slug}`}>
                <p className="pb-3 text-sm leading-relaxed">{news.summary}</p>
                <div className="text-sm font-medium hover:text-gray-600">
                  더 읽기 →
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Bottom News - spans full width, 2 columns layout */}
      {restOfNews.length > 6 && (
        <div className="grid gap-8 border-t-2 border-black pt-8 md:col-span-12 md:grid-cols-2">
          {restOfNews.slice(6, 8).map((news) => (
            <div key={news.id} className="flex gap-4">
              <div className="flex-shrink-0">
                <Image
                  src={news.thumbnail_url || "/assets/logos/square.jpeg"}
                  alt={news.title}
                  width={120}
                  height={120}
                  className="h-24 w-24 rounded-sm object-cover"
                />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-bold leading-tight">
                  {news.title}
                </h3>
                <div className="mb-1 text-xs text-gray-600">
                  By {news.user_info.name}
                </div>
                <Link
                  href={`/news/${news.slug}`}
                  className="text-sm font-medium hover:text-gray-600"
                >
                  더 읽기 →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
