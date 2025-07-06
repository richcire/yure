"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { EventApi } from "@fullcalendar/core";
import "@/styles/calendar.css";
import { IEvents } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// FullCalendar 이벤트 데이터 타입
interface EventData {
  id: string;
  groupId: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    description: string;
  };
}

const fetchData = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, event_types(*)")
    .returns<IEvents[]>();

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};

// 이벤트 종료일자에 하루 더하기
function addOneDay(dateString: string) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  // YYYY-MM-DD 형식으로 반환
  return date.toISOString().slice(0, 10);
}

// DB 이벤트 데이터를 FullCalendar 이벤트 데이터로 변환
function transformEvents(dbEvents: IEvents[]): EventData[] {
  return dbEvents.map((event) => ({
    id: event.id,
    groupId: event.event_types.name,
    title: event.title,
    start: event.start_date,
    end: addOneDay(event.end_date),
    backgroundColor: event.event_types.bg_color,
    borderColor: event.event_types.border_color,
    extendedProps: {
      description: event.description,
    },
  }));
}

export default function SchedulePage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const router = useRouter();

  // 고유 이벤트 타입 추출
  const uniqueEventTypes = Array.from(
    new Map(events.map((event) => [event.groupId, event])).values()
  );

  useEffect(() => {
    async function loadEvents() {
      const eventData = await fetchData();
      const transformed = transformEvents(eventData);
      setEvents(transformed);
    }
    loadEvents();
  }, []);

  // 이벤트 삭제 처리
  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("events")
          .delete()
          .eq("id", selectedEvent.id);

        if (error) {
          throw error;
        }

        // 삭제 후 이벤트 목록 새로고침
        const eventData = await fetchData();
        const transformed = transformEvents(eventData);
        setEvents(transformed);

        setIsOpen(false);
        setSelectedEvent(null);
        toast.success("일정이 삭제되었습니다.");

        // 캘린더 API 리렌더링
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
          calendarApi.refetchEvents();
        }
      } catch (error) {
        console.error("이벤트 삭제 오류:", error);
        toast.error("일정 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <>
      <div className="container mx-auto py-10">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventTextColor="#000000"
          headerToolbar={{
            left: "prev title next",
            right: "upload modify delete",
          }}
          height={"100vh"}
          eventMouseEnter={(mouseEnterInfo) => {
            mouseEnterInfo.el.addEventListener("mouseenter", () => {
              mouseEnterInfo.el.style.cursor = "pointer";
            });
          }}
          eventClick={(eventClickInfo) => {
            setSelectedEvent(eventClickInfo.event);
          }}
          customButtons={{
            upload: {
              text: "생성",
              click: () => {
                router.push(`/admin/schedule/upload`);
              },
            },
            modify: {
              text: "수정",
              click: () => {
                if (selectedEvent) {
                  router.push(`/admin/schedule/modify/${selectedEvent.id}`);
                }
              },
            },
            delete: {
              text: "삭제",
              click: () => {
                if (selectedEvent) {
                  setIsOpen(true);
                }
              },
            },
          }}
          dayMaxEvents={3}
        />
        {/* 색상 범례 */}
        <div className="mt-4 mb-8 flex flex-wrap gap-4 justify-center">
          {uniqueEventTypes.map((eventType) => (
            <div key={eventType.groupId} className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded border border-solid"
                style={{
                  backgroundColor: eventType.backgroundColor,
                  borderColor: eventType.borderColor,
                }}
              />
              <span>{eventType.groupId}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 &quot;{selectedEvent?.title}&quot;을(를) 영구적으로
              삭제합니다. 이 작업은 취소할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
