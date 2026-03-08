import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|assets/|fonts/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2|txt)$).*)",
  ],
};
