/* GSAP + ScrollTrigger animations: hero intro, text splits,
   reveals, counters, horizontal process, parallax */
window.Otterova = window.Otterova || {};

Otterova.animations = {
  /* ---------- Text splitting helpers ---------- */
  splitLines(el) {
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts
      .map((p) => `<span class="split-line"><span class="split-line__inner">${p.trim()}</span></span>`)
      .join("");
    return el.querySelectorAll(".split-line__inner");
  },

  splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="split-word">${w}</span>`).join(" ");
    return el.querySelectorAll(".split-word");
  },

  /* ---------- Initial hidden states (set before preloader ends) ---------- */
  prepare() {
    gsap.set(".hero__title .line__inner", { yPercent: 110 });
    gsap.set("[data-hero-fade]", { opacity: 0, y: 30 });
    gsap.set(".header", { yPercent: -100 });
  },

  /* ---------- Hero intro ---------- */
  heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to(".header", { yPercent: 0, duration: 1.2 })
      .to(".hero__title .line__inner", { yPercent: 0, duration: 1.4, stagger: 0.12 }, 0.1)
      .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.5)
      .from(".hero__visual", { scale: 0.6, rotate: -20, duration: 1.8 }, 0.3)
      .add(() => gsap.set(".header", { clearProps: "transform" }));
  },

  /* ---------- Scroll-driven effects ---------- */
  scroll() {
    gsap.registerPlugin(ScrollTrigger);

    // Section headings: line-by-line reveal
    document.querySelectorAll("[data-split-lines]").forEach((el) => {
      const lines = this.splitLines(el);
      gsap.from(lines, {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });

    // Intro paragraph: words light up as you scroll
    document.querySelectorAll("[data-split-words]").forEach((el) => {
      const words = this.splitWords(el);
      gsap.to(words, {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
      });
    });

    // Generic fade-up reveal, batched for staggered groups
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.fromTo(batch,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", overwrite: true }),
    });
    gsap.set("[data-reveal]", { opacity: 0 });

    // Counters
    document.querySelectorAll("[data-count]").forEach((el) => {
      const end = +el.dataset.count;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => (el.textContent = Math.round(obj.v)),
      });
    });

    // Hero parallax on scroll out
    gsap.to(".hero__content", {
      yPercent: -18, opacity: 0.2, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero__visual", {
      yPercent: 30, rotate: 12, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });

    // Work media: subtle inner parallax
    document.querySelectorAll(".work-item__media .mock").forEach((m) => {
      gsap.fromTo(m, { y: 40 }, {
        y: -40, ease: "none",
        scrollTrigger: { trigger: m.closest(".work-item"), start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // Footer giant word
    gsap.from(".footer__giant", {
      yPercent: 40, opacity: 0, ease: "none",
      scrollTrigger: { trigger: ".footer", start: "top 90%", end: "bottom bottom", scrub: true },
    });

    this.horizontalProcess();
  },

  /* ---------- Pinned horizontal scroll for the process cards (desktop) ---------- */
  horizontalProcess() {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const track = document.getElementById("processTrack");
      const progress = document.getElementById("processProgress");
      const distance = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: ".process",
          start: "top top",
          end: () => "+=" + distance(),
          pin: ".process__pin",
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => (progress.style.width = self.progress * 100 + "%"),
        },
      });
    });
  },
};
