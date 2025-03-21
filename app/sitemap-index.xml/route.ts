import { NextResponse } from "next/server";

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
    </sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
