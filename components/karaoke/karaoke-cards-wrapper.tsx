"use client";

import { IKaraokeSongs } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { KaraokeCard } from "./karaoke-card";
import { FavoriteButton } from "./favorite-button";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { BottomDisplayAdWrapper } from "../google-adsense/bottom-display-ad-wrapper";
import { DesktopKaraokeInfeedAdWrapper } from "../google-adsense/desktop-karaoke-infeed-ad-wrapper";
import Link from "next/link";
import React from "react";

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
      const hasAd = (index + 1) % 5 === 0;
      return 60 + (hasAd ? 80 : 0);
    },
    overscan: 5, // Add some overscan for smoother scrolling
  });

  if (!searchQuery) {
    return <div>검색 키워드를 입력해주세요!</div>;
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
        <div className="w-[30%]">곡명</div>
        <div className="w-[30%]">가수</div>
        <div className="w-[10%] text-center">TJ</div>
        <div className="w-[10%] text-center">KY</div>
        <div className="w-[10%] text-center">JOYSOUND</div>
        <div className="w-[10%] text-center"></div>
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
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const song = songs[virtualItem.index];
              const shouldShowAd = (virtualItem.index + 1) % 5 === 0;
              return (
                <React.Fragment key={virtualItem.key}>
                  <KaraokeCard
                    title={song.song_title}
                    artist={song.singer}
                    tjNumber={song.tj ?? undefined}
                    kyNumber={song.ky ?? undefined}
                    joyNumber={song.js ?? undefined}
                    rightSlot={
                      <FavoriteButton
                        songId={song.id}
                        initialFavorited={favoriteSongIds.has(song.id)}
                        userId={userId}
                        onToggle={handleFavoriteToggle}
                      />
                    }
                  />
                  {shouldShowAd && <DesktopKaraokeInfeedAdWrapper />}
                </React.Fragment>
              );
            })}
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
