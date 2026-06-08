const KEY_ENTERED = "nutriservice:entered";
const KEY_SOUND = "nutriservice:sound-enabled";

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/** True when the user has already clicked Enter in this browser session. */
export function hasEnteredSession(): boolean {
  return storage()?.getItem(KEY_ENTERED) === "true";
}

/**
 * Returns the saved sound preference for this session, or `null` if the
 * user has not entered yet (first visit).
 */
export function getSessionSoundEnabled(): boolean | null {
  const raw = storage()?.getItem(KEY_SOUND);
  if (raw === null || raw === undefined) return null;
  return raw === "true";
}

/** Persist the Enter action and the sound choice for the current session. */
export function markSessionEntered(soundEnabled: boolean): void {
  const s = storage();
  if (!s) return;
  s.setItem(KEY_ENTERED, "true");
  s.setItem(KEY_SOUND, String(soundEnabled));
}
