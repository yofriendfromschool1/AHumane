import type { HumanizerStyle } from "@/lib/humanizer/types";
import { buildHumanizerPrompt, stripModelWrapping } from "@/lib/humanizer/prompt";
import { countWords } from "@/lib/utils/text";

export type ProviderKind = "ovh" | "ollama" | "openai-compatible";

export interface ModelInfo {
  kind: ProviderKind;
  baseUrl: string;
  model: string;
  label: string;
}

export interface ModelRewrite {
  text: string;
  provider: ProviderKind;
  model: string;
  ms: number;
}

function timeout(ms: number) {
  return AbortSignal.timeout(ms);
}

const OVH_DEFAULT_BASE = "https://oai.endpoints.kepler.ai.cloud.ovh.net";
const OVH_FALLBACK_MODELS = [
  "Meta-Llama-3_3-70B-Instruct",
  "gpt-oss-120b",
  "Mistral-Small-3.2-24B-Instruct-2506",
  "Qwen3-32B",
];

let ovhCache: { checkedAt: number; value: ModelInfo | null } | null = null;

export async function detectOvh(): Promise<ModelInfo | null> {
  if (process.env.AHUMANE_DISABLE_CLOUD === "1") return null;
  if (ovhCache && Date.now() - ovhCache.checkedAt < 60_000) return ovhCache.value;
  const base = (process.env.OVH_BASE_URL || OVH_DEFAULT_BASE).replace(/\/$/, "");
  const preferred = process.env.OVH_MODEL;
  try {
    const response = await fetch(`${base}/v1/models`, {
      signal: timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) {
      ovhCache = { checkedAt: Date.now(), value: null };
      return null;
    }
    const data = (await response.json()) as {
      data?: Array<{ id?: string }>;
    };
    const available = (data.data ?? []).map((item) => item.id).filter(Boolean) as string[];
    if (!available.length) return null;
    const model =
      (preferred && available.includes(preferred) && preferred) ||
      OVH_FALLBACK_MODELS.find((candidate) => available.includes(candidate)) ||
      available[0]!;
    const value: ModelInfo = {
      kind: "ovh",
      baseUrl: `${base}/v1`,
      model,
      label: "AHumane Cloud",
    };
    ovhCache = { checkedAt: Date.now(), value };
    return value;
  } catch {
    ovhCache = { checkedAt: Date.now(), value: null };
    return null;
  }
}

export async function detectModel(): Promise<ModelInfo | null> {
  const openaiBase = process.env.LLM_BASE_URL || process.env.OPENAI_BASE_URL;
  const openaiModel = process.env.LLM_MODEL || process.env.OPENAI_MODEL;
  if (openaiBase && openaiModel) {
    return {
      kind: "openai-compatible",
      baseUrl: openaiBase.replace(/\/$/, ""),
      model: openaiModel,
      label: "Custom model",
    };
  }

  if (process.env.AHUMANE_PREFER_LOCAL !== "1") {
    const cloud = await detectOvh();
    if (cloud) return cloud;
  }

  if (process.env.AHUMANE_PREFER_LOCAL !== "1" && !process.env.OLLAMA_MODEL) {
    return null;
  }

  const ollamaBase = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
  try {
    const response = await fetch(`${ollamaBase}/api/tags`, {
      signal: timeout(1500),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { models?: Array<{ name: string }> };
    const models = (data.models ?? []).map((model) => model.name);
    if (!models.length) return null;
    const preferred = process.env.OLLAMA_MODEL;
    const model = preferred && models.includes(preferred) ? preferred : models[0]!;
    return {
      kind: "ollama",
      baseUrl: ollamaBase,
      model,
      label: "Local model",
    };
  } catch {
    return null;
  }
}

async function callOllama(
  info: ModelInfo,
  system: string,
  user: string,
  maxTokens: number,
): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${info.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: info.model,
        stream: false,
        options: {
          temperature: 0.9,
          top_p: 0.92,
          num_predict: maxTokens,
          num_ctx: 8192,
        },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      signal: timeout(Number(process.env.OLLAMA_TIMEOUT_MS || 900_000)),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "TimeoutError" || /aborted due to timeout/i.test(error.message))
    ) {
      throw new Error(
        "Ollama timed out. Choose a smaller local model or raise OLLAMA_TIMEOUT_MS.",
      );
    }
    throw new Error(
      `Ollama is not reachable at ${info.baseUrl}. Start Ollama or choose another model.`,
    );
  }
  if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
  const data = (await response.json()) as { message?: { content?: string } };
  const content = data.message?.content?.trim();
  if (!content) throw new Error("Ollama returned an empty response.");
  return content;
}

