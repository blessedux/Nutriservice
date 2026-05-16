"use client";

import { SoundWaveToggle } from "@/components/sound-wave-toggle";
import { AMBIENT_MUSIC_MAX_GAIN } from "@/lib/audio-gain";

export default function SoundWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-[110] p-1.5">
      <SoundWaveToggle
        audioSrc="/First_Blossom.mp3"
        maxLinearGain={AMBIENT_MUSIC_MAX_GAIN}
        showLabel={false}
        tone="on-dark"
      />
    </div>
  );
}
