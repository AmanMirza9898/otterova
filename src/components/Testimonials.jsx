import WaveDivider from "./WaveDivider.jsx";
import { useEffect, useRef, useState } from "react";
import SectionHeader from "./SectionHeader.jsx";
import Otter from "./otter/Otter3D.jsx";
import useOtterLife, { wave } from "./otter/useOtterLife.js";
import { testimonials } from "../data/content.js";
import { gsap, ScrollTrigger, useGSAP, reduceMotion } from "../lib/motion.js";

const DURATION = 7; // seconds per testimonial

const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

function Heart() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3.1 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.8 0 6 3.9 4.5 7.3C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

export default function Testimonials() {
  const root = useRef(null);
  const ottie = useRef(null);
  const timer = useRef(null);
  const [index, setIndex] = useState(0);
  const [happy, setHappy] = useState(false);
  const firstRun = useRef(true);
  const hovering = useRef(false);
  const visible = useRef(false);

  useOtterLife(ottie, [happy]);

  const go = (i) => setIndex((i + testimonials.length) % testimonials.length);

  // Section entrance + only autoplay while the card is on screen
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ".tst",
        start: "top 85%",
        end: "bottom 15%",
        onToggle: (self) => {
          visible.current = self.isActive;
          if (self.isActive && !hovering.current && !reduceMotion()) timer.current?.resume();
          else timer.current?.pause();
        },
      });
      if (reduceMotion()) return;
      gsap.from(".tst", {
        y: 60,
        autoAlpha: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".tst", start: "top 80%" },
      });
      gsap.from(".tst__ottie-inner", {
        yPercent: 100,
        duration: 1,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".tst", start: "top 65%" },
      });
    },
    { scope: root }
  );

  // Each change: reveal the quote, react, restart the timer
  useGSAP(
    () => {
      const reduce = reduceMotion();
      const bars = root.current.querySelectorAll(".tst__tab-bar span");
      gsap.set(bars, { scaleX: 0 });

      if (!reduce) {
        gsap.from(".tq-word", { y: 18, autoAlpha: 0, duration: 0.6, ease: "power3.out", stagger: 0.018 });
        gsap.from(".tst__author > *", { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "power3.out", delay: 0.25 });
        gsap.fromTo(".tst__mark", { scale: 0.6, rotation: -12 }, { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(2.5)" });
      }

      // Autoplay progress on the active tab
      timer.current?.kill();
      timer.current = gsap.fromTo(
        bars[index],
        { scaleX: 0 },
        { scaleX: 1, duration: DURATION, ease: "none", onComplete: () => go(index + 1) }
      );
      if (reduce || hovering.current || !visible.current) timer.current.pause();

      // Ottie reacts (not on the very first render)
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }
      if (reduce) return;
      setHappy(true);
      const svg = ottie.current.querySelector(".otter");
      const hearts = root.current.querySelectorAll(".tst__heart");
      gsap
        .timeline()
        .to(".tst__ottie-inner", { y: -22, duration: 0.25, ease: "power2.out" })
        .to(".tst__ottie-inner", { y: 0, duration: 0.6, ease: "bounce.out" })
        .fromTo(
          hearts,
          { x: 0, y: 0, scale: 0.3, autoAlpha: 0, rotation: 0 },
          {
            keyframes: { autoAlpha: [0, 1, 1, 0] },
            x: () => gsap.utils.random(-70, 70),
            y: () => gsap.utils.random(-170, -100),
            scale: () => gsap.utils.random(0.8, 1.3),
            rotation: () => gsap.utils.random(-30, 30),
            duration: 1.6,
            ease: "power1.out",
            stagger: 0.08,
          },
          0
        )
        .fromTo(".tst__bubble", { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(2.5)" }, 0.1)
        .add(() => setHappy(false), 1.6);
      if (svg) {
        wave(svg, "l", 2);
        wave(svg, "r", 2);
      }
    },
    { scope: root, dependencies: [index] }
  );

  useEffect(() => () => timer.current?.kill(), []);

  // Pause autoplay while hovering
  const pause = () => {
    hovering.current = true;
    timer.current?.pause();
  };
  const resume = () => {
    hovering.current = false;
    if (!reduceMotion() && visible.current) timer.current?.resume();
  };

  // Swipe on touch screens
  const startX = useRef(null);
  const onPointerDown = (e) => (startX.current = e.clientX);
  const onPointerUp = (e) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
    startX.current = null;
  };

  const t = testimonials[index];
  const firstName = t.name.split(" ")[0];

  return (
    <section className="section" ref={root}>
      <div className="container">
        <SectionHeader label="Clients" title="What clients say">
          <p>Kind words from teams we have built with. Ottie reads every single one.</p>
        </SectionHeader>

        <div
          className="tst"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div className="tst__main">
            <span className="tst__mark" aria-hidden="true">“</span>
            <blockquote key={index} className="tst__quote">
              {t.quote.split(" ").map((w, i) => (
                <span key={i} className="tq-word">{w} </span>
              ))}
            </blockquote>

            <div className="tst__author" key={`a-${index}`}>
              <span className="tst__avatar">{initials(t.name)}</span>
              <span>
                <strong>{t.name}</strong>
                <small>{t.role}</small>
              </span>
            </div>

            <div className="tst__nav">
              <div className="tst__tabs" role="tablist" aria-label="Testimonials">
                {testimonials.map((item, i) => (
                  <button
                    key={item.name}
                    role="tab"
                    aria-selected={i === index}
                    className={`tst__tab${i === index ? " is-active" : ""}`}
                    onClick={() => go(i)}
                  >
                    <span className="tst__tab-avatar">{initials(item.name)}</span>
                    <span className="tst__tab-name">{item.name.split(" ")[0]}</span>
                    <span className="tst__tab-bar"><span /></span>
                  </button>
                ))}
              </div>
              <div className="tst__arrows">
                <button onClick={() => go(index - 1)} aria-label="Previous testimonial">←</button>
                <button onClick={() => go(index + 1)} aria-label="Next testimonial">→</button>
              </div>
            </div>
          </div>

          <div className="tst__side" aria-hidden="true">
            <div className="tst__blob" />
            <div className="tst__bubble" key={`b-${index}`}>Thanks, {firstName}!</div>
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i} className="tst__heart"><Heart /></span>
            ))}
            <div className="tst__ottie" ref={ottie}>
              <div className="tst__ottie-inner">
                <Otter mood={happy ? "happy" : "normal"} />
              </div>
            </div>
            <div className="tst__rating">
              <strong>4.9</strong>
              <span>average rating from<br />40+ client reviews</span>
            </div>
          </div>
        </div>
      </div>
      <WaveDivider color="var(--bg-muted)" />
    </section>
  );
}
