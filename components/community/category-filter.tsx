import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CategoryFilter() {
  return (
    <div className="flex items-center gap-3 mb-6">
      {/* 최신순 */}
      <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 flex-1 justify-center max-w-20">
        <span className="text-sm font-medium">최신순</span>
      </Button>

      {/* HOT */}
      <Button
        variant="outline"
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 px-4 py-2 rounded-xl flex items-center gap-2 flex-1 justify-center max-w-20"
      >
        <Flame className="h-4 w-4" />
        <span className="text-sm font-medium">HOT</span>
      </Button>
    </div>
  );
}
