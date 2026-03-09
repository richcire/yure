import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Trash2, DollarSign } from "lucide-react";
import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

export default function GoogleAd({ node, deleteNode, editor }: NodeViewProps) {
  const showControls = editor?.isEditable;
  const { client, slot, layout, format } = node.attrs;

  useEffect(() => {
    // Only execute the ad script when not in edit mode and in production
    if (!showControls && process.env.NODE_ENV === "production") {
      const timer = requestAnimationFrame(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.error("AdSense error:", err);
        }
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [showControls]);

  return (
    <NodeViewWrapper>
      <div className="relative group">
        {showControls && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
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

        <div className="w-full max-w-2xl mx-auto">
          {showControls ? (
            // Preview mode in editor
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 dark:bg-gray-800 min-h-[100px]">
              <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                <DollarSign className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Google AdSense</div>
                  <div className="text-sm">
                    Client: {client} | Slot: {slot}
                  </div>
                  <div className="text-xs mt-1">
                    Layout: {layout} | Format: {format}
                  </div>
                </div>
              </div>
            </div>
          ) : process.env.NODE_ENV !== "production" ? (
            // Dev mode placeholder in view mode
            <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg min-h-[100px] flex items-center justify-center">
              <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs">광고 영역 (개발 환경)</span>
              </div>
            </div>
          ) : (
            // Actual ad in view mode (production only)
            <ins
              className="adsbygoogle"
              style={{
                display: "block",
                textAlign: "center",
                width: "100%",
                minHeight: "100px",
              }}
              data-ad-layout={layout}
              data-ad-format={format}
              data-ad-client={client}
              data-ad-slot={slot}
            />
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
