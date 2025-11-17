import { NextRequest, NextResponse } from "next/server";
import { runWorkflow } from "@/utils/ai/auto-post";

export async function POST(request: NextRequest) {
  const { input_as_text } = await request.json();
  const html = await runWorkflow({ input_as_text });
  return NextResponse.json({ html });
}
