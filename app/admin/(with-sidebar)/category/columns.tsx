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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteAlert } from "@/components/admin/delete-alert";
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

interface Category {
  id: number;
  name: string;
}

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
    if (!categoryName.trim()) {
      toast.error("카테고리 이름을 입력해주세요.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("categories")
      .update({ name: categoryName.trim() })
      .eq("id", id);

    if (error) {
      toast.error("카테고리 수정에 실패했습니다: " + error.message);
      return;
    }

    toast.success("카테고리가 수정되었습니다.");
    setIsOpen(false);
    router.refresh();
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
              title={category.name}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
