import Link from "next/link";
import { IPosts } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import PostLike from "@/components/community/post-like";
import PostComment from "@/components/community/post-comment";

interface Props {
  searchParams: Promise<{
    search?: string;
    sort?: string;
  }>;
}

export default async function PostList({ searchParams }: Props) {
  const { search, sort = "created_desc" } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("posts").select(
    `
      id,
      title,
      content,
      author_id!inner (name),
      created_at,
      like_count,
      comment_count
    `,
    { count: "exact" }
  );

  // 대소문자 구분 없이 검색
  if (search) {
    const searchTerm = search.toLowerCase();
    query = query.or(`title.ilike.%${searchTerm}%`);
  }

  if (sort === "hot") {
    query = query.order("comment_count", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: posts } = await query
    .order("created_at", { ascending: false })
    .returns<IPosts[]>();

  if (!posts) {
    throw new Error("Failed to fetch posts");
  }

  return (
    <div className="space-y-4 mx-auto">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/community/${post.id}`}
          className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    {post.author_id.name}
                  </span>
                  <span>•</span>
                  <span className="text-xs">
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 mb-1 text-lg leading-tight">
                  {post.title}
                </h3>
                <div className="text-gray-600 text-sm leading-relaxed line-clamp-3 md:line-clamp-2">
                  {post.content.replace(/<[^>]*>/g, " ").trim()}
                </div>
              </div>

              {/* Interactions */}
              <div className="flex items-center gap-6 text-sm text-gray-500 z-50">
                <PostLike like_count={post.like_count} id={post.id} />
                <PostComment comment_count={post.comment_count} />
              </div>
            </div>

            {/* Image */}
            {/* {post.banner_url && (
              <div className="ml-4 flex-shrink-0">
                <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={post.thumbnail_url}
                    alt="Post image"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )} */}
          </div>
        </Link>
      ))}
    </div>
  );
}
