import { notFound } from "next/navigation";
import { StarterKit } from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Highlight } from "@tiptap/extension-highlight";
import { renderToReactElement } from "@tiptap/static-renderer";
import { MessageCircle, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";

interface PostData {
  id: string;
  title: string;
  content: any; // Tiptap JSON content
  author: string;
  timeAgo: string;
  likes: number;
  comments: number;
}

// Mock data - 실제로는 데이터베이스에서 가져옴
const mockPosts: Record<string, PostData> = {
  "react-learning-roadmap": {
    id: "1",
    title: "신입 개발자를 위한 React 학습 로드맵 가이드",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "React 학습 로드맵" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "안녕하세요! 최근에 React를 시작하는 분들을 위해 체계적인 학습 로드맵을 정리해봤습니다. ",
            },
            {
              type: "text",
              marks: [{ type: "bold" }],
              text: "기초부터 심화까지",
            },
            {
              type: "text",
              text: " 단계별로 정리해보았으니 많은 도움이 되셨으면 좋겠습니다.",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "1단계: 기초 지식" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "HTML/CSS",
                    },
                    { type: "text", text: ": 웹의 기본 구조와 스타일링" },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "JavaScript ES6+",
                    },
                    { type: "text", text: ": 최신 자바스크립트 문법과 개념" },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Node.js/NPM",
                    },
                    { type: "text", text: ": 패키지 관리와 개발 환경 설정" },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "2단계: React 기초" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "React의 핵심 개념들을 차근차근 학습해보세요:",
            },
          ],
        },
        {
          type: "orderedList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "JSX 문법과 컴포넌트 개념" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Props와 State 관리" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    { type: "text", text: "이벤트 처리와 조건부 렌더링" },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [{ type: "italic" }],
                  text: "💡 팁: 공식 문서의 튜토리얼을 먼저 완주하는 것을 추천합니다!",
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "더 자세한 내용은 " },
            {
              type: "text",
              marks: [{ type: "link", attrs: { href: "https://react.dev" } }],
              text: "React 공식 문서",
            },
            { type: "text", text: "를 참고해주세요." },
          ],
        },
      ],
    },
    author: "개발자민수",
    timeAgo: "15분 전",
    likes: 42,
    comments: 18,
  },
  "typescript-vs-javascript": {
    id: "2",
    title: "TypeScript vs JavaScript 선택 가이드",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "프로젝트를 시작할 때 TypeScript와 JavaScript 중 어떤 것을 선택해야 할지 고민이 많으시죠? 각각의 장단점과 실무 경험을 바탕으로 가이드를 작성해봤습니다.",
            },
          ],
        },
      ],
    },
    author: "코딩초보",
    timeAgo: "15분 전",
    likes: 23,
    comments: 31,
  },
};

async function getPost(slug: string): Promise<PostData | null> {
  return mockPosts[slug] || null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CommunityPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Tiptap Static Renderer로 JSON 콘텐츠를 React 컴포넌트로 변환
  const extensions = [
    StarterKit,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-blue-600 hover:text-blue-800 underline",
      },
    }),
    Highlight,
  ];

  // JSON 콘텐츠를 직접 React 엘리먼트로 렌더링
  const renderedContent = renderToReactElement({
    extensions,
    content: post.content,
  });

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
              <span className="font-medium text-gray-900">{post.author}</span>
              <span>•</span>
              <div className="text-sm text-gray-500">{post.timeAgo}</div>
            </div>

            {/* 통계 */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 게시글 본문 */}
        <div className="p-6">
          <div>{renderedContent}</div>
        </div>
      </article>
    </div>
  );
}
