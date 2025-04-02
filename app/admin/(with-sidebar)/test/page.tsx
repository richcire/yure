import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function TestPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("test")
    .select("*")
    .order("created_at", { ascending: false });
  return (
    <>
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((item) => (
            <Link
              href={`/admin/test/${item.id}`}
              className="bg-white p-4 rounded-md shadow-md"
              key={item.id}
            >
              <h3 className="text-lg font-bold mb-2">{item.id}</h3>
            </Link>
          ))}
        </div>
      </div>
      <div className="fixed bottom-4 right-4 flex gap-2">
        <Link href="/admin/test/upload" className="shadow-lg">
          <Label className="bg-primary text-white p-2 rounded-md hover:bg-primary/80 hover:cursor-pointer">
            생성
          </Label>
        </Link>
      </div>
    </>
  );
}
