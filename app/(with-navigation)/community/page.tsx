import Header from "@/components/community/community-header";
import TrendingPosts from "@/components/community/trending-posts";
import PostList from "@/components/community/post-list";
import CategoryFilter from "@/components/community/category-filter";

export default function CommunityPage() {
  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen bg-background px-4 py-8 pt-20">
      <Header />
      <main>
        <TrendingPosts />
        <CategoryFilter />
        <PostList />
      </main>
    </div>
  );
}
