"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Plus, Save, Search, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  formatRelativeTime,
  loadDocuments,
  saveDocuments,
  type StoredDocument,
} from "@/lib/studio/storage";
import { toast } from "@/components/ui/toast";

export function DocumentsWorkspace() {
  const router = useRouter();
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftText, setDraftText] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const docs = loadDocuments();
    setDocuments(docs);
    if (docs[0]) {
      setActiveId(docs[0].id);
      setDraftTitle(docs[0].title);
      setDraftText(docs[0].text);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter(
      (doc) => doc.title.toLowerCase().includes(q) || doc.text.toLowerCase().includes(q),
    );
  }, [documents, query]);

  function createDocument() {
    const now = Date.now();
    const doc: StoredDocument = {
      id: `doc-${now}`,
      title: "Untitled document",
      text: "",
      createdAt: now,
      updatedAt: now,
    };
    const next = [doc, ...documents];
    setDocuments(next);
    saveDocuments(next);
    setActiveId(doc.id);
    setDraftTitle(doc.title);
    setDraftText(doc.text);
    setDirty(false);
  }

  function selectDocument(doc: StoredDocument) {
    setActiveId(doc.id);
    setDraftTitle(doc.title);
    setDraftText(doc.text);
    setDirty(false);
  }

  function persist() {
    if (!activeId) return;
    const title = draftTitle.trim() || "Untitled document";
    const next = documents.map((doc) =>
      doc.id === activeId ? { ...doc, title, text: draftText, updatedAt: Date.now() } : doc,
    );
    setDocuments(next);
    saveDocuments(next);
    setDirty(false);
    toast("Document saved.");
  }

  function remove(id: string) {
    const next = documents.filter((doc) => doc.id !== id);
    setDocuments(next);
    saveDocuments(next);
    if (activeId === id) {
      const first = next[0];
      setActiveId(first?.id ?? null);
      setDraftTitle(first?.title ?? "");
      setDraftText(first?.text ?? "");
    }
  }

  function sendToHumanizer() {
    try {
      window.sessionStorage.setItem("ahumane:pending", draftText);
    } catch {
      // ignore
    }
    router.push("/studio/humanizer?from=documents");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <div className="rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-3">
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-md border border-neutral-200 px-2.5">
              <Search className="h-3.5 w-3.5 text-neutral-500" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search documents"
                className="h-8 w-full bg-transparent text-xs outline-none placeholder:text-neutral-500"
                aria-label="Search documents"
              />
            </div>
            <button
              type="button"
              onClick={createDocument}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
              aria-label="New document"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="max-h-[560px] overflow-y-auto p-2 scrollbar-thin">
          {filtered.length ? (
            filtered.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => selectDocument(doc)}
                className={cn(
                  "mb-1 w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                  activeId === doc.id ? "bg-blue-50" : "hover:bg-neutral-50",
                )}
              >
                <p className={cn("truncate text-xs font-medium", activeId === doc.id ? "text-blue-800" : "text-neutral-800")}>
                  {doc.title}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-neutral-500">
                  {formatRelativeTime(doc.updatedAt)} · {doc.text.split(/\s+/).filter(Boolean).length} words
                </p>
              </button>
            ))
          ) : (
            <p className="px-3 py-8 text-center text-xs text-neutral-500">No documents found.</p>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {activeId ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3">
              <input
                value={draftTitle}
                onChange={(event) => {
                  setDraftTitle(event.target.value);
                  setDirty(true);
                }}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
                aria-label="Document title"
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={sendToHumanizer}
                  disabled={!draftText.trim()}
                  className="btn btn-secondary h-8 px-2.5 text-[11px]"
                >
                  <Sparkles className="h-3 w-3" /> Humanize
                </button>
                <button
                  type="button"
                  onClick={persist}
                  className="btn btn-primary h-8 px-2.5 text-[11px]"
                >
                  <Save className="h-3 w-3" /> {dirty ? "Save" : "Saved"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(activeId)}
                  className="rounded-md p-1.5 text-neutral-500 hover:bg-rose-50 hover:text-rose-700"
                  aria-label="Delete document"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <textarea
              value={draftText}
              onChange={(event) => {
                setDraftText(event.target.value);
                setDirty(true);
              }}
              placeholder="Start writing, or paste a draft…"
              className="min-h-[500px] w-full resize-y bg-transparent px-5 py-4 text-[15px] leading-7 text-neutral-800 outline-none placeholder:text-neutral-500"
              aria-label="Document text"
            />
            <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-2 text-[11px] text-neutral-500">
              <span>{draftText.split(/\s+/).filter(Boolean).length} words · local only</span>
              <span>{dirty ? "Unsaved changes" : "All changes saved"}</span>
            </div>
          </>
        ) : (
          <div className="flex min-h-[500px] flex-col items-center justify-center p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
              <FileText className="h-6 w-6" />
            </span>
            <p className="mt-3 text-sm font-semibold text-neutral-700">No document selected</p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-neutral-500">
              Create a document to keep drafts in this browser, or open the humanizer for a one-off rewrite.
            </p>
            <button type="button" onClick={createDocument} className="btn btn-primary mt-4 h-9 px-4 text-xs">
              <Plus className="h-3.5 w-3.5" /> New document
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
