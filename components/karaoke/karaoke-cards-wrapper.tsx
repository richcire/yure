"use client";

import { IKaraokeSongs } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { KaraokeCard } from "./karaoke-card";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { BottomDisplayAdWrapper } from "../google-adsense/bottom-display-ad-wrapper";
import Link from "next/link";

export const LoadingSpinner = ({ className }: { className?: string }) => {
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

export default function KaraokeCardsWrapper() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  const [songs, setSongs] = useState<IKaraokeSongs[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    tj: true,
    ky: true,
    joysound: false,
  });
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Reset state when search query changes
    setSongs([]);
    setOffset(0);
    setHasMore(true);
  }, [searchQuery]);

  useEffect(() => {
    // Reset state when filters change
    setSongs([]);
    setOffset(0);
    setHasMore(true);
  }, [filters]);

  const fetchSongs = useCallback(async () => {
    if (!hasMore || isLoading) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .rpc("search_karaoke_songs_2", {
        _keyword: searchQuery,
        _tj_exists: filters.tj,
        _ky_exists: filters.ky,
        _js_exists: filters.joysound,
      })
      .range(offset, offset + 19)
      .returns<IKaraokeSongs[]>();

    if (error) {
      console.error("Error fetching songs:", error);
      setIsLoading(false);
      return;
    }

    if (data.length < 20) {
      setHasMore(false);
    }

    setSongs((prev) => [...prev, ...data]);
    setOffset((prev) => prev + 20);
    setIsLoading(false);
  }, [searchQuery, offset, hasMore, filters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchSongs();
        }
      },
      {
        threshold: 0.1,
        root: null, // Use viewport as root
        rootMargin: "100px", // Load more content before reaching the bottom
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
    getScrollElement: () => document.documentElement,
    estimateSize: () => 60,
    overscan: 5, // Add some overscan for smoother scrolling
  });

  if (!searchQuery) {
    return <div>검색 키워드가 없습니다.</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tj"
              checked={filters.tj}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, tj: checked === true }))
              }
            />
            <label
              htmlFor="tj"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              TJ 노래방
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ky"
              checked={filters.ky}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, ky: checked === true }))
              }
            />
            <label
              htmlFor="ky"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              KY 노래방
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="joysound"
              checked={filters.joysound}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, joysound: checked === true }))
              }
            />
            <label
              htmlFor="joysound"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              JOYSOUND
            </label>
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="flex items-center p-4 font-medium border rounded-lg mb-2">
        <div className="w-[35%]">곡명</div>
        <div className="w-[35%]">가수</div>
        <div className="w-[10%] text-center">TJ</div>
        <div className="w-[10%] text-center">KY</div>
        <div className="w-[10%] text-center">JOYSOUND</div>
      </div>

      <div ref={parentRef} className="border rounded-lg">
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
                title={songs[virtualItem.index].song_title}
                artist={songs[virtualItem.index].singer}
                tjNumber={songs[virtualItem.index].tj}
                kyNumber={songs[virtualItem.index].ky}
                joyNumber={songs[virtualItem.index].js}
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

      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <p>찾으시는 노래가 없으신가요?</p>
        <Link
          href="/karaoke/application"
          className="text-[#003844] hover:text-[#214E34] underline"
        >
          노래방 곡 추가 신청하기
        </Link>
      </div>
    </>
  );
}
