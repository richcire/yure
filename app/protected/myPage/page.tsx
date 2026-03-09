import { IUserInfo } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import DeleteUserButton from "./DeleteUserButton";
import FavoriteSongsList from "@/components/karaoke/favorite-songs-list";

export default async function MyPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  const { data: userData } = await supabase
    .from("user_info")
    .select("*")
    .eq("user_id", data.user?.id)
    .single<IUserInfo>();

  async function updateName(formData: FormData) {
    "use server";

    const newName = formData.get("name")?.toString();
    if (!newName) return;

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    await supabase
      .from("user_info")
      .update({ name: newName })
      .eq("user_id", data.user?.id);

    revalidatePath("/protected/myPage");
  }
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">마이페이지</h1>
        <p className="text-muted-foreground mt-1">내 계정 정보를 관리합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">닉네임</p>
              <p className="text-lg font-medium text-foreground">
                {userData?.name || "Not set"}
              </p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  수정
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>닉네임 수정</DialogTitle>
                </DialogHeader>
                <form action={updateName} className="space-y-4 mt-4">
                  <Input
                    name="name"
                    placeholder="닉네임을 입력해주세요"
                    defaultValue={userData?.name || ""}
                  />
                  <DialogClose asChild>
                    <Button type="submit">저장</Button>
                  </DialogClose>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Separator className="my-4" />
          <div>
            <p className="text-sm text-muted-foreground">이메일</p>
            <p className="text-foreground">{data.user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>즐겨찾기 노래</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-10" />
                ))}
              </div>
            }
          >
            <FavoriteSongsList userId={data.user?.id || ""} />
          </Suspense>
        </CardContent>
      </Card>

      <Link href="/" className="block pt-4">
        <Button variant="outline" className="w-full">
          홈으로
        </Button>
      </Link>

      <div className="flex justify-center pt-4">
        <DeleteUserButton userId={data.user?.id || ""} />
      </div>
    </div>
  );
}
