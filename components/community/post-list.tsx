import { MessageCircle, Heart } from "lucide-react";
import Link from "next/link";
import { IPosts } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export default async function PostList() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*, author_id!inner (name)")
    .order("created_at", { ascending: false })
    .returns<IPosts[]>();

  if (error || !posts) {
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
                <p className="text-gray-600 text-sm leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Interactions */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                  <Heart className="h-4 w-4" />
                  <span>{post.like_count}</span>
                </button>

                <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comment_count}</span>
                </button>
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
