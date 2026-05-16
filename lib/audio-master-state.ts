/** Sincronía entre mute del widget principal y capas opcionales (p. ej. audio del hero). */
let ambientMasterMuted = false;

export function setAmbientMasterMuted(next: boolean) {
  ambientMasterMuted = next;
}

export function getAmbientMasterMuted(): boolean {
  return ambientMasterMuted;
}
