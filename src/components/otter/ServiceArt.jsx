import { gsap } from "../../lib/motion.js";

// Six small looping illustrations shown on the board Ottie holds.
// Each <svg> has a matching timeline in `buildArtTimeline`.

const ink = "#2b211c";
const sand = "#f3e6d8";
const line = "#efdcc8";

function WebArt() {
  const code = [
    [0, 60, "#f0a77c"], [10, 80, "#8fb3ff"], [10, 64, "#7fd1a0"], [20, 70, "#e9d5c4"],
    [20, 50, "#8fb3ff"], [10, 76, "#7fd1a0"], [0, 40, "#f0a77c"], [10, 66, "#e9d5c4"],
  ];
  return (
    <svg viewBox="0 0 300 200" className="art art--web">
      <rect x="12" y="10" width="276" height="20" rx="6" fill={sand} />
      <circle cx="24" cy="20" r="3" fill="#e2c7ad" /><circle cx="34" cy="20" r="3" fill="#e2c7ad" /><circle cx="44" cy="20" r="3" fill="#e2c7ad" />
      <rect x="62" y="15" width="150" height="10" rx="5" fill="#fff" />
      <rect x="12" y="38" width="130" height="152" rx="7" fill={ink} />
      <g className="a-code">
        {code.map(([x, w, c], i) => (
          <rect key={i} x={24 + x} y={52 + i * 16} width={w} height="6" rx="3" fill={c} />
        ))}
      </g>
      <rect x="152" y="38" width="136" height="152" rx="7" fill="#fff" stroke={line} />
      <g className="a-site">
        <rect x="162" y="48" width="116" height="8" rx="3" fill={ink} />
        <rect x="162" y="66" width="66" height="11" rx="3" fill={ink} opacity=".85" />
        <rect x="162" y="81" width="52" height="6" rx="3" fill="#c9a98d" />
        <rect x="162" y="93" width="34" height="11" rx="5.5" fill="#bf4b1c" />
        <rect x="234" y="66" width="44" height="38" rx="5" fill="#f2c7a8" />
        <rect x="162" y="114" width="34" height="66" rx="5" fill="#f6e4d4" />
        <rect x="203" y="114" width="34" height="66" rx="5" fill="#f6e4d4" />
        <rect x="244" y="114" width="34" height="66" rx="5" fill="#f6e4d4" />
      </g>
    </svg>
  );
}

function MobileArt() {
  return (
    <svg viewBox="0 0 300 200" className="art art--mobile">
      <g className="a-phone">
        <rect x="112" y="8" width="80" height="184" rx="15" fill={ink} />
        <rect x="118" y="16" width="68" height="168" rx="10" fill="#fffaf4" />
        <rect x="140" y="19" width="24" height="5" rx="2.5" fill={ink} />
        <rect x="124" y="32" width="56" height="28" rx="7" fill="#2f6b5e" />
        <rect x="130" y="40" width="26" height="5" rx="2.5" fill="#fff" opacity=".85" />
        <rect x="130" y="49" width="18" height="4" rx="2" fill="#fff" opacity=".6" />
        <g className="a-cards">
          <rect x="124" y="66" width="56" height="24" rx="6" fill={sand} />
          <rect x="124" y="95" width="56" height="24" rx="6" fill={sand} />
          <rect x="124" y="124" width="56" height="24" rx="6" fill={sand} />
        </g>
        <rect x="124" y="164" width="56" height="12" rx="6" fill="#efe3d6" />
      </g>
      <g className="a-notif">
        <rect x="34" y="34" width="118" height="34" rx="10" fill="#fff" stroke={line} />
        <circle cx="52" cy="51" r="8" fill="#bf4b1c" />
        <rect x="66" y="44" width="60" height="5" rx="2.5" fill={ink} opacity=".8" />
        <rect x="66" y="54" width="44" height="4" rx="2" fill="#c9a98d" />
      </g>
      <g className="a-heart">
        <path d="M226 72 c-6 -10 -22 -6 -18 6 c2 6 10 11 18 16 c8 -5 16 -10 18 -16 c4 -12 -12 -16 -18 -6 z" fill="#e8836a" />
      </g>
    </svg>
  );
}

