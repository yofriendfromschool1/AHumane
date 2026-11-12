export interface StoredRun {
  id: string;
  createdAt: number;
  title: string;
  input: string;
  output: string;
  mode: "basic" | "pro";
  style: string;
  strength: number;
  language: string;
  beforeScore: number;
  afterScore: number;
  passes: number;
}

const HISTORY_KEY = "ahumane.history.v1";
const DOCS_KEY = "ahumane.documents.v1";
export const HISTORY_EVENT = "ahumane:history";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function loadHistory(): StoredRun[] {
  if (typeof window === "undefined") return [];
  return safeParse<StoredRun[]>(window.localStorage.getItem(HISTORY_KEY), []);
}

export function saveRun(run: StoredRun): StoredRun[] {
  if (typeof window === "undefined") return [];
  const existing = loadHistory();
  const next = [run, ...existing.filter((item) => item.id !== run.id)].slice(0, 50);
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(HISTORY_EVENT));
  } catch {
    // storage may be full; keep the in-memory run
  }
  return next;
}

export function deleteRun(id: string): StoredRun[] {
  if (typeof window === "undefined") return [];
  const next = loadHistory().filter((item) => item.id !== id);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(HISTORY_EVENT));
  return next;
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(HISTORY_KEY);
  window.dispatchEvent(new Event(HISTORY_EVENT));
}

export interface StoredDocument {
  id: string;
  title: string;
  text: string;
  updatedAt: number;
  createdAt: number;
}

export function loadDocuments(): StoredDocument[] {
  if (typeof window === "undefined") return [];
  return safeParse<StoredDocument[]>(window.localStorage.getItem(DOCS_KEY), []);
}

export function saveDocuments(documents: StoredDocument[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DOCS_KEY, JSON.stringify(documents.slice(0, 100)));
  window.dispatchEvent(new Event("ahumane:documents"));
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return ok;
  }
}
