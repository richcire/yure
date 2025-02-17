import { createClient } from "@/utils/supabase/server";
import { CDCard } from "./cd-card";
import { ITranslations } from "@/types/supabase-table";

export async function FeaturedTranslations() {
  const supabase = await createClient();

  const { data: translations } = await supabase
    .from("translations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  if (!translations) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">최근 가사번역</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {translations.map((song, index) => (
            <div key={song.id}>
              <CDCard song={song} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
