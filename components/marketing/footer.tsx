import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { FOOTER_NAV } from "@/lib/content/site";

export function Footer() {
  return (
    <footer className="bg-blue-600 text-white">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Link href="/" aria-label="AHumane home" className="inline-flex">
              <Logo inverted markClassName="ring-1 ring-white/30" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-blue-50">
              A free AI humanizer, detector, and writing studio. Writing that sounds like you.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <Facebook className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {FOOTER_NAV.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-50">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-blue-50 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-blue-50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AHumane. All rights reserved.</p>
          <p>
            Built for people who still care how a sentence sounds.
          </p>
        </div>
      </div>
    </footer>
  );
}
