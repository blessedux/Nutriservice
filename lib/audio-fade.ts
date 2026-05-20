export function clampGain(value: number, min = 0, max = 1): number {
  return Math.min(Math.max(value, min), max);
}

export function easeOutQuad(t: number): number {
  const u = 1 - t;
  return 1 - u * u;
}

export function easeInQuad(t: number): number {
  return t * t;
}

type FadeToken = { gen: number; raf: number | null };

export function killAudioFade(token: FadeToken) {
  token.gen += 1;
  if (token.raf != null) {
    cancelAnimationFrame(token.raf);
    token.raf = null;
  }
}

export function fadeAudioVolume(
  token: FadeToken,
  audio: HTMLMediaElement,
  from: number,
  to: number,
  durationMs: number,
  ease: (t: number) => number,
  onComplete?: () => void,
) {
  killAudioFade(token);
  const runGen = token.gen;
  const t0 = performance.now();

  const step = (now: number) => {
    if (runGen !== token.gen) return;
    const raw = Math.min(1, (now - t0) / durationMs);
    const k = ease(raw);
    audio.volume = clampGain(from + (to - from) * k);
    if (raw < 1) {
      token.raf = requestAnimationFrame(step);
    } else {
      token.raf = null;
      audio.volume = clampGain(to);
      onComplete?.();
    }
  };

  token.raf = requestAnimationFrame(step);
}
