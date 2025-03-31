import NewsGrid from "@/components/news/news-grid";
import { PaginationControl } from "@/components/ui/pagination-control";
import { INews } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import { BottomDisplayAdWrapper } from "../google-adsense/bottom-display-ad-wrapper";
import NewsCard from "@/components/news/news-card";

const ITEMS_PER_PAGE = 9;

interface Props {
  searchParams: Promise<{
    search?: string; // 검색 키워드
    page?: string;
  }>;
}

export default async function NewsList({ searchParams }: Props) {
  const { search, page = "1" } = await searchParams;
  const currentPage = parseInt(page);
  const supabase = await createClient();

  // Build the base query
  let query = supabase.from("news").select(
    `
      id,
      title,
      slug,
      content,
      summary,
      thumbnail_url,
      user_info!inner (name),
      created_at,
      updated_at
    `,
    { count: "exact" }
  );

  if (search) {
    // Convert search term to lowercase for case-insensitive search
    const searchTerm = search.toLowerCase();
    query = query.or(`title.ilike.%${searchTerm}%`);
  }

  // Fetch paginated data with sorting
  const { data: news, count } = await query
    .order("created_at", { ascending: false })
    .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
    .returns<INews[]>();

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  return (
    <>
      {news ? (
        <>
          {currentPage === 1 ? (
            <NewsGrid news={news} />
          ) : (
            <NewsCard news={news} />
          )}
          <BottomDisplayAdWrapper />
          {totalPages > 1 && (
            <PaginationControl
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </>
      ) : (
        "게시물을 불러오는 중 오류가 발생했습니다."
      )}
    </>
  );
}
