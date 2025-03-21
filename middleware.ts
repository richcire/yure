import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "./utils/supabase/server";

export async function middleware(request: NextRequest) {
  // const baseUrl = request.nextUrl.origin;
  // const originalPath = request.nextUrl.pathname;

  // console.log(originalPath);
  // // 페이지 존재 여부 확인
  // const res = await fetch(`${baseUrl}${originalPath}`, { method: "HEAD" });

  // if (res.status === 404) {
  //   const supabase = await createClient();
  //   const { data: translation } = await supabase
  //     .from("translations")
  //     .select("id")
  //     .eq("permalink", originalPath.slice(1))
  //     .single();

  //   if (translation) {
  //     return NextResponse.redirect(
  //       new URL(`/translation/${translation.id}`, request.url)
  //     );
  //   }
  // }

  const { pathname } = request.nextUrl;

  //redirect old wordpress url to new url
  // Define routes to ignore (not to be redirected)
  const excludePaths = [
    "/translation",
    "/article",
    "/karaoke",
    "/admin",
    "/api",
    "/_next",
    "/favicon.ico",
    "/sitemap-index.xml",
    "/sitemap.xml",
    "/sign-in",
    "/auth",
    "/protected",
  ];

  const isExcluded = excludePaths.some((path) => pathname.startsWith(path));

  // If it's a root-level path like /some-slug (e.g. no other slashes)
  const isSlugOnly = pathname.split("/").filter(Boolean).length === 1;

  if (!isExcluded && isSlugOnly) {
    const newUrl = new URL(`/translation/${pathname}`, request.url);
    return NextResponse.redirect(newUrl, 301);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
