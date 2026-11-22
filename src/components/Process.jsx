import WaveDivider from "./WaveDivider.jsx";
import { useRef, useState } from "react";
import SplitText from "./SplitText.jsx";
import OtterSwim from "./otter/OtterSwim.jsx";
import { process } from "../data/content.js";
import { gsap, useGSAP, reduceMotion } from "../lib/motion.js";

const icons = [
  <path key="0" d="M10.5 4.5a6 6 0 1 1 0 12a6 6 0 0 1 0-12zM20 20l-5-5" />,
  <path key="1" d="M10 6h10M10 12h10M10 18h10M4 6l1.2 1.2L7.5 5M4 12l1.2 1.2L7.5 11M4 18l1.2 1.2L7.5 17" />,
  <path key="2" d="M4 20l4.5-1L19 8.5 15.5 5 5 15.5 4 20zM13.5 7l3.5 3.5" />,
  <path key="3" d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15" />,
  <path key="4" d="M5 19s1-4 3-6m6-9c-4 1-7 4-8.5 8.5l3 3C13 14 16 11 17 7c.3-1 .3-2 0-3-1-.3-2-.3-3 0zM14.5 9.5a1 1 0 1 0 0-.01M6 14l-2 1 1-3M10 18l-1 2 3-1" />,
];

const quips = [
  "Asking lots of questions",
  "Mapping out the route",
  "Sketching every screen",
  "Writing the code",
  "Launch day!",
];

function Icon({ i }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[i]}
    </svg>
  );
}

