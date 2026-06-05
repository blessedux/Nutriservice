/** Mute de la música ambiental principal (`First_Blossom`, widget / menú Sonido). */
let ambientMasterMuted = false;

export function setAmbientMasterMuted(next: boolean) {
  ambientMasterMuted = next;
}

export function getAmbientMasterMuted(): boolean {
  return ambientMasterMuted;
}
