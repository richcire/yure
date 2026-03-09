"use client";

import { MoreHorizontal } from "lucide-react";
import { IComments } from "@/types/supabase-table";
import { User } from "@supabase/supabase-js";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import _ from "lodash";
import { ko } from "date-fns/locale";
import Reply from "./reply-refactory";

interface CommentProps {
  comment: IComments & { replies: IComments[] };
  user: User | undefined;
  handleDelete: (commentId: string) => void;
  handleSubmitReply: (
    e: React.FormEvent<HTMLFormElement>,
    replyContent: string,
    parent_id: string
  ) => void;
}

export default function CommentRefactory({
  comment,
  user,
  handleDelete,
  handleSubmitReply,
}: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const router = useRouter();

  const setHandleSubmitReply = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmitReply(e, replyContent, comment.id);
    setReplyContent("");
  };

  return (
    <div className="rounded-lg p-4 space-y-4 text-foreground">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{comment.author_name}</span>
              <span className="text-sm text-gray-600">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                  locale: ko,
                })}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleDelete(comment.id)}
                >
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {comment.is_deleted ? (
            <p className="mt-2">삭제된 댓글입니다.</p>
          ) : (
            <p className="mt-2">{comment.content}</p>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-foreground/80 mt-2"
            onClick={() => setIsReplying(!isReplying)}
          >
            답글 달기
          </Button>

          {isReplying && (
            <form
              onSubmit={(e) => {
                setHandleSubmitReply(e);
              }}
              className="mt-4 space-y-2"
            >
              {user ? (
                <Textarea
                  value={replyContent}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setReplyContent(e.target.value)
                  }
                  placeholder="답글을 달아보세요!"
                  className="w-full  bg-transparent focus:outline-none focus-visible:ring-0 focus:border-foreground/20"
                />
              ) : (
                <Textarea
                  placeholder="로그인 후 댓글을 달아보세요!"
                  className="w-full bg-transparent focus:outline-none focus-visible:ring-0 focus:border-foreground/20"
                  onClick={() => {
                    router.push("/sign-in");
                  }}
                  readOnly
                />
              )}
              <div className="flex justify-end gap-2">
                {user && (
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!replyContent.trim()}
                    className="hover:text-primary text-foreground border border-foreground/20 bg-transparent hover:bg-background/30 transition-colors"
                  >
                    답글 작성
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReplying(false)}
                  className="hover:text-primary border border-foreground/20 bg-transparent hover:bg-background/30 transition-colors"
                >
                  취소
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-0">
          {comment.replies.map((reply) => (
            <Reply key={reply.id} reply={reply} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
