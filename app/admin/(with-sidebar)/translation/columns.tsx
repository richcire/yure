"use client";

import {
  ITranslations,
  ICategories,
  ITranslationCategories,
} from "@/types/supabase-table";
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
import { MultiSelect } from "@/components/ui/multi-select";
import { Input } from "@/components/ui/input";
import { TranslationTitle } from "@/components/translation/translation-title";
interface CategoryOption {
  value: number;
  label: string;
}

const ModifyKeywordAlert = ({
  translationId,
  translationTitle,
  translationArtist,
  translationKeyword,
}: {
  translationId: string;
  translationTitle: string;
  translationArtist: string;
  translationKeyword: string;
}) => {
  const baseKeyword = (translationTitle + translationArtist)
    .replaceAll(" ", "")
    .toLowerCase();
  const addOnKeyword = translationKeyword
    .replace(baseKeyword, "")
    .replaceAll(" ", "")
    .toLowerCase()
    .trim();
  const [isOpen, setIsOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState(addOnKeyword);
  const supabase = createClient();

  const handleSave = async () => {
    await supabase
      .from("translations")
      .update({
        keyword:
          baseKeyword + newKeyword.replaceAll(" ", "").toLowerCase().trim(),
      })
      .eq("id", translationId);
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          키워드 수정
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>키워드 수정</AlertDialogTitle>
          <AlertDialogDescription>
            '제목+아티스트 이름'은 기본적으로 포함이 됩니다. 현재 키워드는{" "}
            {translationKeyword} 입니다. 뒤에 덧붙일 키워드를 입력해주세요.
            공백은 구분하지 않습니다.
            <Input
              type="text"
              placeholder="키워드 입력"
              className="mt-4"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>수정</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ModifyCategoriesAlert = ({
  translationId,
}: {
  translationId: string;
}) => {
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<number[]>(
    []
  );

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("name")
      .returns<ICategories[]>();

    if (error) {
      console.error(error);
    }

    setCategories(
      data?.map((category) => ({
        value: category.id,
        label: category.name,
      })) || []
    );
  };

  const fetchSelectedCategories = async () => {
    const { data, error } = await supabase
      .from("translation_categories")
      .select("category_id")
      .eq("translation_id", translationId)
      .returns<ITranslationCategories[]>();

    if (error) {
      console.error(error);
    }

    setSelectedCategoriesIds(
      data?.map((category) => category.category_id) || []
    );
  };

  const onDropdownMenuItemClick = async (e: Event) => {
    e.preventDefault();
    // First fetch the data
    await Promise.all([fetchCategories(), fetchSelectedCategories()]);
    // Then open the dialog
    setIsOpen(true);
  };

  const handleSave = async () => {
    console.log(translationId);
    await supabase
      .from("translation_categories")
      .delete()
      .eq("translation_id", translationId);
    await supabase.from("translation_categories").insert(
      selectedCategoriesIds.map((categoryId) => ({
        translation_id: translationId,
        category_id: categoryId,
      }))
    );
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={onDropdownMenuItemClick}>
          카테고리 수정
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>카테고리 수정</AlertDialogTitle>
          <AlertDialogDescription>
            카테고리를 수정할 수 있습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <MultiSelect
            options={categories}
            defaultValue={selectedCategoriesIds}
            onValueChange={setSelectedCategoriesIds}
            placeholder="카테고리 선택"
            variant="inverted"
          />
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>수정</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const DeleteAlert = ({
  onDelete,
  title,
  translationId,
}: {
  onDelete: () => Promise<void>;
  title: string;
  translationId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  const router = useRouter();
  const handleDelete = async () => {
    await onDelete();
    await supabase
      .from("translation_categories")
      .delete()
      .eq("translation_id", translationId);
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

const deleteTranslation = async (id: string) => {
  const supabase = createClient();

  // First fetch the translation to get content and image paths
  const { data: translation } = await supabase
    .from("translations")
    .select("*")
    .eq("id", id)
    .single();

  if (translation) {
    // Create temporary div to parse HTML content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = translation.content;

    // Get all image URLs from the content
    const contentImages = Array.from(tempDiv.getElementsByTagName("img"))
      .map((img) => img.getAttribute("src"))
      .filter((src) => src?.includes("supabase.co"))
      .map((imgUrl) => {
        const path = imgUrl?.split("/").pop();
        return path ? `translation/${path}` : undefined;
      })
      .filter((url): url is string => url !== undefined);

    // Delete all images from storage
    if (contentImages.length > 0) {
      await supabase.storage.from("images").remove(contentImages);
    }

    // Delete the translation record
    await supabase.from("translations").delete().eq("id", id);
  }
};

export const columns: ColumnDef<ITranslations>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "artist",
    header: "Artist",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const translation = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">메뉴 열기</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/admin/translation-modify/${translation.id}`}>
              <DropdownMenuItem>수정</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <ModifyKeywordAlert
              translationId={translation.id}
              translationTitle={translation.title}
              translationArtist={translation.artist}
              translationKeyword={translation.keyword}
            />
            <ModifyCategoriesAlert translationId={translation.id} />
            <DeleteAlert
              onDelete={() => deleteTranslation(translation.id)}
              title={translation.title}
              translationId={translation.id}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
