import KaraokeTableWrapper from "./karaoke-table-wrapper";
import Search from "./search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Suspense } from "react";
import ClientSideSearch from "./client-side-search";
interface Props {
  searchParams: Promise<{
    search?: string; // 검색 키워드
    page?: string;
    sort?: string;
  }>;
}

function KaraokeTableSkeleton() {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="py-4 px-6 font-medium w-[35%]">
              곡명
            </TableHead>
            <TableHead className="py-4 px-6 font-medium w-[35%]">
              가수
            </TableHead>
            <TableHead className="py-4 px-6 font-medium w-[10%]">TJ</TableHead>
            <TableHead className="py-4 px-6 font-medium w-[10%]">KY</TableHead>
            <TableHead className="py-4 px-6 font-medium w-[10%]">
              JOYSOUND
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell className="py-4 px-6">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
              </TableCell>
              <TableCell className="py-4 px-6">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </TableCell>
              <TableCell className="py-4 px-6">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
              </TableCell>
              <TableCell className="py-4 px-6">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
              </TableCell>
              <TableCell className="py-4 px-6">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default async function KaraokePage({ searchParams }: Props) {
  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          노래방 번호 찾기
        </h1>
        <p className="text-gray-600 mt-2">
          부르고 싶은 노래의 노래방 번호를 찾아보세요!
        </p>
      </div>

      <div className="mb-8">
        <Search />
        {/* <ClientSideSearch /> */}
      </div>
      <Suspense fallback={<KaraokeTableSkeleton />}>
        <KaraokeTableWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
