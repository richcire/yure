"use client";

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

interface Category {
  id: number;
  name: string;
}

const DeleteAlert = ({
  onDelete,
  name,
}: {
  onDelete: () => Promise<void>;
  name: string;
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
            이 작업은 &quot;{name}&quot;을(를) 영구적으로 삭제합니다. 이 작업은
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

const deleteCategory = async (id: number) => {
  const supabase = createClient();

  // Delete the category record
  await supabase.from("categories").delete().eq("id", id);
};

const ModifyDialog = ({ id, name }: { id: number; name: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState(name);
  const router = useRouter();
  const handleModify = async () => {
    const supabase = createClient();
    const { error } = await supabase
      .from("categories")
      .update({ name: categoryName })
      .eq("id", id);

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
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          수정
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>카테고리 수정</DialogTitle>
          <DialogDescription>카테고리의 이름을 수정하세요.</DialogDescription>
        </DialogHeader>
        <Input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <DialogFooter>
          <DialogClose>취소</DialogClose>
          <Button onClick={handleModify}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">메뉴 열기</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <ModifyDialog id={category.id} name={category.name} />
            <DropdownMenuSeparator />
            <DeleteAlert
              onDelete={() => deleteCategory(category.id)}
              name={category.name}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
