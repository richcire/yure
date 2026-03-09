"use client";

import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function CategoryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "created_desc"; // 기본값을 최신순으로

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      {/* 최신순 */}
      <Button
        className={`px-4 py-2 rounded-xl flex items-center gap-2 flex-1 justify-center max-w-20 ${
          currentSort === "created_desc"
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
        }`}
        onClick={() => handleSortChange("created_desc")}
      >
        <span className="text-sm font-medium">최신순</span>
      </Button>

      {/* HOT */}
      <Button
        className={`px-4 py-2 rounded-xl flex items-center gap-2 flex-1 justify-center max-w-20 ${
          currentSort === "hot"
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
        }`}
        onClick={() => handleSortChange("hot")}
      >
        <Flame className="h-4 w-4" />
        <span className="text-sm font-medium">HOT</span>
      </Button>
    </div>
  );
}
