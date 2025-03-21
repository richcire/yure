"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { IFeaturedArticles } from "@/types/supabase-table";
import Image from "next/image";
import Link from "next/link";

export function FeaturedArticle({
  articles,
}: {
  articles: IFeaturedArticles[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <>
      <div ref={emblaRef} className="overflow-hidden h-full">
        <div className="flex h-full">
          {articles.map((article, index) => (
            <div key={article.id} className="relative flex-[0_0_100%] min-w-0">
              <Link
                href={`/article/${article.slug}`}
                aria-label={article.title}
              >
                <div className="w-full h-full relative">
                  <Image
                    src={
                      article.banner_url ||
                      article.thumbnail_url ||
                      "/assets/logos/square_high.jpeg"
                    }
                    alt={`${article.title} thumbnail`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1500px) 100vw, 50vw"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                          {article.title}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        onClick={scrollPrev}
        aria-label="Previous article"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        onClick={scrollNext}
        aria-label="Next article"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === selectedIndex ? "bg-white" : "bg-white/50"
            )}
            aria-label={`Go to article ${index + 1}`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </>
  );
}
