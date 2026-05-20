/** Ambient SFX (hero sea, UI cues) — independent from background music mute. */
let fxMuted = true;

export function setFxMuted(next: boolean) {
  fxMuted = next;
}

export function getFxMuted(): boolean {
  return fxMuted;
}

export function broadcastFxMuted(muted: boolean) {
  setFxMuted(muted);
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<{ muted: boolean }>("hyperia:fx-muted", {
      detail: { muted },
    }),
  );
}
