"use client";

import { MusicIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import _ from "lodash";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search")?.toString() || ""
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.set("search", searchTerm);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <MusicIcon className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
            <h1 className="text-xl sm:text-2xl font-bold">J-POP 가사 번역</h1>
          </div>
          <div className="w-full sm:w-auto">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 max-w-md mx-auto sm:mx-0"
            >
              <Input
                placeholder="제목 또는 아티스트 검색"
                className="w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
