import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function YouTube({ node, deleteNode, editor }: NodeViewProps) {
  // Don't show controls if editor is not editable
  const showControls = editor?.isEditable;
  return (
    <NodeViewWrapper>
      <div className="flex justify-center">
        <div className="relative group" style={{ width: "100%" }}>
          {showControls && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex bg-background/80 backdrop-blur-sm rounded-md p-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:text-destructive"
                  onClick={() => deleteNode()}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          <iframe
            src={node.attrs.src}
            width="100%"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-md"
            style={{ aspectRatio: "16/9" }}
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
