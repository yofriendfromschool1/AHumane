"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { toast } from "@/components/ui/toast";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) {
      setError("Enter an email address, or continue without an account.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not sign in.");
      router.push("/studio");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not sign in.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Log in to AHumane</h1>
      <p className="mt-2 text-sm text-slate-600">
        A local demo account. No password, no verification email, no data sent anywhere.
      </p>

      <div className="mt-6 space-y-2">
        <button
          type="button"
          onClick={() => toast("Demo mode: social sign-in is not connected.")}
          className="btn btn-secondary h-11 w-full justify-center text-sm"
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-blue-600 text-[9px] font-bold text-white">G</span>
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => toast("Demo mode: social sign-in is not connected.")}
          className="btn btn-secondary h-11 w-full justify-center text-sm"
        >
          <span className="text-base leading-none"></span>
          Continue with Apple
        </button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-neutral-200" />
        <span className="text-[10px] uppercase tracking-wider text-neutral-500">or</span>
        <span className="h-px flex-1 bg-neutral-200" />
      </div>

      <form onSubmit={submit}>
        <label htmlFor="email" className="text-xs font-medium text-neutral-700">
          Email address
        </label>
        <div className="mt-1.5 flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3">
          <Mail className="h-4 w-4 text-neutral-500" aria-hidden="true" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
          />
        </div>
        {error ? <p className="mt-2 text-xs text-rose-700">{error}</p> : null}
        <button type="submit" disabled={loading} className="btn btn-primary mt-3 h-11 w-full text-sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Opening studio…" : "Continue with email"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-600">
        By continuing, you agree to the{" "}
        <a href="/terms" className="underline underline-offset-2">Terms</a> and{" "}
        <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a>.
      </p>

      <a
        href="/studio"
        className="mt-6 flex items-center justify-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
      >
        Continue without an account <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}
