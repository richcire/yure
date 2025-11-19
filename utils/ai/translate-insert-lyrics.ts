"use server";

import { runWorkflow } from "./auto-post";
import { createClient } from "@/utils/supabase/server";

interface IFormData {
  title: string;
  artist: string;
  keyword: string;
  permalink: string;
  releaseDate: string;
  youtubeKey: string;
  lyrics: string;
  artistInContent: string;
}

const insertDataToSupabase = async (
  formData: IFormData,
  finalContent: string,
  thumbnailUrl: string
) => {
  const supabase = await createClient();
  const { error } = await supabase.from("translations").insert({
    title: formData.title,
    artist: formData.artist,
    content: finalContent,
    thumbnail_url: thumbnailUrl || null,
    keyword: formData.keyword,
    permalink: formData.permalink,
    release_date: formData.releaseDate || null,
    is_hidden: true,
  });
  if (error) {
    console.error(error);
    throw error;
  }
};

const makeFinalContent = (
  html: string,
  youtubeKey: string,
  artistInContent: string,
  thumbnailUrl: string
) => {
  const parts = html.split("</h1>");
  const front_part = parts[0];
  const back_part = parts[1];
  const artist_parts = artistInContent.split("\n");
  const first_artist = artist_parts[0];
  const second_artist = artist_parts[1];
  let final_content =
    front_part +
    "</h1>" +
    "<h2 style='text-align: center;'><strong>" +
    first_artist +
    "</strong><br><strong>" +
    second_artist +
    "</strong></h2><ins class='rounded-md adsbygoogle' data-ad-layout='in-article' data-ad-format='fluid' data-ad-client='ca-pub-4738868818137222' data-ad-slot='2891582134' style='display: block; text-align: center;'></ins>" +
    back_part;
  final_content =
    `<iframe class="rounded-md" src="https://www.youtube.com/embed/${youtubeKey}" width="100%" data-aspect-ratio="16/9" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="true"></iframe><p style="text-align: center;"></p>` +
    final_content;
  if (thumbnailUrl) {
    final_content =
      `<img class="rounded-md max-w-full" src="${thumbnailUrl}" width="100%" textalign="left" float="none">` +
      final_content;
  }
  return final_content;
};

const uploadThumbnailImage = async (file: File) => {
  const supabase = await createClient();
  const fileName = `translation/${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("images")
    .upload(fileName, file);
  if (uploadError) {
    console.error(uploadError);
    throw uploadError;
  }
  const publiUrl = `https://ypkefxbgavxybyzluxan.supabase.co/storage/v1/object/public/images/${fileName}`;
  return publiUrl;
};

const translateInsertLyrics = async (
  formData: IFormData,
  thumbnailImage: File | null
) => {
  try {
    const html = await runWorkflow({ input_as_text: formData.lyrics });
    let thumbnailUrl = "";
    if (thumbnailImage) {
      thumbnailUrl = await uploadThumbnailImage(thumbnailImage);
    }
    const finalContent = makeFinalContent(
      html,
      formData.youtubeKey,
      formData.artistInContent,
      thumbnailUrl
    );
    await insertDataToSupabase(formData, finalContent, thumbnailUrl);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default translateInsertLyrics;
