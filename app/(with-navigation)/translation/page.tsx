import { Header } from "@/components/translation/header";
import { CategoryFilter } from "@/components/translation/category-filter";
import { ITranslations } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import { SongGrid } from "@/components/translation/song-grid";
import { PaginationControl } from "@/components/ui/pagination-control";

const ITEMS_PER_PAGE = 8;

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function TranslationHomePage({ searchParams }: Props) {
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
  const baseQuery = supabase.from("translations").select(
    `
        id,
        title,
        artist,
        category_id,
        thumbnail_url,
        permalink,
        created_at,
        release_date
      `,
    { count: "exact" }
  );

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
          <>
            <SongGrid songs={translations} />
            {totalPages > 1 && (
              <PaginationControl
                currentPage={currentPage}
                totalPages={totalPages}
              />
            )}
          </>
        ) : (
          "error occurred"
        )}
      </main>
    </div>
  );
}
