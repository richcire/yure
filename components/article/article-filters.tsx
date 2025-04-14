"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ArticleFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search")?.toString() || ""
  );

  const currentSort = searchParams.get("sort") || "created_desc";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.set("search", searchTerm);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex w-full gap-4 items-center flex-col sm:flex-row">
      <form onSubmit={handleSubmit} className="flex-1 w-full">
        <Input
          placeholder="검색어를 입력해주세요"
          className="sm:max-w-sm h-12 text-sm md:h-10"
          name="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Select
        name="sort"
        defaultValue={currentSort}
        onValueChange={handleSortChange}
      >
        <SelectTrigger
          className="w-full sm:w-[160px] h-12 text-sm md:h-10"
          aria-label="Sort by"
        >
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_desc">최신순</SelectItem>
          <SelectItem value="created_asc">오래된순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
