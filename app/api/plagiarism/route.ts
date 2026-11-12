import { NextResponse } from "next/server";
import { z } from "zod";
import { checkPlagiarism } from "@/lib/plagiarism";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  text: z.string().min(20).max(200_000),
  web: z.boolean().default(true),
});

export async function POST(request: Request) {
  const limit = rateLimit(`plagiarism:${clientKey(request)}`, 15, 60_000);
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
    return NextResponse.json(
      { error: "Paste at least 20 characters to check." },
      { status: 400 },
    );
  }

  try {
    const result = await checkPlagiarism(parsed.data.text, { web: parsed.data.web });
    return NextResponse.json(result);
  } catch (error) {
    console.error("plagiarism failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { error: "The plagiarism check could not finish. Try again with the web check off." },
      { status: 500 },
    );
  }
}
