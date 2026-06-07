type TabHiddenListener = (hidden: boolean) => void;

let tabHidden = false;
let pageFrozen = false;
let started = false;
let pollInterval: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<TabHiddenListener>();

function isTouchPrimaryDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

/** Tab in background, another browser tab, or window lost focus. */
export function computeTabAudioHidden(): boolean {
  if (typeof document === "undefined") return false;
  if (pageFrozen) return true;
  if (document.visibilityState === "hidden" || document.hidden) return true;
  // iOS Safari often reports hasFocus() === false while the page is still visible,
  // which spuriously ducks audio and blocks the mute control during fades.
  if (!isTouchPrimaryDevice() && typeof document.hasFocus === "function") {
    return !document.hasFocus();
  }
  return false;
}

function emit(next: boolean) {
  if (tabHidden === next) return;
  tabHidden = next;
  for (const listener of listeners) {
    listener(next);
  }
}

function syncHiddenState() {
  emit(computeTabAudioHidden());
}

function startPolling() {
  if (pollInterval != null) return;
  pollInterval = setInterval(syncHiddenState, 750);
}

function stopPolling() {
  if (pollInterval == null) return;
  clearInterval(pollInterval);
  pollInterval = null;
}

function startTabAudioVisibility() {
  if (started || typeof document === "undefined") return;
  started = true;
  tabHidden = computeTabAudioHidden();

  document.addEventListener("visibilitychange", syncHiddenState, true);
  window.addEventListener("pagehide", syncHiddenState);
  window.addEventListener("pageshow", syncHiddenState);
  window.addEventListener("blur", syncHiddenState);
  window.addEventListener("focus", syncHiddenState);
  document.addEventListener(
    "freeze",
    () => {
      pageFrozen = true;
      syncHiddenState();
    },
    true,
  );
  document.addEventListener(
    "resume",
    () => {
      pageFrozen = false;
      syncHiddenState();
    },
    true,
  );
}

/** Subscribe to browser tab / app backgrounding (singleton listeners). */
export function subscribeTabAudioHidden(listener: TabHiddenListener): () => void {
  startTabAudioVisibility();
  listener(tabHidden);
  listeners.add(listener);
  if (listeners.size === 1) {
    startPolling();
    syncHiddenState();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      stopPolling();
    }
  };
}

export function getTabAudioHidden(): boolean {
  return tabHidden;
}
