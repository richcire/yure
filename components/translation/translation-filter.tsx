import { createClient } from "@/utils/supabase/server";
import { CategoryFilter } from "./category-filter";

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    sort?: string;
  }>;
}

async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");
  return data;
}

export default async function TranslationFilter({ searchParams }: Props) {
  const { category } = await searchParams;
  const categories = await getCategories();
  return (
    <>
      {categories && (
        <CategoryFilter
          categories={categories}
          selectedCategoryId={category ? category.split(",") : undefined}
        />
      )}
    </>
  );
}
