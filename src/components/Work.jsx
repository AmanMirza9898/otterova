import WaveDivider from "./WaveDivider.jsx";
import { useRef } from "react";
import SectionHeader from "./SectionHeader.jsx";
import ProjectOtter from "./otter/ProjectOtter.jsx";
import { wave } from "./otter/useOtterLife.js";
import { projects } from "../data/content.js";
import { gsap, useGSAP, scrollToTarget } from "../lib/motion.js";

// Illustrated mini-screens for each project. Decorative only (aria-hidden).
// To use real screenshots instead: <img src={yourImage} alt="..." /> inside .pcard__media
function Chrome({ url }) {
  return (
    <div className="pv__chrome">
      <i /><i /><i />
      {url && <span className="pv__url">{url}</span>}
    </div>
  );
}

function Preview({ kind, accent, image, url, alt }) {
  const a = { "--a": accent };

  if (kind === "phone") {
    return (
      <div className="pv pv--phone" style={a} aria-hidden="true">
        <div className="pv__status"><span>9:41</span><span className="pv__notch" /><span>●●●</span></div>
        <p className="pv__hello">Good morning,<br /><b>Asha</b></p>
        <div className="pv__appt">
          <small>Next appointment</small>
          <b>Dr. Mehta · Cardiology</b>
          <span>Today, 4:30 PM</span>
          <em>Join video call</em>
        </div>
        <div className="pv__row"><i>✓</i><div><b>Blood report ready</b><span>Uploaded 2h ago</span></div></div>
        <div className="pv__row"><i>℞</i><div><b>Prescription</b><span>2 medicines</span></div></div>
        <div className="pv__row"><i>+</i><div><b>Book a follow-up</b><span>Next free: Thu, 11:00</span></div></div>
        <div className="pv__vitals"><span><b>72</b> bpm</span><span><b>118/76</b> BP</span></div>
        <div className="pv__tabs"><i className="on" /><i /><i /><i /></div>
      </div>
    );
  }

  if (kind === "chat") {
    return (
      <div className="pv pv--window" style={a} aria-hidden="true">
        <Chrome url="help.lumen.ai" />
        <div className="pv__chathead">
          <span className="pv__bot">L</span>
          <div><b>Lumen Assistant</b><small><i /> Online · replies instantly</small></div>
        </div>
        <div className="pv__chat">
          <p className="pv__msg pv__msg--me">How do I export last month's invoices?</p>
          <p className="pv__msg">
            Go to <b>Billing → Invoices</b>, set the date range and choose <b>Export CSV</b>. Want me to email you the file?
            <span className="pv__src">Source: Billing guide</span>
          </p>
          <p className="pv__msg pv__msg--me">Yes please!</p>
          <div className="pv__typing"><i /><i /><i /></div>
        </div>
      </div>
    );
  }

  if (kind === "grid") {
    const items = [
      ["Clay vase", "₹1,450", "#d9b89a", "vase"],
      ["Linen throw", "₹2,900", "#b8c4b0", "throw"],
      ["Oak lamp", "₹4,200", "#e6d3b3", "lamp"],
      ["Stoneware mug", "₹650", "#c9a58a", "mug"],
      ["Jute basket", "₹1,100", "#d8c39b", "basket"],
      ["Wall plate", "₹980", "#b9a48f", "plate"],
    ];
    return (
      <div className="pv pv--window" style={a} aria-hidden="true">
        <Chrome url="terragoods.in" />
        <div className="pv__shopnav"><b>TERRA</b><span>Shop</span><span>Living</span><span>Kitchen</span><em>Cart · 2</em></div>
        <div className="pv__grid">
          {items.map(([name, price, tone, shape]) => (
            <div key={name} className="pv__tile">
              <div className="pv__img" style={{ background: tone }}><i className={`pv__shape pv__shape--${shape}`} /></div>
              <b>{name}</b>
              <span>{price}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "screenshot") {
    return (
      <div className="pv pv--window" style={a}>
        <Chrome url={url} />
        <img className="pv__shot" src={image} alt={alt} loading="lazy" />
      </div>
    );
  }

  return (
    <div className="pv pv--window" style={a} aria-hidden="true">
      <Chrome url="app.nimbus.finance" />
      <div className="pv__dash">
        <div className="pv__side">
          <span className="pv__logo" />
          <i className="on" /><i /><i /><i />
        </div>
        <div className="pv__main">
          <div className="pv__top"><b>Applications</b><span>Last 7 days</span></div>
          <div className="pv__kpis">
            <div><small>Completion</small><b>67%</b><em>▲ 26 pts</em></div>
            <div><small>Approved</small><b>1,284</b><em>▲ 18%</em></div>
            <div><small>Avg. time</small><b>6m 10s</b><em>▼ 3m</em></div>
          </div>
          <div className="pv__chart">
            {[41, 46, 50, 55, 58, 63, 67].map((h, n) => (
              <span key={n} style={{ height: `${h * 1.3}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Work() {
  const root = useRef(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".pcard");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        cards.forEach((card, i) => {
          const inner = card.querySelector(".pcard__inner");
          const media = card.querySelector(".pcard__media");
          const pv = card.querySelector(".pv");
          const stage = card.querySelector(".pcard__stage");
          const rise = card.querySelector(".p-otter__rise");
          const sign = card.querySelector(".p-otter__sign");
          const num = card.querySelector("[data-result]");

          // Entrance when the card scrolls in
          const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 72%" } });
          tl.from(media, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" })
            .from(pv, { scale: 1.3, yPercent: 15, duration: 1.5, ease: "expo.out" }, 0.3)
            .from(card.querySelectorAll(".pcard__info > *"), {
              y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.07, ease: "power3.out",
            }, 0.2)
            .from(rise, { yPercent: 100, duration: 0.9, ease: "back.out(1.7)" }, 0.6)
            .from(sign, { rotation: -25, scale: 0.4, transformOrigin: "50% 100%", duration: 0.7, ease: "back.out(2.5)" }, 0.9)
            .add(() => {
              // Looked up now, because the 3D Ottie replaces the SVG once it has loaded
              const otter = card.querySelector(".p-otter .otter");
              if (otter) wave(otter, "r", 2);
            }, 1.2);

          // 3D: the browser window swings in from an angle and settles flat
          gsap.fromTo(
            stage,
            { rotationY: -24, rotationX: 14, z: -80 },
            {
              rotationY: -6,
              rotationX: 4,
              z: 0,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "top 35%", scrub: 0.6 },
            }
          );

          // Chart bars grow in
          const bars = card.querySelectorAll(".pv__chart span");
          if (bars.length) {
            tl.from(bars, { scaleY: 0, transformOrigin: "bottom", duration: 0.9, stagger: 0.06, ease: "power3.out" }, 0.8);
          }

          // Result counter
          if (num) {
            const end = Number(num.dataset.result);
            const dec = Number(num.dataset.decimals || 0);
            const obj = { v: 0 };
            tl.to(obj, {
              v: end,
              duration: 1.6,
              ease: "power3.out",
              onUpdate: () => (num.textContent = obj.v.toFixed(dec)),
            }, 0.5);
          }

          // Sign sways gently afterwards
          gsap.to(sign, { rotation: 4, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });

          // Stack effect: shrink and dim as the next card slides over
          const next = cards[i + 1];
          if (next && window.matchMedia("(min-width: 701px)").matches) {
            const st = { trigger: next, start: "top bottom", end: "top 30%", scrub: true };
            gsap.to(inner, { scale: 0.92, rotationX: 7, transformPerspective: 1400, ease: "none", scrollTrigger: st });
            gsap.to(card.querySelector(".pcard__shade"), { opacity: 0.07, ease: "none", scrollTrigger: { ...st } });
            // Ottie ducks behind the card as the next one arrives
            gsap.to(card.querySelector(".p-otter"), {
              y: 150,
              autoAlpha: 0,
              ease: "power1.in",
              scrollTrigger: { trigger: next, start: "top 85%", end: "top 55%", scrub: true },
            });
          }
        });
      });

      // Preview tilt on hover
      if (!window.matchMedia("(hover: hover)").matches) return;
      cards.forEach((card) => {
        const pv = card.querySelector(".pv");
        const media = card.querySelector(".pcard__media");
        const rx = gsap.quickTo(pv, "rotationX", { duration: 0.6, ease: "power3.out" });
        const ry = gsap.quickTo(pv, "rotationY", { duration: 0.6, ease: "power3.out" });
        media.addEventListener("pointermove", (e) => {
          const r = media.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 14);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
        });
        media.addEventListener("pointerleave", () => { rx(0); ry(0); });
      });
    },
    { scope: root }
  );

  return (
    <section className="section section--muted" id="work" ref={root}>
      <div className="container">
        <SectionHeader label="Selected work" title="Recent projects">
          <a
            href="#contact"
            className="text-link"
            onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); }}
          >
            Request full case studies →
          </a>
        </SectionHeader>

        <div className="pstack">
          {projects.map((p, i) => (
            <article key={p.name} className="pcard" style={{ "--i": i }}>
              <ProjectOtter sign={p.sign} />
              <div className="pcard__inner">
                <div className="pcard__info">
                  <div className="pcard__meta">
                    <span className="pcard__index">{String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
                    <span>{p.sector} · {p.year}</span>
                  </div>
                  <h3>{p.name}</h3>
                  <p className="pcard__scope">{p.scope}</p>
                  <p className="pcard__summary">{p.summary}</p>

                  <div className="pcard__result">
                    <span className="pcard__num" style={{ color: p.accent }}>
                      <span data-result={p.result.value} data-decimals={p.result.decimals}>
                        {p.result.value.toFixed(p.result.decimals)}
                      </span>
                      {p.result.suffix}
                    </span>
                    <span className="pcard__result-label">{p.result.label}</span>
                  </div>

                  <ul className="pcard__tags">
                    {p.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>

                  {p.url && (
                    <a className="text-link pcard__link" href={p.url} target="_blank" rel="noopener noreferrer">
                      Visit live site →
                    </a>
                  )}
                </div>

                <div className="pcard__media" style={{ background: p.tone }}>
                  <div className="pcard__stage">
                  <Preview
                    kind={p.kind}
                    accent={p.accent}
                    image={p.image}
                    url={p.url && p.url.replace(/^https?:\/\/(www\.)?/, "")}
                    alt={`${p.name} website homepage`}
                  />
                  </div>
                </div>
                <div className="pcard__shade" aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </div>
      <WaveDivider color="var(--text)" back="var(--brand)" />
    </section>
  );
}
