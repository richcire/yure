export async function GET(request: Request) {
  const baseUrl = "https://www.yure.me";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
            <loc>${baseUrl}/sitemap.xml</loc>
        </sitemap>
        <sitemap>
            <loc>${baseUrl}/translation/sitemap.xml</loc>
        </sitemap>
        <sitemap>
            <loc>${baseUrl}/article/sitemap.xml</loc>
        </sitemap>
        <sitemap>
            <loc>${baseUrl}/news/sitemap.xml</loc>
        </sitemap>
    </sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      // Cache for 1 hour, stale-while-revalidate for 1 day
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
