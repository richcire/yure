"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen p-24">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-6 text-center">유레 정책</h1>

        <Link
          href="/terms/terms-of-service"
          className="w-full p-4 bg-foreground rounded-lg shadow-sm border flex items-center justify-between  text-background"
        >
          <span className="text-lg">서비스 약관</span>
          <span className=""> → </span>
        </Link>

        <Link
          href="/terms/privacy-policy"
          className="w-full p-4 bg-foreground rounded-lg shadow-sm border flex items-center justify-between text-background"
        >
          <span className="text-lg">개인정보처리방침</span>
          <span className=""> → </span>
        </Link>
      </div>
    </div>
  );
}
