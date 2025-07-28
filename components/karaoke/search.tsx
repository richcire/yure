import { Input } from "@/components/ui/input";
import Form from "next/form";
import { ShineBorder } from "../magicui/shine-border";

export default function Search({ defaultValue }: { defaultValue?: string }) {
  return (
    <Form action="/karaoke" className="relative overflow-hidden rounded-lg">
      <ShineBorder
        shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        duration={14}
        className="animate-shine"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-primary"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <Input
        type="search"
        placeholder="제목, 가수, 애니메이션 제목 등등 생각나는 키워드를 입력해주세요"
        className="pl-10 py-6 text-md border-none"
        name="search"
        defaultValue={defaultValue}
      />
    </Form>
  );
}
