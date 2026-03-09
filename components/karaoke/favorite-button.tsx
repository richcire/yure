"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface FavoriteButtonProps {
  songId: string;
  initialFavorited: boolean;
  userId?: string;
  onToggle?: (songId: string, favorited: boolean) => void;
}

export function FavoriteButton({
  songId,
  initialFavorited,
  userId,
  onToggle,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    const supabase = createClient();

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from("user_favorite_songs")
          .delete()
          .eq("user_id", userId)
          .eq("song_id", songId);

        if (error) {
          console.error("Error removing favorite:", error);
          return;
        }

        setIsFavorited(false);
        onToggle?.(songId, false);
      } else {
        const { error } = await supabase
          .from("user_favorite_songs")
          .insert({ user_id: userId, song_id: songId });

        if (error) {
          console.error("Error adding favorite:", error);
          return;
        }

        setIsFavorited(true);
        onToggle?.(songId, true);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`flex items-center justify-center transition-colors ${
        isFavorited
          ? "text-red-500 hover:text-red-600"
          : "text-gray-400 hover:text-red-500"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={isLoading ? undefined : handleClick}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !isLoading) {
          e.preventDefault();
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
      aria-disabled={isLoading}
    >
      <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
    </div>
  );
}
