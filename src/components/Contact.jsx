import WaveDivider from "./WaveDivider.jsx";
import SplitText from "./SplitText.jsx";
import ContactOtter from "./otter/ContactOtter.jsx";
import { contact } from "../data/content.js";

const icons = {
  person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  mail: "M3 6h18v12H3z M3 7l9 6 9-6",
  pin: "M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2",
};

function Item({ label, value, icon }) {
  return (
    <li className="contact__item">
      <span className="contact__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d={icon} /></svg>
      </span>
      <div>
        <span className="contact__label">{label}</span>
        <span className="contact__value">{value}</span>
      </div>
    </li>
  );
}

export default function Contact() {
  return (
    <section className="section section--muted" id="contact">
      <div className="container contact">
        <div className="contact__info">
          <p className="section-label" data-fade>Contact</p>
          <SplitText as="h2" className="section-title" text="Tell us about your project" />
          <p data-fade>
            Call or email us with a few details and we will reply within one working day. If it
            is a good fit, the next step is a 30-minute call to go through scope and timelines.
          </p>

          <ul className="contact__details" data-fade>
            <Item label="Office" value={contact.address} icon={icons.pin} />
            <Item label="Hours" value={contact.hours} icon={icons.clock} />
          </ul>
          <p className="contact__reply" data-fade>
            <span className="status-dot" aria-hidden="true" /> Now booking projects for January 2027
          </p>
        </div>

        <div className="form-wrap" data-fade>
          <ContactOtter status="idle" errorCount={0} />
          <div className="form">
            <h3>Get in touch</h3>
            <ul className="contact__details contact__details--card">
              <Item label="Name" value={contact.name} icon={icons.person} />
              <Item label="Phone" value={<a href={contact.phoneHref}>{contact.phone}</a>} icon={icons.phone} />
              <Item label="Email" value={<a href={`mailto:${contact.email}`}>{contact.email}</a>} icon={icons.mail} />
            </ul>
            <div className="form__row">
              <a className="btn btn--brand btn--block" href={contact.phoneHref}>Call now</a>
              <a className="btn btn--outline btn--block" href={`mailto:${contact.email}`}>Send email</a>
            </div>
          </div>
        </div>
      </div>
      <WaveDivider color="#1c1917" back="var(--brand)" />
    </section>
  );
}
