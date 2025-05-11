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

// DB 이벤트 데이터를 FullCalendar 이벤트 데이터로 변환
function transformEvents(dbEvents: IEvents[]): EventData[] {
  return dbEvents.map((event) => ({
    id: event.id,
    groupId: event.event_types.name,
    title: event.title,
    start: event.start_date,
    end: event.end_date,
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
    <div className="px-4 py-8">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={transformedEvents}
        eventTextColor="#000000"
        locale="ko"
        height={"80vh"}
        eventClick={(info) => {
          setSelectedEvent(info.event);
          setIsOpen(true);
        }}
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
          <DialogDescription>
            {selectedEvent?.extendedProps?.description}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
