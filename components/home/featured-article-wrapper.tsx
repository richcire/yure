import { createClient } from "@/utils/supabase/server";
import { FeaturedArticle } from "./featured-article";
import { IFeaturedArticles } from "@/types/supabase-table";
import Image from "next/image";
import { TextAnimate } from "../magicui/text-animate";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

async function getArticles(): Promise<IFeaturedArticles[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, thumbnail_url, slug, banner_url")
    .order("created_at", { ascending: false })
    .limit(6);
  if (error) {
    console.error("Error fetching articles:", error);
  }
  return data || [];
}

export default async function FeaturedArticleWrapper() {
  const articles = await getArticles();
  return (
    <section className="container mx-auto px-4 pt-48 pb-60">
      <TextAnimate
        animation="blurInUp"
        by="character"
        once
        className="mb-8 text-3xl font-bold text-right"
        duration={3}
      >
        "J-컬처, 깊이 읽다"
      </TextAnimate>
      <p className="text-xl mb-8 text-right">
        우리가 사랑한 노래, 문화, 그리고 그 순간들. 유레 매거진에서 확인하세요.
      </p>
      <div className="flex justify-end">
        <Link
          href="/article"
          className="mb-8 flex items-center bg-primary text-primary-foreground px-4 rounded-md h-10 w-32 hover:bg-primary/50 hover:text-primary/90 transition-colors"
          aria-label="View all articles"
        >
          <span className="mr-2">더보기</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link
            href={`/article/${article.slug}`}
            key={article.id}
            className="relative aspect-[16/9] group overflow-hidden rounded-lg cursor-pointer"
          >
            {/* Banner Image */}
            <div className="absolute inset-0 transition-transform duration-500 ease-in-out group-hover:scale-110">
              <Image
                src={article.banner_url || article.thumbnail_url}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300" />

            {/* Title */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white text-xl font-bold text-center px-4">
                {article.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
