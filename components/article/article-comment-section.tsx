"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArticleComment } from "./article-comment";
import type { IComments } from "@/types/supabase-table";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { makeCommentTree } from "@/lib/utils";

export function CommentSection({ slug }: { slug: string }) {
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
    const getComments = async () => {
      const { data, error } = await supabase
        .rpc("get_article_comments", {
          s_input: decodeURIComponent(slug),
        })
        .returns<IComments[]>();
      if (data) {
        const commentTree = makeCommentTree(data);
        setComments(commentTree);
      }
    };
    getComments();
    getSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const { data, error } = await supabase.rpc("add_article_comment", {
      s_input: decodeURIComponent(slug),
      new_content: newComment,
    });
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
        <span>{isOpen ? "Hide" : "Show"} Comments</span>
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
                Post Comment
              </Button>
            )}
          </form>

          <div className="space-y-4">
            {comments.map((comment) => (
              <ArticleComment
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
