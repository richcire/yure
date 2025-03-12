import Link from "next/link";
import Image from "next/image";
import type { News } from "@/app/(with-navigation)/news/types";

interface RelatedArticlesProps {
  news: News[];
}

export default function RelatedNews({ news }: RelatedArticlesProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {news.map((newsArticle) => (
        <Link
          key={newsArticle.id}
          href={`/news/${newsArticle.id}`}
          className="group block"
        >
          <div className="overflow-hidden rounded-sm">
            <Image
              src={newsArticle.image || "/placeholder.svg?height=200&width=300"}
              alt={newsArticle.title}
              width={300}
              height={200}
              className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="mt-3">
            <span className="font-serif text-xs font-bold uppercase text-gray-700">
              {newsArticle.category}
            </span>
            <h3 className="mt-1 font-serif text-lg font-bold leading-tight group-hover:underline">
              {newsArticle.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {newsArticle.excerpt}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
