"use client";

import { IArticles, ITranslations } from "@/types/supabase-table";
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
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the article &quot;{title}&quot;. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const deleteArticle = async (id: string) => {
  const supabase = createClient();

  // First fetch the translation to get content and image paths
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single<IArticles>();

  if (article) {
    // Create temporary div to parse HTML content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = article.content;

    // Get all image URLs from the content
    const contentImages = Array.from(tempDiv.getElementsByTagName("img"))
      .map((img) => img.getAttribute("src"))
      .filter((src) => src?.includes("supabase.co"))
      .map((imgUrl) => {
        const path = imgUrl?.split("/").pop();
        return path ? `article/${path}` : undefined;
      })
      .filter((url): url is string => url !== undefined);

    // Delete all images from storage
    if (contentImages.length > 0) {
      await supabase.storage.from("images").remove(contentImages);
    }

    const bannerImage = `article/${article.banner_url.split("/").pop()}`;
    if (bannerImage) {
      await supabase.storage.from("images").remove([bannerImage]);
    }

    // Delete the translation record
    await supabase.from("articles").delete().eq("id", id);
  }
};

export const columns: ColumnDef<IArticles>[] = [
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
      const article = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/admin/article/modify/${article.id}`}>
              <DropdownMenuItem>수정</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DeleteAlert
              onDelete={() => deleteArticle(article.id)}
              title={article.title}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
