import { ITranslations } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import { SongGrid } from "./song-grid";
import { PaginationControl } from "../ui/pagination-control";
import { BottomDisplayAdWrapper } from "../google-adsense/bottom-display-ad-wrapper";
import { BottomDisplayAd } from "../google-adsense/bottom-display-ad";
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

  // Convert comma-separated category string to array
  const categoryIds = category ? category.split(",") : [];

  // Determine sort column and direction
  const [column, direction] = sort.split("_");
  const sortColumn = column === "release" ? "release_date" : "created_at";
  const ascending = direction === "asc";

  const { data: translations, error } = await supabase
    .rpc("search_translations", {
      _search_keyword: search || "",
      _category_ids: categoryIds,
    })
    .order(sortColumn, { ascending })
    .range(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE - 1
    );

  const totalPages =
    translations.length > 0
      ? Math.ceil((translations[0].count || 0) / ITEMS_PER_PAGE)
      : 0;

  return (
    <>
      {translations ? (
        <>
          <SongGrid songs={translations} />
          <BottomDisplayAdWrapper />
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
