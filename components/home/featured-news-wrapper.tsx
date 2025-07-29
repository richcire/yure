import { createClient } from "@/utils/supabase/server";
import { IFeaturedNews } from "@/types/supabase-table";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { TextAnimate } from "../magicui/text-animate";

async function getNews(): Promise<IFeaturedNews[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("id, thumbnail_url, title, summary, slug")
    .order("created_at", { ascending: false })
    .limit(4);
  if (error) {
    console.error("Error fetching news:", error);
  }
  return data || [];
}

export default async function FeaturedNewsWrapper() {
  const news = await getNews();

  return (
    <div className="relative p-1">
      {/* Border with thicker corners */}
      <div className="absolute inset-0 border-2 border-gray-200">
        <div className="absolute -left-1 -top-1 h-4 w-4 border-l-4 border-t-4 border-black" />
        <div className="absolute -right-1 -top-1 h-4 w-4 border-r-4 border-t-4 border-black" />
        <div className="absolute -left-1 -bottom-1 h-4 w-4 border-b-4 border-l-4 border-black" />
        <div className="absolute -right-1 -bottom-1 h-4 w-4 border-b-4 border-r-4 border-black" />
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
        <div className="relative aspect-square group overflow-hidden cursor-pointer">
          {/* Background image */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <TextAnimate
              animation="blurIn"
              by="character"
              once
              className="text-2xl md:text-3xl font-bold text-center"
              duration={3}
            >
              "가장 빠른 J-POP 뉴스, 가장 먼저 만나는 이야기"
            </TextAnimate>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-colors duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
            <h3 className="text-white text-center font-bold px-4 mb-4 line-clamp-2">
              유레 뉴스
            </h3>
            <Link
              href={`/news`}
              className="text-background bg-primary hover:bg-primary/90 transition-colors px-4 py-2 rounded-md"
            >
              더 보기
            </Link>
          </div>
        </div>
        {news.map((newsItem) => (
          <div
            key={newsItem.id}
            className="relative aspect-square group overflow-hidden cursor-pointer"
          >
            {/* Background image */}
            <Image
              src={newsItem.thumbnail_url || "/assets/logos/square.jpeg"}
              alt={newsItem.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 50vw"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-colors duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
              <h3 className="text-white text-center font-bold px-4 mb-4 line-clamp-2">
                {newsItem.title}
              </h3>
              <Link
                href={`/news/${newsItem.slug}`}
                className="text-background bg-primary hover:bg-primary/90 transition-colors px-4 py-2 rounded-md"
              >
                더 보기
              </Link>
            </div>
          </div>
        ))}
        <div className="relative aspect-square group overflow-hidden bg-primary"></div>
      </div>
    </div>
  );
}
