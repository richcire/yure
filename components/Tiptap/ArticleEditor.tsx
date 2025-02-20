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
import { useRouter } from "next/navigation";
import { IArticles } from "@/types/supabase-table";

export default function ArticleEditor({ id }: { id?: string }) {
  const [title, setTitle] = useState("");
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
          class: "bg-[#84894A] dark:bg-[#84894A]",
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
    const fetchArticle = async () => {
      if (id) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching article:", error);
          return;
        }

        setTitle(data.title);
        editor?.commands.setContent(data.content);
      }
    };

    fetchArticle();
  }, [editor]);

  function slugifyLimited(text: string, maxLength = 20) {
    // 문자열로 변환하고, 앞뒤 공백 제거 및 영어의 경우 소문자 변환
    text = text.toString().trim().toLowerCase();
    // Remove URL special characters
    text = text.replace(/[%&?=/#]/g, "");
    const words = text.split(/\s+/);
    let slug = "";

    for (const word of words) {
      // 현재 slug에 단어를 추가했을 때의 후보 문자열 (단어 사이에 '-' 삽입)
      const candidate = slug ? `${slug}-${word}` : word;

      if (candidate.length <= maxLength) {
        slug = candidate;
      } else {
        // slug가 아직 비어있다면, 첫 단어가 maxLength보다 긴 경우
        if (!slug) {
          slug = word.slice(0, maxLength);
        }
        break;
      }
    }
    return slug;
  }

  const handleSave = async () => {
    setIsSaving(true);
    if (!editor || !title) {
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
        const { data: existingArticle } = await supabase
          .from("articles")
          .select("content")
          .eq("id", id)
          .single();

        if (existingArticle) {
          const oldDiv = document.createElement("div");
          oldDiv.innerHTML = existingArticle.content;
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
              return path ? `article/${path}` : undefined;
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
        const fileName = `article/${Date.now()}-${Math.random().toString(36).substring(7)}.${blob.type.split("/")[1]}`;
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

        // Update the image src with the public URL
        img.setAttribute("src", publicUrl);
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
      const articleData: Partial<IArticles> = {
        title,
        content: finalContent,
        thumbnail_url: thumbnailUrl,
        slug: slugifyLimited(title),
      };

      console.log(slugifyLimited(title));

      // Save or update the content in the translations table
      const { error } = id
        ? await supabase.from("articles").update(articleData).eq("id", id)
        : await supabase.from("articles").insert([articleData]);

      setProgressValue(100);
      if (error) {
        setIsSaving(false);
        setProgressValue(0);
        console.error("Error saving translation:", error);
      } else {
        router.push("/admin/article");
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

          <div className="border rounded-md border-input">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} className="p-4" />
          </div>
        </div>
        <div className="fixed bottom-4 right-4 flex gap-2">
          <Button onClick={handleCancel} className="shadow-lg">
            취소
          </Button>
          <Button disabled={!title} className="shadow-lg" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            저장
          </Button>
        </div>
      </div>
    </>
  );
}
