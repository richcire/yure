"use client";

import { MessageCircle } from "lucide-react";

export default function PostComment({
  comment_count,
}: {
  comment_count: number;
}) {
  const handleCommentClick = () => {
    console.log("comment");
  };
  return (
    <button
      className="flex items-center gap-1 hover:text-blue-500 transition-colors"
      onClick={(e) => {
        e.preventDefault();
        handleCommentClick();
      }}
    >
      <MessageCircle className="h-4 w-4" />
      <span>{comment_count}</span>
    </button>
  );
}
