import { MessageCircle, Heart } from "lucide-react";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  timeAgo: string;
  likes: number;
  comments: number;
  image?: string;
}

const mockPosts: Post[] = [
  {
    id: 1,
    title: "배고파",
    content: "배고파",
    author: "YURE",
    timeAgo: "1분 전",
    likes: 0,
    comments: 0,
    image: "https://placehold.co/100x60",
  },
  {
    id: 2,
    title: "배고파",
    content: "배고파 배고파 배고파",
    author: "YURE",
    timeAgo: "1분 전",
    likes: 1,
    comments: 0,
  },
  {
    id: 3,
    title: "배고파",
    content: "배고파",
    author: "YURE",
    timeAgo: "4분 전",
    likes: 6,
    comments: 1,
    image: "https://placehold.co/100x60",
  },
  {
    id: 4,
    title: "배고파",
    content: "배고파 배고파 배고파",
    author: "YURE",
    timeAgo: "15분 전",
    likes: 12,
    comments: 8,
  },
  {
    id: 5,
    title: "배고파",
    content: "배고파",
    author: "YURE",
    timeAgo: "32분 전",
    likes: 8,
    comments: 3,
    image: "https://placehold.co/100x60",
  },
];

export default function PostList() {
  return (
    <div className="space-y-4 mx-auto">
      {mockPosts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
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
        </div>
      ))}
    </div>
  );
}
