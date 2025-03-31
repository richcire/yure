import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { INews } from "@/types/supabase-table";

interface NewsCardProps {
  news: INews[];
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <div className="space-y-6">
      {news.map((newsItem) => (
        <div
          key={newsItem.id}
          className="relative group border-b border-gray-300 pb-6 last:border-b-0"
        >
          <Link
            href={`/news/${newsItem.slug}`}
            className="absolute inset-0 z-10"
          >
            <span className="sr-only">
              {newsItem.title}에 대한 내용 더 읽기
            </span>
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="sm:w-1/4">
              <Image
                src={newsItem.thumbnail_url || "/assets/logos/square_high.jpeg"}
                alt={newsItem.title}
                width={300}
                height={200}
                className="h-auto w-full rounded-sm object-cover transition-opacity group-hover:opacity-90"
              />
            </div>
            <div className="flex-1 sm:w-3/4">
              <div className="mb-1 flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(newsItem.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <h2 className="mb-2 text-xl font-bold leading-tight transition-colors group-hover:text-gray-700 sm:text-2xl">
                {newsItem.title}
              </h2>
              <p className="mb-3 text-gray-700 line-clamp-2 sm:line-clamp-3">
                {newsItem.summary}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  By {newsItem.user_info.name}
                </span>
                <div className="text-sm font-medium hover:underline">
                  더 읽기 →
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
