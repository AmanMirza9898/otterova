import { useRef } from "react";
import { clients, facts } from "../data/content.js";
import { gsap, ScrollTrigger, useGSAP } from "../lib/motion.js";

export default function Clients() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Endless marquee that speeds up and changes direction with scroll
        const loop = gsap.to(".marquee__track", { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
        let direction = 1;
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity();
            if (v !== 0) direction = v > 0 ? 1 : -1;
            const boost = 1 + Math.min(Math.abs(v) / 300, 6);
            gsap.to(loop, { timeScale: boost * direction, duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.2, overwrite: "auto" });
          },
        });
      });
    },
    { scope: root }
  );

  const list = [...clients, ...clients];

  return (
    <section className="clients-band" ref={root}>
      <div className="container">
        <dl className="facts">
          {facts.map((f) => (
            <div key={f.label} className="facts__item" data-fade>
              <dt>{f.label}</dt>
              <dd>
                {f.count ? <span data-count={f.value}>{f.value}</span> : f.value}
                {f.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="marquee" aria-label="Recent clients">
        <p className="marquee__label container">Trusted by teams at</p>
        <div className="marquee__viewport">
          <ul className="marquee__track">
            {list.map((c, i) => (
              <li key={i} aria-hidden={i >= clients.length}>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
