import { Newspaper, Calendar, Search } from "lucide-react";
import { Input } from "../ui/input";

export function Header() {
  const today = new Date().toLocaleDateString("ko-KR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="mb-6 border-b-2 border-black pb-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium uppercase tracking-wider text-gray-600">
          Vol. XXIV, No. 142
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{today}</span>
        </div>
      </div>

      <div className="my-6 text-center">
        <h1 className="font-serif text-5xl font-bold uppercase tracking-tight sm:text-6xl md:text-7xl">
          Yure News
        </h1>
        <p className="mt-2 font-serif italic text-gray-600">
          "All the News That's Fit to Print"
        </p>
      </div>

      <div className="flex flex-col justify-between gap-4 border-t-2 border-black pt-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          <span className="font-medium">Latest Edition</span>
        </div>
        <div className="relative">
          <Input placeholder="뉴스 검색" className="sm:w-64" />
        </div>
      </div>
    </header>
  );
}
