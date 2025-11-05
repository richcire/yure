import TranslationContent from "@/components/translation/translation-content";
import { createClient } from "@/utils/supabase/server";

// app/(site)/lyrics/[slug]/page.tsx
import Image from "next/image";
import TestContent from "./test-content";

export default async function TestPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("test")
    .select("*")
    .eq("id", "7")
    .single();

  if (error) {
    console.error(error);
    return <div>Error: {error.message}</div>;
  }
  const thumbnail =
    "https://ypkefxbgavxybyzluxan.supabase.co/storage/v1/object/public/images/translation/1762330851070-lsm1fu.jpeg";
  const title = "Pretender";
  const subtitle = "Official髭男dism";
  const tags = ["락", "얼터네이티브", "발라드"];

  return (
    <main className="relative">
      {/* 고정 배경: iOS의 background-attachment: fixed 제한을 피하기 위해 'position:fixed' 레이어 사용 */}
      <div aria-hidden className="fixed inset-0 h-screen w-screen">
        <Image src={thumbnail} alt="" fill priority className="object-cover" />
        {/* 가독성 보정용 오버레이 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
      </div>

      {/* 히어로: 화면 한 장 꽉 채움 */}
      <section className="relative flex h-screen w-full items-center justify-center px-6">
        <div className="mx-auto max-w-3xl text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20 backdrop-blur">
            {tags.map((t) => (
              <span key={t} className="text-xs">
                {t}
              </span>
            ))}
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-base/relaxed text-white/85 md:text-lg">
            {subtitle}
          </p>
          {/* 하단 스크롤 힌트 */}
          <div className="mt-12 flex justify-center">
            <a
              href="#content"
              className="group inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm ring-1 ring-white/20 backdrop-blur transition hover:bg-white/15"
            >
              아래로 스크롤
              <svg
                className="size-4 transition group-hover:translate-y-0.5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* 본문 컨테이너: 스크롤 시 배경 위를 덮으며 올라옴 */}
      <section
        id="content"
        className="relative pb-24 max-w-4xl w-screen p-4 rounded-2xl bg-gradient-to-b from-[#F5F5F5] to-[#E4E0D5]"
      >
        <p className="absolute -top-24 right-4 text-base text-white/85 text-right">
          2024년 08월 02일
        </p>

        {/* <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-soft ring-1 ring-black/5 md:p-10">
          <div className="mb-8 flex items-center justify-end text-sm text-gray-500">
            <div>2023년 08월 02일</div>
          </div>

        </div> */}
        <TestContent content={data.content} />
        {/* 추가 섹션(추천/댓글 등) */}
        <div className="mx-auto mt-8 max-w-3xl space-y-6 px-6 md:px-0">
          <section className="rounded-2xl border border-gray-200 p-6">
            <h4 className="mb-2 text-lg font-semibold">관련 포스트</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              <li>연관 해석 #1</li>
              <li>연관 해석 #2</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-gray-200 p-6">
            <h4 className="mb-2 text-lg font-semibold">댓글</h4>
            <p className="text-sm text-gray-600">
              로그인 후 댓글을 남겨보세요.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
