"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { SongModifyDialog } from "@/app/admin/(with-sidebar)/karaoke/song-modify-dialog";
interface KaraokeCardProps {
  id: string;
  title: string;
  artist: string;
  tjNumber: string | null;
  kyNumber: string | null;
  joyNumber: string | null;
  keyword: string;
}

const DeleteAlert = ({ id, title }: { id: string; title: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  const router = useRouter();
  const handleDelete = async () => {
    await supabase.from("karaoke_songs").delete().eq("id", id);
    setIsOpen(false);
    router.refresh();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          삭제
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            이 작업은 &quot;{title}&quot;을(를) 영구적으로 삭제합니다. 이 작업은
            취소할 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export function AdminKaraokeCard({
  id,
  title,
  artist,
  tjNumber,
  kyNumber,
  joyNumber,
  keyword,
}: KaraokeCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="p-4 bg-transparent border-b text-md hover:cursor-pointer"
      >
        <div className="flex items-center">
          <div className="w-[35%]">
            <h3 className=" font-semibold truncate">{title}</h3>
          </div>
          <div className="w-[35%]">
            <span className="text-gray-600">{artist}</span>
          </div>
          <div className="w-[10%] text-center">{tjNumber}</div>
          <div className="w-[10%] text-center">{kyNumber}</div>

          <div className="w-[10%] text-center">{joyNumber}</div>
        </div>
      </div>
      <SongModifyDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        id={id}
        title={title}
        artist={artist}
        tjNumber={tjNumber}
        kyNumber={kyNumber}
        joysoundNumber={joyNumber}
        keyword={keyword}
      />
    </>
  );
}
