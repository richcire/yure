interface ScheduleBadgeProps {
  title: string;
  bgColor: string;
  borderColor: string;
}

export default function ScheduleBadge({
  title,
  bgColor,
  borderColor,
}: ScheduleBadgeProps) {
  return (
    <div
      className="px-3 py-1.5 bg-background rounded-full text-sm inline-block transition-transform hover:scale-105"
      style={{ backgroundColor: bgColor, borderColor: borderColor }}
    >
      {title}
    </div>
  );
}
