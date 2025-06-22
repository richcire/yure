import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { permalink } = await request.json();
  const supabase = await createClient();
  await supabase.rpc("increment_translation_views", {
    _permalink: decodeURIComponent(permalink),
  });

  return NextResponse.json(
    { success: true },
    {
      headers: {
        // Cache for 30 seconds to prevent rapid duplicate increments
        "Cache-Control": "private, max-age=30",
      },
    }
  );
}
