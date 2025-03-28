import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Instagram2({
  node,
  deleteNode,
  editor,
}: NodeViewProps) {
  const showControls = editor?.isEditable;
  const embedCode = node.attrs.embedCode || "";
  const embedContainerRef = useRef<HTMLDivElement>(null);

  // Function to directly inject the embed code
  const injectEmbedCode = () => {
    if (embedContainerRef.current) {
      embedContainerRef.current.innerHTML = embedCode;
    }
  };

  // Add TypeScript interface for Instagram embed script
  interface InstagramWindow extends Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }

  // 인스타그램 임베드 코드 주입 및 스크립트 로드
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 임베드 코드 주입
    injectEmbedCode();

    // 인스타그램 스크립트 로드 및 처리
    const loadInstagramScript = () => {
      const existingScript = document.getElementById("instagram-embed-script");

      if (!existingScript) {
        // 스크립트가 없으면 새로 생성
        const script = document.createElement("script");
        script.id = "instagram-embed-script";
        script.src = "//www.instagram.com/embed.js";
        script.async = true;
        script.onload = processEmbeds;
        document.body.appendChild(script);
      } else {
        // 스크립트가 이미 있으면 바로 처리
        processEmbeds();
      }
    };

    // 임베드 처리 함수
    const processEmbeds = () => {
      const instagramWindow = window as InstagramWindow;
      if (instagramWindow.instgrm) {
        instagramWindow.instgrm.Embeds.process();
      }
    };

    // 즉시 실행
    loadInstagramScript();

    // 백업용 타이머 (스크립트 로딩이 지연될 경우를 대비)
    const fallbackTimer = setTimeout(processEmbeds, 1000);

    return () => clearTimeout(fallbackTimer);
  }, [embedCode]);

  return (
    <NodeViewWrapper>
      <div className="flex justify-center">
        <div className="relative group w-full">
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

          <div
            ref={embedContainerRef}
            className="instagram-embed-container w-full min-h-[360px] rounded-md"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
