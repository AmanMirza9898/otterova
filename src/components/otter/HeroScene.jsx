import { useRef, useState } from "react";
import OtterFloat3D from "./OtterFloat3D.jsx";
import useOtterLife from "./useOtterLife.js";
import { gsap, useGSAP, reduceMotion } from "../../lib/motion.js";

const lines = [
  "Hi, I'm Ottie! Just shipping a website.",
  "We build websites, apps and AI tools.",
  "Two-week sprints. Demo every Friday.",
  "Psst… our work is just below.",
  "Got a project? Let's talk!",
];

const chips = ["Website", "Mobile app", "AI assistant", "Design system", "Dashboard"];

export default function HeroScene() {
  const root = useRef(null);
  const loop = useRef(null);
  const typingRef = useRef(null);
  const busy = useRef(false);
  const float3d = useRef(null);
  const [line, setLine] = useState(0);

  useOtterLife(root);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q(".of-site > *, .of-badge"), { autoAlpha: 0, transformOrigin: "50% 50%" });
      gsap.set(q(".of-code rect:not(.of-caret)"), { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(q(".of-tail"), { transformOrigin: "2% 60%" });
      gsap.set(q(".of-foot"), { transformOrigin: "50% 100%" });

      if (reduceMotion()) {
        gsap.set(q(".of-code rect"), { scaleX: 1 });
        gsap.set(q(".ottie-bubble"), { autoAlpha: 1 });
        return;
      }

      // ---- Intro: float in from the right, then say hi
      gsap.set(q(".ottie-bubble"), { autoAlpha: 0, scale: 0.6, transformOrigin: "20% 100%" });
      gsap
        .timeline({ delay: 0.6 })
        .from(q(".of-otter"), { x: 140, y: 30, rotation: 6, autoAlpha: 0, duration: 2, ease: "power3.out", svgOrigin: "270 240" })
        .from(q(".of-water"), { autoAlpha: 0, duration: 1 }, 0)
        .from(q(".hero-scene__ring"), { autoAlpha: 0, duration: 1 }, 0.6)
        .to(q(".ottie-bubble"), { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(2)" }, 1.8);

      // ---- Idle life
      gsap.to(q(".of-otter"), { y: -7, rotation: 1.5, svgOrigin: "270 240", duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(q(".of-tail"), { rotation: -14, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(q(".of-foot--a"), { rotation: -10, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(q(".of-foot--b"), { rotation: 12, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.3 });
      gsap.to(q(".of-caret"), { autoAlpha: 0, duration: 0.45, ease: "steps(1)", yoyo: true, repeat: -1 });

      q(".hero-scene__ring").forEach((ring, i) => {
        gsap.fromTo(ring, { scale: 0.7, opacity: 0.6 }, { scale: 1.25, opacity: 0, duration: 3.2, ease: "sine.out", repeat: -1, delay: i * 1.6 });
      });

      // ---- Typing paws
      const typing = gsap
        .timeline({ repeat: -1, paused: true })
        .to(q(".of-paw--l"), { y: -4, duration: 0.11, yoyo: true, repeat: 1, ease: "power1.inOut" })
        .to(q(".of-paw--r"), { y: -4, duration: 0.11, yoyo: true, repeat: 1, ease: "power1.inOut" }, 0.14)
        .to({}, { duration: 0.06 });
      typingRef.current = typing;

      // ---- Screen story: type code → build site → deployed → repeat
      const codeLines = q(".of-code rect:not(.of-caret)");
      const site = q(".of-site > *");
      const badge = q(".of-badge");
      const tl = gsap.timeline({ repeat: -1, delay: 1.4, repeatDelay: 0.4 });
      tl.call(() => typing.play())
        .set(codeLines, { scaleX: 0, autoAlpha: 1 })
        .set(q(".of-caret"), { autoAlpha: 1 })
        .to(codeLines, { scaleX: 1, duration: 0.42, ease: "steps(6)", stagger: 0.45 })
        .call(() => typing.pause(0))
        .to(q(".of-code"), { autoAlpha: 0, duration: 0.3 }, "+=0.5")
        .fromTo(site, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)", stagger: 0.08 })
        .fromTo(badge, { autoAlpha: 0, scale: 0.5, y: 6 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(3)" }, "+=0.35")
        .add(() => kick(q), "<")
        .to([...site, badge], { autoAlpha: 0, duration: 0.4 }, "+=1.6")
        .set(q(".of-code"), { autoAlpha: 1 });
      loop.current = tl;

      // ---- Feature chips bubbling out of the laptop
      q(".hero-scene__chip").forEach((chip, i) => {
        gsap
          .timeline({ repeat: -1, delay: 2.5 + i * 1.7, repeatDelay: chips.length * 1.7 - 2.6 })
          .fromTo(
            chip,
            { autoAlpha: 0, y: 0, x: 0, scale: 0.6 },
            { autoAlpha: 1, y: -40, x: gsap.utils.random(10, 90), scale: 1, duration: 0.8, ease: "back.out(1.6)" }
          )
          .to(chip, { y: -120, x: "+=" + gsap.utils.random(-30, 30), autoAlpha: 0, duration: 1.8, ease: "sine.in" });
      });

      // ---- Scroll: drift away to the right and sink
      gsap.to(q(".hero-scene__inner"), {
        xPercent: 18,
        yPercent: 22,
        rotation: 4,
        ease: "none",
        scrollTrigger: { trigger: root.current.closest(".hero") || root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root }
  );

  const onPoke = () => {
    setLine((l) => (l + 1) % lines.length);
    if (busy.current || reduceMotion()) return;
    busy.current = true;
    const q = gsap.utils.selector(root);
    const drops = q(".hero-scene__drop");

    gsap
      .timeline({ onComplete: () => (busy.current = false) })
      .fromTo(q(".ottie-bubble"), { scale: 0.85 }, { scale: 1, duration: 0.45, ease: "back.out(3)" }, 0)
      .to(q(".of-otter"), { y: -22, duration: 0.25, ease: "power2.out", svgOrigin: "270 240", overwrite: "auto" }, 0)
      .to(q(".of-otter"), { y: 0, duration: 0.7, ease: "bounce.out" }, 0.25)
      .fromTo(
        drops,
        { x: 0, y: 0, scale: 1, autoAlpha: 1 },
        {
          x: (i) => (i - (drops.length - 1) / 2) * gsap.utils.random(18, 28),
          y: () => gsap.utils.random(-90, -50),
          scale: 0.3,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power2.out",
        },
        0.55
      )
      .add(() => kick(q), 0.1)
      .add(() => float3d.current?.jump(), 0)
      // jump the screen story straight to "Deployed"
      .add(() => {
        const tl = loop.current;
        if (tl) tl.progress(0.74);
        typingRef.current?.pause(0);
      }, 0.2)
      .add(() => {
        // re-start idle bob after the jump
        gsap.to(q(".of-otter"), { y: -7, rotation: 1.5, svgOrigin: "270 240", duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
  };

  return (
    <div className="hero-scene" ref={root}>
      <div className="hero-scene__inner">
        <div className="ottie-bubble" role="status">
          {lines[line]}
        </div>

        <span className="hero-scene__ring" />
        <span className="hero-scene__ring" />

        {chips.map((c) => (
          <span key={c} className="hero-scene__chip">{c}</span>
        ))}

        <button className="hero-scene__stage" onClick={onPoke} aria-label="Say hi to Ottie, the Otterova otter">
          <OtterFloat3D ref={float3d} />
        </button>

        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="hero-scene__drop" />
        ))}
      </div>
    </div>
  );
}

// Quick happy kick of both feet
function kick(q) {
  gsap.timeline()
    .to(q(".of-foot--a"), { rotation: -30, duration: 0.12, yoyo: true, repeat: 3, ease: "sine.inOut", overwrite: "auto" })
    .to(q(".of-foot--b"), { rotation: 30, duration: 0.12, yoyo: true, repeat: 3, ease: "sine.inOut", overwrite: "auto" }, 0.06)
    .add(() => {
      gsap.to(q(".of-foot--a"), { rotation: -10, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(q(".of-foot--b"), { rotation: 12, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });
}
