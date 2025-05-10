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
  extendedProps: {
    description: string;
  };
  backgroundColor?: string;
  borderColor?: string;
}

interface ColorSet {
  bg: string;
  border: string;
}

// DB 이벤트 데이터를 FullCalendar 이벤트 데이터로 변환
function transformEvents(dbEvents: IEvents[]): EventData[] {
  return dbEvents.map((event) => ({
    id: event.id,
    groupId: event.event_types.name,
    title: event.title,
    start: event.start_date,
    end: event.end_date,
    extendedProps: {
      description: event.description,
    },
  }));
}

// 이벤트 색상 설정 함수
function applyEventColors(events: EventData[]): EventData[] {
  const colorMap: Record<EventData["groupId"], ColorSet> = {
    콘서트: { bg: "#F8BBD0", border: "#F48FB1" },
    앨범: { bg: "#C8E6C9", border: "#A5D6A7" },
  };

  return events.map((event) => {
    const colors = colorMap[event.groupId];

    return {
      ...event,
      backgroundColor: colors.bg,
      borderColor: colors.border,
    };
  });
}

export default function Calendar({ events }: CalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // 색상이 적용된 이벤트 데이터 생성
  const transformedEvents = applyEventColors(transformEvents(events));

  // 범례에 사용할 컬러맵 정의 - applyEventColors의 colorMap과 동일하게 유지
  const legendColorMap: Record<EventData["groupId"], ColorSet> = {
    콘서트: { bg: "#F8BBD0", border: "#F48FB1" },
    앨범: { bg: "#C8E6C9", border: "#A5D6A7" },
  };

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
        {Object.entries(legendColorMap).map(([groupId, colors]) => (
          <div key={groupId} className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded border border-solid"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.border,
              }}
            />
            <span>{groupId}</span>
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