async function callChatCompletions(
  info: ModelInfo,
  system: string,
  user: string,
  maxTokens: number,
): Promise<string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (info.kind === "openai-compatible" && process.env.LLM_API_KEY) {
    headers.Authorization = `Bearer ${process.env.LLM_API_KEY}`;
  }
  const response = await fetch(`${info.baseUrl}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: info.model,
      temperature: 0.95,
      top_p: 0.92,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
    signal: timeout(180_000),
  });
  if (!response.ok) throw new Error(`Model endpoint returned ${response.status}`);
  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("The model returned an empty response.");
  return content;
}

export async function rewriteWithPrompt(
  info: ModelInfo,
  system: string,
  user: string,
  maxTokens = 2200,
): Promise<string> {
  const raw =
    info.kind === "ollama"
      ? await callOllama(info, system, user, maxTokens)
      : await callChatCompletions(info, system, user, maxTokens);
  const cleaned = stripModelWrapping(raw);
  if (!cleaned) throw new Error("The model returned an empty response.");
  return cleaned;
}

export async function rewriteWithModel(
  text: string,
  options: { style: HumanizerStyle; strength: number; language: string },
  modelOverride?: ModelInfo,
): Promise<ModelRewrite> {
  const start = Date.now();
  const info = modelOverride ?? (await detectModel());
  if (!info) throw new Error("No model provider is available.");

  const words = countWords(text);
  if (words > 2400) {
    throw new Error(
      "Model rewriting is limited to 2,400 words per run. The deterministic Pro engine handles longer drafts.",
    );
  }

  const { system, user } = buildHumanizerPrompt(text, options);
  const maxTokens = Math.min(4096, Math.max(500, Math.round(words * 2.4)));
  const cleaned = await rewriteWithPrompt(info, system, user, maxTokens);
  if (countWords(cleaned) < words * 0.4) {
    throw new Error("The model returned a suspiciously short rewrite.");
  }

  return {
    text: cleaned,
    provider: info.kind,
    model: info.model,
    ms: Date.now() - start,
  };
}

export interface OllamaModel {
  name: string;
  size?: number;
}

export async function listOllamaModels(): Promise<OllamaModel[]> {
  const base = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
  try {
    const response = await fetch(`${base}/api/tags`, {
      signal: timeout(3000),
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = (await response.json()) as {
      models?: Array<{ name: string; size?: number }>;
    };
    return (data.models ?? []).map((model) => ({ name: model.name, size: model.size }));
  } catch {
    return [];
  }
}

export async function listOvhModels(): Promise<string[]> {
  if (process.env.AHUMANE_DISABLE_CLOUD === "1") return [];
  const base = (process.env.OVH_BASE_URL || OVH_DEFAULT_BASE).replace(/\/$/, "");
  try {
    const response = await fetch(`${base}/v1/models`, {
      signal: timeout(5000),
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = (await response.json()) as { data?: Array<{ id?: string }> };
    const excluded = /guard|embed|bge|rerank|whisper|audio|vision|\bvl\b|safety|image|tts|stable-diffusion|sdxl|flux|speech|nvr/i;
    const chat = /(llama|qwen|mistral|mixtral|gpt-oss|deepseek|gemma|phi|nemotron|glm|command|hermes|dolphin|yi-|internlm)/i;
    const filtered = (data.data ?? [])
      .map((item) => item.id)
      .filter((id): id is string => Boolean(id) && !excluded.test(id!) && chat.test(id!));
    return filtered.sort((a, b) => {
      const ai = OVH_FALLBACK_MODELS.indexOf(a);
      const bi = OVH_FALLBACK_MODELS.indexOf(b);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      return a.localeCompare(b);
    });
  } catch {
    return [];
  }
}

export async function resolveModel(
  provider: string = "auto",
  model?: string,
): Promise<ModelInfo | null> {
  if (provider === "ollama") {
    const models = await listOllamaModels();
    if (!models.length) return null;
    const exact = model ? models.find((item) => item.name === model) : undefined;
    const suffix = model
      ? models.find((item) => item.name.endsWith(`:${model}`) || item.name === model)
      : undefined;
    const chosen = exact?.name ?? suffix?.name ?? models[0]!.name;
    return {
      kind: "ollama",
      baseUrl: (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, ""),
      model: chosen,
      label: "Local model",
    };
  }

  if (provider === "ovh") {
    const cloud = await detectOvh();
    return cloud ? { ...cloud, model: model || cloud.model } : null;
  }

  if (provider === "openai-compatible") {
    const base = process.env.LLM_BASE_URL || process.env.OPENAI_BASE_URL;
    const configured = process.env.LLM_MODEL || process.env.OPENAI_MODEL;
    if (!base || (!model && !configured)) return null;
    return {
      kind: "openai-compatible",
      baseUrl: base.replace(/\/$/, ""),
      model: model || configured!,
      label: "Custom model",
    };
  }

  // auto: prefer an explicitly selected Ollama model if it exists, else detect
  if (model) {
    const models = await listOllamaModels();
    if (models.some((item) => item.name === model)) {
      return {
        kind: "ollama",
        baseUrl: (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, ""),
        model,
        label: "Local model",
      };
    }
  }
  return detectModel();
}
