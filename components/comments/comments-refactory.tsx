"use client";

import { IComments, INews } from "@/types/supabase-table";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import _ from "lodash";
import CommentRefactory from "./comment-refactory";

interface ICommentProps {
  comment: (IComments & { replies: IComments[] })[];
  useHideFeature: boolean;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    newComment: string
  ) => void;
  deleteFn: string;
  handleSubmitReply: (
    e: React.FormEvent<HTMLFormElement>,
    replyContent: string,
    parent_id: string
  ) => void;
  setComment: Dispatch<
    SetStateAction<
      (IComments & {
        replies: IComments[];
      })[]
    >
  >;
}

export function CommentsRefactory({
  comment,
  useHideFeature,
  handleSubmit,
  deleteFn,
  handleSubmitReply,
  setComment,
}: ICommentProps) {
  const [isOpen, setIsOpen] = useState(useHideFeature ? false : true);
  const [newComment, setNewComment] = useState("");

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

  const handleDelete = async (commentId: string) => {
    const { data, error, count } = await supabase.rpc(
      deleteFn,
      {
        _id: commentId,
      },
      {
        count: "exact",
      }
    );
    if (error) {
      console.error("Error deleting comment:", error);
      return;
    }
    setComment(data);
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <div className="text-black">
      {useHideFeature && (
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <span className="text-foreground">
            댓글 {isOpen ? "숨기기" : "보기"}
          </span>
          <span className="text-sm">{comment.length}</span>
        </Button>
      )}

      {isOpen && (
        <div className="mt-4 space-y-6">
          <form
            onSubmit={(e) => {
              handleSubmit(e, newComment);
              setNewComment("");
            }}
            className="space-y-4"
          >
            {user ? (
              <Textarea
                value={newComment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNewComment(e.target.value)
                }
                placeholder="댓글을 달아보세요!"
                className="w-full border-gray-200 bg-transparent focus:outline-none focus-visible:ring-0 focus:border-foreground/20"
              />
            ) : (
              <Textarea
                placeholder="로그인 후 댓글을 달아보세요!"
                className="w-full text-foreground border-gray-200 bg-transparent focus:outline-none focus-visible:ring-0 focus:border-foreground/20"
                onClick={() => {
                  router.push(`/sign-in?redirectTo=${pathname}`);
                }}
                readOnly
              />
            )}
            {user && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="border border-foreground/20 bg-transparent text-foreground hover:bg-background/30 transition-colors"
                >
                  댓글 작성
                </Button>
              </div>
            )}
          </form>

          <div className="space-y-4">
            {comment.map((comment) => (
              <CommentRefactory
                key={comment.id}
                comment={comment}
                user={user}
                handleDelete={handleDelete}
                handleSubmitReply={handleSubmitReply}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
