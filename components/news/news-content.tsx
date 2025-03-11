import { news } from "@/app/(with-navigation)/news/data";
import NewsGrid from "./news-grid";

export function NewsContent() {
  return (
    <main>
      <NewsGrid news={news} />
    </main>
  );
}
