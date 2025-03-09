import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-gray-900">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800">
            페이지를 찾을 수 없습니다.
          </h2>
          <p className="text-gray-600 text-lg">
            앗! 찾으시는 페이지가 없습니다.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          <Home size={20} />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
