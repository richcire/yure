import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Image({
  node,
  updateAttributes,
  editor,
}: NodeViewProps) {
  const [width, setWidth] = useState(node.attrs.width || "100%");
  const textAlign = node.attrs.textAlign as "left" | "center" | "right";

  // Don't show controls if editor is not editable
  const showControls = editor?.isEditable;

  const handleResize = (newWidth: string) => {
    setWidth(newWidth);
    updateAttributes({ width: newWidth });
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

  return (
    <NodeViewWrapper>
      <div className={`flex ${alignmentClasses[textAlign]}`}>
        <div className="relative group" style={{ width }}>
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
              <div className="bg-background/80 backdrop-blur-sm rounded-md p-1">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={parseInt(width)}
                  onChange={(e) => handleResize(`${e.target.value}%`)}
                  className="w-24"
                />
              </div>
            </div>
          )}
          <img
            src={node.attrs.src || ""}
            alt={node.attrs.alt || ""}
            title={node.attrs.title}
            style={{ width: "100%" }}
            className="max-w-full rounded-md"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
