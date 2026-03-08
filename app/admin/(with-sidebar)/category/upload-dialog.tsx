"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
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

export const UploadDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const router = useRouter();
  const handleUpload = async () => {
    if (!categoryName.trim()) {
      toast.error("카테고리 이름을 입력해주세요.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("categories")
      .insert({ name: categoryName.trim() });

    if (error) {
      toast.error("카테고리 생성에 실패했습니다: " + error.message);
      return;
    }

    toast.success("카테고리가 생성되었습니다.");
    setCategoryName("");
    setIsOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Label className="bg-primary text-white p-2 rounded-md hover:bg-primary/80 hover:cursor-pointer">
          생성
        </Label>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>카테고리 생성</DialogTitle>
          <DialogDescription>
            새 카테고리의 이름을 입력하세요.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <DialogFooter>
          <DialogClose>취소</DialogClose>
          <Button onClick={handleUpload}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
