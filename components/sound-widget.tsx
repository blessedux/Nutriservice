"use client";

import { SoundWaveToggle } from "@/components/sound-wave-toggle";

export default function SoundWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-[110] p-1.5">
      <SoundWaveToggle
        audioSrc="/First_Blossom.mp3"
        showLabel={false}
        tone="on-dark"
      />
    </div>
  );
}
