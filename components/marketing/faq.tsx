"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({
  items,
  defaultOpen = -1,
  className,
}: {
  items: FaqItem[];
  defaultOpen?: number;
  className?: string;
}) {
  const [open, setOpen] = useState<number>(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn("mx-auto w-full max-w-3xl space-y-2", className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div
            key={item.q}
            className={cn(
              "overflow-hidden rounded-xl border bg-white transition-colors",
              isOpen ? "border-blue-200" : "border-neutral-200",
            )}
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className="flex min-h-[60px] w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
              >
                {item.q}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-5 text-[15px] leading-7 text-slate-600"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
