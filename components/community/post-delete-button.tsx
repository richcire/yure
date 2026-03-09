"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface PostDeleteButtonProps {
  postId: string;
  content: string;
}

export default function PostDeleteButton({
  postId,
  content,
}: PostDeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const supabase = createClient();

      // Parse HTML content to extract image URLs
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;

      const contentImages = Array.from(tempDiv.getElementsByTagName("img"))
        .map((img) => img.getAttribute("src"))
        .filter((src) => src?.includes("supabase.co"))
        .map((imgUrl) => {
          const path = imgUrl?.split("/").pop();
          return path ? `post/${path}` : undefined;
        })
        .filter((url): url is string => url !== undefined);

      // Delete images from storage
      if (contentImages.length > 0) {
        await supabase.storage.from("images").remove(contentImages);
      }

      // Delete the post record
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (error) {
        throw error;
      }

      toast.success("게시물이 삭제되었습니다.");
      router.push("/community");
    } catch {
      toast.error("게시물 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Trash2 className="h-4 w-4 mr-1" />
          삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>게시물을 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            이 작업은 되돌릴 수 없습니다. 게시물과 포함된 이미지가 영구적으로
            삭제됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "삭제 중..." : "삭제"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
