import Lenis from "lenis";

export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

let lenis: Lenis | undefined;

export function startSmoothScroll() {
  if (window.matchMedia(reducedMotionQuery).matches) return () => {};
  lenis = new Lenis({ duration: 1.1, smoothWheel: true, autoRaf: true });
  return () => {
    lenis?.destroy();
    lenis = undefined;
  };
}

export function scrollToHash(hash: string) {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { offset: -16 });
  else target.scrollIntoView({ behavior: "smooth" });
}

export function interceptAnchors() {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || link.hash.length < 2) return;
    event.preventDefault();
    scrollToHash(link.hash);
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}

export const springs = {
  soft: { type: "spring", stiffness: 120, damping: 20, mass: 0.9 },
  snappy: { type: "spring", stiffness: 320, damping: 24 },
  bouncy: { type: "spring", stiffness: 180, damping: 9 },
} as const;
