import { BottomDisplayAdWrapper } from "../google-adsense/bottom-display-ad-wrapper";
import ScheduleCardWrapper from "@/components/schedule/schedule-card-wrapper";
import CalendarWrapper from "@/components/schedule/calendar-wrapper";

interface Props {
  searchParams: Promise<{
    search?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function ScheduleList({ searchParams }: Props) {
  const { search } = await searchParams;

  return (
    <div className="px-4 py-8">
      {/* 검색어가 없으면 캘린더, 있으면 리스트 */}
      {!search ? (
        <CalendarWrapper searchParams={searchParams} />
      ) : (
        <ScheduleCardWrapper searchParams={searchParams} />
      )}
      <BottomDisplayAdWrapper />
    </div>
  );
}
