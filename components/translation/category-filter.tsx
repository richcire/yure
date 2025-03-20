"use client";

import { Badge } from "@/components/ui/badge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SortSelect } from "./sort-select";
import { MultiSelect } from "../ui/multi-select";
import { useState } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId?: string[];
}

export function CategoryFilter({
  categories,
  selectedCategoryId = [],
}: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id.toString(),
  }));

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    selectedCategoryId || []
  );

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    const currentCategories =
      params.get("category")?.split(",").filter(Boolean) || [];

    if (currentCategories.includes(categoryId)) {
      // Remove the category if it's already selected
      const updatedCategories = currentCategories.filter(
        (id) => id !== categoryId
      );
      if (updatedCategories.length === 0) {
        params.delete("category");
      } else {
        params.set("category", updatedCategories.join(","));
      }
    } else {
      // Add the new category to existing ones
      currentCategories.push(categoryId);
      params.set("category", currentCategories.join(","));
    }

    // Reset to page 1 when changing categories
    params.delete("page");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);

    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    } else {
      params.delete("category");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="md:flex flex-wrap items-center justify-between gap-4 mb-6 mt-8 px-4">
      <div className="hidden md:flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={
              selectedCategoryId?.includes(category.id.toString())
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
      <div className="flex md:hidden items-center gap-2 mb-4">
        <MultiSelect
          options={categoryOptions}
          onValueChange={setSelectedCategories}
          defaultValue={selectedCategories}
          placeholder="카테고리 선택"
          variant="inverted"
          useCommandInput={false}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleSearch}
          className="h-10 w-10"
        >
          <Search />
        </Button>
      </div>
      <SortSelect />
    </div>
  );
}
