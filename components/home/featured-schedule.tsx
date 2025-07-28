import { createClient } from "@/utils/supabase/server";
import { TextAnimate } from "../magicui/text-animate";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Marquee } from "@/components/magicui/marquee";
import ScheduleBadge from "./schedule-badge";

export default async function FeaturedSchedule() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("id, title")
    .order("created_at", { ascending: false })
    .limit(80);

  const firstRow = events?.slice(0, 20);
  const secondRow = events?.slice(20, 40);
  const thirdRow = events?.slice(40, 60);
  const fourthRow = events?.slice(60, 80);

  return (
    <>
      <div className="container">
        <p className="text-xl mb-8">
          콘서트부터 컴백까지, 팬이라면 알아야 할 모든 일정
        </p>
        <TextAnimate
          animation="blurIn"
          by="character"
          once
          className="mb-8 text-3xl font-bold"
          duration={3}
        >
          놓치지 마세요, 당신의 최애가 오는 날
        </TextAnimate>
        <Link
          href="/translation"
          className="flex items-center bg-primary text-primary-foreground px-4 rounded-md h-10 w-32 hover:bg-primary/50 hover:text-primary/90 transition-colors"
          aria-label="View all translations"
        >
          <span className="mr-2">더보기</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden pt-10">
        <Marquee pauseOnHover className="[--duration:60s]  pt-5">
          {firstRow?.map((event) => (
            <ScheduleBadge key={event.id} title={event.title} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:50s]  pt-5">
          {secondRow?.map((event) => (
            <ScheduleBadge key={event.id} title={event.title} />
          ))}
        </Marquee>
        <Marquee pauseOnHover className="[--duration:60s]  pt-5">
          {thirdRow?.map((event) => (
            <ScheduleBadge key={event.id} title={event.title} />
          ))}
        </Marquee>
        <Marquee pauseOnHover className="[--duration:50s]  pt-5">
          {fourthRow?.map((event) => (
            <ScheduleBadge key={event.id} title={event.title} />
          ))}
        </Marquee>
      </div>
    </>
  );
}
