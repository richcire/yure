"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  TextQuote,
  Image as ImageIcon,
  Youtube,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  MinusSquare,
  Type,
  Link,
  Instagram,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ToolbarProps {
  editor: Editor | null;
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [instagramEmbedCode, setInstagramEmbedCode] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          editor
            .chain()
            .focus()
            .insertContent({
              type: "image",
              attrs: { src: reader.result },
            })
            .run();
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    return null;
  };

  const handleYoutubeEmbed = () => {
    if (youtubeUrl) {
      const embedUrl = getYoutubeEmbedUrl(youtubeUrl);
      if (!embedUrl) {
        return;
      }

      editor
        .chain()
        .focus()
        .insertContent({
          type: "youtube",
          attrs: {
            src: embedUrl,
            aspectRatio: youtubeUrl.includes("shorts") ? "9/16" : "16/9",
          },
        })
        .run();
      setYoutubeUrl("");
    }
  };

  const handleInstagramEmbedCode = () => {
    if (instagramEmbedCode) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "instagram",
          attrs: {
            embedCode: instagramEmbedCode,
          },
        })
        .run();
      setInstagramEmbedCode("");
    }
  };

  const handleGoogleAdInsert = () => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: "googleAd",
        attrs: {
          client: "ca-pub-4738868818137222",
          slot: "2891582134",
          layout: "in-article",
          format: "fluid",
        },
      })
      .run();
  };

  const handleLinkSet = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkUrl("");
    setIsLinkDialogOpen(false);
  };

  const handleLinkButtonClick = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    setIsLinkDialogOpen(true);
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 flex justify-center bg-background/40 backdrop-blur-sm shadow-sm z-20">
      <div className="flex flex-wrap gap-2 p-2">
        {([1, 2, 3] as const).map((level) => (
          <Button
            key={level}
            size="sm"
            aria-label={`제목 ${level}`}
            aria-pressed={editor.isActive("heading", { level })}
            variant={
              editor.isActive("heading", { level }) ? "secondary" : "ghost"
            }
            onClick={() => {
              const { from, to } = editor.state.selection;
              editor
                .chain()
                .focus()
                .toggleHeading({ level })
                .run();

              setTimeout(() => {
                editor.commands.setTextSelection({ from, to });
                editor.commands.focus();
              }, 0);
            }}
          >
            {level === 1 && <Heading1 className="h-4 w-4" aria-hidden="true" />}
            {level === 2 && <Heading2 className="h-4 w-4" aria-hidden="true" />}
            {level === 3 && <Heading3 className="h-4 w-4" aria-hidden="true" />}
          </Button>
        ))}
        <Button
          size="sm"
          aria-label="본문"
          aria-pressed={editor.isActive("paragraph")}
          variant={editor.isActive("paragraph") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <Type className="h-4 w-4" aria-hidden="true" />
        </Button>

        <div className="w-px h-6 bg-border mx-2" />

        <Button
          size="sm"
          aria-label="굵게"
          aria-pressed={editor.isActive("bold")}
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          aria-label="기울임"
          aria-pressed={editor.isActive("italic")}
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          aria-label="취소선"
          aria-pressed={editor.isActive("strike")}
          variant={editor.isActive("strike") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" aria-hidden="true" />
        </Button>

        <Button
          size="sm"
          aria-label="하이라이트"
          aria-pressed={editor.isActive("highlight")}
          variant={editor.isActive("highlight") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="h-4 w-4" aria-hidden="true" />
        </Button>

        <Button
          size="sm"
          aria-label="수평선"
          variant="ghost"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <MinusSquare className="h-4 w-4" aria-hidden="true" />
        </Button>

        <div className="w-px h-6 bg-border mx-2" />

        <Button
          size="sm"
          aria-label="글머리 기호 목록"
          aria-pressed={editor.isActive("bulletList")}
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          aria-label="번호 목록"
          aria-pressed={editor.isActive("orderedList")}
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          aria-label="인용구"
          aria-pressed={editor.isActive("blockquote")}
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <TextQuote className="h-4 w-4" aria-hidden="true" />
        </Button>

        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              aria-label={editor.isActive("link") ? "링크 제거" : "링크 추가"}
              aria-pressed={editor.isActive("link")}
              variant={editor.isActive("link") ? "secondary" : "ghost"}
              onClick={handleLinkButtonClick}
            >
              <Link className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>링크 추가</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              <Input
                placeholder="https://..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLinkSet();
                }}
                autoFocus
              />
              <Button onClick={handleLinkSet}>확인</Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="w-px h-6 bg-border mx-2" />

        <Button
          size="sm"
          aria-label="텍스트 왼쪽 정렬"
          aria-pressed={editor.isActive({ textAlign: "left" })}
          variant={
            editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"
          }
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          aria-label="텍스트 가운데 정렬"
          aria-pressed={editor.isActive({ textAlign: "center" })}
          variant={
            editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"
          }
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          aria-label="텍스트 오른쪽 정렬"
          aria-pressed={editor.isActive({ textAlign: "right" })}
          variant={
            editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"
          }
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" aria-hidden="true" />
        </Button>

        <div className="w-px h-6 bg-border mx-2" />

        <Button
          size="sm"
          aria-label="이미지 삽입"
          variant="ghost"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => handleImageUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
            input.click();
          }}
        >
          <ImageIcon className="h-4 w-4" aria-hidden="true" />
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" aria-label="YouTube 삽입">
              <Youtube className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>YouTube 삽입</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              <Input
                placeholder="YouTube URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <Button onClick={handleYoutubeEmbed}>삽입</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" aria-label="Instagram 삽입">
              <Instagram className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Instagram 삽입</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              <Input
                placeholder={'<blockquote class="instagram-media" ...>'}
                value={instagramEmbedCode}
                onChange={(e) => setInstagramEmbedCode(e.target.value)}
              />
              <Button onClick={handleInstagramEmbedCode}>삽입</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button size="sm" variant="ghost" aria-label="광고 블록 삽입" onClick={handleGoogleAdInsert}>
          <DollarSign className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
