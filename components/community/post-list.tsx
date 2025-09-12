import { MessageCircle, Heart } from "lucide-react";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  timeAgo: string;
  likes: number;
  comments: number;
  image?: string;
  slug: string;
}

const mockPosts: Post[] = [
  {
    id: 1,
    title: "신입 개발자를 위한 React 학습 로드맵 가이드",
    content: "기초부터 심화까지 체계적인 React 학습 방법을 정리해봤습니다",
    author: "개발자민수",
    timeAgo: "2분 전",
    likes: 42,
    comments: 18,
    image: "https://placehold.co/100x60/4F46E5/FFFFFF?text=React",
    slug: "react-learning-roadmap",
  },
  {
    id: 2,
    title: "TypeScript vs JavaScript 선택 가이드",
    content: "프로젝트에 따른 TypeScript와 JavaScript 선택 기준",
    author: "코딩초보",
    timeAgo: "15분 전",
    likes: 23,
    comments: 31,
    slug: "typescript-vs-javascript",
  },
  {
    id: 3,
    title: "2024년 프론트엔드 트렌드 분석",
    content: "올해 주목받고 있는 프론트엔드 기술들과 전망",
    author: "테크리더",
    timeAgo: "1시간 전",
    likes: 89,
    comments: 45,
    image: "https://placehold.co/100x60/1F2937/FFFFFF?text=Trend",
    slug: "frontend-trends-2024",
  },
  {
    id: 4,
    title: "카카오 2024 코딩테스트 후기",
    content: "최근 카카오 코딩테스트 문제 유형과 난이도 분석",
    author: "알고마스터",
    timeAgo: "3시간 전",
    likes: 156,
    comments: 67,
    slug: "kakao-coding-test-review",
  },
  {
    id: 5,
    title: "효율적인 Git 브랜칭 전략",
    content: "팀 프로젝트에서 활용할 수 있는 Git 워크플로우 비교",
    author: "Git마스터",
    timeAgo: "5시간 전",
    likes: 72,
    comments: 29,
    image: "https://placehold.co/100x60/10B981/FFFFFF?text=Git",
    slug: "git-branching-strategy",
  },
];

export default function PostList() {
  return (
    <div className="space-y-4 mx-auto">
      {mockPosts.map((post) => (
        <Link
          key={post.id}
          href={`/community/${post.slug}`}
          className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    {post.author}
                  </span>
                  <span>•</span>
                  <span className="text-xs">{post.timeAgo}</span>
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
                  <span>{post.likes}</span>
                </button>

                <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </button>
              </div>
            </div>

            {/* Image */}
            {post.image && (
              <div className="ml-4 flex-shrink-0">
                <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={post.image}
                    alt="Post image"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
