import { gsap, useGSAP, reduceMotion } from "../../lib/motion.js";

// Gives an <Otter /> its idle behaviour: arms resting on the chest,
// eyes that follow the cursor, random blinking and gentle breathing.
// `deps` lets the effect re-run when the SVG re-renders (e.g. mood change).
export default function useOtterLife(scope, deps = []) {
  useGSAP(
    () => {
      const svg = scope.current?.querySelector(".otter, .otter-float");
      if (!svg) return;

      const armL = svg.querySelector(".otter__arm--l");
      const armR = svg.querySelector(".otter__arm--r");
      if (armL && armR) {
        gsap.set([armL, armR], { transformOrigin: "50% 12%" });
        gsap.set(armL, { rotation: -32 });
        gsap.set(armR, { rotation: 32 });
      }
      gsap.set(svg.querySelector(".otter__head"), { transformOrigin: "50% 85%" });

      if (reduceMotion()) return;

      // Breathing
      gsap.to(svg.querySelector(".otter__body"), {
        scaleY: 1.025,
        transformOrigin: "50% 100%",
        duration: 1.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Eyes + head follow the pointer
      const look = svg.querySelector(".otter__look");
      const head = svg.querySelector(".otter__head");
      const lx = gsap.quickTo(look, "x", { duration: 0.5, ease: "power3.out" });
      const ly = gsap.quickTo(look, "y", { duration: 0.5, ease: "power3.out" });
      const hr = gsap.quickTo(head, "rotation", { duration: 0.9, ease: "power3.out" });

      const onMove = (e) => {
        const r = svg.getBoundingClientRect();
        if (!r.width) return;
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height * 0.4;
        const dx = (e.clientX - cx) / window.innerWidth;
        const dy = (e.clientY - cy) / window.innerHeight;
        lx(gsap.utils.clamp(-6, 6, dx * 16));
        ly(gsap.utils.clamp(-5, 5, dy * 14));
        hr(gsap.utils.clamp(-8, 8, dx * 14));
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      // Blink at random intervals (sometimes twice)
      let call;
      const blink = () => {
        const eyes = svg.querySelectorAll(".otter__eye");
        if (eyes.length) {
          const tl = gsap.timeline();
          tl.to(eyes, { scaleY: 0.1, transformOrigin: "50% 60%", duration: 0.07, yoyo: true, repeat: 1 });
          if (Math.random() < 0.25) tl.to(eyes, { scaleY: 0.1, duration: 0.07, yoyo: true, repeat: 1 }, "+=0.08");
        }
        call = gsap.delayedCall(gsap.utils.random(2, 5), blink);
      };
      call = gsap.delayedCall(gsap.utils.random(1, 3), blink);

      return () => {
        window.removeEventListener("pointermove", onMove);
        call?.kill();
      };
    },
    { scope, dependencies: deps, revertOnUpdate: true }
  );
}

// Waves one arm a few times, then returns it to rest.
export function wave(svg, side = "r", times = 3) {
  if (svg?.__otter3d?.ready) return svg.__otter3d.wave(side, times);
  const arm = svg.querySelector(`.otter__arm--${side}`);
  if (!arm) return gsap.timeline();
  const up = side === "r" ? -150 : 150;
  const rest = side === "r" ? 32 : -32;
  return gsap
    .timeline()
    .to(arm, { rotation: up, duration: 0.35, ease: "back.out(2)" })
    .to(arm, { rotation: up + (side === "r" ? 22 : -22), duration: 0.16, yoyo: true, repeat: times * 2 - 1, ease: "sine.inOut" })
    .to(arm, { rotation: rest, duration: 0.5, ease: "power3.inOut" });
}
