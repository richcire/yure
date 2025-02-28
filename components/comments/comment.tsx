"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import type { IComments, IUserInfo } from "@/types/supabase-table";
import { User } from "@supabase/supabase-js";
import { CornerDownRight, MoreHorizontal } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { makeCommentTree } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentProps {
  comment: IComments & { replies: IComments[] };
  user: User | undefined;
  setComments: Dispatch<
    SetStateAction<(IComments & { replies: IComments[] })[]>
  >;
}

interface ReplyProps {
  reply: IComments;
  user: User | undefined;
  onDelete: (replyId: string) => void;
}

function Reply({ reply, user, onDelete }: ReplyProps) {
  const canDelete = user?.id === reply.author_id;

  return (
    <div className="relative pl-8 py-4 border-t">
      <div className="absolute left-0 top-4 h-full w-8">
        <CornerDownRight className="w-4 h-4" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{reply.author_name}</span>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(reply.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
        {canDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(reply.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <p className="mt-2">{reply.content}</p>
    </div>
  );
}

export function Comment({ comment, user, setComments }: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const supabase = createClient();
  const router = useRouter();
  const { permalink } = useParams<{ permalink: string }>();

  //웹에서 사전에 삭제기능을 검증하고 싶을때 사용. 현재는 db에서 author_id를 안 돌려줌
  // const canDelete = user?.id === comment.author_id;

  const handleDelete = async (commentId: string) => {
    const { data, error } = await supabase
      .from("translation_comments")
      .delete()
      .eq("id", commentId)
      .select();

    if (data) {
      const { data: updatedComments } = await supabase
        .rpc("get_translation_comments", {
          p_link: decodeURIComponent(permalink),
        })
        .returns<IComments[]>();

      if (updatedComments) {
        const commentTree = makeCommentTree(updatedComments);
        setComments(commentTree);
      }
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    await handleDelete(replyId);
  };

  const handleSubmitReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    const { data, error } = await supabase.rpc("add_translation_comment", {
      p_link: decodeURIComponent(permalink),
      new_content: replyContent,
      parent_id: comment.id,
    });
    setReplyContent("");
    setIsReplying(false);

    if (data) {
      const commentTree = makeCommentTree(data);
      setComments(commentTree);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{comment.author_name}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleDelete(comment.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="mt-2">{comment.content}</p>

          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => setIsReplying(!isReplying)}
          >
            Reply
          </Button>

          {isReplying && (
            <form onSubmit={handleSubmitReply} className="mt-4 space-y-2">
              {user ? (
                <Textarea
                  value={replyContent}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setReplyContent(e.target.value)
                  }
                  placeholder="Write a reply..."
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
              <div className="flex gap-2">
                {user && (
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!replyContent.trim()}
                  >
                    Post Reply
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-0">
          {comment.replies.map((reply) => (
            <Reply
              key={reply.id}
              reply={reply}
              user={user}
              onDelete={handleDeleteReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
