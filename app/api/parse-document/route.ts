import { NextResponse } from "next/server";
import mammoth from "mammoth";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Upload a .docx, .txt, or .md file." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
  }
  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "Files must be 4 MB or smaller." }, { status: 413 });
  }

  const name = file.name.toLowerCase();
  try {
    if (name.endsWith(".docx")) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value.trim();
      if (!text) throw new Error("The document did not contain readable text.");
      return NextResponse.json({
        text,
        filename: file.name,
        warnings: result.messages.map((message) => message.message).slice(0, 5),
      });
    }

    if (name.endsWith(".txt") || name.endsWith(".md") || name.endsWith(".markdown") || file.type.startsWith("text/")) {
      const text = (await file.text()).trim();
      if (!text) throw new Error("The file was empty.");
      return NextResponse.json({ text, filename: file.name, warnings: [] });
    }

    return NextResponse.json(
      { error: "Only .docx, .txt, and .md files are supported right now." },
      { status: 415 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not read that file." },
      { status: 422 },
    );
  }
}
