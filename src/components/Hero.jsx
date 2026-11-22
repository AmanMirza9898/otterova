import { Fragment, Suspense, lazy, useRef } from "react";
import HeroScene from "./otter/HeroScene.jsx";

// Three.js is heavy: load it after the page is interactive
const WaveScene = lazy(() => import("./WaveScene.jsx"));
import { gsap, useGSAP, scrollToTarget, tilt3D } from "../lib/motion.js";

const lines = ["We design and", "build software", "for growing", "businesses."];

export default function Hero() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Intro
        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
        tl.from(".hero__line-inner", {
          yPercent: 115,
          rotationX: -80,
          transformOrigin: "50% 100%",
          transformPerspective: 600,
          duration: 1.5,
          stagger: 0.05,
        })
          .from(".hero__label", { autoAlpha: 0, y: 16, duration: 1 }, 0.2)
          .from(".hero__fade", { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.1 }, 0.55)
          .from(".hero__scroll", { autoAlpha: 0, duration: 1 }, 1.1)
          .fromTo(
            ".hero__squiggle path",
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" },
            0.9
          );

        // Scroll out: content drifts up and fades
        gsap.to(".hero__content", {
          yPercent: -25,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        // Ottie's scene leans towards the cursor anywhere in the hero
        return tilt3D(root.current, root.current.querySelector(".hero-scene"), { maxX: 7, maxY: 11 });
      });
    },
    { scope: root }
  );

  return (
    <section className="hero" ref={root}>
      <Suspense fallback={null}>
        <WaveScene />
      </Suspense>
      <div className="container hero__layout">
      <div className="hero__content">
        <a
          href="#contact"
          className="hero__label"
          onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); }}
        >
          <span className="hero__label-tag">
            <span className="status-dot" aria-hidden="true" />
            Open
          </span>
          Now booking projects for January 2027
          <span className="hero__label-arrow" aria-hidden="true">→</span>
        </a>

        <h1 className="hero__title" aria-label={lines.join(" ")}>
          {lines.map((line, li) => {
            const words = line.split(" ").map((word, wi) => (
              <Fragment key={wi}>
                <span className="hero__word" aria-hidden="true">
                  <span className="hero__line-inner">{word}</span>
                </span>{" "}
              </Fragment>
            ));
            const last = li === lines.length - 1;
            return (
              <Fragment key={line}>
                {last ? (
                  <span className="hero__accent">
                    {words}
                    {/* Hand-drawn wave under the accent word */}
                    <svg className="hero__squiggle" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
                      <path pathLength="1" d="M4 14 C 30 2, 50 22, 76 12 S 122 2, 148 12 S 194 22, 220 12 S 266 2, 296 10" />
                    </svg>
                  </span>
                ) : (
                  words
                )}
                {!last && <br className="hero__br" />}
              </Fragment>
            );
          })}
        </h1>

        <p className="hero__lead hero__fade">
          Otterova is a team of <strong>24 designers and engineers</strong> in Gurugram. We build{" "}
          <strong>websites, mobile apps and AI tools</strong> for startups and established
          companies, from first version to long-term support.
        </p>

        <div className="hero__actions hero__fade">
          <a href="#contact" className="btn btn--brand" data-magnetic onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); }}>
            <span className="btn__label"><span data-text="Discuss your project">Discuss your project</span></span>
            <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
          <a href="#work" className="btn btn--outline" data-magnetic onClick={(e) => { e.preventDefault(); scrollToTarget("#work"); }}>
            <span className="btn__label"><span data-text="View our work">View our work</span></span>
          </a>
        </div>

        <div className="hero__proof hero__fade">
          <span className="hero__avatars" aria-hidden="true">
            <i>RK</i><i>SM</i><i>DL</i><i>+40</i>
          </span>
          <span>
            <span className="hero__stars" aria-hidden="true">★★★★★</span>
            <b>4.9/5</b> from 40+ client reviews
          </span>
        </div>
      </div>
      <HeroScene />
      </div>

      <div className="container hero__bottom">
        <span className="hero__scroll" aria-hidden="true">
          <i /> Scroll to explore
        </span>
        <span className="hero__hint hero__fade">Click Ottie to say hi</span>
      </div>
    </section>
  );
}
