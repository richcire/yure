import { createClient } from "@/utils/supabase/client";

export const uploadImages = async (
  newContent: string,
  storageFolder: string
): Promise<{ finalContentWrapper: HTMLDivElement; uploadError: null } | { finalContentWrapper: null; uploadError: Error }> => {
  const supabase = createClient();
  const newContentWrapper = document.createElement("div");
  newContentWrapper.innerHTML = newContent;
  const images = Array.from(newContentWrapper.getElementsByTagName("img")).filter(
    (img) => img.getAttribute("src")?.startsWith("data:image")
  );

  const imagePromises = images.map(async (img) => {
    const base64Data = img.getAttribute("src");
    const response = await fetch(base64Data!);
    const blob = await response.blob();

    const fileName = `${storageFolder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${blob.type.split("/")[1]}`;
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, blob);

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(fileName);

    img.setAttribute("src", publicUrl);
  });

  try {
    await Promise.all(imagePromises);
    return { finalContentWrapper: newContentWrapper, uploadError: null };
  } catch (err) {
    return { finalContentWrapper: null, uploadError: err as Error };
  }
};

export const deleteRemovedImagesInStorage = async (
  newContent: string,
  oldContent: string,
  storageFolder: string
): Promise<void> => {
  const supabase = createClient();

  const oldWrapper = document.createElement("div");
  oldWrapper.innerHTML = oldContent;
  const oldImages = Array.from(oldWrapper.getElementsByTagName("img"))
    .map((img) => img.getAttribute("src"))
    .filter((src) => src?.includes("supabase.co"));

  const newWrapper = document.createElement("div");
  newWrapper.innerHTML = newContent;
  const newImages = Array.from(newWrapper.getElementsByTagName("img"))
    .map((img) => img.getAttribute("src"))
    .filter((src) => src?.includes("supabase.co"));

  const imagesToDelete = oldImages.filter((oldSrc) => !newImages.includes(oldSrc));
  const imagePathsToDelete = imagesToDelete
    .map((imgUrl) => {
      const path = imgUrl?.split("/").pop();
      return path ? `${storageFolder}/${path}` : undefined;
    })
    .filter((url): url is string => url !== undefined);

  if (imagePathsToDelete.length > 0) {
    await supabase.storage.from("images").remove(imagePathsToDelete);
  }
};

export const getThumbnailImage = (finalContentWrapper: HTMLDivElement): string => {
  const firstImage = finalContentWrapper.querySelector("img");
  return firstImage?.getAttribute("src") || "";
};
