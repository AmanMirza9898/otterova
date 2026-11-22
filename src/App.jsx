import { useEffect, useRef } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Clients from "./components/Clients.jsx";
import Film from "./components/Film.jsx";
import Services from "./components/Services.jsx";
import Work from "./components/Work.jsx";
import Process from "./components/Process.jsx";
import About from "./components/About.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import OtterBuddy from "./components/otter/OtterBuddy.jsx";
import { gsap, ScrollTrigger, useGSAP, initSmoothScroll } from "./lib/motion.js";

export default function App() {
  const root = useRef(null);

  useEffect(() => {
    const destroy = initSmoothScroll();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      window.removeEventListener("load", refresh);
      destroy();
    };
  }, []);

  // Generic scroll animations shared by every section.
  // Section-specific motion lives inside each component.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headings: words slide up from a mask
        gsap.utils.toArray("[data-split]:not([data-split-manual])").forEach((el) => {
          gsap.from(el.querySelectorAll(".w__i"), {
            yPercent: 110,
            rotationX: -70,
            transformOrigin: "50% 100%",
            transformPerspective: 500,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.05,
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });

        // Fade-up, batched so neighbours stagger together
        gsap.set("[data-fade]", { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch("[data-fade]", {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.08, overwrite: true }),
        });

        // Counters
        gsap.utils.toArray("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: end,
            duration: 2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
            onUpdate: () => (el.textContent = Math.round(obj.v)),
          });
        });

        // Magnetic buttons (desktop pointers only)
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          gsap.utils.toArray("[data-magnetic]").forEach((el) => {
            const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
            const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
            el.addEventListener("pointermove", (e) => {
              const r = el.getBoundingClientRect();
              xTo((e.clientX - r.left - r.width / 2) * 0.25);
              yTo((e.clientY - r.top - r.height / 2) * 0.35);
            });
            el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
          });
        }

        // Lines that draw in from the left
        gsap.utils.toArray("[data-line]").forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 92%" },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      <a href="#top" className="skip-link">Skip to content</a>
      <Header />
      <main id="top">
        <Hero />
        <Clients />
        <Film />
        <Services />
        <Work />
        <Process />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <OtterBuddy />
    </div>
  );
}
