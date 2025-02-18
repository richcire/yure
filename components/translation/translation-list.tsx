import { ITranslations } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import { CategoryFilter } from "./category-filter";
import { SongGrid } from "./song-grid";
import { PaginationControl } from "../ui/pagination-control";

const ITEMS_PER_PAGE = 8;

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function TranslationList({ searchParams }: Props) {
  // Move all the data fetching logic here
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
    <>
      {categories && (
        <CategoryFilter categories={categories} selectedCategoryId={category} />
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
    </>
  );
}
