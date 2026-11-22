import WaveDivider from "./WaveDivider.jsx";
import { useState } from "react";
import SplitText from "./SplitText.jsx";
import ContactOtter from "./otter/ContactOtter.jsx";
import { budgets, contact, interests } from "../data/content.js";

const empty = { name: "", email: "", company: "", budget: "", interests: [], message: "" };

function validate(v) {
  const errors = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = "Please enter a valid email address.";
  if (v.message.trim().length < 10) errors.message = "Please add a few lines about the project.";
  return errors;
}

// TODO: connect to a real backend (Formspree, EmailJS or your own API).
const send = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 900));

export default function Contact() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [errorCount, setErrorCount] = useState(0);

  const update = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const toggleInterest = (item) =>
    setValues((v) => ({
      ...v,
      interests: v.interests.includes(item)
        ? v.interests.filter((i) => i !== item)
        : [...v.interests, item],
    }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      setErrorCount((n) => n + 1);
      return;
    }

    setStatus("sending");
    await send(values);
    setStatus("sent");
    setValues(empty);
  };

  return (
    <section className="section section--muted" id="contact">
      <div className="container contact">
        <div className="contact__info">
          <p className="section-label" data-fade>Contact</p>
          <SplitText as="h2" className="section-title" text="Tell us about your project" />
          <p data-fade>
            Share a few details and we will reply within one working day. If it is a good
            fit, the next step is a 30-minute call to go through scope and timelines.
          </p>

          <ul className="contact__details" data-fade>
            {[
              ["Email", <a href={`mailto:${contact.email}`}>{contact.email}</a>, "M3 6h18v12H3z M3 7l9 6 9-6"],
              ["Phone", <a href={contact.phoneHref}>{contact.phone}</a>, "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"],
              ["Office", contact.address, "M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"],
              ["Hours", contact.hours, "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2"],
            ].map(([label, value, icon]) => (
              <li key={label} className="contact__item">
                <span className="contact__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d={icon} /></svg>
                </span>
                <div>
                  <span className="contact__label">{label}</span>
                  <span className="contact__value">{value}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="contact__reply" data-fade>
            <span className="status-dot" aria-hidden="true" /> Now booking projects for January 2027
          </p>
        </div>

        <div className="form-wrap" data-fade>
        <ContactOtter status={status} errorCount={errorCount} />
        <form className="form" onSubmit={onSubmit} noValidate>
          {status === "sent" ? (
            <div className="form__success" role="status">
              <h3>Thank you, your message has been sent.</h3>
              <p>We will get back to you within one working day.</p>
              <button type="button" className="btn btn--outline" onClick={() => setStatus("idle")}>
                Send another message
              </button>
            </div>
          ) : (
            <>
              <div className="form__row">
                <Field label="Full name" error={errors.name}>
                  <input type="text" value={values.name} onChange={update("name")} autoComplete="name" />
                </Field>
                <Field label="Work email" error={errors.email}>
                  <input type="email" value={values.email} onChange={update("email")} autoComplete="email" />
                </Field>
              </div>

              <div className="form__row">
                <Field label="Company" optional>
                  <input type="text" value={values.company} onChange={update("company")} autoComplete="organization" />
                </Field>
                <Field label="Budget" optional>
                  <select value={values.budget} onChange={update("budget")}>
                    <option value="">Select a range</option>
                    {budgets.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <fieldset className="field">
                <legend>What do you need help with?</legend>
                <div className="checks">
                  {interests.map((item) => (
                    <label key={item} className="check">
                      <input
                        type="checkbox"
                        checked={values.interests.includes(item)}
                        onChange={() => toggleInterest(item)}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field label="Project details" error={errors.message}>
                <textarea
                  rows="5"
                  value={values.message}
                  onChange={update("message")}
                  placeholder="What are you building, who is it for, and when do you need it?"
                />
              </Field>

              <button type="submit" className="btn btn--brand btn--block" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
              <p className="form__note">
                We only use your details to reply to this enquiry.
              </p>
            </>
          )}
        </form>
        </div>
      </div>
      <WaveDivider color="#1c1917" back="var(--brand)" />
    </section>
  );
}

function Field({ label, optional, error, children }) {
  return (
    <label className={`field${error ? " has-error" : ""}`}>
      <span className="field__label">
        {label}
        {optional && <span className="field__optional"> (optional)</span>}
      </span>
      {children}
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}
