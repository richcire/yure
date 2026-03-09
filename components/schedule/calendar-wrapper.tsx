import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/server";

const Calendar = dynamic(() => import("@/components/schedule/calendar"));
import { IEvents } from "@/types/supabase-table";

interface Props {
  searchParams: Promise<{
    search?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function CalendarWrapper({ searchParams }: Props) {
  const { search, sort } = await searchParams;
  const supabase = await createClient();

  // 기본 쿼리 생성
  let query = supabase.from("events").select(
    `
        id,
        title,
        description,
        event_types!inner (id, name, bg_color, border_color),
        start_date,
        end_date,
        created_at
      `
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

  const { data: events } = await query.returns<IEvents[]>();

  return (
    <div className="px-2 md:px-3 py-4 md:py-6 bg-hanji-dark rounded-md">
      {events ? (
        <Calendar events={events} />
      ) : (
        "일정을 불러오는 중 오류가 발생했습니다."
      )}
    </div>
  );
}
