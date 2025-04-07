import { IFeaturedNews } from "@/types/supabase-table";
import Image from "next/image";
import Link from "next/link";

export default async function FeaturedNews({
  news,
}: {
  news: IFeaturedNews[];
}) {
  return (
    <>
      <h2 className="text-2xl sm:text-2xl font-bold mb-8">NEWS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {news.map((news) => (
          <Link
            href={`/news/${news.slug}`}
            key={news.id}
            className="group block"
          >
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full">
                <Image
                  src={news.thumbnail_url || "/assets/logos/square_high.jpeg"}
                  alt={news.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-gray-600 line-clamp-4">{news.summary}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
