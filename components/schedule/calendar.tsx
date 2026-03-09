"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { EventApi } from "@fullcalendar/core";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import { IEvents } from "@/types/supabase-table";
import "@/styles/calendar.css";
import { linkify } from "@/utils/linkify";

interface CalendarProps {
  events: IEvents[];
}

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


export default function Calendar({ events }: CalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const transformedEvents = transformEvents(events);

  // 고유 이벤트 타입 추출
  const uniqueEventTypes = Array.from(
    new Map(
      events.map((event) => [event.event_types.name, event.event_types])
    ).values()
  );

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={transformedEvents}
        eventTextColor="hsl(var(--foreground))"
        headerToolbar={{
          left: "prev title next",
          right: "",
        }}
        height={"auto"}
        eventMouseEnter={(mouseEnterInfo) => {
          mouseEnterInfo.el.addEventListener("mouseenter", () => {
            mouseEnterInfo.el.style.cursor = "pointer";
          });
        }}
        eventClick={(eventClickInfo) => {
          setSelectedEvent(eventClickInfo.event);
          setIsOpen(true);
        }}
        dayMaxEvents={3}
      />

      {/* 색상 범례 */}
      <div className="mt-4 mb-8 flex flex-wrap gap-4 justify-center">
        {uniqueEventTypes.map((eventType) => (
          <div key={eventType.name} className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded border border-solid"
              style={{
                backgroundColor: eventType.bg_color,
                borderColor: eventType.border_color,
              }}
            />
            <span>{eventType.name}</span>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>{selectedEvent?.title}</DialogTitle>
          <DialogDescription className="break-all">
            {selectedEvent?.extendedProps?.description ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: linkify(selectedEvent.extendedProps.description),
                }}
              />
            ) : null}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
