import { useRef } from "react";
import Otter from "./Otter3D.jsx";
import useOtterLife from "./useOtterLife.js";

// Ottie peeking over a project card, holding a little sign on a stick.
export default function ProjectOtter({ sign }) {
  const root = useRef(null);
  useOtterLife(root);

  return (
    <div className="p-otter" ref={root} aria-hidden="true">
      <div className="p-otter__rise">
        <div className="p-otter__sign">
          <span>{sign}</span>
        </div>
        <div className="p-otter__body">
          <Otter />
        </div>
      </div>
    </div>
  );
}
