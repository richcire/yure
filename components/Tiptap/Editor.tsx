"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
// import FontSize from "@tiptap/extension-font-size";
import { Toolbar } from "./Toolbar";
import { ImageExtension } from "./extensions/ImageExtension";
import { YouTubeExtension } from "./extensions/YouTubeExtension";
import { Highlight } from "@tiptap/extension-highlight";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { DatePicker } from "@/components/date-picker";
import { ITranslations } from "@/types/supabase-table";

interface Category {
  id: string;
  name: string;
}

const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  // 연도, 월, 일 가져오기
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");

  // "YYYY-MM-DD" 형식으로 조합
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export default function TiptapEditor({ id }: { id?: string }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [releaseDate, setReleaseDate] = useState<Date>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [progressValue, setProgressValue] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph", "youtube"],
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full",
        },
      }),
      YouTubeExtension.configure({
        HTMLAttributes: {
          class: "rounded-md",
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-yellow-200 dark:bg-yellow-800",
        },
      }),
      //   FontSize,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose focus:outline-none prose-p:mt-0 prose-headings:mt-0 prose:max-w-none prose-sm:max-w-none max-w-none w-full",
      },
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      setCategories(data || []);

      if (id) {
        const { data: translation, error: translationError } = await supabase
          .from("translations")
          .select("*, categories(*)")
          .eq("id", id)
          .single<ITranslations>();

        if (translationError) {
          console.error("Error fetching translation:", translationError);
          return;
        }

        setTitle(translation.title);
        setArtist(translation.artist);
        setCategoryId(translation.category_id);
        setReleaseDate(new Date(translation.release_date));
        editor?.commands.setContent(translation.content);
      }
    };

    fetchCategories();
  }, [editor]);

  const handleSave = async () => {
    setIsSaving(true);
    if (!editor || !title || !artist || !categoryId) {
      setIsSaving(false);
      console.error("Please fill in all required fields");
      return;
    }

    const supabase = createClient();
    const content = editor.getHTML();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    let thumbnailUrl = "";
    setProgressValue(20);

    try {
      // If updating, handle deleted images
      if (id) {
        const { data: existingTranslation } = await supabase
          .from("translations")
          .select("content")
          .eq("id", id)
          .single();

        if (existingTranslation) {
          const oldDiv = document.createElement("div");
          oldDiv.innerHTML = existingTranslation.content;
          const oldImages = Array.from(oldDiv.getElementsByTagName("img"))
            .map((img) => img.getAttribute("src"))
            .filter((src) => src?.includes("supabase.co"));

          // Get current images in the editor
          const currentImages = Array.from(tempDiv.getElementsByTagName("img"))
            .map((img) => img.getAttribute("src"))
            .filter((src) => src?.includes("supabase.co"));

          // Find images that were deleted (present in old but not in current)
          const deletedImages = oldImages.filter(
            (oldSrc) => !currentImages.includes(oldSrc)
          );

          // Delete only the removed images from storage
          const imgUrlsToDelete = deletedImages
            .map((imgUrl) => {
              const path = imgUrl?.split("/").pop();
              return path ? `translation/${path}` : undefined;
            })
            .filter((url): url is string => url !== undefined);

          if (imgUrlsToDelete.length > 0) {
            await supabase.storage.from("images").remove(imgUrlsToDelete);
          }
        }
      }

      // Handle new images
      const images = Array.from(tempDiv.getElementsByTagName("img")).filter(
        (img) => {
          const src = img.getAttribute("src");
          return src?.startsWith("data:image");
        }
      );
      setProgressValue(30);

      // Upload each image to Supabase storage and get their URLs
      const imagePromises = images.map(async (img, idx) => {
        const base64Data = img.getAttribute("src");
        // Convert base64 to blob
        const response = await fetch(base64Data!);
        const blob = await response.blob();

        // Upload to Supabase storage
        const fileName = `translation/${Date.now()}-${Math.random().toString(36).substring(7)}.${blob.type.split("/")[1]}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, blob);

        if (uploadError) {
          return;
        }
        setProgressValue(40);
        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(fileName);
      });

      // Wait for all images to be uploaded
      await Promise.all(imagePromises);
      setProgressValue(70);

      // Get the final HTML with updated image URLs
      const finalContent = tempDiv.innerHTML;

      // Find the first image in the final content for thumbnail
      const firstImage = tempDiv.querySelector("img");
      thumbnailUrl = firstImage?.getAttribute("src") || "";

      // Prepare the data object
      const translationData: Partial<ITranslations> = {
        content: finalContent,
        title,
        artist,
        category_id: categoryId,
        release_date: formatDate(releaseDate),
        thumbnail_url: thumbnailUrl,
      };

      // Save or update the content in the translations table
      const { error } = id
        ? await supabase
            .from("translations")
            .update(translationData)
            .eq("id", id)
        : await supabase.from("translations").insert([translationData]);

      setProgressValue(100);
      if (error) {
        setIsSaving(false);
        setProgressValue(0);
        console.error("Error saving translation:", error);
      } else {
        router.push("/admin/translation");
      }
    } catch (error) {
      setIsSaving(false);
      setProgressValue(0);
      console.error("Error details:", error);
    }
  };

  const handleCancel = () => {
    setIsSaving(false);
    setProgressValue(0);
    router.push("/admin/translation");
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-screen h-screen bg-black/50 z-30 flex justify-center items-center ${
          isSaving ? "block" : "hidden"
        }`}
      >
        <Progress value={progressValue} className="w-1/3" />
      </div>
      <div className="w-full relative min-h-screen pb-16">
        <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full p-4">
          <Input
            placeholder="글 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder="아티스트 이름"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
            />
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DatePicker date={releaseDate} setDate={setReleaseDate} />
          </div>
          <div className="border rounded-md border-input">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} className="p-4" />
          </div>
        </div>
        <div className="fixed bottom-4 right-4 flex gap-2">
          <Button onClick={handleCancel} className="shadow-lg">
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title || !artist || !categoryId}
            className="shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Translation
          </Button>
        </div>
      </div>
    </>
  );
}
