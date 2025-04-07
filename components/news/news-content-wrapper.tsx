import { createClient } from "@/utils/supabase/server";
import NewsContent from "./news-content";
import { redirect } from "next/navigation";
import { INews } from "@/types/supabase-table";

async function getNewsContent(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("content")
    .eq("slug", decodeURIComponent(slug))
    .single<INews>();
  return data?.content;
}

export default async function NewsContentWrapper({ slug }: { slug: string }) {
  const content = await getNewsContent(slug);
  if (!content) {
    redirect("/404");
  }
  return <NewsContent content={content} />;
}
