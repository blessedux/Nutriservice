"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

type CtaFooterParallaxContextValue = {
  shellRef: RefObject<HTMLDivElement | null>;
  active: boolean;
  setActive: (active: boolean) => void;
};

const CtaFooterParallaxContext =
  createContext<CtaFooterParallaxContextValue | null>(null);

export function CtaFooterParallaxProvider({ children }: { children: ReactNode }) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [active, setActiveState] = useState(false);

  const setActive = useCallback((next: boolean) => {
    setActiveState((current) => (current === next ? current : next));
  }, []);

  const value = useMemo(
    () => ({
      shellRef,
      active,
      setActive,
    }),
    [active, setActive],
  );

  return (
    <CtaFooterParallaxContext.Provider value={value}>
      {children}
    </CtaFooterParallaxContext.Provider>
  );
}

export function useCtaFooterParallax() {
  return useContext(CtaFooterParallaxContext);
}
