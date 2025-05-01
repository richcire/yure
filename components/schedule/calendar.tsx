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

const eventsData = [
  {
    id: "1",
    groupId: "콘서트",
    title: "요네즈 켄시 콘서트",
    start: "2025-04-10T10:00:00",
    end: "2025-04-10T11:00:00",
    extendedProps: {
      content: "abc",
    },
  },
  {
    id: "2",
    groupId: "팬미팅",
    title: "아이묭 팬미팅",
    start: "2025-04-11",
    end: "2025-04-11",
    extendedProps: {
      content: "def",
    },
  },
  {
    id: "3",
    groupId: "콘서트",
    title: "나 콘서트",
    start: "2025-04-11",
    end: "2025-04-11",
    extendedProps: {
      content: "def",
    },
  },
  {
    id: "4",
    groupId: "팬미팅",
    title: "미세스 그린 애플 팬미팅",
    start: "2025-04-11",
    end: "2025-04-11",
    extendedProps: {
      content: "def",
    },
  },
];

export default function Calendar() {
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="px-4 py-8">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={eventsData}
        locale="ko"
        height={"100vh"}
        eventClick={(info) => {
          setSelectedEvent(info.event);
          setIsOpen(true);
        }}
      />
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
