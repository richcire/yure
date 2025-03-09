import KaraokeTableWrapper from "../../../components/karaoke/karaoke-table-wrapper";
import Search from "../../../components/karaoke/search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Suspense } from "react";
import ClientSideSearch from "../../../components/karaoke/client-side-search";
import { MobileKaraokeTableSkeleton } from "../../../components/karaoke/mobile-karaoke-table";

export const metadata = {
  title: "🔍 JPOP 노래방 검색기",
  description: "부르고 싶은 JPOP 노래의 노래방 번호를 찾아보세요!",
};

interface Props {
  searchParams: Promise<{
    search?: string; // 검색 키워드
    page?: string;
  }>;
}

function KaraokeTableSkeleton() {
  return (
    <>
      {/* Desktop Skeleton */}
      <div className="hidden md:block">
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-[#69140E]/5">
                <TableHead className="py-4 px-6 font-medium w-[35%]">
                  곡명
                </TableHead>
                <TableHead className="py-4 px-6 font-medium w-[35%]">
                  가수
                </TableHead>
                <TableHead className="py-4 px-6 font-medium w-[10%]">
                  TJ
                </TableHead>
                <TableHead className="py-4 px-6 font-medium w-[10%]">
                  KY
                </TableHead>
                <TableHead className="py-4 px-6 font-medium w-[10%]">
                  JOYSOUND
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i} className="hover:bg-[#69140E]/5">
                  <TableCell className="py-4 px-6">
                    <div className="h-4 bg-[#69140E]/20 rounded animate-pulse w-3/4 mb-2"></div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="h-4 bg-[#69140E]/20 rounded animate-pulse w-2/3"></div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="h-4 bg-[#69140E]/20 rounded animate-pulse w-12"></div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="h-4 bg-[#69140E]/20 rounded animate-pulse w-12"></div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="h-4 bg-[#69140E]/20 rounded animate-pulse w-12"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Skeleton */}
      <div className="md:hidden">
        <MobileKaraokeTableSkeleton />
      </div>
    </>
  );
}

export default async function KaraokePage({ searchParams }: Props) {
  const parmas = await searchParams;
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          🔍 JPOP 노래방 검색기
        </h1>
        <p className="text-gray-600 mt-2">
          부르고 싶은 노래의 노래방 번호를 찾아보세요!
        </p>
      </div>

      <div className="mb-8">
        <Search defaultValue={parmas.search} />
        {/* <ClientSideSearch /> */}
      </div>
      {/* key 안주면 suspense 안됨 */}
      <Suspense
        key={`${parmas.search}${parmas.page}`}
        fallback={<KaraokeTableSkeleton />}
      >
        <KaraokeTableWrapper searchParams={parmas} />
      </Suspense>
    </div>
  );
}
