import { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server";

async function getArticleSlugs() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("articles").select("slug");
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getArticleSlugs();
  return slugs.map((data) => ({
    url: `https://yure.me/article/${data.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
}
