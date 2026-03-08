import { INews } from "@/types/supabase-table";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Label } from "@/components/ui/label";

export const revalidate = 60;

async function getData(): Promise<INews[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select(
      `
      id,
      title,
      user_info (name)
    `
    )
    .order("created_at", { ascending: false })
    .returns<INews[]>();

  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export default async function NewsPage() {
  const data = await getData();

  return (
    <>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
      <div className="fixed bottom-4 right-4 flex gap-2">
        <Link href="/admin/news/upload" className="shadow-lg">
          <Label className="bg-primary text-white p-2 rounded-md hover:bg-primary/80 hover:cursor-pointer">
            생성
          </Label>
        </Link>
      </div>
    </>
  );
}
