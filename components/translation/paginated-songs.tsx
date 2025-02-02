"use client";

import { SongGrid } from "./song-grid";
import { Pagination } from "@/components/ui/pagination";
import { ITranslations } from "@/types/supabase-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { PaginationControl } from "../ui/pagination-control";

interface PaginatedSongsProps {
  songs: ITranslations[];
  currentPage: number;
  totalPages: number;
}

export function PaginatedSongs({
  songs,
  currentPage,
  totalPages,
}: PaginatedSongsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handlePageChange = (page: number) => {
    router.push(pathname + "?" + createQueryString("page", page.toString()));
  };

  return (
    <>
      <SongGrid songs={songs} />
      {totalPages > 1 && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}
