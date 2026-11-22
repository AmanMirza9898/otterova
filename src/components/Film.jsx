import { useEffect, useRef, useState } from "react";
import SectionHeader from "./SectionHeader.jsx";
// Web-optimised copy of otterova-product-film-HQ.mp4 (same 1080p film, ~18 MB instead of 108 MB).
// The HQ master stays in src/videos but is not imported, so it is not bundled.
import filmSrc from "../videos/otterova-product-film.mp4";
import previewSrc from "../videos/film-preview.mp4";
import poster from "../videos/film-poster.jpg";
import { gsap, useGSAP, reduceMotion } from "../lib/motion.js";

// Launch film: a silent looping teaser that plays the full film (with sound) on click.
// The full film is only requested once the visitor presses play.
export default function Film() {
  const root = useRef(null);
  const card = useRef(null);
  const preview = useRef(null);
  const film = useRef(null);
  const [playing, setPlaying] = useState(false);

  // Card grows into place as it scrolls up
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          card.current,
          { scale: 0.86, borderRadius: 48 },
          {
            scale: 1,
            borderRadius: 28,
            ease: "none",
            scrollTrigger: { trigger: card.current, start: "top bottom", end: "center center", scrub: true },
          }
        );
      });
    },
    { scope: root }
  );

  // Teaser only runs while on screen; the full film pauses when scrolled away
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        const p = preview.current;
        if (p && !reduceMotion()) e.isIntersecting ? p.play().catch(() => {}) : p.pause();
        if (!e.isIntersecting) film.current?.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(card.current);
    return () => io.disconnect();
  }, []);

  const play = () => {
    setPlaying(true);
    requestAnimationFrame(() => film.current?.play().catch(() => {}));
  };

  return (
    <section className="section film" id="film" ref={root}>
      <div className="container">
        <SectionHeader label="The launch film" title="Otterova in 60 seconds">
          <p>Who we are, what we build and how we work, told the short way. Sound on.</p>
        </SectionHeader>

        <div className={`film-card${playing ? " is-playing" : ""}`} ref={card}>
          <video
            ref={preview}
            className="film-card__preview"
            src={previewSrc}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
          />

          {playing && (
            <video
              ref={film}
              className="film-card__video"
              src={filmSrc}
              poster={poster}
              controls
              playsInline
              preload="auto"
              onEnded={() => setPlaying(false)}
            />
          )}

          {!playing && (
            <button className="film-card__play" onClick={play} aria-label="Play the Otterova launch film, 1 minute 2 seconds, with sound">
              <span className="film-card__btn" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>
              </span>
              <span className="film-card__meta">
                <b>Watch the film</b>
                <span>1:02 · Sound on</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
