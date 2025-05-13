import { INews } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import squareLogo from "@/public/assets/logos/square_high.jpeg";
async function getRelatedPosts(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("created_at")
    .eq("slug", decodeURIComponent(slug))
    .single<INews>();

  if (error) return null;
  if (!data) return null;

  const previousPost = supabase
    .from("news")
    .select("title, slug, thumbnail_url")
    .lt("created_at", data.created_at)
    .order("created_at", { ascending: false })
    .limit(1)
    .single<INews>();

  const nextPost = supabase
    .from("news")
    .select("title, slug, thumbnail_url")
    .gt("created_at", data.created_at)
    .order("created_at", { ascending: true })
    .limit(1)
    .single<INews>();

  const [
    { data: previousPostData, error: previousPostError },
    { data: nextPostData, error: nextPostError },
  ] = await Promise.all([previousPost, nextPost]);

  return { previousPost: previousPostData, nextPost: nextPostData };
}

export default async function NewsRelatedPosts({ slug }: { slug: string }) {
  const relatedPosts = await getRelatedPosts(slug);
  if (!relatedPosts) return null;

  const { previousPost, nextPost } = relatedPosts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
      {previousPost && (
        <Link
          href={`/news/${previousPost.slug}`}
          className="group flex flex-col rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
        >
          <div className="text-sm text-gray-600 mb-2">이전 게시물</div>
          <div className="relative aspect-video mb-3 w-full">
            <Image
              src={previousPost.thumbnail_url || squareLogo}
              alt={previousPost.title}
              fill
              className="rounded object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <h3 className="text-lg font-semibold transition-colors mb-2">
            {previousPost.title}
          </h3>
          <span className="text-sm">← 더 보기</span>
        </Link>
      )}

      {nextPost && (
        <Link
          href={`/news/${nextPost.slug}`}
          className="group flex flex-col rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
        >
          <div className="text-sm text-gray-600 mb-2 text-right">
            다음 게시물
          </div>
          <div className="relative aspect-video mb-3 w-full">
            <Image
              src={nextPost.thumbnail_url || squareLogo}
              alt={nextPost.title}
              fill
              className="rounded object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <h3 className="text-lg text-right font-semibold transition-colors mb-2">
            {nextPost.title}
          </h3>
          <span className="text-sm text-right">더 보기 →</span>
        </Link>
      )}
    </div>
  );
}
