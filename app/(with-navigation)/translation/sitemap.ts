import { createClient } from "@/utils/supabase/server";
import { MetadataRoute } from "next";

async function getTranslationPermalinks() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("translations")
    .select("permalink, thumbnail_url");
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
  const permalinks = await getTranslationPermalinks();
  return permalinks.map((data) =>
    data.thumbnail_url
      ? {
          url: `https://yure.me/translation/${data.permalink}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
          images: [data.thumbnail_url],
        }
      : {
          url: `https://yure.me/translation/${data.permalink}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        }
  );
}
