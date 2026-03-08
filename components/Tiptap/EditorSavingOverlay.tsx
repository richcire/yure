"use client";

import { Progress } from "@/components/ui/progress";

interface EditorSavingOverlayProps {
  isSaving: boolean;
  progressValue: number;
}

export function EditorSavingOverlay({
  isSaving,
  progressValue,
}: EditorSavingOverlayProps) {
  if (!isSaving) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-30 flex justify-center items-center">
      <Progress
        value={progressValue}
        className="w-1/3"
        indicatorClassName="bg-white"
      />
    </div>
  );
}
