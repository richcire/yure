import { Header } from "@/components/translation/header";
import { CategoryFilter } from "@/components/translation/category-filter";
import { PaginatedSongs } from "@/components/translation/paginated-songs";
import { ITranslations } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import Link from "next/link";

const ITEMS_PER_PAGE = 12;

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function Home({ searchParams }: Props) {
  const {
    search,
    category,
    page = "1",
    sort = "created_desc",
  } = await searchParams;
  const currentPage = parseInt(page);
  const supabase = await createClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  // Build the base query
  const baseQuery = supabase
    .from("translations")
    .select("*", { count: "exact" });

  if (search) {
    baseQuery.or(`title.ilike.%${search}%,artist.ilike.%${search}%`);
  }

  if (category) {
    baseQuery.eq("category_id", category);
  }

  // Get total count
  const { count } = await baseQuery;
  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  // Determine sort column and direction
  const [column, direction] = sort.split("_");
  const sortColumn = column === "release" ? "release_date" : "created_at";
  const ascending = direction === "asc";

  // Fetch paginated data with sorting
  const { data: translations } = await baseQuery
    .order(sortColumn, { ascending })
    .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
    .returns<ITranslations[]>();

  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {categories && (
          <CategoryFilter
            categories={categories}
            selectedCategoryId={category}
          />
        )}
        {translations ? (
          <PaginatedSongs
            songs={translations}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        ) : (
          "error occurred"
        )}
      </main>
    </div>
  );
}
