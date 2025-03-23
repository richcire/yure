"use client";

import { INews } from "@/types/supabase-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
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
import Link from "next/link";
const DeleteAlert = ({
  onDelete,
  title,
}: {
  onDelete: () => Promise<void>;
  title: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    await onDelete();
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

const deleteNews = async (id: string) => {
  const supabase = createClient();

  // First fetch the news to get content and image paths
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single<INews>();

  if (news) {
    // Create temporary div to parse HTML content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = news.content;

    // Get all image URLs from the content
    const contentImages = Array.from(tempDiv.getElementsByTagName("img"))
      .map((img) => img.getAttribute("src"))
      .filter((src) => src?.includes("supabase.co"))
      .map((imgUrl) => {
        const path = imgUrl?.split("/").pop();
        return path ? `news/${path}` : undefined;
      })
      .filter((url): url is string => url !== undefined);

    // Delete all images from storage
    if (contentImages.length > 0) {
      await supabase.storage.from("images").remove(contentImages);
    }

    // const bannerImage = `article/${article.banner_url.split("/").pop()}`;
    // if (bannerImage) {
    //   await supabase.storage.from("images").remove([bannerImage]);
    // }

    // Delete the news record
    await supabase.from("news").delete().eq("id", id);
  }
};

export const columns: ColumnDef<INews>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "user_info.name",
    header: "Author",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const news = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">메뉴 열기</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/admin/news/modify/${news.id}`}>
              <DropdownMenuItem>수정</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DeleteAlert
              onDelete={() => deleteNews(news.id)}
              title={news.title}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
