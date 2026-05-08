"use client";

import { createContext, useContext, type ReactNode } from "react";

/** True once the intro preloader has finished fading and unmounted (`overlay === "off"`). */
const HeroRevealContext = createContext(false);

export function HeroRevealProvider({
  value,
  children,
}: Readonly<{ value: boolean; children: ReactNode }>) {
  return (
    <HeroRevealContext.Provider value={value}>
      {children}
    </HeroRevealContext.Provider>
  );
}

export function useHeroRevealReady() {
  return useContext(HeroRevealContext);
}
