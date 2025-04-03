"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCallback, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { IKaraokeSongs } from "@/types/supabase-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { BottomDisplayAdWrapper } from "../google-adsense/bottom-display-ad-wrapper";

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

export default function KaraokeAccordion() {
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
    setIsLoading(true);
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
    estimateSize: () => 80,
  });

  if (!searchQuery) {
    return <div>검색 키워드가 없습니다.</div>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-3 p-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="tj-mobile"
            checked={filters.tj}
            onCheckedChange={(checked) =>
              setFilters((prev) => ({ ...prev, tj: checked === true }))
            }
          />
          <label
            htmlFor="tj-mobile"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            TJ
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="ky-mobile"
            checked={filters.ky}
            onCheckedChange={(checked) =>
              setFilters((prev) => ({ ...prev, ky: checked === true }))
            }
          />
          <label
            htmlFor="ky-mobile"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            KY
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="joysound-mobile"
            checked={filters.joysound}
            onCheckedChange={(checked) =>
              setFilters((prev) => ({ ...prev, joysound: checked === true }))
            }
          />
          <label
            htmlFor="joysound-mobile"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            JOYSOUND
          </label>
        </div>
      </div>

      <div ref={parentRef} className="h-[calc(100vh-300px)] overflow-auto">
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
            <Accordion type="single" collapsible className="space-y-2">
              {rowVirtualizer.getVirtualItems().map((virtualItem) => (
                <AccordionItem
                  key={virtualItem.key}
                  value={songs[virtualItem.index].id.toString()}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex flex-col items-start gap-1">
                      <div className="font-medium">
                        {songs[virtualItem.index].song_title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {songs[virtualItem.index].singer}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pb-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">TJ</span>
                        <span className="text-sm">
                          {songs[virtualItem.index].tj || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">KY</span>
                        <span className="text-sm">
                          {songs[virtualItem.index].ky || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">JOYSOUND</span>
                        <span className="text-sm">
                          {songs[virtualItem.index].js || "-"}
                        </span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
        <a
          href="/karaoke/application"
          className="text-[#003844] hover:text-[#214E34] underline"
        >
          노래방 곡 추가 신청하기
        </a>
      </div>
    </>
  );
}
