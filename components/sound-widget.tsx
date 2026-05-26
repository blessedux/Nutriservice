"use client";

import { SoundWaveToggle } from "@/components/sound-wave-toggle";
import { useMobileExperience } from "@/hooks/use-mobile-experience";
import { AMBIENT_MUSIC_MAX_GAIN } from "@/lib/audio-gain";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

export default function SoundWidget() {
  const isMobile = useMobileExperience();

  if (isMobile !== false) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[110] p-1.5">
      <SoundWaveToggle
        audioSrc={PUBLIC_ASSETS.audio.ambient}
        maxLinearGain={AMBIENT_MUSIC_MAX_GAIN}
        autoBootstrap={false}
        showLabel={false}
        tone="on-dark"
      />
    </div>
  );
}
