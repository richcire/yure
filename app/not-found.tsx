import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-foreground">404</h1>
          <h2 className="text-3xl font-semibold text-foreground">
            페이지를 찾을 수 없습니다.
          </h2>
          <p className="text-muted-foreground text-lg">
            앗! 찾으시는 페이지가 없습니다.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-80 transition-opacity duration-200"
        >
          <Home size={20} />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
