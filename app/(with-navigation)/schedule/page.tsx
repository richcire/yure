import Calendar from "@/components/schedule/calendar";
import Header from "@/components/schedule/schedule-header";
import ScheduleList from "@/components/schedule/schedule-list";
// import interactionPlugin from "@fullcalendar/interaction";

// const handleDateClick = () => {
//   alert("날짜 선택됨");
// };

interface Props {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function SchedulePage({ searchParams }: Props) {
  const { search, page = "1" } = await searchParams;
  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen bg-background">
      <Header />
      {search ? <ScheduleList /> : <Calendar />}
    </div>
  );
}
