"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { cleanAndLowercase } from "@/utils/string";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const SongUploadDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [songData, setSongData] = useState({
    title: "",
    artist: "",
    tjNumber: "",
    kyNumber: "",
    joysoundNumber: "",
    keyword: "",
    defaultKeyword: "",
  });
  const router = useRouter();

  const handleUpload = async () => {
    if (!songData.title.trim() || !songData.artist.trim()) {
      toast.error("제목과 아티스트를 입력해주세요.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("karaoke_songs").insert({
      song_title: songData.title,
      singer: songData.artist,
      tj: songData.tjNumber || null,
      ky: songData.kyNumber || null,
      js: songData.joysoundNumber || null,
      keyword: cleanAndLowercase(songData.defaultKeyword, songData.keyword),
    });

    if (error) {
      toast.error("등록에 실패했습니다: " + error.message);
      return;
    }

    toast.success("곡이 등록되었습니다.");
    setIsOpen(false);
    router.refresh();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const title = e.target.value;
    const defaultKeyword = cleanAndLowercase(title, songData.artist);

    setSongData((prev) => ({
      ...prev,
      title,
      defaultKeyword,
    }));
  };

  const handleArtistChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const artist = e.target.value;
    const defaultKeyword = cleanAndLowercase(songData.title, artist);
    setSongData((prev) => ({
      ...prev,
      artist,
      defaultKeyword,
    }));
  };

  const handleInputChange =
    (field: keyof typeof songData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSongData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Label className="bg-primary text-white p-2 rounded-md hover:bg-primary/80 hover:cursor-pointer">
          노래 추가
        </Label>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>노래 추가</DialogTitle>
          <DialogDescription>
            새로운 노래의 정보를 입력하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              제목
            </Label>
            <Textarea
              id="title"
              value={songData.title}
              onChange={handleTitleChange}
              className="col-span-3 resize-none"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="artist" className="text-right">
              아티스트
            </Label>
            <Textarea
              id="artist"
              value={songData.artist}
              onChange={handleArtistChange}
              className="col-span-3 resize-none"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tjNumber" className="text-right">
              TJ 번호
            </Label>
            <Input
              id="tjNumber"
              value={songData.tjNumber}
              onChange={handleInputChange("tjNumber")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="kyNumber" className="text-right">
              KY 번호
            </Label>
            <Input
              id="kyNumber"
              value={songData.kyNumber}
              onChange={handleInputChange("kyNumber")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="joysoundNumber" className="text-right">
              조이사운드 번호
            </Label>
            <Input
              id="joysoundNumber"
              value={songData.joysoundNumber}
              onChange={handleInputChange("joysoundNumber")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="keyword" className="text-right">
              키워드(곡명+아티스트 이름은 자동으로 추가됩니다. 추가로 인식되고
              싶은 키워드를 입력하세요)
            </Label>
            <Input
              id="keyword"
              value={songData.keyword}
              onChange={handleInputChange("keyword")}
              placeholder={songData.defaultKeyword}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button onClick={handleUpload}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
