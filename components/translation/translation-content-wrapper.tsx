import TranslationContent from "./translation-content";
import { ITranslations } from "@/types/supabase-table";
import { BottomDisplayAdWrapper } from "../google-adsense/bottom-display-ad-wrapper";

export default async function TranslationContentWrapper({
  translation,
}: {
  translation: ITranslations;
}) {
  return (
    <div>
      <TranslationContent content={translation.content} />
      <BottomDisplayAdWrapper />

      <div className="flex justify-between mt-16 text-sm text-muted-foreground">
        <time dateTime={translation.created_at}>
          작성일:{" "}
          {new Date(translation.created_at).toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          })}
        </time>
        <time dateTime={translation.updated_at}>
          최근 수정일:{" "}
          {new Date(translation.updated_at).toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          })}
        </time>
      </div>
    </div>
  );
}
