"use client";

import { KaraokeCard } from "@/components/karaoke/karaoke-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IKaraokeSongs } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/client";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useRef, useState } from "react";
import { SongUploadDialog } from "./song-upload-dialog";

const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export default function AdminKaraokePage() {
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState<IKaraokeSongs[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = () => {
    setSongs([]);
    setOffset(0);
    setHasMore(true);
  };

  const fetchSongs = useCallback(async () => {
    if (!hasMore || isLoading) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .rpc("search_karaoke_songs", {
        _keyword: search,
      })
      .range(offset, offset + 39)
      .returns<IKaraokeSongs[]>();

    if (error) {
      console.error("Error fetching songs:", error);
      setIsLoading(false);
      return;
    }
    console.log(data);

    if (data.length < 40) {
      setHasMore(false);
    }

    setSongs((prev) => [...prev, ...data]);
    setOffset((prev) => prev + 40);
    setIsLoading(false);
  }, [search, offset, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchSongs();
        }
      },
      {
        threshold: 0.1,
      }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [fetchSongs]);

  const rowVirtualizer = useVirtualizer({
    count: songs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
  });

  return (
    <div className="container max-w-5xl w-full mx-auto py-8 px-4 min-h-screen">
      <div className="flex items-center gap-2">
        <Input
          type="search"
          placeholder="제목이나 가수를 입력하세요"
          className="pl-10 py-6 text-lg"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}>검색</Button>
      </div>

      {/* Column Headers */}
      <div className="flex items-center p-4 font-medium border rounded-lg mb-2 w-full">
        <div className="w-[35%]">곡명</div>
        <div className="w-[35%]">가수</div>
        <div className="w-[10%] text-center">TJ</div>
        <div className="w-[10%] text-center">KY</div>
        <div className="w-[10%] text-center">JOYSOUND</div>
      </div>

      <div
        ref={parentRef}
        className="h-[calc(100vh-300px)] overflow-auto border rounded-lg"
      >
        <div
          className="relative"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${rowVirtualizer.getVirtualItems()[0]?.start ?? 0}px)`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => (
              <KaraokeCard
                key={virtualItem.key}
                id={songs[virtualItem.index].id}
                title={songs[virtualItem.index].song_title}
                artist={songs[virtualItem.index].singer}
                tjNumber={songs[virtualItem.index].tj}
                kyNumber={songs[virtualItem.index].ky}
                joyNumber={songs[virtualItem.index].js}
                keyword={songs[virtualItem.index].keyword}
              />
            ))}
          </div>
        </div>
        {hasMore && (
          <div
            ref={loaderRef}
            className="flex justify-center items-center h-10"
          >
            <LoadingSpinner />
          </div>
        )}
      </div>

      <div className="fixed bottom-4 right-4 flex gap-2">
        <SongUploadDialog />
      </div>
    </div>
  );
}
