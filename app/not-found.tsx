import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-6 text-center">
      <Logo />
      <span className="mt-10 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Compass className="h-7 w-7" aria-hidden="true" />
      </span>
      <p className="mt-5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-blue-600">404</p>
      <h1 className="display mt-3 max-w-lg text-[2.2rem] sm:text-[3rem]">
        This page wandered off.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
        The link may be old, or the page may have moved.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary h-11 px-5 text-sm">
          Back to home <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/studio" className="btn btn-secondary h-11 px-5 text-sm">
          Open the studio
        </Link>
      </div>
    </main>
  );
}
