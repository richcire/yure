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
import Link from "next/link";
import { DeleteAlert } from "@/components/admin/delete-alert";

const deleteArticle = async (id: string) => {
  const supabase = createClient();

  // First fetch the translation to get content and image paths
  const { data: article } = await supabase
    .from("articles")
    .select("content, banner_url")
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

    if (article.banner_url) {
      const bannerImage = `article/${article.banner_url.split("/").pop()}`;
      if (bannerImage) {
        await supabase.storage.from("images").remove([bannerImage]);
      }
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
              <span className="sr-only">메뉴 열기</span>
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
