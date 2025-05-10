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

export function ScheduleFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search")?.toString() || ""
  );

  const currentSort = searchParams.get("sort") || "전체";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.set("search", searchTerm);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // 전체 선택시 sort 파라미터 삭제
    if (value === "전체") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 items-center flex-col sm:flex-row">
      <form onSubmit={handleSubmit} className="flex-1 w-full">
        <Input
          placeholder="검색어를 입력해주세요"
          className="sm:max-w-sm "
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
        <SelectTrigger className="w-full sm:w-[160px]" aria-label="Sort by">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="전체">전체</SelectItem>
          <SelectItem value="콘서트">콘서트</SelectItem>
          <SelectItem value="앨범">앨범</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
