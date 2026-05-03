"use client";

import { useState } from "react";
import { SoundWaveToggle } from "../../code";

/** Short CC0-style loop from MDN interactive examples (replace with your asset in production). */
const DEMO_AUDIO_MP3 =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";

export default function SoundWaveToggleDemo() {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={isDark ? "dark" : undefined}>
      <div className="relative flex min-h-[320px] w-full flex-col bg-zinc-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
        <div className="absolute right-4 top-4 z-10 flex items-center gap-3 rounded-full border border-zinc-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/90">
          <span
            className={`text-xs font-medium ${!isDark ? "text-zinc-900" : "text-zinc-400"}`}
          >
            Light
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isDark ? "true" : "false"}
            aria-label="Toggle dark and light preview background"
            onClick={() => setIsDark((d) => !d)}
            className="relative h-7 w-12 shrink-0 rounded-full border border-zinc-300 bg-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-zinc-600 dark:bg-zinc-700 dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-zinc-900"
          >
            <span
              className={`absolute left-0.5 top-0.5 block h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ease-out dark:bg-zinc-100 ${
                isDark ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-xs font-medium ${isDark ? "text-zinc-100" : "text-zinc-400"}`}
          >
            Dark
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center p-12">
          <SoundWaveToggle
            audioSrc={DEMO_AUDIO_MP3}
            tone={isDark ? "on-dark" : "on-light"}
            labelClassName="text-lg tracking-tight"
          />
        </div>
      </div>
    </div>
  );
}
