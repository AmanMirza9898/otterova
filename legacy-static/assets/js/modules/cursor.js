/* Custom cursor with hover + "View" states (desktop only) */
window.Otterova = window.Otterova || {};

Otterova.cursor = function () {
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

  const ring = document.getElementById("cursor");
  const dot = document.getElementById("cursorDot");
  const label = ring.querySelector(".cursor__label");
  if (!ring || !dot) return;

  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const pos = { x: mouse.x, y: mouse.y };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%)`;
  });

  (function loop() {
    pos.x += (mouse.x - pos.x) * 0.16;
    pos.y += (mouse.y - pos.y) * 0.16;
    ring.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll("a, button, [data-magnetic], .chip").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
  });

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      label.textContent = el.dataset.cursor;
      ring.classList.add("is-view");
    });
    el.addEventListener("mouseleave", () => ring.classList.remove("is-view"));
  });

  document.addEventListener("mouseleave", () => { ring.style.opacity = dot.style.opacity = 0; });
  document.addEventListener("mouseenter", () => { ring.style.opacity = dot.style.opacity = 1; });
};
