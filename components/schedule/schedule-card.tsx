"use client";

import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import { useState } from "react";
import { IEvents } from "@/types/supabase-table";

interface ScheduleCardProps {
  events: IEvents[];
}

function linkify(text: string) {
  // URL 정규식
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" style="color: #1976d2; text-decoration: underline;">${url}</a>`;
  });
}

export default function ScheduleCard({ events }: ScheduleCardProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {events.map((eventItem, index) => (
        <div
          key={eventItem.id}
          className="relative group border-b border-gray-300 pb-6 last:border-b-0 transition-colors hover:text-muted-foreground"
        >
          <div
            className="flex flex-col gap-4 sm:flex-row cursor-pointer"
            onClick={() => {
              setSelectedEventId(eventItem.id);
            }}
          >
            <div className="flex-1 sm:w-3/4">
              <div className="mb-1 flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(eventItem.start_date).toLocaleDateString()} {"~ "}
                    {new Date(eventItem.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <h2 className="mb-2 text-xl font-bold leading-tight sm:text-2xl line-clamp-2 lg:line-clamp-1">
                {eventItem.title}
              </h2>
              <p className="text-gray-700 line-clamp-3 lg:line-clamp-2">
                {eventItem.description}
              </p>
            </div>
          </div>

          <Dialog
            open={selectedEventId === eventItem.id}
            onOpenChange={(open) => {
              if (!open) setSelectedEventId(null);
            }}
          >
            <DialogContent>
              <DialogTitle>{eventItem.title}</DialogTitle>
              <DialogDescription className="break-all">
                {eventItem?.description ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: linkify(eventItem.description),
                    }}
                  />
                ) : null}
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  );
}
