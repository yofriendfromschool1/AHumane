"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Download,
  HardDrive,
  Loader2,
  RefreshCw,
  Server,
  Sparkles,
  Trash2,
} from "lucide-react";
import { clearHistory, loadDocuments, loadHistory } from "@/lib/studio/storage";
import { STYLE_LABELS } from "@/lib/humanizer/types";
import { toast } from "@/components/ui/toast";

interface Health {
  algorithm: boolean;
  cloud: { available: boolean; model: string | null; baseUrl: string | null; models?: string[] };
  ollama: {
    available: boolean;
    baseUrl: string;
    models: string[];
    details?: Array<{ name: string; size?: number }>;
    error?: string;
  };
  openaiCompatible: boolean;
  preferredModel: string | null;
  preferLocal?: boolean;
  cloudDisabled?: boolean;
  languages: string[];
}

interface Settings {
  mode: "basic" | "pro";
  style: keyof typeof STYLE_LABELS;
  strength: number;
  language: string;
}

const SETTINGS_KEY = "ahumane.settings.v1";
const DEFAULTS: Settings = { mode: "pro", style: "natural", strength: 4, language: "en" };

export function SettingsPanel() {
  const [health, setHealth] = useState<Health | null>(null);
  const [healthError, setHealthError] = useState("");
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [modelChoice, setModelChoice] = useState("auto");
  const [modelOptions, setModelOptions] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SETTINGS_KEY);
      if (stored) setSettings({ ...DEFAULTS, ...(JSON.parse(stored) as Partial<Settings>) });
    } catch {
      // defaults
    }
    void refreshHealth();
  }, []);

  async function refreshHealth() {
    setLoadingHealth(true);
    setHealthError("");
    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      const data = (await response.json()) as Health;
      setHealth(data);
      const options: Array<{ value: string; label: string }> = [
        { value: "auto", label: "Auto (best available)" },
      ];
      if (data.cloud?.available) {
        const models = data.cloud.models?.length
          ? data.cloud.models
          : data.cloud.model
            ? [data.cloud.model]
            : [];
        for (const model of models.slice(0, 8)) {
          options.push({ value: `ovh:${model}`, label: `Cloud · ${model}` });
        }
      }
      const details: Array<{ name: string; size?: number }> =
        data.ollama?.details ??
        (data.ollama?.models ?? []).map((name) => ({ name }));
      for (const model of details) {
        const size = model.size ? ` (${(model.size / 1e9).toFixed(1)} GB)` : "";
        options.push({ value: `ollama:${model.name}`, label: `Local · ${model.name}${size}` });
      }
      if (data.openaiCompatible) options.push({ value: "openai-compatible", label: "Custom / Unsloth (vLLM)" });
      setModelOptions(options);
      let saved: string | null = null;
      try {
        saved = window.localStorage.getItem("ahumane.model.v1");
      } catch {
        saved = null;
      }
      const localOption = options.find((option) => option.value.startsWith("ollama:"));
      setModelChoice(
        options.some((option) => option.value === saved)
          ? saved!
          : data.preferLocal && localOption
            ? localOption.value
            : options[1]?.value ?? "auto",
      );
    } catch {
      setHealthError("Could not reach the health endpoint.");
    } finally {
      setLoadingHealth(false);
    }
  }

  function saveSettings(next: Settings) {
    setSettings(next);
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      toast("Defaults saved.");
    } catch {
      toast("Could not save settings in this browser.");
    }
  }

  function exportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      history: loadHistory(),
      documents: loadDocuments(),
      settings,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ahumane-data.json";
    anchor.click();
    URL.revokeObjectURL(url);
    toast("Exported your local data.");
  }

  function clearData() {
    if (!window.confirm("Delete all local history and documents? This cannot be undone.")) return;
    clearHistory();
    window.localStorage.removeItem("ahumane.documents.v1");
    window.localStorage.removeItem(SETTINGS_KEY);
    setSettings(DEFAULTS);
    toast("Local data cleared.");
    window.dispatchEvent(new Event("ahumane:documents"));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold">Humanizer defaults</h2>
              <p className="text-[10px] text-neutral-500">Used when you open the studio.</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <label className="block text-xs text-neutral-600">
              Mode
              <select
                value={settings.mode}
                onChange={(event) => saveSettings({ ...settings, mode: event.target.value as Settings["mode"] })}
                className="mt-1 h-9 w-full rounded-md border border-neutral-200 bg-white px-2 text-xs"
              >
                <option value="pro">Pro (recommended)</option>
                <option value="basic">Basic</option>
              </select>
            </label>
            <label className="block text-xs text-neutral-600">
              Style
              <select
                value={settings.style}
                onChange={(event) => saveSettings({ ...settings, style: event.target.value as Settings["style"] })}
                className="mt-1 h-9 w-full rounded-md border border-neutral-200 bg-white px-2 text-xs"
              >
                {Object.entries(STYLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-neutral-600">
              Strength: <span className="font-medium text-neutral-900">{settings.strength}</span>
              <input
                type="range"
                min={1}
                max={5}
                value={settings.strength}
                onChange={(event) => setSettings({ ...settings, strength: Number(event.target.value) })}
                onMouseUp={() => saveSettings(settings)}
                onTouchEnd={() => saveSettings(settings)}
                className="mt-2 w-full accent-blue-600"
              />
            </label>
            <label className="block text-xs text-neutral-600">
              Language
              <select
                value={settings.language}
                onChange={(event) => saveSettings({ ...settings, language: event.target.value })}
                className="mt-1 h-9 w-full rounded-md border border-neutral-200 bg-white px-2 text-xs"
              >
                <option value="en">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="pt">Portuguese</option>
                <option value="it">Italian</option>
                <option value="nl">Dutch</option>
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <HardDrive className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold">Local data</h2>
              <p className="text-[10px] text-neutral-500">History and documents live in this browser.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={exportData} className="btn btn-secondary h-9 px-3 text-xs">
              <Download className="h-3.5 w-3.5" /> Export JSON
            </button>
            <button type="button" onClick={clearData} className="btn btn-secondary h-9 px-3 text-xs text-rose-700">
              <Trash2 className="h-3.5 w-3.5" /> Clear all
            </button>
          </div>
          <p className="mt-3 text-[11px] leading-5 text-slate-600">
            Clearing local data does not affect the site itself. It only removes your browser's saved
            runs and documents.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Server className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-semibold">Model status</h2>
                <p className="text-[10px] text-neutral-500">Optional local or OpenAI-compatible provider.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void refreshHealth()}
              className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Refresh model status"
            >
              {loadingHealth ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </button>
          </div>

          {health ? (
            <div className="mt-4 space-y-3 text-xs">
              {modelOptions.length > 1 ? (
                <label className="block text-neutral-600">
                  Deep rewrite model
                  <select
                    value={modelChoice}
                    onChange={(event) => {
                      const value = event.target.value;
                      setModelChoice(value);
                      try {
                        window.localStorage.setItem("ahumane.model.v1", value);
                      } catch {
                        // storage is optional
                      }
                    }}
                    className="mt-1 h-9 w-full rounded-md border border-neutral-200 bg-white px-2 text-xs"
                  >
                    {modelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="mt-1 block text-[10px] leading-4 text-neutral-500">
                    The humanizer uses this model when Deep rewrite is on.
                  </span>
                </label>
              ) : null}
              <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                <span className="text-neutral-600">Deterministic engine</span>
                <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                  <Check className="h-3 w-3" /> Always available
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                <span className="text-neutral-600">Deep rewrite (cloud)</span>
                <span className={health.cloud.available ? "font-medium text-emerald-700" : "text-neutral-500"}>
                  {health.cloud.available ? health.cloud.model : "Unavailable"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                <span className="text-neutral-600">Ollama</span>
                <span className={health.ollama.available ? "font-medium text-emerald-700" : "text-neutral-500"}>
                  {health.ollama.available ? "Detected" : "Not running"}
                </span>
              </div>
              {health.ollama.available && health.ollama.models.length ? (
                <div className="rounded-lg border border-neutral-200 p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Models</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {health.ollama.models.map((model) => (
                      <span key={model} className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600">
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                <span className="text-neutral-600">OpenAI-compatible</span>
                <span className={health.openaiCompatible ? "font-medium text-emerald-700" : "text-neutral-500"}>
                  {health.openaiCompatible ? "Configured" : "Not configured"}
                </span>
              </div>
              <p className="text-[11px] leading-5 text-slate-600">
                The Pro engine runs without a model. To connect one, set{" "}
                <code className="rounded bg-neutral-100 px-1">OLLAMA_BASE_URL</code>,{" "}
                <code className="rounded bg-neutral-100 px-1">OLLAMA_MODEL</code>, or{" "}
                <code className="rounded bg-neutral-100 px-1">LLM_BASE_URL</code> in your deployment. Deep rewrite uses a free public endpoint by default; set <code className="rounded bg-neutral-100 px-1">AHUMANE_DISABLE_CLOUD=1</code> to disable it.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-xs text-neutral-500">
              {healthError || "Checking provider status…"}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-semibold">About this build</h2>
          <dl className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500">Version</dt>
              <dd className="font-medium">1.0.0</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500">Engine</dt>
              <dd className="font-medium">Deterministic + optional model</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500">Storage</dt>
              <dd className="font-medium">Browser local</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <Link href="/how-it-works" className="font-medium text-blue-600 hover:underline">
              How it works
            </Link>
            <Link href="/privacy" className="font-medium text-blue-600 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="font-medium text-blue-600 hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
