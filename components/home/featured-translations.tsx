import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { CDCarousel } from "./cd-carousel";
import { ITranslations } from "@/types/supabase-table";
import { Marquee } from "@/components/magicui/marquee";
import VideoTape from "./video-tape";
import { TextAnimate } from "../magicui/text-animate";

export async function FeaturedTranslations() {
  const supabase = await createClient();

  const { data: translations } = await supabase
    .from("translations")
    .select("id, title, artist, permalink, thumbnail_url")
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .limit(16)
    .returns<ITranslations[]>();

  if (!translations) {
    return null;
  }

  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="flex-col items-start justify-start mb-8">
          <p className="text-xl mb-8">J-POP 가사번역</p>
          <TextAnimate
            animation="blurIn"
            by="character"
            once
            className="mb-8 text-3xl font-bold"
            duration={3}
          >
            "멜로디만으로는 알 수 없는 감정, 지금 해석해드릴게요"
          </TextAnimate>
          <Link
            href="/translation"
            className="flex items-center bg-primary text-primary-foreground px-4 rounded-md h-10 w-32 hover:bg-primary/50 hover:text-primary/90 transition-colors"
            aria-label="View all translations"
          >
            <span className="mr-2">더보기</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:20s] [--gap:2px]  pt-5">
          {translations.map((translation) => (
            <VideoTape key={translation.id} translation={translation} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
