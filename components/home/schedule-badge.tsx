"use client";

interface ScheduleBadgeProps {
  title: string;
}

export default function ScheduleBadge({ title }: ScheduleBadgeProps) {
  return (
    <div className="px-3 py-1.5 bg-background rounded-full text-sm inline-block">
      {title}
    </div>
  );
}