function DesignArt() {
  return (
    <svg viewBox="0 0 300 200" className="art art--design">
      <rect x="24" y="12" width="252" height="176" rx="8" fill="#fff" stroke={line} />
      <g stroke="#f1e2d3" strokeDasharray="3 4">
        <path d="M24 100 H276" /><path d="M150 12 V188" />
      </g>
      <circle className="a-shape" cx="92" cy="66" r="24" fill="#f2c7a8" />
      <rect className="a-shape" x="166" y="118" width="70" height="44" rx="10" fill="#3d4a7a" opacity=".85" />
      <path className="a-curve" pathLength="1" d="M56 150 C 96 40, 156 40, 196 108 S 246 150, 252 64" fill="none" stroke="#bf4b1c" strokeWidth="4" strokeLinecap="round" />
      <g className="a-box">
        <rect x="160" y="112" width="82" height="56" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
        {[[160, 112], [242, 112], [160, 168], [242, 168]].map(([x, y], i) => (
          <rect key={i} x={x - 4} y={y - 4} width="8" height="8" fill="#fff" stroke="#3b82f6" strokeWidth="1.5" />
        ))}
      </g>
      <g className="a-swatch">
        {["#bf4b1c", "#f2c7a8", "#3d4a7a", "#2f9e5b"].map((c, i) => (
          <circle key={c} cx={46 + i * 18} cy="172" r="6.5" fill={c} />
        ))}
      </g>
      <g className="a-pen">
        <path d="M0 0 L14 -4 L36 -26 L30 -32 L8 -10 Z" fill={ink} />
        <path d="M0 0 L4 -1 L1 -4 Z" fill="#bf4b1c" />
      </g>
    </svg>
  );
}

