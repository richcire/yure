"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export default function PostLike({
  like_count,
  id,
}: {
  like_count: number;
  id: string;
}) {
  const [likeCount, setLikeCount] = useState(like_count);
  const [userLike, setUserLike] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | undefined>();

  const supabase = createClient();

  const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      return;
    }
    setUser(data.session?.user);
  };

  useEffect(() => {
    getSession();
  }, []);

  const getUserLike = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user like:", error);
      return;
    }

    setUserLike(!!data);
  };

  useEffect(() => {
    if (user) {
      getUserLike();
    }
  }, [user, id]);

  const handleLikeClick = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (userLike) {
        // 좋아요 취소
        const { error: deleteError } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", id)
          .eq("user_id", user.id);

        if (deleteError) {
          console.error("Error removing like:", deleteError);
          return;
        }

        setLikeCount(likeCount - 1);
        setUserLike(false);
      } else {
        // 좋아요 추가
        const { error: insertError } = await supabase
          .from("post_likes")
          .insert({ post_id: id, user_id: user.id });

        if (insertError) {
          console.error("Error adding like:", insertError);
          return;
        }

        setLikeCount(likeCount + 1);
        setUserLike(true);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`flex items-center gap-1 transition-colors ${
        userLike
          ? "text-red-500 hover:text-red-600"
          : "text-gray-500 hover:text-red-500"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={(e) => {
        e.preventDefault();
        handleLikeClick();
      }}
      disabled={isLoading}
    >
      <Heart className={`h-4 w-4 ${userLike ? "fill-current" : ""}`} />
      <span>{likeCount}</span>
    </button>
  );
}
