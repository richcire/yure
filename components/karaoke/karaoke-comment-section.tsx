"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { IComments } from "@/types/supabase-table";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { KaraokeComment } from "./karaoke-comment";

interface CommentSectionProps {
  useHideFeature?: boolean;
}

export function KaraokeCommentSection({
  useHideFeature = true,
}: CommentSectionProps) {
  const [isOpen, setIsOpen] = useState(useHideFeature ? false : true);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<
    (IComments & { replies: IComments[] })[]
  >([]);
  const [user, setUser] = useState<User | undefined>();
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      return;
    }
    setUser(data.session?.user);
  };

  const getComments = async () => {
    const { data, error, count } = await supabase.rpc(
      "get_karaoke_comments_with_replies",
      {},
      { count: "exact" }
    );
    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }
    setComments(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const { data, error, count } = await supabase.rpc(
      "add_karaoke_comment",
      {
        _content: newComment,
        _parent_id: null,
      },
      {
        count: "exact",
      }
    );
    if (error) {
      console.error("Error adding comment:", error);
      return;
    }
    setComments(data);
    setNewComment("");
  };

  useEffect(() => {
    getSession();
    getComments();
  }, []);

  return (
    <div className="mt-8">
      {useHideFeature && (
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <span>댓글 {isOpen ? "숨기기" : "보기"}</span>
          <span className="text-sm text-muted-foreground">
            ({comments.length})
          </span>
        </Button>
      )}

      {isOpen && (
        <div className="mt-4 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {user ? (
              <Textarea
                value={newComment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNewComment(e.target.value)
                }
                placeholder="댓글을 달아보세요!"
                className="w-full"
              />
            ) : (
              <Textarea
                placeholder="로그인 후 댓글을 달아보세요!"
                className="w-full"
                onClick={() => {
                  router.push(`/sign-in?redirectTo=${pathname}`);
                }}
                readOnly
              />
            )}
            {user && (
              <Button type="submit" disabled={!newComment.trim()}>
                댓글 작성
              </Button>
            )}
          </form>

          <div className="space-y-4">
            {comments.map((comment) => (
              <KaraokeComment
                key={comment.id}
                comment={comment}
                user={user}
                setComments={setComments}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