function AiArt() {
  return (
    <svg viewBox="0 0 300 200" className="art art--ai">
      <g className="a-user">
        <rect x="140" y="14" width="140" height="30" rx="14" fill="#bf4b1c" />
        <rect x="154" y="26" width="90" height="6" rx="3" fill="#fff" opacity=".9" />
      </g>
      <g className="a-bot">
        <circle cx="34" cy="78" r="15" fill={ink} />
        <path className="a-spark" d="M34 68 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z" fill="#f0a77c" />
        <rect x="56" y="58" width="190" height="78" rx="14" fill={sand} />
        <g className="a-dots">
          <circle cx="78" cy="97" r="5" fill="#a8927e" /><circle cx="94" cy="97" r="5" fill="#a8927e" /><circle cx="110" cy="97" r="5" fill="#a8927e" />
        </g>
        <g className="a-reply">
          <rect x="72" y="74" width="150" height="7" rx="3.5" fill={ink} opacity=".75" />
          <rect x="72" y="89" width="124" height="7" rx="3.5" fill={ink} opacity=".55" />
          <rect x="72" y="104" width="140" height="7" rx="3.5" fill={ink} opacity=".55" />
          <rect x="72" y="119" width="70" height="7" rx="3.5" fill="#2f9e5b" />
        </g>
      </g>
      <rect x="20" y="156" width="260" height="30" rx="15" fill="#fff" stroke={line} />
      <rect x="38" y="168" width="110" height="6" rx="3" fill="#e2c7ad" />
      <circle cx="262" cy="171" r="10" fill="#bf4b1c" />
      <path d="M258 171 h8 m-3 -3 l3 3 l-3 3" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function CloudArt() {
  const servers = [85, 155, 225];
  return (
    <svg viewBox="0 0 300 200" className="art art--cloud">
      <g className="a-cloud">
        <circle cx="128" cy="58" r="22" fill={sand} />
        <circle cx="158" cy="44" r="28" fill={sand} />
        <circle cx="190" cy="60" r="20" fill={sand} />
        <rect x="108" y="56" width="104" height="26" rx="13" fill={sand} />
      </g>
      <g stroke="#e2c7ad" strokeWidth="2" strokeDasharray="4 5" fill="none">
        {servers.map((x) => <path key={x} d={`M160 84 L${x} 128`} />)}
      </g>
      {servers.map((x, i) => (
        <circle key={i} className="a-packet" cx="160" cy="84" r="4.5" fill="#bf4b1c" />
      ))}
      {servers.map((x) => (
        <g key={x}>
          <rect x={x - 27} y="128" width="54" height="56" rx="7" fill={ink} />
          <rect x={x - 19} y="140" width="30" height="5" rx="2.5" fill="#4d423c" />
          <rect x={x - 19} y="154" width="30" height="5" rx="2.5" fill="#4d423c" />
          <rect x={x - 19} y="168" width="30" height="5" rx="2.5" fill="#4d423c" />
          <circle className="a-led" cx={x + 16} cy="142" r="3.5" fill="#3ddc84" />
          <circle className="a-led" cx={x + 16} cy="156" r="3.5" fill="#3ddc84" />
        </g>
      ))}
      <g className="a-uptime">
        <rect x="218" y="16" width="66" height="22" rx="11" fill="#e3f3e8" />
        <circle cx="231" cy="27" r="4" fill="#2f9e5b" />
        <text x="240" y="31" fontSize="10" fontWeight="600" fill="#1f7a45" fontFamily="Inter, sans-serif">99.9%</text>
      </g>
    </svg>
  );
}

function SeoArt() {
  const bars = [30, 44, 38, 60, 72, 96];
  return (
    <svg viewBox="0 0 300 200" className="art art--seo">
      <path d="M30 20 V176 H280" stroke="#e2c7ad" strokeWidth="2" fill="none" />
      <g className="a-bars">
        {bars.map((h, i) => (
          <rect key={i} x={48 + i * 38} y={176 - h} width="22" height={h} rx="4" fill={sand} />
        ))}
      </g>
      <path className="a-line" pathLength="1" d="M48 150 L86 132 L124 140 L162 104 L200 92 L238 58 L268 36" fill="none" stroke="#2f9e5b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="a-end" cx="268" cy="36" r="6" fill="#2f9e5b" />
      <g className="a-tag">
        <rect x="196" y="6" width="58" height="22" rx="11" fill="#2f9e5b" />
        <text x="225" y="21" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">+128%</text>
      </g>
      <g className="a-lens">
        <circle cx="96" cy="62" r="20" fill="#fff" fillOpacity=".7" stroke={ink} strokeWidth="5" />
        <path d="M110 76 L128 94" stroke={ink} strokeWidth="7" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export const arts = [WebArt, MobileArt, DesignArt, AiArt, CloudArt, SeoArt];

// Returns a paused, repeating timeline for illustration `i` inside element `el`.
export function buildArtTimeline(i, el) {
  const q = gsap.utils.selector(el);
  const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.6 });

  switch (i) {
    case 0: // web
      tl.fromTo(q(".a-code rect"), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.3, stagger: 0.18, ease: "steps(5)" })
        .fromTo(q(".a-site > *"), { scale: 0.3, autoAlpha: 0, transformOrigin: "50% 50%" }, { scale: 1, autoAlpha: 1, duration: 0.4, stagger: 0.08, ease: "back.out(2)" }, "-=0.4")
        .to({}, { duration: 1.6 });
      break;
    case 1: // mobile
      tl.fromTo(q(".a-cards rect"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.15, ease: "power3.out" })
        .fromTo(q(".a-notif"), { y: -30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "back.out(1.8)" }, "+=0.2")
        .fromTo(q(".a-heart"), { scale: 0, autoAlpha: 0, transformOrigin: "50% 100%" }, { scale: 1.15, autoAlpha: 1, duration: 0.4, ease: "back.out(3)" }, "+=0.1")
        .to(q(".a-heart"), { y: -26, autoAlpha: 0, duration: 0.9, ease: "power1.in" }, "+=0.3")
        .to(q(".a-notif"), { y: -20, autoAlpha: 0, duration: 0.4 }, "+=0.2")
        .to(q(".a-phone"), { rotation: -3, svgOrigin: "152 100", duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);
      break;
    case 2: // design
      tl.set(q(".a-pen"), { x: 56, y: 150 })
        .fromTo(q(".a-curve"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: "power1.inOut" })
        .to(q(".a-pen"), { keyframes: [{ x: 96, y: 72 }, { x: 150, y: 60 }, { x: 196, y: 108 }, { x: 236, y: 136 }, { x: 252, y: 64 }], duration: 1.6, ease: "none" }, "<")
        .fromTo(q(".a-shape"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.5, stagger: 0.15, ease: "back.out(2)" }, "-=0.6")
        .fromTo(q(".a-box"), { autoAlpha: 0, scale: 1.1, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.35 }, "+=0.1")
        .fromTo(q(".a-swatch circle"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.3, stagger: 0.06, ease: "back.out(3)" }, "<")
        .to({}, { duration: 1.2 });
      break;
    case 3: // ai
      tl.set(q(".a-reply rect"), { scaleX: 0, transformOrigin: "0% 50%" })
        .set(q(".a-dots"), { autoAlpha: 1 })
        .fromTo(q(".a-user"), { scale: 0.6, autoAlpha: 0, transformOrigin: "100% 50%" }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(2)" })
        .fromTo(q(".a-dots circle"), { y: 0 }, { y: -6, duration: 0.22, yoyo: true, repeat: 5, stagger: 0.1, ease: "sine.inOut" }, "+=0.2")
        .set(q(".a-dots"), { autoAlpha: 0 })
        .to(q(".a-reply rect"), { scaleX: 1, duration: 0.35, stagger: 0.18, ease: "power2.out" })
        .to(q(".a-spark"), { rotation: 180, svgOrigin: "34 78", duration: 0.8, ease: "back.out(2)" }, "<")
        .to({}, { duration: 1.4 });
      break;
    case 4: { // cloud
      const ends = [[85, 128], [155, 128], [225, 128]];
      q(".a-packet").forEach((p, n) => {
        tl.fromTo(p, { x: 0, y: 0, autoAlpha: 1 }, { x: ends[n][0] - 160, y: ends[n][1] - 84, duration: 0.9, ease: "power1.in" }, n * 0.3)
          .to(p, { autoAlpha: 0, duration: 0.1 });
      });
      tl.fromTo(q(".a-led"), { opacity: 1 }, { opacity: 0.25, duration: 0.15, yoyo: true, repeat: 3, stagger: 0.07 }, 0.9)
        .fromTo(q(".a-cloud"), { y: 0 }, { y: -4, duration: 0.9, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0)
        .fromTo(q(".a-uptime"), { scale: 0.7, autoAlpha: 0, transformOrigin: "50% 50%" }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(2)" }, 0.2)
        .to({}, { duration: 0.6 });
      break;
    }
    case 5: // seo
      tl.fromTo(q(".a-bars rect"), { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" })
        .fromTo(q(".a-line"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power1.inOut" }, "-=0.3")
        .fromTo(q(".a-end"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.3, ease: "back.out(3)" })
        .fromTo(q(".a-tag"), { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(2)" }, "<")
        .fromTo(q(".a-lens"), { x: 0, y: 0 }, { x: 110, y: 40, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0)
        .to({}, { duration: 0.4 });
      break;
    default:
      break;
  }
  return tl;
}
