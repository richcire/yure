import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-hanji">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#69140E]" />
        <p className="text-[#69140E] text-lg font-medium animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
