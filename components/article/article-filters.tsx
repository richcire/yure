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
import { useState, useCallback } from "react";
import _ from "lodash";

export function ArticleFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search")?.toString() || ""
  );

  const currentSort = searchParams.get("sort") || "created_desc";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = useCallback(
    _.debounce((value: string) => {
      setSearchTerm(value);
      router.push(`${pathname}?${createQueryString("search", value)}`);
    }, 300),
    [pathname, router, createQueryString]
  );

  const handleSortChange = (value: string) => {
    router.push(`${pathname}?${createQueryString("sort", value)}`);
  };

  return (
    <div className="flex gap-4 items-center">
      <Input
        placeholder="검색어를 입력해주세요"
        className="max-w-sm"
        name="search"
        defaultValue={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Select
        name="sort"
        defaultValue={currentSort}
        onValueChange={handleSortChange}
      >
        <SelectTrigger className="w-[180px]" aria-label="Sort by">
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
