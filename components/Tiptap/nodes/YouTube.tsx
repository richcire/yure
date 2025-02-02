import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function YouTube({ node, deleteNode, editor }: NodeViewProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const videoRef = useRef<HTMLDivElement>(null);
  const showControls = editor?.isEditable;

  useEffect(() => {
    // Set initial render to false after a small delay to ensure component is mounted
    const timer = setTimeout(() => {
      setIsInitialRender(false);
    }, 100);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!isInitialRender) {
          setIsSticky(!entry.isIntersecting);
        }
      },
      {
        threshold: 0,
        rootMargin: "-50px 0px 0px 0px",
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
      clearTimeout(timer);
    };
  }, [isInitialRender]);

  return (
    <NodeViewWrapper>
      <div className="flex justify-center" ref={videoRef}>
        <div
          className={`relative group ${!isInitialRender && isSticky ? "sticky-video" : ""}`}
          style={{ width: "100%" }}
        >
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
            className={`rounded-md ${!isInitialRender && isSticky ? "sticky-iframe" : ""}`}
            style={{ aspectRatio: "16/9" }}
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
