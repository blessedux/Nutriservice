/** Touch-first / narrow viewports — ambient audio stays off until the user opts in. */
export function isMobileExperience(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(
    "(max-width: 767px), (hover: none) and (pointer: coarse)",
  ).matches;
}
