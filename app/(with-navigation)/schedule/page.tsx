import Header from "@/components/schedule/schedule-header";
import ScheduleList from "@/components/schedule/schedule-list";

interface Props {
  searchParams: Promise<{
    search?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function SchedulePage({ searchParams }: Props) {
  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen bg-background">
      <Header />
      <ScheduleList searchParams={searchParams} />
    </div>
  );
}
