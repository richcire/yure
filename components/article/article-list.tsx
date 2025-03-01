import { ArticleGrid } from "@/components/article/article-grid";
import { PaginationControl } from "@/components/ui/pagination-control";
import { IArticles } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import { BottomDisplayAd } from "../google-adsense/bottom-display-ad";

const ITEMS_PER_PAGE = 9;

interface Props {
  searchParams: Promise<{
    search?: string; // 검색 키워드
    page?: string;
    sort?: string;
  }>;
}

export default async function ArticleList({ searchParams }: Props) {
  const { search, page = "1", sort = "created_desc" } = await searchParams;
  const currentPage = parseInt(page);
  const supabase = await createClient();

  // Build the base query
  let query = supabase.from("articles").select(
    `
            id,
            title,
            content,
            user_info!inner (name),
            created_at,
            slug,
            thumbnail_url
          `,
    { count: "exact" }
  );

  if (search) {
    // Convert search term to lowercase for case-insensitive search
    const searchTerm = search.toLowerCase();
    query = query.or(`title.ilike.%${searchTerm}%`);
  }

  // Determine sort direction
  const ascending = sort === "created_asc";

  // Fetch paginated data with sorting
  const { data: articles, count } = await query
    .order("created_at", { ascending })
    .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
    .returns<IArticles[]>();

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  return (
    <>
      {articles ? (
        <>
          <ArticleGrid articles={articles} />
          <div className="my-12 bg-white max-w-[768px] h-40 mx-auto">
            <BottomDisplayAd />
          </div>
          {totalPages > 1 && (
            <PaginationControl
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </>
      ) : (
        "Error occurred while fetching articles"
      )}
    </>
  );
}
