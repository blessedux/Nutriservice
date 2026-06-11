"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

import {
  NOSOTROS_TIMELINE_ENTRIES,
  type TimelineMilestone,
} from "@/lib/nosotros-timeline-milestones";
import { cn } from "@/lib/utils";

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

function fadeUp(reducedMotion: boolean | null, visible: boolean, delay = 0) {
  if (reducedMotion) {
    return { opacity: 1, y: 0 };
  }

  return visible
    ? {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: REVEAL_EASE, delay },
      }
    : { opacity: 0, y: 20 };
}

function TimelineMilestoneItem({
  entry,
  showYear,
  reducedMotion,
}: {
  entry: TimelineMilestone;
  showYear: boolean;
  reducedMotion: boolean | null;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.35,
    margin: "0px 0px -52% 0px",
  });

  const visible = Boolean(reducedMotion || isInView);

  return (
    <motion.li
      ref={ref}
      className="relative pb-10 last:pb-0"
      initial={false}
    >
      <span
        className="absolute -left-[calc(2rem+0.5px)] top-1.5 size-2.5 rounded-full bg-ns-emerald ring-4 ring-ns-navy sm:-left-[calc(2.5rem+0.5px)]"
        aria-hidden
      />

      {showYear ? (
        <motion.p
          animate={fadeUp(reducedMotion, visible, 0)}
          className="text-2xl font-bold tabular-nums tracking-tight text-white sm:text-3xl"
        >
          {entry.year}
        </motion.p>
      ) : null}

      <motion.h3
        animate={fadeUp(reducedMotion, visible, showYear ? 0.1 : 0)}
        className={cn(
          "text-base font-semibold leading-snug text-white sm:text-lg",
          showYear ? "mt-3" : "mt-0",
        )}
      >
        {entry.title}
      </motion.h3>

      {entry.summary ? (
        <motion.p
          animate={fadeUp(reducedMotion, visible, showYear ? 0.2 : 0.1)}
          className="mt-2 text-pretty text-sm leading-relaxed text-white/65 sm:text-base"
        >
          {entry.summary}
        </motion.p>
      ) : null}
    </motion.li>
  );
}

export default function ImpactoHistorySection({
  className,
}: {
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className={cn("px-6 sm:px-10 lg:px-12", className)}
      aria-labelledby="nosotros-historia-heading"
    >
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2
            id="nosotros-historia-heading"
            className="text-balance text-3xl font-bold text-white sm:text-4xl"
          >
            Nuestra Historia
          </h2>
        </div>

        <ol className="relative mt-12 space-y-0 border-l border-white/15 pl-8 sm:pl-10">
          {NOSOTROS_TIMELINE_ENTRIES.map((entry, index) => {
            const showYear =
              index === 0 ||
              NOSOTROS_TIMELINE_ENTRIES[index - 1]?.year !== entry.year;

            return (
              <TimelineMilestoneItem
                key={`${entry.year}-${entry.title}`}
                entry={entry}
                showYear={showYear}
                reducedMotion={reducedMotion}
              />
            );
          })}
        </ol>
      </div>
    </section>
  );
}
