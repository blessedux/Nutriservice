type TabHiddenListener = (hidden: boolean) => void;

let tabHidden = false;
let started = false;
let pollInterval: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<TabHiddenListener>();

/** Tab in background, another browser tab, or window lost focus. */
export function computeTabAudioHidden(): boolean {
  if (typeof document === "undefined") return false;
  return (
    document.visibilityState === "hidden" ||
    document.hidden ||
    !document.hasFocus()
  );
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
