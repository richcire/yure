import { PaginationControl } from "@/components/ui/pagination-control";
import { IEvents } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
// import { BottomDisplayAdWrapper } from "../google-adsense/bottom-display-ad-wrapper";
import ScheduleCard from "@/components/schedule/schedule-card";
import Calendar from "@/components/schedule/calendar";

const ITEMS_PER_PAGE = 9;

interface Props {
  searchParams: Promise<{
    search?: string; // 검색 키워드
    page?: string;
  }>;
}

export default async function ScheduleList({ searchParams }: Props) {
  const { search, page = "1" } = await searchParams;
  const currentPage = parseInt(page);
  const supabase = await createClient();

  const { data: events } = await supabase.from("events").select("*");

  console.log(events);

  return (
    <>
      {events ? (
        search ? (
          <ScheduleCard events={events} />
        ) : (
          <Calendar events={events} />
        )
      ) : (
        ""
      )}
    </>
  );
}
