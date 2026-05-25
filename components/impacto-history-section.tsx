"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ImpactoHistorySection() {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="flex min-h-[calc(100dvh-8rem)] w-full flex-col items-center justify-center rounded-[2rem] border border-ns-border bg-ns-surface text-center sm:min-h-[calc(100dvh-9rem)] sm:rounded-[2.5rem]">
        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="inline-flex items-center justify-center rounded-full border border-ns-border bg-white px-10 py-4 text-sm font-bold uppercase tracking-[0.14em] text-ns-text shadow-sm transition-colors hover:border-ns-green/30 hover:bg-ns-surface active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ns-green/40"
          >
            Ver nuestra historia
          </button>
        ) : (
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl font-light tracking-tight text-ns-text sm:text-4xl"
          >
            Coming soon
          </motion.h2>
        )}
      </div>
    </section>
  );
}
