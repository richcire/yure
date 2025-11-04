import { createClient } from "@/utils/supabase/server";

export default async function TestPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("test")
    .select("*")
    .eq("id", "7")
    .single();

  if (error) {
    console.error(error);
    return <div>Error: {error.message}</div>;
  }

  return <div>{JSON.stringify(data)}</div>;
}
