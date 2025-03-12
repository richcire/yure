import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Tag, Share2, Printer } from "lucide-react";
import { news } from "@/app/(with-navigation)/news/data";
import RelatedNews from "@/components/news/related-news";

interface NewsPageProps {
  params: {
    id: string;
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { id } = await params;

  const newsArticle = news.find((newsArticle) => newsArticle.id === id);

  if (!newsArticle) {
    notFound();
  }

  // Generate some dummy paragraphs for the news content
  const paragraphs = generateNewsContent();

  // Get related news (excluding current one)
  const related = news
    .filter((a) => a.id !== newsArticle.id)
    .filter((a) => a.category === newsArticle.category || Math.random() > 0.5)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with navigation */}
        <header className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/news"
              className="flex items-center gap-2 text-sm font-medium hover:text-gray-600"
            >
              <ArrowLeft className="h-4 w-4" />앞 페이지로 돌아가기
            </Link>
            <div className="font-serif text-sm italic text-gray-600">
              YureNews
            </div>
          </div>

          {/* News category */}
          <div className="mb-4">
            <span className="inline-block bg-black px-3 py-1 font-serif text-sm font-bold uppercase text-white">
              {newsArticle.category}
            </span>
          </div>

          {/* News title */}
          <h1 className="mb-4 font-serif text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            {newsArticle.title}
          </h1>

          {/* News metadata */}
          <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-gray-300 pb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>By {newsArticle.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{newsArticle.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>{newsArticle.category}</span>
            </div>
          </div>
        </header>

        {/* News image */}
        <div className="mb-8">
          <Image
            src={newsArticle.image || "/placeholder.svg?height=500&width=1000"}
            alt={newsArticle.title}
            width={1000}
            height={500}
            className="h-auto w-full rounded-sm object-cover"
          />
          <p className="mt-2 text-center text-sm italic text-gray-600">
            Photo: The Daily Chronicle Archives
          </p>
        </div>

        {/* News content */}
        <div className="article-content mb-12">
          {/* Lead paragraph with drop cap */}
          <p className="mb-6 font-serif text-lg leading-relaxed">
            <span className="float-left mr-2 font-serif text-6xl font-bold leading-none">
              {newsArticle.excerpt.charAt(0)}
            </span>
            {newsArticle.excerpt.substring(1)}
          </p>

          {/* Rest of the news */}
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`mb-6 font-serif leading-relaxed ${index === 2 ? "italic border-l-4 border-black pl-4 py-2" : ""}`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* News actions */}
        <div className="mb-12 flex justify-center gap-4 border-t border-b border-gray-300 py-4">
          <button className="flex items-center gap-2 text-sm font-medium hover:text-gray-600">
            <Share2 className="h-4 w-4" />
            공유하기
          </button>
          <button className="flex items-center gap-2 text-sm font-medium hover:text-gray-600">
            <Printer className="h-4 w-4" />
            인쇄하기
          </button>
        </div>

        {/* Related news */}
        <div className="mb-12">
          <h2 className="mb-6 border-b-2 border-black pb-2 text-2xl font-bold">
            관련 뉴스
          </h2>
          <RelatedNews news={related} />
        </div>

        {/* Footer */}
        {/* <footer className="mt-12 border-t-2 border-black pt-6 text-center">
          <p className="font-serif text-sm text-gray-600">
            The Daily Chronicle © {new Date().getFullYear()} | All Rights
            Reserved
          </p>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <Link href="/" className="underline hover:text-gray-800">
              Home
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
    </div>
  );
}

// Helper function to generate dummy news content
function generateNewsContent() {
  return [
    'The city council\'s decision marks a significant turning point for downtown development, with Mayor Eleanor Richards calling it "a historic moment for our community." The $42 million project will include renovations to historic buildings, new public spaces, and infrastructure improvements designed to attract businesses and residents alike.',

    'Council member James Thompson, who initially opposed the plan, changed his vote after additional provisions were added to protect affordable housing. "We need to ensure that development benefits everyone in our community," Thompson said during the four-hour council meeting that preceded the vote.',

    'Critics of the plan argue that the scale of development could change the character of the downtown area and lead to gentrification. "We\'re concerned about small businesses being priced out," said Maria Gonzalez, owner of a family restaurant that has operated downtown for three decades.',

    "The development plan includes provisions for a new central plaza, pedestrian-friendly streets, and incentives for businesses that commit to hiring local residents. Construction is expected to begin in early summer, with the first phase completed within 18 months.",

    'City Planner Robert Chen emphasized that community input shaped many aspects of the final plan. We held over twenty public forums and incorporated feedback from hundreds of residents," Chen explained. "This truly is a community-driven vision.',

    "The downtown revitalization represents the largest public-private partnership in the city's history, with several major developers committing resources alongside the city's investment. Economic analysts project the development could create up to 1,200 jobs during construction and 800 permanent positions once completed.",

    'Council member Sophia Williams, who chairs the economic development committee, noted that the plan includes strict environmental standards. "We\'re requiring LEED certification for new buildings and incorporating green spaces throughout the development," Williams said.',

    "The next steps include finalizing contracts with developers and beginning the permitting process. City officials have promised regular updates and continued opportunities for public input as the project moves forward.",
  ];
}
