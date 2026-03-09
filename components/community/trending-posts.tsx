import { createClient } from "@/utils/supabase/server";
import { IPosts } from "@/types/supabase-table";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export default async function TrendingPosts() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*, author_id!inner (name)")
    .order("like_count", { ascending: false })
    .returns<IPosts[]>();

  if (error || !posts) {
    throw new Error("Failed to fetch trending posts");
  }

  return (
    <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-gray-900">인기글</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        {/* Left Column - Posts 1-5 */}
        <div className="space-y-4">
          {posts.slice(0, 5).map((post, index) => (
            <Link
              key={post.id}
              href={`/community/${post.id}`}
              className="flex items-start gap-3 group cursor-pointer"
            >
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-800">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500">
                    {post.author_id.name}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-[10px] text-gray-400">
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                  {post.title}
                  <span className="ml-2 text-blue-500 font-bold">
                    {post.comment_count}
                  </span>
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Column - Posts 6-10 */}
        <div className="space-y-4 mt-4 md:mt-0 hidden md:block">
          {posts.slice(5, 10).map((post, index) => (
            <Link
              key={post.id}
              href={`/community/${post.id}`}
              className="flex items-start gap-3 group cursor-pointer"
            >
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-800">
                  {index + 6}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500">
                    {post.author_id.name}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-[10px] text-gray-400">
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                  {post.title}
                  <span className="ml-2 text-blue-500 font-bold">
                    {post.comment_count}
                  </span>
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
