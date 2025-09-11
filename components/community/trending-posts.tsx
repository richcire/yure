export default function TrendingPosts() {
  const posts = [
    {
      id: 1,
      title: "배고파 배고파 배고파",
      author: "YURE",
      timeAgo: "11시간 전",
      comments: 15,
    },
    {
      id: 2,
      title: "배고파 배고파 배고파",
      author: "YURE",
      timeAgo: "7시간 전",
      comments: 43,
    },
    {
      id: 3,
      title: "배고파 배고파 배고파",
      author: "YURE",
      timeAgo: "7시간 전",
      comments: 68,
    },
    {
      id: 4,
      title: "배고파 배고파 배고파",
      author: "YURE",
      timeAgo: "18시간 전",
      comments: 22,
    },
    {
      id: 5,
      title: "배고파 배고파 배고파",
      author: "YURE",
      timeAgo: "11시간 전",
      comments: 13,
    },
    {
      id: 6,
      title: "배고파 배고파 배고파",
      author: "YURE",
      timeAgo: "20시간 전",
      comments: 31,
    },
    {
      id: 7,
      title: "배고파 배고파 배고파",
      author: "YURE",
      timeAgo: "6시간 전",
      comments: 11,
    },
    {
      id: 8,
      title: "배고파 배고파 배고파",
      author: "YURE",
      timeAgo: "15시간 전",
      comments: 22,
    },
    {
      id: 9,
      title: "배고파 배고파 배고파",
      author: "YURE",
      timeAgo: "13시간 전",
      comments: 17,
    },
    {
      id: 10,
      title: "배고파 배고파 배고파",
      author: "YURE",
      timeAgo: "15시간 전",
      comments: 10,
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-gray-900">인기글</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        {/* Left Column - Posts 1-5 */}
        <div className="space-y-4">
          {posts.slice(0, 5).map((post, index) => (
            <div
              key={post.id}
              className="flex items-start gap-3 group cursor-pointer"
            >
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-800">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500">{post.author}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-[10px] text-gray-400">
                    {post.timeAgo}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                  {post.title}
                  <span className="ml-2 text-blue-500 font-bold">
                    {post.comments}
                  </span>
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Posts 6-10 */}
        <div className="space-y-4 mt-4 md:mt-0 hidden md:block">
          {posts.slice(5, 10).map((post, index) => (
            <div
              key={post.id}
              className="flex items-start gap-3 group cursor-pointer"
            >
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-800">
                  {index + 6}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500">{post.author}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-[10px] text-gray-400">
                    {post.timeAgo}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                  {post.title}
                  <span className="ml-2 text-blue-500 font-bold">
                    {post.comments}
                  </span>
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
