"use client";

import { useEffect, useState } from "react";
import type { IComments } from "@/types/supabase-table";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { CommentsRefactory } from "@/components/comments/comments-refactory";

export function TranslationCommentSection({
  permalink,
}: {
  permalink: string;
}) {
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
    const { data, error, count } = await supabase.rpc(
      "get_tranlsation_comments_with_replies",
      { _permalink: permalink },
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
    const { data, error, count } = await supabase.rpc(
      "add_translation_comment",
      {
        p_link: decodeURIComponent(permalink),
        new_content: newComment,
        parent_id: null,
      }
    );
    if (error) {
      console.error("Error adding comment:", error);
      return;
    }

    setComments(data);
  };

  const handleSubmitReply = async (
    e: React.FormEvent<HTMLFormElement>,
    replyContent: string,
    parent_id: string
  ) => {
    e.preventDefault();

    const { data, error } = await supabase.rpc("add_translation_comment", {
      p_link: decodeURIComponent(permalink),
      new_content: replyContent,
      parent_id,
    });
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
        deleteFn={"delete_translation_comment"}
        setComment={setComments}
      />
    </div>
  );
}
