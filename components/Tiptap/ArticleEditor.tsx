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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Link from "@tiptap/extension-link";
export default function ArticleEditor({ id }: { id?: string }) {
  const [article, setArticle] = useState<IArticles>();
  const [title, setTitle] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [selectedBannerImage, setSelectedBannerImage] = useState<File | null>(
    null
  );

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
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            // disallowed protocols
            const disallowedProtocols = ["ftp", "file", "mailto"];
            const protocol = parsedUrl.protocol.replace(":", "");

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            // disallowed domains
            const disallowedDomains = [
              "example-phishing.com",
              "malicious-site.net",
            ];
            const domain = parsedUrl.hostname;

            if (disallowedDomains.includes(domain)) {
              return false;
            }

            // all checks have passed
            return true;
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`https://${url}`);

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = [
              "example-no-autolink.com",
              "another-no-autolink.com",
            ];
            const domain = parsedUrl.hostname;

            return !disallowedDomains.includes(domain);
          } catch {
            return false;
          }
        },
      }),
      //   FontSize,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose focus:outline-none prose-p:mt-0 prose-p:mb-0 prose-headings:mt-0 prose:max-w-none prose-sm:max-w-none max-w-none w-full",
      },
    },
    immediatelyRender: false,
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
        setArticle(data);
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

  const uploadBannerImage = async () => {
    if (!selectedBannerImage) return;

    const supabase = createClient();

    const fileName = `article/banner-${Date.now()}-${Math.random().toString(36).substring(7)}.${selectedBannerImage.type.split("/")[1]}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, selectedBannerImage);

    if (uploadError) {
      console.error("Error uploading banner image:", uploadError);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(fileName);

    return publicUrl;
  };

  const deleteRemovedImagesInStorage = async (
    newContent: string,
    oldContent: string
  ) => {
    const supabase = createClient();
    const oldContentWrapper = document.createElement("div");
    oldContentWrapper.innerHTML = oldContent;
    const oldImages = Array.from(oldContentWrapper.getElementsByTagName("img"))
      .map((img) => img.getAttribute("src"))
      .filter((src) => src?.includes("supabase.co"));

    const newContentWrapper = document.createElement("div");
    newContentWrapper.innerHTML = newContent;
    const newImages = Array.from(newContentWrapper.getElementsByTagName("img"))
      .map((img) => img.getAttribute("src"))
      .filter((src) => src?.includes("supabase.co"));

    const imagesToDelete = oldImages.filter(
      (oldSrc) => !newImages.includes(oldSrc)
    );

    const imagePathsToDelete = imagesToDelete
      .map((imgUrl) => {
        const path = imgUrl?.split("/").pop();
        return path ? `article/${path}` : undefined;
      })
      .filter((url): url is string => url !== undefined);

    if (imagePathsToDelete.length > 0) {
      await supabase.storage.from("images").remove(imagePathsToDelete);
    }
  };

  const uploadImages = async (newContent: string) => {
    const supabase = createClient();
    const newContentWrapper = document.createElement("div");
    newContentWrapper.innerHTML = newContent;
    const images = Array.from(
      newContentWrapper.getElementsByTagName("img")
    ).filter((img) => {
      const src = img.getAttribute("src");
      return src?.startsWith("data:image");
    });

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
        return { finalContent: null, uploadError: uploadError };
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(fileName);

      // Update the image src with the public URL
      img.setAttribute("src", publicUrl);
    });

    await Promise.all(imagePromises);

    return { finalContentWrapper: newContentWrapper, uploadError: null };
  };

  const getThumbnailImage = (finalContentWrapper: HTMLDivElement) => {
    const firstImage = finalContentWrapper.querySelector("img");
    return firstImage?.getAttribute("src") || "";
  };

  const handleFinalSave = async () => {
    setIsSaving(true);
    if (!editor || !title) {
      setIsSaving(false);
      console.error("Please fill in all required fields");
      return;
    }

    try {
      if (!selectedBannerImage) {
        setIsSaving(false);
        console.error("Please select a banner image");
        return;
      }

      // Upload banner image if selected
      const bannerUrl = await uploadBannerImage();

      // Continue with the original save logic
      const supabase = createClient();
      const content = editor.getHTML();
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      setProgressValue(20);

      // If updating, handle deleted images

      if (id && article) {
        await deleteRemovedImagesInStorage(editor.getHTML(), article.content);
      }

      setProgressValue(30);

      const { finalContentWrapper, uploadError } = await uploadImages(content);

      if (uploadError) {
        setIsSaving(false);
        setProgressValue(0);
        console.error("Error uploading images:", uploadError);
        return;
      }

      setProgressValue(80);

      const thumbnailUrl = getThumbnailImage(finalContentWrapper);

      // Prepare the data object
      const articleData: Partial<IArticles> = {
        title,
        content: finalContentWrapper.innerHTML,
        thumbnail_url: thumbnailUrl,
        slug: slugifyLimited(title),
        banner_url: bannerUrl,
      };

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
    router.push("/admin/article");
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
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={!title} className="shadow-lg">
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>배너 이미지 선택</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="banner">배너 이미지</Label>
                  {id && (
                    <p className="text-sm text-gray-500">
                      배너 이미지를 다시 선택하면 기존 배너 이미지를 대체합니다.
                    </p>
                  )}
                  <Input
                    id="banner"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setSelectedBannerImage(e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={handleFinalSave}
                  disabled={!selectedBannerImage}
                >
                  저장
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
