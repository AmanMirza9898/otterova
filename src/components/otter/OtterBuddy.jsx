import { useEffect, useRef, useState } from "react";
import Otter from "./Otter3D.jsx";
import useOtterLife, { wave } from "./useOtterLife.js";
import { gsap, reduceMotion, scrollToTarget } from "../../lib/motion.js";

const R = 30;
const CIRC = 2 * Math.PI * R;

// Small floating otter in the corner: shows scroll progress and goes back to top.
export default function OtterBuddy() {
  const root = useRef(null);
  const ring = useRef(null);
  const [visible, setVisible] = useState(false);

  useOtterLife(root);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (ring.current) ring.current.style.strokeDashoffset = String(CIRC * (1 - p));
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onClick = () => {
    if (!reduceMotion()) {
      const svg = root.current.querySelector(".otter");
      gsap.timeline()
        .add(wave(svg, "r", 1))
        .to(svg, { y: -14, duration: 0.25, ease: "power2.out", yoyo: true, repeat: 1 }, 0);
    }
    setTimeout(() => scrollToTarget("#top"), reduceMotion() ? 0 : 350);
  };

  return (
    <button
      ref={root}
      className={`otter-buddy${visible ? " is-visible" : ""}`}
      onClick={onClick}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <svg className="otter-buddy__ring" viewBox="0 0 68 68" aria-hidden="true">
        <circle cx="34" cy="34" r={R} className="otter-buddy__track" />
        <circle
          ref={ring}
          cx="34"
          cy="34"
          r={R}
          className="otter-buddy__progress"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC}
        />
      </svg>
      <span className="otter-buddy__face">
        <Otter />
      </span>
      <span className="otter-buddy__tip">Back to top</span>
    </button>
  );
}
