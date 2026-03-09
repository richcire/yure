"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { IKaraokeSongs } from "@/types/supabase-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { MobileKaraokeInfeedAdWrapper } from "../google-adsense/mobile-karaoke-infeed-ad-wrapper";
import { FavoriteButton } from "./favorite-button";
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
  const [userId, setUserId] = useState<string | undefined>();
  const [favoriteSongIds, setFavoriteSongIds] = useState<Set<string>>(
    new Set()
  );
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;

      const uid = sessionData.session.user.id;
      setUserId(uid);

      const { data, error } = await supabase
        .from("user_favorite_songs")
        .select("song_id")
        .eq("user_id", uid);

      if (error) {
        console.error("Error fetching favorites:", error);
        return;
      }

      setFavoriteSongIds(new Set(data.map((d) => d.song_id)));
    };
    loadFavorites();
  }, []);

  const handleFavoriteToggle = (songId: string, favorited: boolean) => {
    setFavoriteSongIds((prev) => {
      const next = new Set(prev);
      if (favorited) {
        next.add(songId);
      } else {
        next.delete(songId);
      }
      return next;
    });
  };

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
    estimateSize: (index) => {
      // Every 5th item (index + 1 % 5 === 0) has an additional 80px for the ad
      const hasAd = (index + 1) % 5 === 0;
      return 90 + (hasAd ? 80 : 0); // 90px for accordion + 80px if there's an ad
    },
    overscan: 5, // Add some overscan for smoother scrolling
  });

  if (!searchQuery) {
    return <div>검색 키워드를 입력해주세요!</div>;
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

      <div ref={parentRef}>
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
              {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const shouldShowAd = (virtualItem.index + 1) % 5 === 0;
                return (
                  <React.Fragment key={virtualItem.key}>
                    <AccordionItem
                      value={songs[virtualItem.index].id.toString()}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 w-full">
                          <FavoriteButton
                            songId={songs[virtualItem.index].id}
                            initialFavorited={favoriteSongIds.has(
                              songs[virtualItem.index].id
                            )}
                            userId={userId}
                            onToggle={handleFavoriteToggle}
                          />
                          <div className="flex flex-col items-start gap-1">
                            <div className="font-medium">
                              {songs[virtualItem.index].song_title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {songs[virtualItem.index].singer}
                            </div>
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
                            <span className="text-sm font-medium">
                              JOYSOUND
                            </span>
                            <span className="text-sm">
                              {songs[virtualItem.index].js || "-"}
                            </span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    {shouldShowAd && <MobileKaraokeInfeedAdWrapper />}
                  </React.Fragment>
                );
              })}
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
    </>
  );
}