export default function Process() {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(-1);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const track = q(".process__track")[0];
      const lane = q(".process__lane")[0];
      const cards = q(".process-card");
      const buoys = q(".process__buoy");
      const swimmer = q(".process__swimmer")[0];
      const rot = q(".process__swimmer-rot")[0];
      const river = q(".process__river")[0];
      const band = q(".river-band")[0];
      const lineEl = q(".river-line")[0];
      const reduce = reduceMotion();

      const celebrate = () => {
        const bits = q(".process__confetti i");
        gsap
          .timeline()
          .to(q(".process__swimmer-jump"), { y: -26, duration: 0.25, ease: "power2.out", yoyo: true, repeat: 1 })
          .fromTo(
            bits,
            { x: 0, y: 0, autoAlpha: 1, rotation: 0 },
            {
              x: () => gsap.utils.random(-80, 80),
              y: () => gsap.utils.random(-110, -50),
              rotation: () => gsap.utils.random(-200, 200),
              autoAlpha: 0,
              duration: 1.3,
              ease: "power2.out",
              stagger: 0.015,
            },
            0
          );
      };

      // Highlight the step Ottie has reached
      const mark = (idx) => {
        if (idx === activeRef.current) return;
        const prev = activeRef.current;
        activeRef.current = idx;
        setActive(idx);
        cards.forEach((c, i) => {
          c.classList.toggle("is-reached", i <= idx);
          c.classList.toggle("is-current", i === idx);
        });
        buoys.forEach((b, i) => {
          b.classList.toggle("is-reached", i <= idx);
          b.classList.toggle("is-current", i === idx);
        });
        if (reduce) return;
        if (buoys[idx]) gsap.fromTo(buoys[idx], { scale: 1.6 }, { scale: 1, duration: 0.6, ease: "back.out(3)" });
        gsap.fromTo(q(".process__bubble"), { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(2.5)" });
        if (idx === cards.length - 1 && prev < idx) celebrate();
      };

      // Idle swimming
      if (!reduce) {
        gsap.to(q(".os-paw--front"), { rotation: 35, svgOrigin: "132 62", duration: 0.35, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(q(".os-paw--back"), { rotation: -35, svgOrigin: "68 62", duration: 0.35, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.17 });
        gsap.to(q(".os-tail"), { rotation: 12, svgOrigin: "44 56", duration: 0.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(q(".os-head"), { rotation: -4, svgOrigin: "150 50", duration: 1.1, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(q(".process__swimmer-bob"), { y: -3, duration: 0.9, yoyo: true, repeat: -1, ease: "sine.inOut" });
        q(".process__wake i").forEach((w, i) => {
          gsap.fromTo(w, { x: 0, scale: 0.4, opacity: 0.8 }, { x: -60, scale: 1.2, opacity: 0, duration: 1.4, repeat: -1, delay: i * 0.45, ease: "sine.out" });
        });
      }

      const mm = gsap.matchMedia();

      // ---------- Desktop: pinned horizontal river ----------
      mm.add("(min-width: 1025px) and (prefers-reduced-motion: no-preference)", () => {
        const H = 120;
        const amp = 12;
        const freq = 1 / 85;
        const yAt = (x) => H / 2 + amp * Math.sin(x * freq);
        let centers = [];

        const layout = () => {
          const W = track.scrollWidth;
          centers = cards.map((c) => c.offsetLeft + c.offsetWidth / 2);
          lane.style.width = W + "px";
          river.setAttribute("viewBox", `0 0 ${W} ${H}`);
          let d = `M-800 ${yAt(-800).toFixed(1)}`;
          for (let x = -784; x <= W + 400; x += 16) d += ` L${x} ${yAt(x).toFixed(1)}`;
          lineEl.setAttribute("d", d);
          band.setAttribute("d", `${d} L${W + 400} ${H} L-800 ${H} Z`);
          buoys.forEach((b, i) => {
            b.style.left = centers[i] + "px";
            b.style.top = yAt(centers[i]) + "px";
          });
        };

        const place = (p) => {
          if (!centers.length) return;
          const x = centers[0] + p * (centers[centers.length - 1] - centers[0]);
          gsap.set(swimmer, { x, y: yAt(x) });
          gsap.set(rot, { rotation: Math.atan(amp * freq * Math.cos(x * freq)) * 57.3 });
          let idx = 0;
          centers.forEach((c, i) => { if (x >= c - 40) idx = i; });
          mark(idx);
        };

        layout();
        place(0);

        // Shift so the last card ends at the container edge (viewport has left padding)
        const distance = () => {
          const vp = track.parentElement;
          const pad = parseFloat(getComputedStyle(vp).paddingLeft) || 0;
          return Math.max(0, track.scrollWidth + pad * 2 - vp.clientWidth);
        };
        let tween = null;
        tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: () => { layout(); place(tween ? tween.progress() : 0); },
          },
          onUpdate() { place(this.progress()); },
        });

        gsap.to(q(".process__progress span"), {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => "+=" + distance(), scrub: true },
        });

        cards.forEach((card) => {
          gsap.from(card.querySelector(".process-card__num"), {
            xPercent: 40,
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 95%", end: "left 55%", scrub: true },
          });
        });

        return () => {
          lane.style.width = "";
          gsap.set([swimmer, rot], { clearProps: "all" });
        };
      });

      // ---------- Tablet / mobile / reduced motion: vertical river ----------
      mm.add("(max-width: 1024px), (prefers-reduced-motion: reduce)", () => {
        const mids = () => cards.map((c) => c.offsetTop + c.offsetHeight / 2);
        gsap.set(swimmer, { x: 0, y: mids()[0] });
        gsap.set(rot, { rotation: 90 });
        mark(0);

        gsap.utils.toArray(cards).forEach((card) => {
          if (reduce) return;
          gsap.from(card, { y: 50, autoAlpha: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 88%" } });
        });

        const st = {
          trigger: track,
          start: "top 60%",
          end: "bottom 60%",
          onUpdate: (self) => {
            const m = mids();
            const y = m[0] + self.progress * (m[m.length - 1] - m[0]);
            gsap.to(swimmer, { y, duration: reduce ? 0 : 0.35, ease: "power2.out", overwrite: true });
            let idx = 0;
            m.forEach((v, i) => { if (y >= v - 30) idx = i; });
            mark(idx);
          },
        };
        gsap.timeline({ scrollTrigger: st });

        return () => gsap.set([swimmer, rot], { clearProps: "all" });
      });
    },
    { scope: root }
  );

  return (
    <section className="process" id="process" ref={root}>
      <div className="process__inner">
        <div className="container process__head">
          <div>
            <p className="section-label">Process</p>
            <SplitText as="h2" className="section-title" text="How a project runs" />
          </div>
          <p className="process__intro">
            A typical project takes 8 to 16 weeks. You have a single point of contact and a
            shared board where you can follow progress at any time. Follow Ottie down the river.
          </p>
        </div>

        <div className="process__viewport">
          <div className="process__track">
            <ol className="process__cards">
              {process.map((step, i) => (
                <li key={step.title} className="process-card">
                  <div className="process-card__top">
                    <span className="process-card__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="process-card__icon"><Icon i={i} /></span>
                  </div>
                  <div className="process-card__body">
                    <span className="process-card__duration">{step.duration}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="process__lane" aria-hidden="true">
              <svg className="process__river" preserveAspectRatio="none">
                <path className="river-band" />
                <path className="river-line" />
              </svg>

              {process.map((_, i) => (
                <span key={i} className="process__buoy">{i + 1}</span>
              ))}

              <div className="process__swimmer">
                <div className="process__bubble">
                  <span className="process__bubble-icon"><Icon i={active} /></span>
                  {quips[active]}
                </div>
                <div className="process__swimmer-jump">
                  <div className="process__swimmer-rot">
                    <div className="process__wake"><i /><i /><i /></div>
                    <div className="process__swimmer-bob">
                      <OtterSwim />
                    </div>
                  </div>
                </div>
                <div className="process__confetti">
                  {Array.from({ length: 16 }, (_, i) => (
                    <i key={i} style={{ background: ["#bf4b1c", "#f2a276", "#3ddc84", "#fffaf4"][i % 4] }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="process__progress"><span /></div>
        </div>
      </div>
      <WaveDivider color="var(--bg-muted)" back="var(--brand)" />
    </section>
  );
}
