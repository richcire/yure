import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { IArticles } from "@/types/supabase-table";

interface ArticleCardProps {
  article: IArticles;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.slug}`}>
      <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg group bg-background text-foreground border border-[#69140E]/50">
        <div className="relative aspect-video m-4">
          <Image
            src={article.thumbnail_url || "/assets/logos/square.jpeg"}
            alt={article.title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-[#69140E]/50 mb-4 flex-grow line-clamp-3">
              {article.content
                .replace(/<[^>]*>/g, "")
                .slice(0, 50)
                .trim() + "..."}
            </p>
            <div className="flex justify-between items-center text-sm text-[#69140E]/50">
              <span>{article.user_info.name}</span>
              <span>{new Date(article.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
