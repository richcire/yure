import { IKaraokeSongs } from "@/types/supabase-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/server";
import { PaginationControl } from "@/components/ui/pagination-control";
import MobileKaraokeTable from "./mobile-karaoke-table";
import { BottomDisplayAdWrapper } from "../google-adsense/bottom-display-ad-wrapper";

interface Props {
  searchParams: {
    search?: string; // 검색 키워드
    page?: string;
  };
}

const ITEMS_PER_PAGE = 10;

async function getSongs(searchKeyword: string, currentPage: number) {
  const supabase = await createClient();
  const { data, error, count } = await supabase
    .rpc(
      "get_karaoke_songs",
      {
        search_keyword: searchKeyword,
      },
      {
        count: "exact",
      }
    )
    .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
    .returns<IKaraokeSongs[]>();

  return { data, error, count };
}

export default async function KaraokeTableWrapper({ searchParams }: Props) {
  const { search: searchKeyword, page } = searchParams;
  if (!searchKeyword) {
    return <div>검색 키워드가 없습니다.</div>;
  }
  const {
    data: karaokeSongs,
    error,
    count,
  } = await getSongs(
    decodeURIComponent(searchKeyword),
    page ? parseInt(page) : 1
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!karaokeSongs) {
    return <div>No songs found</div>;
  }

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);
  return (
    <>
      {/* Desktop View */}
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
              {karaokeSongs.map((song) => (
                <TableRow key={song.id} className="hover:bg-[#69140E]/5">
                  <TableCell className="py-4 px-6">
                    <div>{song.song_title}</div>
                  </TableCell>
                  <TableCell className="py-4 px-6">{song.singer}</TableCell>
                  <TableCell className="py-4 px-6">{song.tj}</TableCell>
                  <TableCell className="py-4 px-6">{song.ky}</TableCell>
                  <TableCell className="py-4 px-6">{song.js}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <MobileKaraokeTable songs={karaokeSongs} />
      </div>
      <BottomDisplayAdWrapper />
      <PaginationControl
        currentPage={page ? parseInt(page) : 1}
        totalPages={totalPages}
      />
    </>
  );
}
