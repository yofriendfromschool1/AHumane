import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ email: z.string().email().max(200) });

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const email = parsed.data.email;
  const name = email.split("@")[0]?.replace(/[._-]+/g, " ") || "Writer";
  const session = Buffer.from(JSON.stringify({ email, name })).toString("base64url");

  const response = NextResponse.json({ ok: true, name });
  response.cookies.set("ahumane_session", session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
