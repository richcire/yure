"use client";

import { Clipboard } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function NewsActionsSkeleton() {
  return (
    <div className="mb-12 flex justify-center gap-4 border-t border-b border-gray-300 py-4">
      <Skeleton className="h-8 w-28 animate-pulse" />
    </div>
  );
}

export function NewsActions() {
  const handleCopy = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("URL이 클립보드에 복사되었습니다.");
      })
      .catch(() => {
        toast.error("URL 복사에 실패했습니다.");
      });
  };

  return (
    <div className="mb-12 flex justify-center gap-4 border-t border-b border-gray-300 py-4">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-muted-foreground"
      >
        <Clipboard className="h-4 w-4" />
        복사하기
      </button>
    </div>
  );
}
