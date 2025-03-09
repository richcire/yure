import { IKaraokeSongs } from "@/types/supabase-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Props {
  songs: IKaraokeSongs[];
}

export function MobileKaraokeTableSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-[#69140E]/20 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-[#69140E]/20 rounded animate-pulse w-1/2"></div>
            </div>
            <div className="h-4 w-4 bg-[#69140E]/20 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MobileKaraokeTable({ songs }: Props) {
  if (!songs.length) {
    return <div>노래를 찾을 수 없습니다</div>;
  }

  return (
    <Accordion type="single" collapsible className="space-y-2">
      {songs.map((song) => (
        <AccordionItem
          key={song.id}
          value={song.id.toString()}
          className="border rounded-lg px-4"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-col items-start gap-1">
              <div className="font-medium">{song.song_title}</div>
              <div className="text-sm text-muted-foreground">{song.singer}</div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pb-2">
              {song.tj && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">TJ</span>
                  <span className="text-sm">{song.tj}</span>
                </div>
              )}
              {song.ky && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">KY</span>
                  <span className="text-sm">{song.ky}</span>
                </div>
              )}
              {song.js && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">JOYSOUND</span>
                  <span className="text-sm">{song.js}</span>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
