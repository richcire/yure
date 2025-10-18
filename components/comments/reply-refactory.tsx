"use client";

import { IComments } from "@/types/supabase-table";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { MoreHorizontal } from "lucide-react";
import { CornerDownRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ReplyProps {
  reply: IComments;
  onDelete: (replyId: string) => void;
}

export default function Reply({ reply, onDelete }: ReplyProps) {
  // const canDelete = user?.id === reply.author_id;

  return (
    <div className="relative pl-8 py-4 border-t border-foreground/20">
      <div className="absolute left-0 top-4 h-full w-8">
        <CornerDownRight className="w-4 h-4" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{reply.author_name}</span>
          <span className="text-sm text-gray-600">
            {formatDistanceToNow(new Date(reply.created_at), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
        </div>
        {/* {canDelete && ( */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(reply.id)}
            >
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* )} */}
      </div>
      <p className="text-foreground/80 mt-2">{reply.content}</p>
    </div>
  );
}
