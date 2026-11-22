import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Single shared Lenis instance so any component can scroll to an anchor.
let lenis = null;

export function initSmoothScroll() {
  if (reduceMotion()) return () => {};

  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  };
}

export function scrollToTarget(href) {
  const target = href === "#top" ? 0 : document.querySelector(href);
  if (target === null) return;
  if (lenis) lenis.scrollTo(target, { offset: href === "#top" ? 0 : -64, duration: 1.4 });
  else if (target === 0) window.scrollTo({ top: 0, behavior: "smooth" });
  else target.scrollIntoView({ behavior: "smooth" });
}

export function getLenis() {
  return lenis;
}

export { gsap, ScrollTrigger, useGSAP };

// 3D tilt: rotates `target` towards the pointer while it moves over `area`.
// Desktop pointers only, and skipped for reduced motion. Returns a cleanup function.
export function tilt3D(area, target, { maxX = 8, maxY = 10, perspective = 900 } = {}) {
  if (!area || !target || reduceMotion()) return () => {};
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};

  gsap.set(target, { transformPerspective: perspective, transformStyle: "preserve-3d" });
  const rx = gsap.quickTo(target, "rotationX", { duration: 0.8, ease: "power3.out" });
  const ry = gsap.quickTo(target, "rotationY", { duration: 0.8, ease: "power3.out" });

  const move = (e) => {
    const r = area.getBoundingClientRect();
    ry(((e.clientX - r.left) / r.width - 0.5) * 2 * maxY);
    rx(-((e.clientY - r.top) / r.height - 0.5) * 2 * maxX);
  };
  const leave = () => { rx(0); ry(0); };
  area.addEventListener("pointermove", move);
  area.addEventListener("pointerleave", leave);
  return () => {
    area.removeEventListener("pointermove", move);
    area.removeEventListener("pointerleave", leave);
  };
}
