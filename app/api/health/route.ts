import { NextResponse } from "next/server";
import { detectOvh, listOllamaModels, listOvhModels } from "@/lib/llm/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function checkOllama(): Promise<{
  available: boolean;
  baseUrl: string;
  models: string[];
  error?: string;
}> {
  const baseUrl = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
  try {
    const response = await fetch(`${baseUrl}/api/tags`, {
      signal: AbortSignal.timeout(1200),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`status ${response.status}`);
    const data = (await response.json()) as { models?: Array<{ name: string; size?: number }> };
    return {
      available: true,
      baseUrl,
      models: (data.models ?? []).map((model) => model.name).slice(0, 20),
    };
  } catch (error) {
    return {
      available: false,
      baseUrl,
      models: [],
      error: error instanceof Error ? error.message : "unreachable",
    };
  }
}

export async function GET() {
  const [ollama, cloud, cloudModels, ollamaDetails] = await Promise.all([
    checkOllama(),
    detectOvh(),
    listOvhModels(),
    listOllamaModels(),
  ]);
  const openaiCompatible = Boolean(process.env.LLM_BASE_URL || process.env.OPENAI_BASE_URL);
  return NextResponse.json({
    algorithm: true,
    cloud: {
      available: Boolean(cloud),
      model: cloud?.model ?? null,
      baseUrl: cloud?.baseUrl ?? null,
      models: cloudModels,
    },
    ollama: {
      ...ollama,
      details: ollamaDetails,
    },
    openaiCompatible,
    preferredModel: cloud?.model ?? process.env.OLLAMA_MODEL ?? null,
    preferLocal: process.env.AHUMANE_PREFER_LOCAL === "1",
    cloudDisabled: process.env.AHUMANE_DISABLE_CLOUD === "1",
    languages: ["en", "es", "fr", "de", "pt", "it", "nl"],
  });
}
