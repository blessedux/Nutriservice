"use client";

import "../../gooey-search.css";

import { GooeySearch } from "../../code";

export default function GooeySearchDemo() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center bg-zinc-200 px-6 py-16">
      <div className="mb-8 max-w-lg text-center">
        <h1 className="text-lg font-semibold text-zinc-900">
          Gooey Search — toggle demo
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Click <span className="font-medium text-zinc-800">Search</span> to
          open the gooey animation. Click outside the bar or press{" "}
          <kbd className="rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-mono text-xs">
            Esc
          </kbd>{" "}
          to collapse it again.
        </p>
      </div>

      <GooeySearch />
    </div>
  );
}
