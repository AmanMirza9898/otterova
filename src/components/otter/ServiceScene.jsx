import { useEffect, useRef } from "react";
import Otter from "./Otter3D.jsx";
import useOtterLife from "./useOtterLife.js";
import { arts, buildArtTimeline } from "./ServiceArt.jsx";
import { gsap, useGSAP, reduceMotion } from "../../lib/motion.js";

const quips = [
  "Typing up a fast website…",
  "New notification? Shipped.",
  "Pixel-perfect, every time.",
  "My AI buddy answers tickets.",
  "Servers up. 99.9% uptime.",
  "Look, traffic is going up!",
];

// Chip positions around the board (percent of the scene box)
const chipSpots = [
  { left: "-4%", top: "34%" },
  { right: "-6%", top: "26%" },
  { left: "-6%", bottom: "22%" },
  { right: "0%", bottom: "8%" },
];

export default function ServiceScene({ active, services }) {
  const root = useRef(null);
  const timelines = useRef([]);
  const first = useRef(true);

  useOtterLife(root);

  // Build one looping timeline per illustration
  useGSAP(
    () => {
      const panes = root.current.querySelectorAll(".svc-scene__art");
      timelines.current = [...panes].map((pane, i) => buildArtTimeline(i, pane));
      gsap.set(panes, { autoAlpha: 0 });
      gsap.set(panes[0], { autoAlpha: 1 });

      if (reduceMotion()) {
        timelines.current.forEach((tl) => tl.progress(0.85).pause());
        return;
      }

      // Float gently
      gsap.to(".svc-scene__float", { y: -8, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      timelines.current[0].play(0);
    },
    { scope: root }
  );

  // Switch board content, hop, update chips
  useEffect(() => {
    const panes = root.current.querySelectorAll(".svc-scene__art");
    const chips = root.current.querySelectorAll(".svc-scene__chip");
    const bubble = root.current.querySelector(".svc-scene__bubble");
    const reduce = reduceMotion();

    timelines.current.forEach((tl, i) => {
      if (i !== active) tl.pause();
    });

    if (first.current) {
      first.current = false;
      if (!reduce) gsap.fromTo(chips, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: "back.out(2)" });
      return;
    }

    if (reduce) {
      gsap.set(panes, { autoAlpha: 0 });
      gsap.set(panes[active], { autoAlpha: 1 });
      return;
    }

    const others = [...panes].filter((_, i) => i !== active);
    gsap
      .timeline()
      .to(others, { autoAlpha: 0, y: -12, duration: 0.25, ease: "power2.in", overwrite: true })
      .fromTo(panes[active], { autoAlpha: 0, y: 16, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)", overwrite: true }, 0.15)
      .add(() => timelines.current[active]?.play(0), 0.2)
      // Ottie hops and the board wobbles
      .to(".svc-scene__otter", { y: -18, duration: 0.2, ease: "power2.out" }, 0)
      .to(".svc-scene__otter", { y: 0, duration: 0.5, ease: "bounce.out" }, 0.2)
      .fromTo(".svc-scene__board", { rotation: 0 }, { rotation: 1.5, duration: 0.12, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.1)
      .fromTo(bubble, { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(2.5)" }, 0.15)
      .fromTo(chips, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.45, stagger: 0.06, ease: "back.out(2)" }, 0.25);
  }, [active]);

  const stack = services[active].stack;

  return (
    <div className="svc-scene" ref={root}>
      <div className="svc-scene__float">
        <div className="svc-scene__bubble" role="status">{quips[active]}</div>

        <div className="svc-scene__otter">
          <Otter />
        </div>

        <div className="svc-scene__board">
          {arts.map((Art, i) => (
            <div key={i} className="svc-scene__art" aria-hidden={i !== active}>
              <Art />
            </div>
          ))}
          <span className="svc-scene__label">{services[active].title}</span>
        </div>

        {/* Paws gripping the top of the board */}
        <span className="svc-scene__paw svc-scene__paw--l" />
        <span className="svc-scene__paw svc-scene__paw--r" />

        {chipSpots.map((pos, i) =>
          stack[i] ? (
            <span key={`${active}-${i}`} className="svc-scene__chip" style={{ ...pos, "--d": `${i * 0.4}s` }}>
              {stack[i]}
            </span>
          ) : null
        )}
      </div>
    </div>
  );
}
