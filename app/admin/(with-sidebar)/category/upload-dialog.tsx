"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
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
    const supabase = createClient();
    const { error } = await supabase
      .from("categories")
      .insert({ name: categoryName });

    if (error) {
      window.alert(error.message);
      return;
    } else {
      setIsOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Label className="bg-primary text-white p-2 rounded-md hover:bg-primary/80 hover:cursor-pointer">
          Upload
        </Label>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Category</DialogTitle>
          <DialogDescription>
            Enter the name of the new category.
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
