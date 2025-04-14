interface KaraokeCardProps {
  title: string;
  artist: string;
  tjNumber?: string;
  kyNumber?: string;
  joyNumber?: string;
}

export function KaraokeCard({
  title,
  artist,
  tjNumber,
  kyNumber,
  joyNumber,
}: KaraokeCardProps) {
  return (
    <div className="p-4 bg-transparent border-b text-md">
      <div className="flex items-center">
        <div className="w-[35%]">
          <h3 className="font-medium truncate">{title}</h3>
        </div>
        <div className="w-[35%]">
          <span className="">{artist}</span>
        </div>
        <div className="w-[10%] text-center">{tjNumber || "-"}</div>
        <div className="w-[10%] text-center">{kyNumber || "-"}</div>
        <div className="w-[10%] text-center">{joyNumber || "-"}</div>
      </div>
    </div>
  );
}
