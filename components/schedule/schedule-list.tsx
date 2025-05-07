import { PaginationControl } from "@/components/ui/pagination-control";
import { IEvents } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import { BottomDisplayAdWrapper } from "../google-adsense/bottom-display-ad-wrapper";
import ScheduleCard from "@/components/schedule/schedule-card";
import Calendar from "@/components/schedule/calendar";

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
    `
  );

  if (search) {
    // Convert search term to lowercase for case-insensitive search
    const searchTerm = search.toLowerCase();
    query = query.or(`title.ilike.%${searchTerm}%`);
  }

  // Determine sort direction
  const ascending = sort === "created_asc";

  // Fetch paginated data with sorting
  const { data: events } = await query
    .order("created_at", { ascending })
    .returns<IEvents[]>();

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
      <BottomDisplayAdWrapper />
    </>
  );
}
