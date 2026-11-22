import WaveDivider from "./WaveDivider.jsx";
import { useRef } from "react";
import { stack } from "../data/content.js";
import { gsap, useGSAP } from "../lib/motion.js";

const statement =
  "We started in 2019 as three engineers building apps for local businesses. Today we are 24 people across design, engineering and project management — and most of our work comes from clients who have been with us for years.";

export default function About() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Words darken one by one as you scroll through the paragraph
        gsap.fromTo(
          ".about__statement .word",
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: ".about__statement",
              start: "top 80%",
              end: "bottom 45%",
              scrub: true,
            },
          }
        );

        gsap.from(".stack-table tr", {
          x: -30,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".stack-table", start: "top 85%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="section section--muted" id="about" ref={root}>
      <div className="container">
        <p className="section-label" data-fade>About us</p>
        <p className="about__statement">
          {statement.split(" ").map((w, i) => (
            <span className="word" key={i}>
              {w}{" "}
            </span>
          ))}
        </p>

        <div className="about">
          <div className="about__text" data-fade>
            <h3>Small, senior teams</h3>
            <p>
              The people you meet in the first call are the people who work on your product.
              No hand-offs to juniors after the contract is signed.
            </p>
            <h3>We stay after launch</h3>
            <p>
              Every project comes with a 30-day warranty, and most clients keep us on for
              ongoing improvements and support.
            </p>
          </div>

          <div className="about__stack" data-fade>
            <h3>Technologies we use</h3>
            <table className="stack-table">
              <tbody>
                {stack.map((row) => (
                  <tr key={row.group}>
                    <th scope="row">{row.group}</th>
                    <td>{row.items.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <WaveDivider color="var(--bg)" />
    </section>
  );
}
