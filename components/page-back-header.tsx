import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

export type PageBackCrumb = {
  label: string;
  href?: string;
};

type PageBackHeaderProps = {
  backHref?: string;
  backLabel?: string;
  crumbs?: PageBackCrumb[];
  tone?: "on-dark" | "on-light";
  className?: string;
  /** When true, only shows arrow + back label (no breadcrumb trail). */
  simple?: boolean;
};

export default function PageBackHeader({
  backHref = "/",
  backLabel = "Volver",
  crumbs = [],
  tone = "on-dark",
  className,
  simple = false,
}: PageBackHeaderProps) {
  const onDark = tone === "on-dark";

  return (
    <nav
      className={cn(
        "mb-6 flex flex-wrap items-center gap-3 text-xs",
        className,
      )}
      aria-label="Navegación de página"
    >
      <Link
        href={backHref}
        className={cn(
          "inline-flex items-center gap-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          simple
            ? cn(
                "text-sm font-medium",
                onDark
                  ? "text-white hover:text-white/80 focus-visible:outline-white/40"
                  : "text-ns-text hover:text-ns-muted focus-visible:outline-ns-green/40",
              )
            : cn(
                "rounded-full border px-2.5 py-1.5 font-semibold uppercase tracking-widest",
                onDark
                  ? "border-white/25 bg-white/10 text-white hover:bg-white/15 focus-visible:outline-white/40"
                  : "border-ns-border bg-white text-ns-text hover:bg-ns-surface focus-visible:outline-ns-green/40",
              ),
        )}
      >
        <ChevronLeft
          className={cn("shrink-0", simple ? "h-5 w-5" : "h-4 w-4")}
          aria-hidden
        />
        <span className={simple ? undefined : "sr-only"}>{backLabel}</span>
      </Link>

      {!simple && crumbs.length > 0 ? (
        <ol className="flex flex-wrap items-center gap-2">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {index > 0 ? (
                  <span
                    className={onDark ? "text-white/25" : "text-ns-subtle"}
                    aria-hidden
                  >
                    /
                  </span>
                ) : null}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className={cn(
                      "transition-colors",
                      onDark
                        ? "text-white/50 hover:text-white/80"
                        : "text-ns-muted hover:text-ns-text",
                    )}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "font-semibold uppercase tracking-widest",
                      onDark ? "text-cyan-400" : "text-ns-emerald",
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      ) : null}
    </nav>
  );
}
