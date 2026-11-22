/* Header states, mobile menu, smooth anchor scrolling, active link */
window.Otterova = window.Otterova || {};

Otterova.navigation = function (lenis) {
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");

  // --- Header: shrink on scroll, hide on scroll-down, show on scroll-up
  let lastY = 0;
  const onScroll = (y) => {
    header.classList.toggle("is-scrolled", y > 40);
    const menuOpen = menu.classList.contains("is-open");
    header.classList.toggle("is-hidden", !menuOpen && y > lastY && y > 400);
    lastY = y;
  };
  if (lenis) lenis.on("scroll", ({ scroll }) => onScroll(scroll));
  else window.addEventListener("scroll", () => onScroll(window.scrollY), { passive: true });

  // --- Mobile menu
  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));

  // --- Smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2 && id !== "#") return;
      const target = id === "#" || id === "#top" ? 0 : document.querySelector(id);
      if (target === null) return;
      e.preventDefault();
      setMenu(false);
      if (lenis) lenis.scrollTo(target, { offset: -20, duration: 1.4 });
      else if (target === 0) window.scrollTo({ top: 0, behavior: "smooth" });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // --- Active nav link
  const links = document.querySelectorAll(".nav__link");
  const sections = [...links].map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => io.observe(s));
};
