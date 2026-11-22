// Side view of Ottie swimming to the right. The water line sits at y = 60.
const C = {
  fur: "#b4532a",
  furDark: "#8e3d1c",
  face: "#e3a47c",
  light: "#f8dcc6",
  ink: "#2b1b15",
};

export default function OtterSwim() {
  return (
    <svg className="otter-swim" viewBox="0 0 200 90" aria-hidden="true">
      <path className="os-tail" d="M44 52 Q20 50 4 36 Q8 54 40 62 Z" fill={C.furDark} />
      <ellipse className="os-paw os-paw--back" cx="62" cy="66" rx="11" ry="6" fill={C.furDark} />

      <g className="os-body">
        <ellipse cx="98" cy="54" rx="60" ry="19" fill={C.fur} />
        <path d="M58 58 Q98 72 146 58 Q98 64 58 58 Z" fill={C.light} opacity=".6" />
      </g>

      <ellipse className="os-paw os-paw--front" cx="138" cy="66" rx="11" ry="6" fill={C.furDark} />

      <g className="os-head">
        <circle cx="146" cy="24" r="7" fill={C.fur} />
        <circle cx="146" cy="24" r="3.5" fill={C.furDark} />
        <circle cx="158" cy="38" r="23" fill={C.fur} />
        <ellipse cx="170" cy="44" rx="16" ry="12" fill={C.face} />
        <ellipse cx="175" cy="47" rx="11" ry="8" fill={C.light} />
        <circle cx="185" cy="41" r="4.5" fill={C.ink} />
        <circle cx="164" cy="31" r="3.6" fill={C.ink} />
        <circle cx="165.2" cy="29.8" r="1.2" fill="#fff" />
        <path d="M181 50 q-3 3 -7 1" stroke={C.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <g stroke={C.ink} strokeWidth="1.2" strokeLinecap="round" opacity=".5">
          <path d="M178 46 L198 42" />
          <path d="M178 49 L198 50" />
        </g>
      </g>

      {/* Water in front of the lower body */}
      <path
        className="os-water"
        d="M-40 60 Q-25 55 -10 60 T20 60 T50 60 T80 60 T110 60 T140 60 T170 60 T200 60 T230 60 T260 60 V100 H-40 Z"
      />
      <path
        className="os-waterline"
        d="M-40 60 Q-25 55 -10 60 T20 60 T50 60 T80 60 T110 60 T140 60 T170 60 T200 60 T230 60 T260 60"
      />
    </svg>
  );
}
