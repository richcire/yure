import Calendar from "@/components/schedule/calendar";

// import interactionPlugin from "@fullcalendar/interaction";

// const handleDateClick = () => {
//   alert("날짜 선택됨");
// };

export default function SchedulePage() {
  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen bg-background">
      <Calendar />
    </div>
  );
}
