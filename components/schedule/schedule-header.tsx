import { ScheduleFilters } from "./schedule-filters";

export default function Header() {
  return (
    <header className="container mx-auto px-4 py-12 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-12">J-POP 일정</h1>
      <ScheduleFilters />
    </header>
  );
}
