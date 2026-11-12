import { NextResponse } from "next/server";
import { z } from "zod";
import { detect } from "@/lib/detector/score";
import { countWords } from "@/lib/utils/text";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  text: z.string().min(1).max(400_000),
});

export async function POST(request: Request) {
  const limit = rateLimit(`detect:${clientKey(request)}`, 60, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many scans. Wait a minute." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Paste some text to scan." }, { status: 400 });
  }

  if (countWords(parsed.data.text) > 25_000) {
    return NextResponse.json({ error: "That text is over 25,000 words." }, { status: 413 });
  }

  return NextResponse.json(detect(parsed.data.text));
}
