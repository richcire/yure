import PostSearch from "@/components/community/post-search";

export default function Header() {
  return (
    <header className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">커뮤니티</h1>
        <PostSearch />
      </div>
    </header>
  );
}
