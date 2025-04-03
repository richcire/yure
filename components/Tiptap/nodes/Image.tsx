import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useState, useEffect } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  PanelLeft,
  PanelRight,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ImageNode({
  node,
  updateAttributes,
  editor,
}: NodeViewProps) {
  const [inputWidth, setInputWidth] = useState(
    node.attrs.width.replace("%", "") || "100"
  );
  const textAlign = node.attrs.textAlign as "left" | "center" | "right";
  const float = node.attrs.float as "none" | "left" | "right";
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  // Don't show controls if editor is not editable
  const showControls = editor?.isEditable;

  const handleResize = () => {
    if (inputWidth === "") {
      setInputWidth("100");
      updateAttributes({ width: "100%" });
      return;
    }

    if (/^\d*$/.test(inputWidth)) {
      let normalizedValue = parseInt(inputWidth || "1");
      // Clamp value between 1 and 100
      normalizedValue = Math.max(1, Math.min(100, normalizedValue));
      setInputWidth(`${normalizedValue}`);
      updateAttributes({ width: `${normalizedValue}%` });
    } else {
      setInputWidth("100");
      updateAttributes({ width: "100%" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleResize();
    }
  };

  const alignmentClasses: Record<typeof textAlign, string> = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  const controlsAlignment: Record<typeof textAlign, string> = {
    left: "left-0",
    center: "left-1/2 -translate-x-1/2",
    right: "right-0",
  };

  useEffect(() => {
    if (node.attrs.src) {
      const img = new window.Image();
      img.src = node.attrs.src;
      img.onload = () => {
        setAspectRatio(img.width / img.height);
      };
    }
  }, [node.attrs.src]);

  return (
    <NodeViewWrapper>
      <div className={`flex my-8 ${alignmentClasses[textAlign]}`}>
        <div className="relative group" style={{ width: node.attrs.width }}>
          {showControls && (
            <div
              className={`absolute -top-12 ${controlsAlignment[textAlign]} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1`}
            >
              <div className="flex bg-background/80 backdrop-blur-sm rounded-md p-1 gap-1">
                <Button
                  size="icon"
                  variant={textAlign === "left" ? "secondary" : "ghost"}
                  className="h-8 w-8"
                  onClick={() => updateAttributes({ textAlign: "left" })}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={textAlign === "center" ? "secondary" : "ghost"}
                  className="h-8 w-8"
                  onClick={() => updateAttributes({ textAlign: "center" })}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={textAlign === "right" ? "secondary" : "ghost"}
                  className="h-8 w-8"
                  onClick={() => updateAttributes({ textAlign: "right" })}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-background/80 backdrop-blur-sm rounded-md p-1 flex items-center border border-border">
                <input
                  type="text"
                  value={inputWidth}
                  onChange={(e) => setInputWidth(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-16 h-8 px-2 bg-background rounded-md text-sm"
                  placeholder="100"
                />
                <span className="ml-1">%</span>
              </div>
            </div>
          )}
          {/* <img
            src={node.attrs.src || ""}
            alt={node.attrs.alt || ""}
            title={node.attrs.title}
            style={{ width: "100%" }}
            className="max-w-full rounded-md"
          /> */}
          {/* 이미지를 nextjs/image로 렌더링  */}
          <div
            className="relative w-full"
            style={{
              width: "100%",
              aspectRatio: aspectRatio || "auto",
            }}
          >
            <Image
              src={node.attrs.src || ""}
              alt={node.attrs.alt || ""}
              title={node.attrs.title}
              fill
              sizes="(max-width: 1200px) 100vw, 50vw"
              className="object-contain rounded-md m-0"
              priority={true}
            />
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
