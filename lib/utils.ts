import { IComments } from "@/types/supabase-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function makeCommentTree(comments: IComments[]) {
  const commentTree: Record<string, IComments & { replies: IComments[] }> = {};
  comments.forEach((comment) => {
    if (comment.parent_comment_id === null) {
      commentTree[comment.id] = {
        ...comment,
        replies: [],
      };
    } else {
      if (!commentTree[comment.parent_comment_id]) {
        commentTree[comment.parent_comment_id] = {
          ...comment,
          replies: [],
        };
      } else {
        commentTree[comment.parent_comment_id].replies.push(comment);
      }
    }
  });
  return Object.values(commentTree);
}
