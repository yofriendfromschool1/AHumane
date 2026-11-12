import { NextResponse } from "next/server";
import { z } from "zod";
import { humanize } from "@/lib/humanizer/pipeline";
import { detect } from "@/lib/detector/score";
import { countWords } from "@/lib/utils/text";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { humanizeWithModel } from "@/lib/humanizer/model";

export const runtime = "nodejs";
export const maxDuration = 900;

const schema = z.object({
  text: z.string().min(1).max(400_000),
  mode: z.enum(["basic", "pro"]).default("pro"),
  style: z.enum(["natural", "academic", "professional", "casual", "concise"]).default("natural"),
  strength: z.number().int().min(1).max(5).default(4),
  language: z.string().max(12).default("en"),
  seed: z.number().int().min(0).max(2_147_483_647).optional(),
  useModel: z.boolean().default(false),
  provider: z.enum(["auto", "ovh", "ollama", "openai-compatible"]).default("auto"),
  model: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  const limit = rateLimit(`humanize:${clientKey(request)}`, 30, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Wait a minute and try again." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
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
      { error: parsed.error.issues[0]?.message || "Invalid request." },
      { status: 400 },
    );
  }

  const { text, mode, style, strength, language, seed, useModel, provider, model } = parsed.data;
  const words = countWords(text);
  if (words > 25_000) {
    return NextResponse.json(
      { error: "That draft is over the 25,000-word limit. Split it into parts." },
      { status: 413 },
    );
  }
  if (words < 3) {
    return NextResponse.json(
      { error: "Add at least a few words so the engine has something to work with." },
      { status: 422 },
    );
  }

  try {
    const before = detect(text);
    let result: Awaited<ReturnType<typeof humanize>>;
    let resultProvider: "algorithm" | "ollama" | "openai-compatible" | "ovh" = "algorithm";

    if (mode === "pro" && useModel) {
      try {
        result = await humanizeWithModel(text, {
          mode,
          style,
          strength,
          language,
          seed,
          provider,
          model,
        });
        resultProvider = result.provider;
      } catch (modelError) {
        const reason =
          modelError instanceof Error
            ? modelError.message.replace(/\.$/, "")
            : "unknown error";
        result = humanize(text, { mode, style, strength, language, seed });
        result.warnings.push(
          `Deep rewrite unavailable: ${reason}. The local Pro engine was used instead.`,
        );
      }
    } else {
      result = humanize(text, { mode, style, strength, language, seed });
    }

    result.provider = resultProvider;
    const after = detect(result.output);
    if (language !== "en" && !language.startsWith("en-")) {
      result.warnings.push(
        "The full lexicon is English-first. Other languages get structural cleanup; connect a model for a full rewrite.",
      );
    }
    return NextResponse.json({ result, before, after });  } catch (error) {
    console.error("humanize failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { error: "The humanizer hit an internal error. Your text was not stored." },
      { status: 500 },
    );
  }
}
