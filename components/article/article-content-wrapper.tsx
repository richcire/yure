import { createClient } from "@/utils/supabase/server";
import ArticleContent from "./article-content";
import { redirect } from "next/navigation";

async function getArticleContent(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("content")
    .eq("slug", decodeURIComponent(slug))
    .single();
  return data?.content;
}

export default async function ArticleContentWrapper({
  slug,
}: {
  slug: string;
}) {
  const content = await getArticleContent(slug);
  if (!content) {
    redirect("/404");
  }
  return <ArticleContent content={content} />;
}
