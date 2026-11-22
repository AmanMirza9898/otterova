import WaveDivider from "./WaveDivider.jsx";
import { useRef, useState } from "react";
import SectionHeader from "./SectionHeader.jsx";
import ServiceScene from "./otter/ServiceScene.jsx";
import { services } from "../data/content.js";
import { gsap, ScrollTrigger, useGSAP, tilt3D } from "../lib/motion.js";

export default function Services() {
  const root = useRef(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const items = gsap.utils.toArray(".svc-item");

      // Desktop: the item crossing the middle of the screen becomes active
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1025px)", () => {
        items.forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 58%",
            end: "bottom 58%",
            onToggle: (self) => self.isActive && setActive(i),
          });
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(items, {
          x: -40,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".svc-list", start: "top 80%" },
        });
        gsap.from(".svc-scene", {
          y: 60,
          autoAlpha: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".svc-layout", start: "top 75%" },
        });

        const sticky = root.current.querySelector(".svc-sticky");
        return tilt3D(sticky, sticky.querySelector(".svc-scene"), { maxX: 9, maxY: 12 });
      });
    },
    { scope: root }
  );

  return (
    <section className="section" id="services" ref={root}>
      <div className="container">
        <SectionHeader label="Services" title="What we do">
          <p>
            One team for design, development and infrastructure, so nothing gets lost between
            vendors. Ottie will show you around.
          </p>
        </SectionHeader>

        <div className="svc-layout">
          <ol className="svc-list">
            {services.map((s, i) => (
              <li
                key={s.title}
                className={`svc-item${active === i ? " is-active" : ""}`}
                onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setActive(i)}
              >
                <button className="svc-item__head" onClick={() => setActive(i)} aria-expanded={active === i}>
                  <span className="svc-item__num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{s.title}</h3>
                  <span className="svc-item__icon" aria-hidden="true">+</span>
                </button>
                <div className="svc-item__body">
                  <div>
                    <p>{s.text}</p>
                    <ul className="svc-item__stack">
                      {s.stack.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <span className="svc-item__bar" aria-hidden="true" />
              </li>
            ))}
          </ol>

          <div className="svc-sticky">
            <ServiceScene active={active} services={services} />
          </div>
        </div>
      </div>
      <WaveDivider color="var(--bg-muted)" />
    </section>
  );
}
