import { Header } from "@/components/news/header";
import { NewsContent } from "@/components/news/news-content";
import { Suspense } from "react";

export default function NewsHomePage() {
  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen bg-background px-4 py-8">
      <Header />
      {/* Breaking News Banner */}
      {/* <div className="mb-8 bg-black px-4 py-3 text-center font-serif text-white">
        <p className="text-lg font-bold uppercase tracking-wider">
          Breaking News
        </p>
      </div> */}
      <Suspense>
        <NewsContent />
      </Suspense>
      {/* Footer */}
      {/* <footer className="mt-12 border-t-2 border-black pt-6 text-center">
          <p className="font-serif text-sm text-gray-600">
            The Daily Chronicle © {new Date().getFullYear()} | All Rights
            Reserved
          </p>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <Link href="#" className="underline hover:text-gray-800">
              About
            </Link>
            <Link href="#" className="underline hover:text-gray-800">
              Subscribe
            </Link>
            <Link href="#" className="underline hover:text-gray-800">
              Archives
            </Link>
            <Link href="#" className="underline hover:text-gray-800">
              Contact
            </Link>
          </div>
        </footer> */}
    </div>
  );
}
