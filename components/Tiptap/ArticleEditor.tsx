"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
import { CustomHighlight } from "./extensions/CustomHighlightExtenstion";
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
import { InstagramExtension } from "./extensions/InstagramExtension";
import { tiptapLinkConfig } from "@/lib/tiptap-link-config";
import {
  uploadImages,
  deleteRemovedImagesInStorage,
  getThumbnailImage,
} from "@/utils/tiptap/image-upload";
import { EditorSavingOverlay } from "./EditorSavingOverlay";

export default function ArticleEditor({ id }: { id?: string }) {
  const [article, setArticle] = useState<IArticles>();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [selectedBannerImage, setSelectedBannerImage] = useState<File | null>(
    null
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomHighlight,
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
      InstagramExtension.configure({
        HTMLAttributes: {
          class: "rounded-md",
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class:
            "bg-lyric-mark text-primary dark:bg-lyric-mark-dark dark:text-lyric-mark-text-dark",
        },
      }),
      Link.configure(tiptapLinkConfig),
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
        setSlug(data.slug);
        editor?.commands.setContent(data.content);
      }
    };

    fetchArticle();
  }, [editor]);

  const uploadBannerImage = async (
    storageFolder: string,
    selectedBannerImage: File
  ) => {
    const supabase = createClient();

    const fileName = `${storageFolder}/banner-${Date.now()}-${Math.random().toString(36).substring(7)}.${selectedBannerImage.type.split("/")[1]}`;
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, selectedBannerImage);

    if (uploadError) {
      console.error("Error uploading banner image:", uploadError);
      return { bannerUrl: null, uploadError };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(fileName);

    return { bannerUrl: publicUrl, uploadError: null };
  };

  const updateArticle = async () => {
    if (slug.includes("/")) {
      alert("퍼마링크에 슬래시(/)는 포함될 수 없습니다.");
      return;
    }
    setIsSaving(true);

    if (!editor || !title) {
      setIsSaving(false);
      console.error("Please fill in all required fields");
      return;
    }

    if (!article) {
      setIsSaving(false);
      console.error("Article not found");
      return;
    }

    const supabase = createClient();

    let bannerUrl = "";

    //delete old banner image and upload new one if selected
    if (selectedBannerImage) {
      const currentBannerPath = article?.banner_url?.split("/").pop();

      if (currentBannerPath) {
        const { error: bannerDeleteError } = await supabase.storage
          .from("images")
          .remove([`article/${currentBannerPath}`]);

        if (bannerDeleteError) {
          setIsSaving(false);
          console.error("Error deleting banner image:", bannerDeleteError);
          return;
        }
      }
      const { bannerUrl: newBannerUrl, uploadError } = await uploadBannerImage(
        "article",
        selectedBannerImage
      );

      if (uploadError) {
        setIsSaving(false);
        console.error("Error uploading banner image:", uploadError);
        return;
      }

      bannerUrl = newBannerUrl;
    }

    const content = editor.getHTML();

    setProgressValue(20);

    // handle deleted images
    await deleteRemovedImagesInStorage(
      editor.getHTML(),
      article.content,
      "article"
    );

    setProgressValue(30);

    const { finalContentWrapper, uploadError } = await uploadImages(
      content,
      "article"
    );

    if (uploadError || !finalContentWrapper) {
      setIsSaving(false);
      setProgressValue(0);
      console.error("Error uploading images:", uploadError);
      return;
    }

    setProgressValue(80);

    const thumbnailUrl = getThumbnailImage(finalContentWrapper);

    const articleData: Partial<IArticles> = {
      title,
      content: finalContentWrapper.innerHTML,
      thumbnail_url: thumbnailUrl,
      slug,
      banner_url: bannerUrl || article.banner_url,
    };

    const { error } = await supabase
      .from("articles")
      .update(articleData)
      .eq("id", id);

    setProgressValue(100);

    if (error) {
      setIsSaving(false);
      setProgressValue(0);
      console.error("Error saving article:", error);
    } else {
      setIsSaving(false);
      router.push("/admin/article");
    }
  };

  const saveArticle = async () => {
    if (slug.includes("/")) {
      alert("퍼마링크에 슬래시(/)는 포함될 수 없습니다.");
      return;
    }
    setIsSaving(true);
    if (!editor || !title) {
      setIsSaving(false);
      console.error("Please fill in all required fields");
      return;
    }

    try {
      const supabase = createClient();

      if (!selectedBannerImage) {
        setIsSaving(false);
        console.error("Please select a banner image");
        return;
      }

      // Upload banner image
      const { bannerUrl: newBannerUrl, uploadError: bannerUploadError } =
        await uploadBannerImage("article", selectedBannerImage);

      if (bannerUploadError) {
        setIsSaving(false);
        console.error("Error uploading banner image:", bannerUploadError);
        return;
      }

      // Continue with the original save logic
      const content = editor.getHTML();

      setProgressValue(20);

      setProgressValue(30);

      const { finalContentWrapper, uploadError } = await uploadImages(
        content,
        "article"
      );

      if (uploadError || !finalContentWrapper) {
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
        slug,
        banner_url: newBannerUrl,
      };

      // Save or update the content in the translations table
      const { error } = await supabase.from("articles").insert([articleData]);

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
      <EditorSavingOverlay isSaving={isSaving} progressValue={progressValue} />
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
                <DialogTitle>배너 이미지 선택 및 퍼마링크 입력</DialogTitle>
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
                <div className="grid gap-2">
                  <Label htmlFor="slug">퍼마링크</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="퍼마링크를 입력해주세요"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {id ? (
                  <Button onClick={updateArticle} disabled={isSaving || !slug}>
                    저장
                  </Button>
                ) : (
                  <Button
                    onClick={saveArticle}
                    disabled={!selectedBannerImage || isSaving || !slug}
                  >
                    저장
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
