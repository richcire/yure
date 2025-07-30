"use client";

import { useEffect, useState } from "react";
import type { IComments, INews } from "@/types/supabase-table";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import _ from "lodash";
import { CommentsRefactory } from "@/components/comments/comments-refactory";

interface CommentSectionProps {
  news: INews;
  useHideFeature?: boolean;
}

export function NewsCommentSection({ news }: CommentSectionProps) {
  const [, setNewComment] = useState("");
  const [comments, setComments] = useState<
    (IComments & { replies: IComments[] })[]
  >([]);
  const [user, setUser] = useState<User | undefined>();
  const supabase = createClient();

  const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      return;
    }
    setUser(data.session?.user);
  };

  const getComments = async () => {
    const { data, error } = await supabase.rpc(
      "get_news_comments_with_replies",
      { _news_id: news.id },
      { count: "exact" }
    );
    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }
    setComments(data);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    newComment: string
  ) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const { data, error } = await supabase.rpc(
      "add_news_comment",
      {
        _content: newComment,
        _news_id: news.id,
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

  const handleSubmitReply = async (
    e: React.FormEvent<HTMLFormElement>,
    replyContent: string,
    parent_id: string
  ) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    const { data, error } = await supabase.rpc(
      "add_news_comment",
      {
        _content: replyContent,
        _news_id: news.id,
        _parent_id: parent_id,
      },
      {
        count: "exact",
      }
    );
    if (error) {
      console.error("Error adding reply:", error);
      return;
    }
    setComments(data);
  };

  useEffect(() => {
    getSession();
    getComments();
  }, []);

  return (
    <div className="mt-8">
      <CommentsRefactory
        comment={comments}
        useHideFeature={true}
        handleSubmit={handleSubmit}
        handleSubmitReply={handleSubmitReply}
        deleteFn={"delete_news_comment"}
        setComment={setComments}
      />
    </div>
  );
}
