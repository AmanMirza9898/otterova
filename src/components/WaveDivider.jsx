// Flowing two-layer wave placed at the bottom of a section.
// `color` is the background of the section that comes next.
// `back` optionally tints the rear wave (e.g. brand orange on light→dark
// transitions, where a translucent dark wave would read as muddy grey).
const d =
  "M0 30 Q60 10 120 30 T240 30 T360 30 T480 30 T600 30 T720 30 T840 30 T960 30 T1080 30 T1200 30 T1320 30 T1440 30 T1560 30 T1680 30 T1800 30 T1920 30 T2040 30 T2160 30 T2280 30 T2400 30 T2520 30 T2640 30 T2760 30 T2880 30 V60 H0 Z";

export default function WaveDivider({ color, back }) {
  const style = { "--wave": color };
  if (back) style["--wave-back"] = back;
  return (
    <div className={`wave-divider${back ? " wave-divider--tinted" : ""}`} style={style} aria-hidden="true">
      <svg className="wave-divider__back" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d={d} />
      </svg>
      <svg className="wave-divider__front" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d={d} />
      </svg>
    </div>
  );
}
