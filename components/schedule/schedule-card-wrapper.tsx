import ScheduleCard from "@/components/schedule/schedule-card";
import { IEvents } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import { PaginationControl } from "@/components/ui/pagination-control";

const ITEMS_PER_PAGE = 9;

interface Props {
  searchParams: Promise<{
    search?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function ScheduleCardWrapper({ searchParams }: Props) {
  const { search, page = "1", sort } = await searchParams;
  const currentPage = parseInt(page);
  const supabase = await createClient();

  // 기본 쿼리 생성
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

  // 대소문자 구분 없이 검색
  if (search) {
    const searchTerm = search.toLowerCase();
    query = query.or(`title.ilike.%${searchTerm}%`);
  }

  // 이벤트 타입으로 필터링
  if (sort) {
    query = query.eq("event_types.name", sort);
  }

  // 페이지네이션과 정렬
  const { data: events, count } = await query
    .order("created_at", { ascending: false })
    .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
    .returns<IEvents[]>();

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  return (
    <>
      <ScheduleCard events={events ?? []} />
      {totalPages > 1 && (
        <PaginationControl currentPage={currentPage} totalPages={totalPages} />
      )}
    </>
  );
}
