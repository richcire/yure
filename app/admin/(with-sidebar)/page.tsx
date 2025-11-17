"use client";

import { runWorkflow } from "@/utils/ai/auto-post";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    keyword: "",
    permalink: "",
    releaseDate: "",
    youtubeKey: "",
    lyrics: "",
    artistInContent: "",
  });

  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleThumbnailImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailImage(file);
    }
  };

  const validateForm = () => {
    return (
      formData.title.length > 0 &&
      formData.artist.length > 0 &&
      formData.permalink.length > 0 &&
      formData.lyrics.length > 0
    );
  };

  const handleOpen = () => {
    const autoPost = document.getElementById("autoPost");
    if (autoPost) {
      (autoPost as HTMLDialogElement).showModal();
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      artist: "",
      keyword: "",
      permalink: "",
      releaseDate: "",
      youtubeKey: "",
      lyrics: "",
      artistInContent: "",
    });
    setThumbnailImage(null);
    const autoPost = document.getElementById("autoPost");
    if (autoPost) {
      (autoPost as HTMLDialogElement).close();
    }
  };

  const uploadThumbnailImage = async (file: File) => {
    const supabase = createClient();
    const fileName = `translation/${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file);
    const {
      data: { publicUrl: thumbnailUrl },
    } = await supabase.storage.from("images").getPublicUrl(fileName);
    return thumbnailUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    handleClose();
    setIsLoading(true);
    toast("액션 수행 중...", {
      description:
        "가사를 번역하고 데이터베이스에 넣는 중입니다. 잠시만 기다려주세요. (5~10분 소요)",
      style: {
        color: "#3f3f3f !important",
      },
    });
    const response = await fetch("/api/autopost", {
      method: "POST",
      body: JSON.stringify({ input_as_text: formData.lyrics }),
    });
    const translatedLyrics = (await response.json()).html;

    let thumbnailUrl = "";
    if (thumbnailImage) {
      thumbnailUrl = await uploadThumbnailImage(thumbnailImage);
    }

    const finalContent = makeFinalContent(
      translatedLyrics,
      formData.youtubeKey,
      formData.artistInContent,
      thumbnailUrl
    );
    await insertDataToSupabase(finalContent, thumbnailUrl);

    toast("액션 완료", {
      description: "작업이 완료되었습니다.",
    });

    setIsLoading(false);
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

  const insertDataToSupabase = async (
    finalContent: string,
    thumbnailUrl: string
  ) => {
    const supabase = createClient();
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
  };

  return (
    <>
      <dialog
        id="autoPost"
        className="backdrop:bg-black/50 rounded-lg shadow-lg max-w-2xl w-full"
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                자동 포스트 생성
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                AI를 통해 자동으로 포스트를 생성합니다
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Artist Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 font-medium">
                  제목 <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="예: 신곡 타이틀"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist" className="text-gray-700 font-medium">
                  아티스트 <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="예: BTS"
                  id="artist"
                  value={formData.artist}
                  onChange={handleChange}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Keyword and Permalink Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keyword" className="text-gray-700 font-medium">
                  키워드
                </Label>
                <Input
                  type="text"
                  placeholder="예: 신곡, K-pop"
                  id="keyword"
                  value={formData.keyword}
                  onChange={handleChange}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="permalink"
                  className="text-gray-700 font-medium"
                >
                  퍼마링크 <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="예: bts-new-song"
                  id="permalink"
                  value={formData.permalink}
                  onChange={handleChange}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Release Date */}
            <div className="space-y-2">
              <Label
                htmlFor="releaseDate"
                className="text-gray-700 font-medium"
              >
                발매일
              </Label>
              <Input
                type="text"
                placeholder="예: 2024-01-15"
                id="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* youtube key value */}
            <div className="space-y-2">
              <Label
                htmlFor="releaseDate"
                className="text-gray-700 font-medium"
              >
                YouTube 키 값
              </Label>
              <Input
                type="text"
                placeholder="예: AIzaSyD-9tSrQfXuz1KZ-U3O6jp2Tb0oAI3xBWM"
                id="youtubeKey"
                value={formData.youtubeKey}
                onChange={handleChange}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* thumbnail image value */}
            <div className="space-y-2">
              <Label
                htmlFor="releaseDate"
                className="text-gray-700 font-medium"
              >
                썸네일 이미지
              </Label>
              <Input
                type="file"
                id="thumbnailImage"
                onChange={handleThumbnailImageChange}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Artist in Content */}
            <div className="space-y-2">
              <Label
                htmlFor="artistInContent"
                className="text-gray-700 font-medium"
              >
                본문 내 아티스트
              </Label>
              <Textarea
                placeholder="본문에 포함될 아티스트 정보를 입력하세요"
                id="artistInContent"
                value={formData.artistInContent}
                onChange={handleChange}
                className="min-h-24 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Lyrics */}
            <div className="space-y-2">
              <Label htmlFor="lyrics" className="text-gray-700 font-medium">
                가사 원문 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="번역할 가사를 입력하세요"
                id="lyrics"
                value={formData.lyrics}
                onChange={handleChange}
                className="min-h-32 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">
                가사가 없으면 AI가 내용을 생성할 수 없습니다
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={!validateForm()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {validateForm() ? "생성" : "모든 필드를 입력해주세요"}
              </Button>
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                className="px-6"
              >
                닫기
              </Button>
            </div>
          </form>
        </div>
      </dialog>
      <Button onClick={handleOpen} className="bg-blue-600 hover:bg-blue-700">
        자동 포스트 생성
      </Button>
      {isLoading && (
        <div className="bg-black/50 w-screen h-screen absolute top-0 left-0 z-50 flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </>
  );
}
