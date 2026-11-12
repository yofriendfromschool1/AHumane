"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Menu,
  PenLine,
  ScanSearch,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Logo } from "@/components/brand/logo";

const NAV = [
  { href: "/studio", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/studio/documents", label: "Documents", icon: FileText },
];

const TOOLS = [
  { href: "/studio/humanizer", label: "Humanizer", icon: Sparkles },
  { href: "/studio/detector", label: "AI Detector", icon: ScanSearch },
  { href: "/studio/plagiarism", label: "Plagiarism", icon: BookOpen },
  { href: "/studio/writer", label: "AI Writer", icon: PenLine },
];

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/studio": { title: "Dashboard", subtitle: "Your workspace at a glance" },
  "/studio/documents": { title: "Documents", subtitle: "Saved drafts and humanized versions" },
  "/studio/humanizer": { title: "Humanizer", subtitle: "Basic and Pro, both free" },
  "/studio/detector": { title: "AI Detector", subtitle: "See the signals behind the score" },
  "/studio/plagiarism": { title: "Plagiarism", subtitle: "Compare against a transparent source index" },
  "/studio/writer": { title: "AI Writer", subtitle: "Outlines and first drafts" },
  "/studio/settings": { title: "Settings", subtitle: "Defaults, data, and model status" },
};

export function StudioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = TITLES[pathname] ?? { title: "Studio", subtitle: "AHumane" };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const sidebar = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-[68px] items-center justify-between border-b border-neutral-200 px-5">
        <Link href="/" className="inline-flex items-center gap-2" aria-label="AHumane home">
          <Logo markClassName="h-7 w-7" />
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Studio navigation">
        <div className="space-y-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[38px] items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium transition-colors",
                isActive(item.href, item.exact)
                  ? "bg-blue-50 text-blue-700"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
              )}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </div>

        <p className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
          Tools
        </p>
        <div className="mt-1 space-y-0.5">
          {TOOLS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[38px] items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium transition-colors",
                isActive(item.href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
              )}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-800">
            <Sparkles className="h-3 w-3" /> Pro is free
          </p>
          <p className="mt-1 text-[10px] leading-4 text-blue-700/70">
            Every mode, unlimited words. No account, no card.
          </p>
        </div>
      </nav>

      <div className="space-y-0.5 border-t border-neutral-200 px-3 py-3">
        <Link
          href="/studio/settings"
          className={cn(
            "flex min-h-[38px] items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium",
            isActive("/studio/settings")
              ? "bg-blue-50 text-blue-700"
              : "text-neutral-600 hover:bg-neutral-50",
          )}
        >
          <Settings className="h-4 w-4" aria-hidden="true" /> Settings
        </Link>
        <Link
          href="/help"
          className="flex min-h-[38px] items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium text-neutral-600 hover:bg-neutral-50"
        >
          <HelpCircle className="h-4 w-4" aria-hidden="true" /> Help Center
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[232px] border-r border-neutral-200 lg:block">
        {sidebar}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[280px] shadow-2xl">{sidebar}</div>
        </div>
      ) : null}

      <div className="lg:pl-[232px]">
        <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
          <div className="flex h-[68px] items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-md border border-neutral-200 p-2 text-neutral-600 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div>
                <h1 className="text-base font-semibold tracking-tight">{meta.title}</h1>
                <p className="hidden text-[11px] text-neutral-500 sm:block">{meta.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700 sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Unlimited words
              </span>
              <Link
                href="/studio/settings"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800"
                aria-label="Workspace settings"
              >
                A
              </Link>
            </div>
          </div>
        </header>

        <main id="main" className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
