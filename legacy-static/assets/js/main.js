/* =========================================================
   OTTEROVA — MAIN
   Boots smooth scroll, animations and all UI modules.
   ========================================================= */
(function () {
  const O = window.Otterova;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  // --- Smooth scrolling (Lenis) synced with GSAP's ticker
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    if (hasGSAP) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    lenis.stop(); // locked until preloader finishes
  }

  // --- UI modules (work with or without GSAP)
  O.cursor();
  O.navigation(lenis);
  O.interactions();
  O.testimonials();
  O.form();

  // --- Animations
  if (hasGSAP && !reduceMotion) {
    O.animations.prepare();
    O.animations.scroll();
  }

  O.preloader(() => {
    lenis && lenis.start();
    if (hasGSAP && !reduceMotion) O.animations.heroIntro();
    if (hasGSAP) ScrollTrigger.refresh();
  });

  // Recalculate positions once fonts/images are ready
  window.addEventListener("load", () => hasGSAP && ScrollTrigger.refresh());
})();
