import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function Instagram({ node, deleteNode, editor }: NodeViewProps) {
  const showControls = editor?.isEditable;

  return (
    <NodeViewWrapper>
      <div className="flex justify-center">
        <div className="relative group" style={{ width: "100%" }}>
          {showControls && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex bg-background/80 backdrop-blur-sm rounded-md p-1 gap-1">
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
            width="350px"
            style={{ aspectRatio: "1 / 1.375" }}
            scrolling="no"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
            className="rounded-md"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
