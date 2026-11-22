import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import logoMark from "../assets/logo-mark.png";
import { nav } from "../data/content.js";
import { ScrollTrigger, getLenis, scrollToTarget } from "../lib/motion.js";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [dark, setDark] = useState(false);
  const [blob, setBlob] = useState({ x: 0, w: 0, show: false });
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const lastY = useRef(0);

  // Pill on scroll, hide while scrolling down, show on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > lastY.current && y > 500);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Highlight the section currently in view
  useEffect(() => {
    const sections = nav.map((n) => document.querySelector(n.href)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive("#" + e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    // Clear the highlight when back at the hero
    const top = () => window.scrollY < window.innerHeight * 0.5 && setActive("");
    window.addEventListener("scroll", top, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", top);
    };
  }, []);

  // Switch to a dark header while it sits over the dark sections
  useEffect(() => {
    const over = new Set();
    const triggers = [".process", ".footer"].map((sel) =>
      ScrollTrigger.create({
        trigger: sel,
        start: "top top+=34",
        end: "bottom top+=34",
        refreshPriority: -1,
        onToggle: (self) => {
          self.isActive ? over.add(sel) : over.delete(sel);
          setDark(over.size > 0);
        },
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const lenis = getLenis();
    if (lenis) open ? lenis.stop() : lenis.start();
  }, [open]);

  // Liquid blob: glides to the hovered link, rests on the active one.
  const moveBlob = useCallback((el) => {
    if (!el) return setBlob((b) => ({ ...b, show: false }));
    setBlob({ x: el.offsetLeft, w: el.offsetWidth, show: true });
  }, []);
  const restBlob = useCallback(() => {
    moveBlob(active ? navRef.current?.querySelector(`a[href="${active}"]`) : null);
  }, [active, moveBlob]);
  useLayoutEffect(restBlob, [restBlob]);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    scrollToTarget(href);
  };

  const cls = ["header", scrolled && "is-scrolled", dark && "is-dark", hidden && !open && "is-hidden", open && "is-open"]
    .filter(Boolean)
    .join(" ");

  return (
    <header ref={headerRef} className={cls}>
      <div className="container header__inner">
        <a href="#top" className="brand" onClick={(e) => go(e, "#top")} aria-label="Otterova home">
          <img src={logoMark} alt="" width="32" height="32" />
          <span>Otterova</span>
        </a>

        <nav className="nav" aria-label="Primary" ref={navRef} onPointerLeave={restBlob}>
          <span
            className={`nav__blob${blob.show ? " is-on" : ""}`}
            style={{ "--x": `${blob.x}px`, "--w": `${blob.w}px` }}
            aria-hidden="true"
          />
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => go(e, item.href)}
              onPointerEnter={(e) => moveBlob(e.currentTarget)}
              onFocus={(e) => moveBlob(e.currentTarget)}
              onBlur={restBlob}
              className={active === item.href ? "is-active" : ""}
              aria-current={active === item.href ? "true" : undefined}
            >
              <span className="nav__label" data-text={item.label}>{item.label}</span>
            </a>
          ))}
        </nav>

        <a href="#contact" onClick={(e) => go(e, "#contact")} className="btn btn--dark btn--sm header__cta" data-magnetic>
          <span className="header__cta-dot" aria-hidden="true" />
          <span className="btn__label"><span data-text="Let's talk">Contact us</span></span>
        </a>

        <button
          className={`burger${open ? " is-open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`mobile-menu${open ? " is-open" : ""}`}>
        <nav className="container">
          {nav.map((item, i) => (
            <a key={item.href} href={item.href} onClick={(e) => go(e, item.href)} style={{ "--i": i }}>
              {item.label}
              <span className="mobile-menu__arrow" aria-hidden="true">→</span>
            </a>
          ))}
          <a href="#contact" onClick={(e) => go(e, "#contact")} className="btn btn--brand" style={{ "--i": nav.length }}>
            Start a project →
          </a>
          <p className="mobile-menu__note" style={{ "--i": nav.length + 1 }}>
            <span className="status-dot" aria-hidden="true" /> Now booking projects for January 2027
          </p>
        </nav>
      </div>
    </header>
  );
}
