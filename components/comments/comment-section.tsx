"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "./comment";
import type { IComments } from "@/types/supabase-table";
import { PostgrestError, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { makeCommentTree } from "@/lib/utils";

interface CommentSectionProps {
  getComments: () => Promise<{
    data: IComments[] | null;
    error: PostgrestError | null;
  }>;
  addComment: (new_content: string) => Promise<{
    data: IComments[] | null;
    error: PostgrestError | null;
  }>;
  deleteComment: (commentId: string) => Promise<{
    data: IComments[] | null;
    error: PostgrestError | null;
  }>;
}

export function CommentSection({
  getComments,
  addComment,
  deleteComment,
}: CommentSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<
    (IComments & { replies: IComments[] })[]
  >([]);
  const [user, setUser] = useState<User | undefined>();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        return;
      }
      setUser(data.session?.user);
    };
    const fetchComments = async () => {
      const { data, error } = await getComments();
      if (data) {
        const commentTree = makeCommentTree(data);
        setComments(commentTree);
      }
    };

    fetchComments();
    getSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const { data, error } = await addComment(newComment);
    if (data) {
      const commentTree = makeCommentTree(data);
      setComments(commentTree);
    }
    setNewComment("");
  };

  return (
    <div className="mt-8">
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
                  router.push("/sign-in");
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
              <Comment
                key={comment.id}
                comment={comment}
                user={user}
                setComments={setComments}
                getComments={getComments}
                addComment={addComment}
                deleteComment={deleteComment}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
