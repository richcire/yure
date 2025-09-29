import Header from "@/components/community/community-header";
import TrendingPosts from "@/components/community/trending-posts";
import PostList from "@/components/community/post-list";
import CategoryFilter from "@/components/community/category-filter";

interface Props {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function CommunityPage({ searchParams }: Props) {
  const { search } = await searchParams;

  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen px-4 py-8 pt-20">
      <Header />
      <main>
        {!search ? (
          <>
            <TrendingPosts />
            <CategoryFilter />
            <PostList searchParams={searchParams} />
          </>
        ) : (
          <PostList searchParams={searchParams} />
        )}
      </main>
    </div>
  );
}
