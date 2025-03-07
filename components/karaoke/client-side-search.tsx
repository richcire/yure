"use client";

import { Input } from "@/components/ui/input";
import Form from "next/form";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
export default function ClientSideSearch() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.set("search", search);
    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500"
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
        placeholder="제목이나 가수를 입력하세요"
        className="pl-10 py-6 text-lg"
        name="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  );
}
