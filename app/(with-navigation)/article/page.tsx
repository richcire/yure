import { ArticleGrid } from "@/components/article/article-grid";
import { Header } from "@/components/article/header";
import { PaginationControl } from "@/components/ui/pagination-control";
import { IArticles } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";

const ITEMS_PER_PAGE = 9;

interface Props {
  searchParams: Promise<{
    search?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function ArticleHomePage({ searchParams }: Props) {
  const { search, page = "1", sort = "created_desc" } = await searchParams;
  const currentPage = parseInt(page);
  const supabase = await createClient();

  // Build the base query
  const baseQuery = supabase.from("articles").select(
    `
      id,
      title,
      content,
      user_info (name),
      created_at,
      slug,
      thumbnail_url
    `,
    { count: "exact" }
  );

  if (search) {
    baseQuery.or(`title.ilike.%${search}%,user_info.name.ilike.%${search}%`);
  }

  // Get total count
  const { count } = await baseQuery;
  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  // Determine sort direction
  const ascending = sort === "created_asc";

  // Fetch paginated data with sorting
  const { data: articles } = await baseQuery
    .order("created_at", { ascending })
    .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
    .returns<IArticles[]>();

  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {articles ? (
          <>
            <ArticleGrid articles={articles} />
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
      </main>
    </div>
  );
}
