import { cn } from "@/lib/utils/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("h-8 w-8", className)}
    >
      <rect width="32" height="32" rx="9" fill="#2563EB" />
      <path
        d="M9 23.2 15.1 8.8h1.9L23 23.2h-3.1l-1.3-3.4H13.3L12 23.2H9Zm5.1-6.1h3.7L16 12.4l-1.9 4.7Z"
        fill="white"
      />
      <path
        d="M20.2 23.2c1.2 0 2.1-.4 2.8-1.1"
        stroke="#93C5FD"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="24.4" cy="9.2" r="2.1" fill="#FDBA74" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  inverted = false,
}: {
  className?: string;
  markClassName?: string;
  inverted?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span
        className={cn(
          "text-[1.35rem] font-semibold tracking-[-0.045em]",
          inverted ? "text-white" : "text-[#020817]",
        )}
      >
        AHumane
      </span>
    </span>
  );
}
