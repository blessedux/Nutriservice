export function productosFilterChipClass(active: boolean, onDark: boolean) {
  if (onDark) {
    return active
      ? "border-cyan-400/60 bg-cyan-400/15 text-white"
      : "border-white/20 bg-white/[0.06] text-white/70 hover:border-white/35 hover:text-white";
  }

  return active
    ? "border-ns-green bg-white text-ns-text"
    : "border-ns-border bg-white text-ns-muted hover:border-ns-green";
}
