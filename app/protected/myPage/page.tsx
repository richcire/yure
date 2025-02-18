import { IUserInfo } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function MyPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  console.log(data);
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
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">내 정보</h1>

        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <p className="text-sm text-gray-500">닉네임</p>
            <p className="text-lg font-medium">{userData?.name || "Not set"}</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">수정</Button>
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

        <Link href="/">
          <Button variant="outline" className="w-full mt-4">
            홈으로
          </Button>
        </Link>
      </div>
    </div>
  );
}
