import Header from "@/components/news/header";
import NewsGrid from "@/components/news/news-grid";
import { Suspense } from "react";

export default function NewsHomePage() {
  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen bg-background px-4 py-8">
      <Header />
      <Suspense>
        <NewsGrid />
      </Suspense>
    </div>
  );
}
