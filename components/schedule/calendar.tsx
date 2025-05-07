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

// 이벤트 유형 정의
type EventGroupId = "콘서트" | "팬미팅" | string;

interface EventData {
  id: string;
  groupId: EventGroupId;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    content: string;
  };
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

interface ColorSet {
  bg: string;
  border: string;
}

// 이벤트 색상 설정 유틸리티 함수
function applyEventColors(events: EventData[]): EventData[] {
  const colorMap: Record<EventGroupId, ColorSet> = {
    콘서트: { bg: "#F8BBD0", border: "#F48FB1" },
    팬미팅: { bg: "#C8E6C9", border: "#A5D6A7" },
    // 필요시 다른 groupId에 대한 색상 추가
  };

  return events.map((event) => {
    const defaultColors: ColorSet = {
      bg: "#BBDEFB",
      border: "#90CAF9",
    };
    const colors = colorMap[event.groupId] || defaultColors;

    return {
      ...event,
      backgroundColor: colors.bg,
      borderColor: colors.border,
    };
  });
}

const eventsData: EventData[] = [
  {
    id: "1",
    groupId: "콘서트",
    title: "요네즈 켄시",
    start: "2025-04-10T10:00:00",
    end: "2025-04-10T11:00:00",
    extendedProps: {
      content: "abc",
    },
  },
  {
    id: "2",
    groupId: "팬미팅",
    title: "아이묭",
    start: "2025-04-11",
    end: "2025-04-11",
    extendedProps: {
      content: "def",
    },
  },
  {
    id: "3",
    groupId: "콘서트",
    title: "나",
    start: "2025-04-11",
    end: "2025-04-11",
    extendedProps: {
      content: "def",
    },
  },
  {
    id: "4",
    groupId: "팬미팅",
    title: "미세스 그린 애플",
    start: "2025-04-11",
    end: "2025-04-11",
    extendedProps: {
      content: "def",
    },
  },
];

interface CalendarProps {
  events: IEvents[];
}

function transformEvents(dbEvents: IEvents[]): EventData[] {
  return dbEvents.map((event) => ({
    id: event.id.toString(),
    groupId: event.event_type_id || "기타",
    title: event.title,
    start: event.start_date,
    end: event.end_date,
    extendedProps: {
      content: event.description || "",
    },
  }));
}

export default function Calendar({ events }: CalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  // 색상이 적용된 이벤트 데이터 생성
  // const coloredEvents = applyEventColors(events);
  const transformedEvents = applyEventColors(transformEvents(events));

  // 범례에 사용할 컬러맵 정의 - applyEventColors의 colorMap과 동일하게 유지
  const legendColorMap: Record<EventGroupId, ColorSet> = {
    콘서트: { bg: "#F8BBD0", border: "#F48FB1" },
    팬미팅: { bg: "#C8E6C9", border: "#A5D6A7" },
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
              className="w-5 h-5 rounded"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.border,
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            />
            <span>{groupId}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded"
            style={{
              backgroundColor: "#BBDEFB",
              borderColor: "#90CAF9",
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          />
          <span>기타</span>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>{selectedEvent?.title}</DialogTitle>
          <DialogDescription>Event Details</DialogDescription>
          <div>{selectedEvent?.extendedProps?.content}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
