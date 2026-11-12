"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileSearch,
  Menu,
  ScanSearch,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Logo } from "@/components/brand/logo";
import { MAIN_NAV, PRODUCT_NAV, SITE } from "@/lib/content/site";

const PRODUCT_ICONS = {
  sparkles: Sparkles,
  scan: ScanSearch,
  "file-search": FileSearch,
  chrome: BookOpen,
};

export function Header() {
  const pathname = usePathname();
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProducts, setMobileProducts] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProductsOpen(false);
    setMobileOpen(false);
    setMobileProducts(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!productsOpen) return;
    const onClick = (event: MouseEvent) => {
      if (productsRef.current && !productsRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [productsOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50">
      <div className="brand-gradient text-white">
        <div className="container-page flex h-[38px] items-center justify-center gap-3 text-[13px]">
          <span className="truncate font-medium">{SITE.announcement.label}</span>
          <Link
            href={SITE.announcement.href}
            className="inline-flex shrink-0 items-center gap-1 rounded px-1 py-0.5 text-[13px] text-blue-50 underline-offset-2 hover:text-white hover:underline"
          >
            {SITE.announcement.cta}
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="border-b border-neutral-200/80 bg-white/85 backdrop-blur-md">
        <div className="container-page flex h-[64px] items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="AHumane home"
            className="flex shrink-0 items-center rounded-md"
          >
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            <div className="relative" ref={productsRef}>
              <button
                type="button"
                className={cn(
                  "inline-flex h-10 items-center gap-1.5 rounded-md px-4 text-[15px] font-medium text-neutral-950 transition-colors hover:bg-neutral-50 hover:text-blue-600",
                  productsOpen && "bg-neutral-50 text-blue-600",
                )}
                aria-expanded={productsOpen}
                aria-haspopup="true"
                onClick={() => setProductsOpen((open) => !open)}
              >
                Products
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform", productsOpen && "rotate-180")}
                  aria-hidden="true"
                />
              </button>
              {productsOpen ? (
                <div className="absolute left-0 top-full mt-2 w-[380px] rounded-xl border border-neutral-200 bg-white p-2 shadow-xl shadow-slate-900/5">
                  {PRODUCT_NAV.map((item) => {
                    const Icon = PRODUCT_ICONS[item.icon];
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-neutral-50"
                      >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-sm font-medium text-neutral-900">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block text-xs leading-5 text-neutral-500">
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex h-10 items-center rounded-md px-4 text-[15px] font-medium transition-colors hover:bg-neutral-50 hover:text-blue-600",
                  isActive(item.href) ? "text-blue-600" : "text-neutral-950",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/studio"
              className="btn btn-primary h-10 px-5 text-sm"
            >
              Open Studio
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl"
          >
            <div className="flex h-[64px] items-center justify-between border-b border-neutral-200 px-5">
              <Logo />
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="Mobile navigation">
              <button
                type="button"
                className="flex min-h-[56px] w-full items-center justify-between border-b border-neutral-200 text-left text-lg font-medium"
                aria-expanded={mobileProducts}
                onClick={() => setMobileProducts((open) => !open)}
              >
                Products
                <ChevronDown
                  className={cn("h-5 w-5 transition-transform", mobileProducts && "rotate-180")}
                  aria-hidden="true"
                />
              </button>
              {mobileProducts ? (
                <div className="space-y-1 border-b border-neutral-200 py-2">
                  {PRODUCT_NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex min-h-[48px] items-center rounded-lg px-3 text-base text-neutral-600 hover:bg-neutral-50 hover:text-blue-600"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
              {MAIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-[56px] items-center border-b border-neutral-200 text-lg font-medium hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/about"
                className="flex min-h-[56px] items-center border-b border-neutral-200 text-lg font-medium hover:text-blue-600"
              >
                About
              </Link>
            </nav>
            <div className="border-t border-neutral-200 p-5">
              <Link href="/studio" className="btn btn-primary min-h-[52px] w-full text-base">
                Open Studio
              </Link>
              <p className="mt-3 text-center text-xs text-neutral-500">
                Free forever. No account required.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
