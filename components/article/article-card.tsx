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
      <Card className="flex flex-col h-[400px] overflow-hidden transition-all duration-300 hover:shadow-lg group bg-background text-foreground border-2 border-[#69140E]/50 hover:bg-[#69140E]/5">
        <div className="relative aspect-video m-3 max-h-[200px]">
          <Image
            src={article.thumbnail_url || "/assets/logos/square_high.jpeg"}
            alt={article.title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 750px) 100vw, (max-width: 1000px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4 pt-0 flex-1">
          <div className="flex flex-col h-full">
            <div className="text-xl font-semibold mb-2 line-clamp-2">
              {article.title}
            </div>
            <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">
              {article.content
                .replace(/<[^>]*>/g, "")
                .slice(0, 70)
                .trim() + "..."}
            </p>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{article.user_info.name}</span>
              <span>{new Date(article.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
