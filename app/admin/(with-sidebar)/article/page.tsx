import { IArticles } from "@/types/supabase-table";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Label } from "@/components/ui/label";

async function getData(): Promise<IArticles[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      id,
      title,
      user_info (name)
    `
    )
    .order("created_at", { ascending: false })
    .returns<IArticles[]>();

  if (error) {
    console.error(error);
    return [];
  }
  console.log(data);
  return data;
}

export default async function ArticlePage() {
  const data = await getData();

  return (
    <>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
      <div className="fixed bottom-4 right-4 flex gap-2">
        <Link href="/admin/article/upload" className="shadow-lg">
          <Label className="bg-primary text-white p-2 rounded-md hover:bg-primary/80 hover:cursor-pointer">
            Upload
          </Label>
        </Link>
      </div>
    </>
  );
}
