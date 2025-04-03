import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { permalink } = await request.json();
  const supabase = await createClient();
  await supabase.rpc("increment_translation_views", {
    _permalink: decodeURIComponent(permalink),
  });
  return NextResponse.json({ success: true });
}
