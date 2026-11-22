import { useRef, useState } from "react";
import logoMark from "../assets/logo-mark.png";
import SplitText from "./SplitText.jsx";
import Otter from "./otter/Otter3D.jsx";
import useOtterLife, { wave } from "./otter/useOtterLife.js";
import { contact, nav } from "../data/content.js";
import { gsap, useGSAP, reduceMotion, scrollToTarget } from "../lib/motion.js";

const social = [
  { label: "LinkedIn", href: "https://linkedin.com/company/otterova" },
  { label: "Instagram", href: "https://instagram.com/otterova" },
  { label: "X", href: "https://x.com/otterova" },
  { label: "Dribbble", href: "https://dribbble.com/otterova" },
];

const word = "Otterova";

// What Ottie says each time you find him
const lines = [
  "Bye for now!",
  "Hey, you found me!",
  "Okay, again!",
  "You're good at this.",
  "Fine, you win. Now go email us!",
];

export default function Footer() {
  const root = useRef(null);
  const otterRef = useRef(null);
  const spot = useRef(4);
  const busy = useRef(false);
  const [finds, setFinds] = useState(0);

  useOtterLife(otterRef);

  // Move Ottie (horizontally) behind letter i
  const placeAt = (i) => {
    const giant = root.current.querySelector(".footer__giant");
    const letter = root.current.querySelectorAll(".gl")[i];
    const ot = root.current.querySelector(".f-otter");
    if (!giant || !letter || !ot) return;
    const g = giant.getBoundingClientRect();
    const l = letter.getBoundingClientRect();
    gsap.set(ot, { x: l.left - g.left + l.width / 2 - ot.offsetWidth / 2 });
  };

  useGSAP(
    () => {
      placeAt(spot.current);
      const reduce = reduceMotion();
      const inner = ".f-otter__inner";

      if (reduce) {
        gsap.set(inner, { yPercent: 0 });
        return;
      }
      gsap.set(inner, { yPercent: 150 });

      // Giant wordmark rises letter by letter
      gsap.from(".gl", {
        yPercent: 100,
        ease: "power2.out",
        stagger: 0.05,
        scrollTrigger: { trigger: ".footer__giant", start: "top bottom", end: "bottom bottom", scrub: 1 },
      });

      // Ottie pops up near the end of the page and waves goodbye
      gsap.timeline({
        scrollTrigger: {
          trigger: ".footer__giant",
          start: "top 75%",
          toggleActions: "play none none reverse",
          onRefresh: () => placeAt(spot.current),
        },
      })
        .to(inner, { yPercent: 0, duration: 0.8, ease: "back.out(1.6)" })
        .fromTo(".f-otter__bubble", { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(2.5)" })
        .add(() => {
          const svg = otterRef.current?.querySelector(".otter");
          if (svg) wave(svg, "r", 3);
        }, "-=0.3");

      // Water strip drifts
      gsap.to(".footer__wave-path", { x: -120, duration: 3, ease: "none", repeat: -1 });
    },
    { scope: root }
  );

  // Hide-and-seek: dive, swim to another letter, pop up again
  const boop = () => {
    if (busy.current) return;
    const count = root.current.querySelectorAll(".gl").length;
    let next = spot.current;
    while (next === spot.current) next = Math.floor(Math.random() * count);
    spot.current = next;

    if (reduceMotion()) {
      placeAt(next);
      setFinds((f) => f + 1);
      return;
    }
    busy.current = true;
    const drops = root.current.querySelectorAll(".f-otter__drop");
    gsap
      .timeline({ onComplete: () => (busy.current = false) })
      .to(".f-otter__inner", { yPercent: 150, duration: 0.35, ease: "power2.in" })
      .fromTo(drops, { x: 0, y: 0, autoAlpha: 1, scale: 1 }, {
        x: (i) => (i - 2) * gsap.utils.random(14, 22),
        y: () => gsap.utils.random(-60, -30),
        autoAlpha: 0,
        scale: 0.4,
        duration: 0.6,
        ease: "power2.out",
      }, 0.2)
      .add(() => {
        placeAt(next);
        setFinds((f) => f + 1);
      }, 0.45)
      .to(".f-otter__inner", { yPercent: 0, duration: 0.7, ease: "back.out(1.8)" }, 0.75)
      .fromTo(".f-otter__bubble", { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(2.5)" }, 1)
      .add(() => {
        const svg = otterRef.current?.querySelector(".otter");
        if (svg) wave(svg, Math.random() > 0.5 ? "l" : "r", 2);
      }, 1.1);
  };

  const go = (e, href) => {
    e.preventDefault();
    scrollToTarget(href);
  };

  return (
    <footer className="footer" ref={root}>
      <div className="container">
        {/* Closing call to action */}
        <div className="footer__cta">
          <div>
            <p className="section-label" data-fade>Have a project in mind?</p>
            <SplitText as="h2" className="footer__cta-title" text="Let's build something your users will love." />
          </div>
          <div className="footer__cta-actions" data-fade>
            <a href="#contact" className="btn btn--brand" data-magnetic onClick={(e) => go(e, "#contact")}>
              <span className="btn__label"><span data-text="Start a project">Start a project</span></span>
              <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
            <a href={`mailto:${contact.email}`} className="footer__email">{contact.email}</a>
          </div>
        </div>

        <div className="footer__top">
          <div className="footer__brand" data-fade>
            <a href="#top" className="brand" onClick={(e) => go(e, "#top")}>
              <img src={logoMark} alt="" width="32" height="32" />
              <span>Otterova</span>
            </a>
            <p>Software design and development studio based in Bengaluru, India.</p>
          </div>

          <div className="footer__cols" data-fade>
            <div>
              <h4>Company</h4>
              {nav.map((n) => (
                <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)}>{n.label}</a>
              ))}
            </div>
            <div>
              <h4>Contact</h4>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <a href={contact.phoneHref}>{contact.phone}</a>
              <span>Bengaluru, India</span>
            </div>
            <div>
              <h4>Follow</h4>
              {social.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Otterova Technologies Pvt. Ltd.</span>
          <span className="footer__finds" aria-live="polite">
            {finds > 0 ? `You found Ottie ${finds}× ` : "Psst… click the otter below"}
          </span>
          <span>
            <a href="#top">Privacy policy</a>
            <a href="#top">Terms</a>
            <a href="#top" onClick={(e) => go(e, "#top")}>Back to top ↑</a>
          </span>
        </div>
      </div>

      {/* Giant wordmark with Ottie hiding behind the letters */}
      <div className="footer__giant">
        <div className="f-otter" ref={otterRef}>
          <div className="f-otter__inner">
            <div className="f-otter__bubble">{lines[Math.min(finds, lines.length - 1)]}</div>
            <button className="f-otter__btn" onClick={boop} aria-label="Play hide and seek with Ottie">
              <Otter />
            </button>
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="f-otter__drop" />
          ))}
        </div>

        <div className="footer__word" aria-hidden="true">
          {word.split("").map((c, i) => (
            <span key={i} className="gl">{c}</span>
          ))}
        </div>

        <svg className="footer__wave" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
          <path
            className="footer__wave-path"
            d="M0 16 Q30 6 60 16 T120 16 T180 16 T240 16 T300 16 T360 16 T420 16 T480 16 T540 16 T600 16 T660 16 T720 16 T780 16 T840 16 T900 16 T960 16 T1020 16 T1080 16 T1140 16 T1200 16 T1260 16 T1320 16 T1380 16 T1440 16 T1500 16 T1560 16 V40 H0 Z"
          />
        </svg>
      </div>
    </footer>
  );
}
