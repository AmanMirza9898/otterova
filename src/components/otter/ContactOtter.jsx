import { useEffect, useRef } from "react";
import Otter from "./Otter3D.jsx";
import useOtterLife, { wave } from "./useOtterLife.js";
import { gsap, useGSAP, reduceMotion } from "../../lib/motion.js";

// Peeks over the top edge of the contact form.
// Shakes its head on validation errors and celebrates when the message is sent.
export default function ContactOtter({ status, errorCount }) {
  const root = useRef(null);
  const happy = status === "sent";

  useOtterLife(root, [happy]);

  useGSAP(
    () => {
      if (reduceMotion()) return;
      gsap.from(".contact-otter__inner", {
        yPercent: 100,
        duration: 1.1,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: root.current, start: "top 85%" },
      });
    },
    { scope: root }
  );

  // Head shake on error
  useEffect(() => {
    if (!errorCount || reduceMotion()) return;
    root.current.querySelector(".otter")?.__otter3d?.shake();
    const head = root.current.querySelector(".otter__head");
    gsap.fromTo(head, { rotation: 0 }, { rotation: 10, duration: 0.09, yoyo: true, repeat: 5, ease: "sine.inOut", clearProps: "rotation" });
  }, [errorCount]);

  // Celebrate on success
  useEffect(() => {
    if (!happy || reduceMotion()) return;
    const svg = root.current.querySelector(".otter");
    const tl = gsap.timeline();
    tl.to(".contact-otter__inner", { y: -26, duration: 0.3, ease: "power2.out", yoyo: true, repeat: 3 })
      .add(wave(svg, "l", 3), 0)
      .add(wave(svg, "r", 3), 0.1)
      .fromTo(
        root.current.querySelectorAll(".contact-otter__confetti i"),
        { y: 0, x: 0, autoAlpha: 1, rotation: 0 },
        {
          y: () => gsap.utils.random(-120, -60),
          x: () => gsap.utils.random(-90, 90),
          rotation: () => gsap.utils.random(-180, 180),
          autoAlpha: 0,
          duration: 1.4,
          ease: "power2.out",
          stagger: 0.02,
        },
        0
      );
    return () => tl.kill();
  }, [happy]);

  return (
    <div className="contact-otter" ref={root} aria-hidden="true">
      <div className="contact-otter__confetti">
        {Array.from({ length: 14 }, (_, i) => (
          <i key={i} style={{ background: ["#bf4b1c", "#f2a276", "#2f9e5b", "#1c1917"][i % 4] }} />
        ))}
      </div>
      <div className="contact-otter__inner">
        <Otter mood={happy ? "happy" : "normal"} />
      </div>
    </div>
  );
}
