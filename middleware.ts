import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
// import { createClient } from "./utils/supabase/server";

export async function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;

  //redirect old wordpress url to new url
  // Define routes to ignore (not to be redirected)
  // const excludePaths = [
  //   "/translation",
  //   "/article",
  //   "/karaoke",
  //   "/news",
  //   "/schedule",
  //   "/admin",
  //   "/api",
  //   "/terms",
  //   "/_next",
  //   "/favicon.ico",
  //   "/sitemap-index.xml",
  //   "/sitemap.xml",
  //   "/sign-in",
  //   "/auth",
  //   "/protected",
  //   "/ads.txt",
  //   "/schedule",
  //   "/assets",
  //   "/community",
  // ];

  // const isExcluded = excludePaths.some((path) => pathname.startsWith(path));

  // If it's a root-level path like /some-slug (e.g. no other slashes)
  // const isSlugOnly = pathname.split("/").filter(Boolean).length === 1;

  // if (!isExcluded && isSlugOnly) {
  //   const newUrl = new URL(`/translation/${pathname}`, request.url);
  //   return NextResponse.redirect(newUrl, 301);
  // }

  return await updateSession(request);
}

export const config = {
  matcher: [
    // Match all paths except static files and assets
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|assets/|fonts/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2|txt)$).*)",

    // Exclude translation pages
    "/((?!^translation/).*)",
  ],
};
