import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { CDCarousel } from "./cd-carousel";
import { ITranslations } from "@/types/supabase-table";
export async function FeaturedTranslations() {
  const supabase = await createClient();

  const { data: translations } = await supabase
    .from("translations")
    .select("id, title, artist, permalink, thumbnail_url")
    .order("created_at", { ascending: false })
    .limit(8)
    .returns<ITranslations[]>();

  if (!translations) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">J-POP 가사번역</h2>
          <Link
            href="/translation"
            className="flex items-center transition-colors"
            aria-label="View all translations"
          >
            <span className="mr-2">더보기</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <CDCarousel translations={translations} />
      </div>
    </section>
  );
}
