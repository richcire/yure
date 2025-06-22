import { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server";

// Add revalidation to reduce function invocations
export const revalidate = 3600; // Revalidate every hour

async function getNewsSlugs() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("news").select("slug");
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getNewsSlugs();
  return slugs.map((data) => ({
    url: `https://yure.me/news/${data.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
}
