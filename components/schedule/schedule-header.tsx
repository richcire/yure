import { ScheduleFilters } from "./schedule-filters";

export default function Header() {
  return (
    <header className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">일정</h1>
      <ScheduleFilters />
    </header>
  );
}
