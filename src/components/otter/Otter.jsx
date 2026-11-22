import { forwardRef } from "react";

// Ottie — the Otterova mascot, drawn as layered SVG so each part can move.
// Parts used by animations:
//   .otter__head   tilts           .otter__look  eyes follow the cursor
//   .otter__eye    blinks          .otter__arm--l / --r  wave
//   .otter__body   breathes
const C = {
  fur: "#b4532a",
  furDark: "#8e3d1c",
  face: "#e3a47c",
  light: "#f8dcc6",
  ink: "#2b1b15",
  blush: "#e8836a",
};

const Otter = forwardRef(function Otter({ mood = "normal", className = "", title }, ref) {
  const happy = mood === "happy";

  return (
    <svg
      ref={ref}
      className={`otter ${className}`}
      viewBox="0 0 200 230"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* Body */}
      <g className="otter__body">
        <path d="M44 232 C44 172 66 142 100 142 C134 142 156 172 156 232 Z" fill={C.fur} />
        <path d="M72 232 C72 190 82 166 100 166 C118 166 128 190 128 232 Z" fill={C.light} />
      </g>

      {/* Head */}
      <g className="otter__head">
        {/* Small rounded ears set low on the sides */}
        <circle cx="42" cy="84" r="10" fill={C.fur} />
        <circle cx="42" cy="84" r="5" fill={C.furDark} />
        <circle cx="158" cy="84" r="10" fill={C.fur} />
        <circle cx="158" cy="84" r="5" fill={C.furDark} />

        {/* Wide, flat otter head */}
        <ellipse cx="100" cy="102" rx="64" ry="47" fill={C.fur} />
        <path d="M66 68 Q100 52 134 68 Q100 62 66 68 Z" fill={C.furDark} opacity="0.4" />
        {/* Lighter face */}
        <ellipse cx="100" cy="112" rx="52" ry="33" fill={C.face} />

        {/* Muzzle */}
        <ellipse cx="88" cy="124" rx="20" ry="14" fill={C.light} />
        <ellipse cx="112" cy="124" rx="20" ry="14" fill={C.light} />
        <ellipse cx="100" cy="134" rx="13" ry="8" fill={C.light} />

        <ellipse cx="60" cy="116" rx="8" ry="5" fill={C.blush} opacity="0.55" />
        <ellipse cx="140" cy="116" rx="8" ry="5" fill={C.blush} opacity="0.55" />

        {/* Eyes */}
        <g className="otter__look">
          {happy ? (
            <g fill="none" stroke={C.ink} strokeWidth="4" strokeLinecap="round">
              <path d="M71 99 Q78 90 85 99" />
              <path d="M115 99 Q122 90 129 99" />
            </g>
          ) : (
            <>
              <g className="otter__eye">
                <ellipse cx="78" cy="97" rx="7" ry="8" fill={C.ink} />
                <circle cx="80.5" cy="94" r="2.4" fill="#fff" />
              </g>
              <g className="otter__eye">
                <ellipse cx="122" cy="97" rx="7" ry="8" fill={C.ink} />
                <circle cx="124.5" cy="94" r="2.4" fill="#fff" />
              </g>
            </>
          )}
        </g>

        {/* Nose + mouth */}
        <path d="M87 111 Q100 103 113 111 Q110 119 100 120 Q90 119 87 111 Z" fill={C.ink} />
        <ellipse cx="95" cy="109" rx="4" ry="1.7" fill="#fff" opacity="0.45" />
        <path
          d={happy ? "M100 120 L100 124 M100 124 Q92 136 84 126 M100 124 Q108 136 116 126" : "M100 120 L100 125 M100 125 Q94 132 88 127 M100 125 Q106 132 112 127"}
          fill="none"
          stroke={C.ink}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Whiskers */}
        <g stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5">
          <path d="M72 120 Q50 112 28 112" />
          <path d="M72 126 Q50 124 26 128" />
          <path d="M72 131 Q52 134 32 142" />
          <path d="M128 120 Q150 112 172 112" />
          <path d="M128 126 Q150 124 174 128" />
          <path d="M128 131 Q148 134 168 142" />
        </g>
      </g>

      {/* Arms (rotate from the shoulder) */}
      <g className="otter__arm otter__arm--l">
        <rect x="60" y="152" width="22" height="44" rx="11" fill={C.furDark} />
        <path d="M65 190 v4 M71 191 v4 M77 190 v4" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </g>
      <g className="otter__arm otter__arm--r">
        <rect x="118" y="152" width="22" height="44" rx="11" fill={C.furDark} />
        <path d="M123 190 v4 M129 191 v4 M135 190 v4" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </g>
    </svg>
  );
});

export default Otter;
