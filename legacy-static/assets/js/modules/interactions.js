/* Micro-interactions: magnetic buttons, 3D tilt + spotlight cards */
window.Otterova = window.Otterova || {};

Otterova.interactions = function () {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover) return;

  // Magnetic elements pull toward the cursor
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const strength = el.classList.contains("btn") ? 0.35 : 0.25;
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.transform = "";
      setTimeout(() => (el.style.transition = ""), 600);
    });
  });

  // Service cards: 3D tilt + cursor spotlight
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", px * 100 + "%");
      card.style.setProperty("--my", py * 100 + "%");
      card.style.transform = `rotateY(${(px - 0.5) * 8}deg) rotateX(${(0.5 - py) * 8}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s";
      card.style.transform = "";
      setTimeout(() => (card.style.transition = ""), 800);
    });
  });

  // Hero otter follows the mouse slightly
  const visual = document.querySelector(".hero__otter");
  const hero = document.getElementById("hero");
  if (visual && hero) {
    hero.addEventListener("mousemove", (e) => {
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 30;
      visual.style.translate = `${x}px ${y}px`;
    });
  }
};
