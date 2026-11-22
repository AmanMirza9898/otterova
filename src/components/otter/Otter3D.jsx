import { forwardRef, useEffect, useRef, useState } from "react";
import Otter from "./Otter.jsx";

// 3D Ottie with the SVG Ottie as a fallback.
// The SVG shows first; once the 3D engine has loaded (and WebGL works) the canvas fades in on top.
// The wrapper keeps the `otter` class, so existing code that looks up `.otter` still finds it,
// and `wrapper.__otter3d` exposes wave() / shake() / hop() for the 3D version.
const loadEngine = () => import("./three/engine.js");

const Otter3D = forwardRef(function Otter3D({ mood = "normal", className = "", title }, ref) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const inst = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    loadEngine()
      .then((engine) => {
        if (!alive || !engine.webglAvailable()) return;
        inst.current = engine.mountUpright(canvas.current);
        if (!inst.current) return;
        inst.current.setMood(mood);
        wrap.current.__otter3d = inst.current;
        setReady(true);
      })
      .catch((err) => console.warn("3D Ottie unavailable, showing the SVG version.", err));
    return () => {
      alive = false;
      inst.current?.destroy();
      if (wrap.current) delete wrap.current.__otter3d;
      inst.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    inst.current?.setMood(mood);
  }, [mood]);

  const setRefs = (node) => {
    wrap.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <div
      ref={setRefs}
      className={`otter otter3d${ready ? " is-3d" : ""} ${className}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <Otter mood={mood} className="otter3d__svg" />
      <canvas ref={canvas} className="otter3d__canvas" />
    </div>
  );
});

export default Otter3D;
