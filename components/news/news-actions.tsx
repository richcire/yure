"use client";

import { Clipboard } from "lucide-react";
import { toast } from "sonner";

export default function NewsActions() {
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
        className="flex items-center gap-2 text-sm font-medium hover:text-gray-600"
      >
        <Clipboard className="h-4 w-4" />
        복사하기
      </button>
    </div>
  );
}
