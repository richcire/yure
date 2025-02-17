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
interface HeaderProps {
  search?: string;
  sort?: string;
}

export function Header() {
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
    <header className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Latest Articles</h1>
      <p className="text-muted-foreground text-lg mb-8">
        Insights and perspectives on design, technology, and modern business
      </p>
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by title or author..."
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_desc">Newest First</SelectItem>
            <SelectItem value="created_asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
