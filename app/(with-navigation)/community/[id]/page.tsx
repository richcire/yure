import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { createClient } from "@/utils/supabase/server";
import { IPosts } from "@/types/supabase-table";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import PostContent from "@/components/community/post-content";
import PostLike from "@/components/community/post-like";
import PostComment from "@/components/community/post-comment";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: string): Promise<IPosts | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, author_id!inner (name)")
    .eq("id", id)
    .single<IPosts>();

  if (error || !data) {
    throw new Error("Post not found");
  }

  return data;
}

export default async function CommunityPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    redirect("/404");
  }

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen pt-20 px-4">
      {/* 뒤로가기 버튼 */}
      <div className="mb-6">
        <NextLink href="/community">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            커뮤니티로 돌아가기
          </Button>
        </NextLink>
      </div>

      <article className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* 게시글 헤더 */}
        <div className="p-6 border-b border-gray-200">
          {/* 제목 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* 작성자 정보 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {post.author_id.name}
              </span>
              <span>•</span>
              <div className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                  locale: ko,
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 게시글 본문 */}
        <div className="p-6">
          <PostContent content={post.content} />
        </div>
        {/* 본문 아래 인터랙션 */}
        <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-gray-200 p-6">
          <PostLike like_count={post.like_count} id={post.id} />
          <PostComment comment_count={post.comment_count} />
        </div>
      </article>
    </div>
  );
}
