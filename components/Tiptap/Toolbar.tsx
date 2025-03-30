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
        alert("Please enter a valid YouTube URL");
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

  return (
    <div className="fixed top-0 left-0 right-0 h-16 flex justify-center bg-white/40 backdrop-blur-sm shadow-sm z-20">
      <div className="flex flex-wrap gap-2 p-2">
        {[1, 2, 3].map((level) => (
          <Button
            key={level}
            size="sm"
            variant={
              editor.isActive("heading", { level }) ? "secondary" : "ghost"
            }
            onClick={() => {
              const { from, to } = editor.state.selection;
              editor
                .chain()
                .focus()
                .toggleHeading({ level: level as 1 | 2 | 3 })
                .run();

              setTimeout(() => {
                editor.commands.setTextSelection({ from, to });
                editor.commands.focus();
              }, 0);
            }}
          >
            {level === 1 && <Heading1 className="h-4 w-4" />}
            {level === 2 && <Heading2 className="h-4 w-4" />}
            {level === 3 && <Heading3 className="h-4 w-4" />}
          </Button>
        ))}
        <Button
          size="sm"
          variant={editor.isActive("paragraph") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <Type className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-2" />

        <Button
          size="sm"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("strike") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("highlight") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <MinusSquare className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-2" />

        <Button
          size="sm"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <TextQuote className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("link") ? "secondary" : "ghost"}
          onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
              return;
            }

            const url = window.prompt("Enter URL:");

            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
        >
          <Link className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-2" />

        <Button
          size="sm"
          variant={
            editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"
          }
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={
            editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"
          }
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={
            editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"
          }
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-2" />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => handleImageUpload(e as any);
            input.click();
          }}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost">
              <Youtube className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                Embed YouTube Video
              </DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              <Input
                placeholder="YouTube URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <Button onClick={handleYoutubeEmbed}>Embed</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost">
              <Instagram className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                Embed Instagram Code
              </DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              <Input
                placeholder={'<blockquote class="instagram-media" ...>'}
                value={instagramEmbedCode}
                onChange={(e) => setInstagramEmbedCode(e.target.value)}
              />
              <Button onClick={handleInstagramEmbedCode}>Insert Code</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
