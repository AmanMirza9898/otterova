/* Preloader: animated logo + counter, then reveals the page */
window.Otterova = window.Otterova || {};

Otterova.preloader = function (onComplete) {
  const el = document.getElementById("preloader");
  const bar = document.getElementById("preloaderBar");
  const count = document.getElementById("preloaderCount");

  const finish = () => {
    document.body.classList.remove("is-loading");
    onComplete && onComplete();
  };

  if (!el) return finish();

  // No GSAP (CDN blocked/offline) → just hide it
  if (!window.gsap) {
    el.style.display = "none";
    return finish();
  }

  const progress = { v: 0 };
  const tl = gsap.timeline();

  tl.to(".preloader__logo", { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" })
    .to(".preloader__word span", { y: 0, duration: 0.8, stagger: 0.05, ease: "expo.out" }, "-=0.5")
    .to(progress, {
      v: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(progress.v);
        count.textContent = v;
        bar.style.width = v + "%";
      },
    }, "-=0.6")
    .to(".preloader__inner", { y: -40, opacity: 0, duration: 0.6, ease: "power3.in" })
    .to(el, {
      clipPath: "inset(0 0 100% 0)",
      duration: 1,
      ease: "expo.inOut",
      onStart: finish,
      onComplete: () => (el.style.display = "none"),
    }, "-=0.2");
};
