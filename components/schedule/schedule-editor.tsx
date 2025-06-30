"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IEvents, IEventTypes } from "@/types/supabase-table";
import { useRouter } from "next/navigation";

const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  // 연도, 월, 일 가져오기
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");

  // "YYYY-MM-DD" 형식으로 조합
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export default function ScheduleEditor({ id }: { id?: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [eventType, setEventType] = useState<IEventTypes[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<IEventTypes>();
  const [eventTypeId, setEventTypeId] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTypes = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("event_types")
        .select("id, name")
        .order("name")
        .returns<IEventTypes[]>();

      if (error) {
        console.error("Error fetching event types:", error);
        return;
      }

      setEventType(data || []);

      if (id) {
        const { data: event, error: eventError } = await supabase
          .from("events")
          .select(
            `
            *,
            event_types(id, name)
            `
          )
          .eq("id", id)
          .single<IEvents>();

        if (eventError) {
          console.error("Error fetching event:", eventError);
          return;
        }

        setTitle(event.title);
        setDescription(event.description);
        setStartDate(new Date(event.start_date));
        setEndDate(new Date(event.end_date));
        setEventTypeId(event.event_types.id);
      }
    };

    fetchTypes();
  }, []);

  const updateEvent = async () => {
    setIsSaving(true);
    if (!title || !description) {
      setIsSaving(false);
      console.error("Please fill in all required fields");
      return;
    }

    const supabase = createClient();

    const eventData = {
      title,
      description,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      event_type_id: selectedEventType?.id,
    };

    const { error } = await supabase
      .from("events")
      .update(eventData)
      .eq("id", id);

    if (error) {
      setIsSaving(false);
      console.error("Error updating event:", error);
    } else {
      router.push("/admin/schedule");
    }
  };

  const saveEvent = async () => {
    setIsSaving(true);
    if (!title || !description) {
      setIsSaving(false);
      console.error("Please fill in all required fields");
      return;
    }

    const supabase = createClient();

    const eventData = {
      title,
      description,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      event_type_id: selectedEventType?.id,
    };

    const { error } = await supabase.from("events").insert([eventData]);

    if (error) {
      setIsSaving(false);
      console.error("Error saving event:", error);
    } else {
      router.push("/admin/schedule");
    }
  };

  const handleCancel = () => {
    setIsSaving(false);
    router.push("/admin/schedule");
  };

  return (
    <>
      <div className="w-full relative min-h-screen pb-16">
        <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full p-4">
          <Input
            placeholder="글 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="grid gap-4 md:grid-cols-3">
            <Select
              onValueChange={(id) =>
                setSelectedEventType(eventType.find((type) => type.id === id))
              }
              value={selectedEventType?.id}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={`${eventType.find((type) => type.id === eventTypeId)?.name || "이벤트 타입 선택"}`}
                />
              </SelectTrigger>
              <SelectContent>
                {eventType.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DatePicker date={startDate} setDate={setStartDate} />
            <DatePicker date={endDate} setDate={setEndDate} />
          </div>
          <div>
            <Textarea
              className="min-h-[400px]"
              placeholder="글 내용"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="fixed bottom-4 right-4 flex gap-2">
          <Button className="shadow-lg" onClick={handleCancel}>
            취소
          </Button>
          {id ? (
            <Button
              className="shadow-lg"
              onClick={updateEvent}
              disabled={
                !title ||
                !description ||
                !startDate ||
                !endDate ||
                !selectedEventType
              }
            >
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
          ) : (
            <Button
              className="shadow-lg"
              onClick={saveEvent}
              disabled={
                !title ||
                !description ||
                !startDate ||
                !endDate ||
                !selectedEventType
              }
            >
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
