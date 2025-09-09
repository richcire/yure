import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">커뮤니티</h1>
        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
          <Search className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}
