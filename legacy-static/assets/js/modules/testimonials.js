/* Testimonial slider with dots + autoplay */
window.Otterova = window.Otterova || {};

Otterova.testimonials = function () {
  const slider = document.getElementById("testimonialSlider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".testimonial");
  const dotsWrap = document.getElementById("tDots");
  let index = 0;
  let timer;

  const dots = [...slides].map((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", `Show testimonial ${i + 1}`);
    b.addEventListener("click", () => go(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function go(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("is-active", n === index));
    dots.forEach((d, n) => d.classList.toggle("is-active", n === index));
    restart();
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(index + 1), 6000);
  }

  document.getElementById("tPrev").addEventListener("click", () => go(index - 1));
  document.getElementById("tNext").addEventListener("click", () => go(index + 1));
  go(0);
};
