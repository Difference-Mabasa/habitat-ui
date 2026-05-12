import { useEffect, useState } from "react";

export type Breakpoint = "sm" | "md" | "lg";

/** Width thresholds (px). Anything < `sm` is phone, < `md` is tablet, else desktop. */
const SM_MAX = 720;
const MD_MAX = 1080;

export interface Viewport {
  width: number;
  breakpoint: Breakpoint;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  /** True when ≤ md — useful for "collapse the right rail" decisions. */
  isMobileOrTablet: boolean;
}

function readWidth(): number {
  if (typeof window === "undefined") return 1440;
  return window.innerWidth;
}

function bpFor(width: number): Breakpoint {
  if (width < SM_MAX) return "sm";
  if (width < MD_MAX) return "md";
  return "lg";
}

/**
 * Reactive viewport hook. Re-renders whenever the viewport crosses a
 * breakpoint boundary. Used by the top screens to flip between
 * desktop / tablet / phone layouts.
 */
export function useViewport(): Viewport {
  const [width, setWidth] = useState(() => readWidth());

  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const breakpoint = bpFor(width);
  return {
    width,
    breakpoint,
    isSm: breakpoint === "sm",
    isMd: breakpoint === "md",
    isLg: breakpoint === "lg",
    isMobileOrTablet: breakpoint !== "lg",
  };
}
