import { IUserInfo } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

function getEmailPrefix(email: string) {
  // "@" 문자의 인덱스를 찾습니다.
  const atIndex = email.indexOf("@");
  // "@" 문자가 없으면 전체 문자열을 반환하거나, 에러 처리를 할 수 있습니다.
  if (atIndex === -1) {
    return email;
  }
  // "@" 앞부분의 문자열을 반환합니다.
  return email.slice(0, atIndex);
}

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    const { data: userData } = await supabase
      .from("user_info")
      .select("*")
      .eq("user_id", user?.id)
      .single<IUserInfo>();

    if (!userData) {
      await supabase.from("user_info").insert({
        user_id: user?.id,
        name: getEmailPrefix(user?.email || "") || "익명",
        role: "none",
      });
    }
  }

  // if (redirectTo) {
  //   return NextResponse.redirect(`${origin}${redirectTo}`);
  // }

  // URL to redirect to after sign up process completes
  if (redirectTo) {
    const safePath = redirectTo.startsWith("/") ? redirectTo : `/${redirectTo}`;
    return NextResponse.redirect(`${origin}${safePath}`);
  }

  return NextResponse.redirect(`${origin}`);
}
