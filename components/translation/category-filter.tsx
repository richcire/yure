"use client";

import { Badge } from "@/components/ui/badge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SortSelect } from "./sort-select";

interface Category {
  id: number;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId?: string;
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
}: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);

    if (categoryId === selectedCategoryId) {
      // If clicking the same category, remove the filter
      params.delete("category");
    } else {
      // Otherwise, apply the new category filter
      params.set("category", categoryId);
    }
    // Reset to page 1 when changing categories
    params.delete("page");

    // Use replace instead of push to avoid adding to history stack
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={
              category.id.toString() === selectedCategoryId
                ? "default"
                : "outline"
            }
            className={`cursor-pointer`}
            onClick={() => handleCategoryClick(category.id.toString())}
          >
            {category.name}
          </Badge>
        ))}
      </div>
      <SortSelect />
    </div>
  );
}
