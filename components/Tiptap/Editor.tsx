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
import { DatePicker } from "@/components/date-picker";
import { ICategories, ITranslations } from "@/types/supabase-table";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "@tiptap/extension-link";
import { MultiSelect } from "../ui/multi-select";
import { Label } from "../ui/label";
import { InstagramExtension } from "./extensions/InstagramExtension";
import { GoogleAdExtension } from "./extensions/GoogleAdExtension";

interface CategoryOption {
  value: number;
  label: string;
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
  const [categoryId, setCategoryId] = useState<string>("2");
  const [releaseDate, setReleaseDate] = useState<Date>();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<number[]>(
    []
  );
  const [keyword, setKeyword] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [permalink, setPermalink] = useState("");
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
      InstagramExtension.configure({
        HTMLAttributes: {
          class: "rounded-md",
        },
      }),
      GoogleAdExtension.configure({
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
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name")
        .returns<ICategories[]>();

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      setCategories(
        data?.map((category) => ({
          label: category.name,
          value: category.id,
        })) || []
      );

      if (id) {
        const { data: translation, error: translationError } = await supabase
          .from("translations")
          .select("*")
          .eq("id", id)
          .single<ITranslations>();

        if (translationError) {
          console.error("Error fetching translation:", translationError);
          return;
        }

        setTitle(translation.title);
        setArtist(translation.artist);
        setReleaseDate(new Date(translation.release_date));
        setPermalink(translation.permalink);
        editor?.commands.setContent(translation.content);
      }
    };

    fetchCategories();
  }, [editor]);

  const handleSave = async () => {
    if (permalink.includes("/")) {
      alert("퍼마링크에 슬래시(/)는 포함될 수 없습니다.");
      return;
    }
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
      const translationData = {
        content: finalContent,
        title,
        artist,
        release_date: formatDate(releaseDate),
        thumbnail_url: thumbnailUrl,
        permalink,
        // 게시물 수정 시 updated_at 필드에 현재 시간 추가
        updated_at: new Date().toISOString(),
      };

      // Save or update the content in the translations table
      const { error } = id
        ? await supabase
            .from("translations")
            .update(translationData)
            .eq("id", id)
        : await supabase.rpc("insert_translation_with_categories", {
            _content: finalContent,
            _title: title,
            _artist: artist,
            _release_date: formatDate(releaseDate),
            _categories_id: selectedCategoriesIds,
            _thumbnail_url: thumbnailUrl,
            _permalink: permalink,
            _keyword: keyword,
          });

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
        <Progress
          value={progressValue}
          className="w-1/3"
          indicatorClassName="bg-white"
        />
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
              className="h-10"
              required
            />

            {id ? null : (
              <MultiSelect
                options={categories}
                onValueChange={setSelectedCategoriesIds}
                defaultValue={selectedCategoriesIds}
                placeholder="카테고리 선택"
                variant="inverted"
              />
            )}
            <DatePicker date={releaseDate} setDate={setReleaseDate} />
          </div>
          {id ? null : (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">
                "제목+아티스트"는 키워드에 기본적으로 포함됩니다. 추가적으로
                포함할 키워드만 입력하세요
              </Label>
              <Input
                placeholder="키워드 입력"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          )}
          <div className="border rounded-md border-input">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} className="p-4" />
          </div>
        </div>
        <div className="fixed bottom-4 right-4 flex gap-2">
          <Button onClick={handleCancel} className="shadow-lg">
            취소
          </Button>
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                disabled={!title || !artist || !categoryId}
                className="shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>퍼마링크 입력</DrawerTitle>
                  <DrawerDescription>
                    다른 글과 중복되면 안됩니다.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <Input
                    placeholder="퍼마링크 입력"
                    value={permalink}
                    onChange={(e) => setPermalink(e.target.value)}
                  />
                </div>
                <DrawerFooter>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !permalink}
                  >
                    저장
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline">취소</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </>
  );
}
