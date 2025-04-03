import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Trash2, VideoOff, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function YouTube({
  node,
  deleteNode,
  updateAttributes,
  editor,
}: NodeViewProps) {
  //   const [aspectRatio, setAspectRatio] = useState(
  //     node.attrs.aspectRatio || "16/9"
  //   );
  const [isSticky, setIsSticky] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isFolded, setIsFolded] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const showControls = editor?.isEditable;
  const aspectRatio = node.attrs.aspectRatio || "16/9";
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("admin")) {
      return;
    }
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

  const aspectRatioClasses: Record<string, string> = {
    "4/3": "aspect-[4/3]",
    "16/9": "aspect-[16/9]",
    "21/9": "aspect-[21/9]",
  };

  //   const updateAspectRatio = (newRatio: string) => {
  //     setAspectRatio(newRatio);
  //     updateAttributes({ aspectRatio: newRatio });
  //   };

  return (
    <NodeViewWrapper>
      <div ref={videoRef}>
        <div
          className={`relative group ${
            !isInitialRender && isSticky
              ? `sticky-video ${isFolded ? "folded" : ""}`
              : ""
          } aspect-[${aspectRatio}]`}
          style={{ width: "100%" }}
        >
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
                <Button
                  size="icon"
                  variant={aspectRatio === "4/3" ? "secondary" : "ghost"}
                  className="h-8 w-8"
                  onClick={() => updateAttributes({ aspectRatio: "4/3" })}
                >
                  4:3
                </Button>
                <Button
                  size="icon"
                  variant={aspectRatio === "16/9" ? "secondary" : "ghost"}
                  className="h-8 w-8"
                  onClick={() => updateAttributes({ aspectRatio: "16/9" })}
                >
                  16:9
                </Button>
                <Button
                  size="icon"
                  variant={aspectRatio === "21/9" ? "secondary" : "ghost"}
                  className="h-8 w-8"
                  onClick={() => updateAttributes({ aspectRatio: "21/9" })}
                >
                  21:9
                </Button>
              </div>
            </div>
          )}
          {!showControls && isSticky && !isInitialRender && (
            <Button
              size="icon"
              variant="secondary"
              className={`sticky-video-button ${isFolded ? "folded" : ""}`}
              onClick={() => setIsFolded(!isFolded)}
            >
              {isFolded ? (
                <Video className="h-4 w-4" />
              ) : (
                <VideoOff className="h-4 w-4" />
              )}
            </Button>
          )}
          <iframe
            src={node.attrs.src}
            width="100%"
            data-aspect-ratio={aspectRatio}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={`rounded-md ${
              !pathname.includes("admin") && !isInitialRender && isSticky
                ? "sticky-iframe"
                : ""
            } aspect-[${aspectRatio}]`}
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
