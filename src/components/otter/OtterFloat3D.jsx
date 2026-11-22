import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import OtterFloat from "./OtterFloat.jsx";

// Hero Ottie floating on its back with a laptop, in 3D.
// The SVG version shows until the 3D engine loads, and stays if WebGL is unavailable.
const OtterFloat3D = forwardRef(function OtterFloat3D(_, ref) {
  const canvas = useRef(null);
  const inst = useRef(null);
  const [ready, setReady] = useState(false);

  useImperativeHandle(ref, () => ({
    jump: () => (inst.current?.ready ? inst.current.jump() : null),
    get is3d() { return !!inst.current?.ready; },
  }));

  useEffect(() => {
    let alive = true;
    import("./three/engine.js")
      .then((engine) => {
        if (!alive || !engine.webglAvailable()) return;
        inst.current = engine.mountFloat(canvas.current);
        if (inst.current) setReady(true);
      })
      .catch((err) => console.warn("3D Ottie unavailable, showing the SVG version.", err));
    return () => {
      alive = false;
      inst.current?.destroy();
      inst.current = null;
    };
  }, []);

  return (
    <div className={`otter-float3d${ready ? " is-3d" : ""}`}>
      <OtterFloat />
      <canvas ref={canvas} className="otter-float3d__canvas" aria-hidden="true" />
    </div>
  );
});

export default OtterFloat3D;
