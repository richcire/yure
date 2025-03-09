import { columns } from "./columns";
import { DataTable } from "./data-table";
import { createClient } from "@/utils/supabase/server";
import { UploadDialog } from "./upload-dialog";

interface Category {
  id: number;
  name: string;
}

async function getData(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true })
    .returns<Category[]>();

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export default async function CategoryPage() {
  const data = await getData();

  return (
    <>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
      <div className="fixed bottom-4 right-4 flex gap-2">
        <UploadDialog />
      </div>
    </>
  );
}
