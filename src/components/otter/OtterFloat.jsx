// Ottie floating on its back with a laptop on its belly.
// Parts used by HeroScene animations:
//   .of-otter (bobs)  .of-tail  .of-foot  .of-paw--l/--r (typing)
//   .otter__head / .otter__look / .otter__eye / .otter__body (shared with useOtterLife)
//   .of-code rect (typed lines)  .of-site * (website preview)  .of-badge  .of-caret
const C = {
  fur: "#b4532a",
  furDark: "#8e3d1c",
  face: "#e3a47c",
  light: "#f8dcc6",
  ink: "#2b1b15",
  blush: "#e8836a",
};

const code = [
  { x: 0, w: 34, c: "#bf4b1c" },
  { x: 8, w: 52, c: "#3d4a7a" },
  { x: 8, w: 40, c: "#2f9e5b" },
  { x: 16, w: 46, c: "#c9a98d" },
  { x: 8, w: 30, c: "#3d4a7a" },
  { x: 0, w: 22, c: "#bf4b1c" },
];

export default function OtterFloat() {
  return (
    <svg className="otter-float" viewBox="0 0 520 330" aria-hidden="true">
      <g className="of-otter">
        {/* Tail */}
        <path
          className="of-tail"
          d="M392 238 Q452 232 504 196 Q510 207 500 216 Q452 254 394 256 Z"
          fill={C.furDark}
        />

        {/* Body lying on its back */}
        <g className="otter__body">
          <path d="M146 238 C146 206 204 196 272 198 C344 200 400 214 404 242 C406 268 342 286 272 286 C200 286 146 270 146 238 Z" fill={C.fur} />
          <path d="M168 230 C178 211 230 206 276 207 C322 208 356 216 366 230 C334 240 208 242 168 230 Z" fill={C.light} />
        </g>

        {/* Feet sticking out of the water */}
        <g className="of-foot of-foot--a">
          <ellipse cx="382" cy="204" rx="13" ry="24" fill={C.furDark} transform="rotate(-18 382 204)" />
          <path d="M372 186 l-2 -6 M379 183 l0 -6 M386 183 l2 -6" stroke={C.ink} strokeWidth="1.6" strokeLinecap="round" opacity=".45" />
        </g>
        <g className="of-foot of-foot--b">
          <ellipse cx="408" cy="210" rx="12" ry="22" fill={C.furDark} transform="rotate(16 408 210)" />
          <path d="M405 192 l-1 -6 M412 192 l1 -6 M418 195 l3 -5" stroke={C.ink} strokeWidth="1.6" strokeLinecap="round" opacity=".45" />
        </g>

        {/* Laptop */}
        <g className="of-laptop">
          <path d="M206 214 L344 214 L360 228 L190 228 Z" fill="#3a302b" />
          <path d="M214 218 L336 218 L344 224 L206 224 Z" fill="#4d423c" />
          <rect x="216" y="120" width="118" height="96" rx="7" fill="#2b211c" />
          <rect x="223" y="127" width="104" height="82" rx="3" fill="#fffaf4" />

          <g className="of-screen">
            <g className="of-code">
              {code.map((l, i) => (
                <rect key={i} x={231 + l.x} y={136 + i * 10} width={l.w} height="5" rx="2.5" fill={l.c} />
              ))}
              <rect className="of-caret" x="231" y="196" width="2.5" height="7" fill={C.ink} />
            </g>

            <g className="of-site">
              <rect x="229" y="132" width="92" height="7" rx="2" fill="#2b211c" />
              <rect x="229" y="144" width="52" height="8" rx="2" fill="#2b211c" opacity=".85" />
              <rect x="229" y="155" width="40" height="5" rx="2" fill="#c9a98d" />
              <rect x="229" y="164" width="22" height="7" rx="3.5" fill="#bf4b1c" />
              <rect x="287" y="144" width="34" height="27" rx="3" fill="#f2c7a8" />
              <rect x="229" y="177" width="28" height="26" rx="3" fill="#f6e4d4" />
              <rect x="261" y="177" width="28" height="26" rx="3" fill="#f6e4d4" />
              <rect x="293" y="177" width="28" height="26" rx="3" fill="#f6e4d4" />
            </g>

            <g className="of-badge">
              <rect x="243" y="157" width="64" height="20" rx="10" fill="#2f9e5b" />
              <text x="275" y="170.5" textAnchor="middle" fontSize="9" fontWeight="600" fill="#fff" fontFamily="Inter, system-ui, sans-serif">
                Deployed ✓
              </text>
            </g>
          </g>
        </g>

        {/* Arms reaching to the keyboard */}
        <g className="of-paw of-paw--l">
          <path d="M196 236 Q212 220 236 217" stroke={C.furDark} strokeWidth="15" strokeLinecap="round" fill="none" />
          <ellipse cx="238" cy="216" rx="11" ry="7" fill={C.furDark} />
        </g>
        <g className="of-paw of-paw--r">
          <path d="M356 234 Q338 220 314 217" stroke={C.furDark} strokeWidth="15" strokeLinecap="round" fill="none" />
          <ellipse cx="312" cy="217" rx="11" ry="7" fill={C.furDark} />
        </g>

        {/* Head, tilted up to look at the viewer */}
        <g transform="translate(50 100) scale(0.9) rotate(-10 100 110)">
          <g className="otter__head">
            <circle cx="42" cy="84" r="10" fill={C.fur} />
            <circle cx="42" cy="84" r="5" fill={C.furDark} />
            <circle cx="158" cy="84" r="10" fill={C.fur} />
            <circle cx="158" cy="84" r="5" fill={C.furDark} />
            <ellipse cx="100" cy="102" rx="64" ry="47" fill={C.fur} />
            <path d="M66 68 Q100 52 134 68 Q100 62 66 68 Z" fill={C.furDark} opacity="0.4" />
            <ellipse cx="100" cy="112" rx="52" ry="33" fill={C.face} />
            <ellipse cx="88" cy="124" rx="20" ry="14" fill={C.light} />
            <ellipse cx="112" cy="124" rx="20" ry="14" fill={C.light} />
            <ellipse cx="100" cy="134" rx="13" ry="8" fill={C.light} />
            <ellipse cx="60" cy="116" rx="8" ry="5" fill={C.blush} opacity="0.55" />
            <ellipse cx="140" cy="116" rx="8" ry="5" fill={C.blush} opacity="0.55" />
            <g className="otter__look">
              <g className="otter__eye">
                <ellipse cx="78" cy="97" rx="7" ry="8" fill={C.ink} />
                <circle cx="80.5" cy="94" r="2.4" fill="#fff" />
              </g>
              <g className="otter__eye">
                <ellipse cx="122" cy="97" rx="7" ry="8" fill={C.ink} />
                <circle cx="124.5" cy="94" r="2.4" fill="#fff" />
              </g>
            </g>
            <path d="M87 111 Q100 103 113 111 Q110 119 100 120 Q90 119 87 111 Z" fill={C.ink} />
            <ellipse cx="95" cy="109" rx="4" ry="1.7" fill="#fff" opacity="0.45" />
            <path d="M100 120 L100 125 M100 125 Q94 132 88 127 M100 125 Q106 132 112 127" fill="none" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" />
            <g stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5">
              <path d="M72 120 Q50 112 28 112" />
              <path d="M72 126 Q50 124 26 128" />
              <path d="M128 120 Q150 112 172 112" />
              <path d="M128 126 Q150 124 174 128" />
            </g>
          </g>
        </g>
      </g>

      {/* Water in front: hides the otter's underside */}
      <g className="of-water">
        <path
          className="of-water__fill"
          d="M-100 262 Q-75 252 -50 262 T0 262 T50 262 T100 262 T150 262 T200 262 T250 262 T300 262 T350 262 T400 262 T450 262 T500 262 T550 262 T600 262 T650 262 V340 H-100 Z"
        />
        <path
          className="of-water__line"
          d="M-100 262 Q-75 252 -50 262 T0 262 T50 262 T100 262 T150 262 T200 262 T250 262 T300 262 T350 262 T400 262 T450 262 T500 262 T550 262 T600 262 T650 262"
        />
      </g>
    </svg>
  );
}
