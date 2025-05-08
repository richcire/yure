import { PaginationControl } from "@/components/ui/pagination-control";
import { IEvents } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import { BottomDisplayAdWrapper } from "../google-adsense/bottom-display-ad-wrapper";
import ScheduleCard from "@/components/schedule/schedule-card";
import Calendar from "@/components/schedule/calendar";

const ITEMS_PER_PAGE = 9;

interface Props {
  searchParams: Promise<{
    search?: string; // 검색 키워드
    page?: string;
    sort?: string;
  }>;
}

export default async function ScheduleList({ searchParams }: Props) {
  const { search, page = "1", sort = "created_desc" } = await searchParams;
  const currentPage = parseInt(page);
  const supabase = await createClient();

  // Build the base query
  let query = supabase.from("events").select(
    `
      id,
      title,
      description,
      event_types!inner (id, name),
      start_date,
      end_date,
      created_at
    `,
    { count: "exact" }
  );

  if (search) {
    // Convert search term to lowercase for case-insensitive search
    const searchTerm = search.toLowerCase();
    query = query.or(`title.ilike.%${searchTerm}%`);
  }

  // 이벤트 타입으로 필터링 (콘서트 또는 팬미팅)
  if (sort === "콘서트" || sort === "팬미팅") {
    query = query.eq("event_types.name", sort);
  }

  // Fetch paginated data with sorting
  const { data: events, count } = await query
    .order("created_at", { ascending: false })
    .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
    .returns<IEvents[]>();

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

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
      <BottomDisplayAdWrapper />
      {totalPages > 1 && (
        <PaginationControl currentPage={currentPage} totalPages={totalPages} />
      )}
    </>
  );
}
