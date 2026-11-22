/* Contact form: client-side validation + submit state.
   Connect to a real backend (Formspree, EmailJS, your API) inside `send()`. */
window.Otterova = window.Otterova || {};

Otterova.form = function () {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const status = document.getElementById("formStatus");
  const btnText = form.querySelector(".btn__text");

  const validators = {
    name: (v) => v.trim().length > 1,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: (v) => v.trim().length > 9,
  };

  // TODO: replace with your real endpoint, e.g. fetch("https://formspree.io/f/xxxx", ...)
  const send = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 1200));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let ok = true;

    Object.entries(validators).forEach(([name, test]) => {
      const input = form.elements[name];
      const valid = test(input.value);
      input.closest(".field").classList.toggle("is-invalid", !valid);
      if (!valid) ok = false;
    });

    if (!ok) {
      status.textContent = "Please fill in your name, a valid email and a short message.";
      return;
    }

    btnText.textContent = "Sending…";
    status.textContent = "";
    await send(new FormData(form));
    btnText.textContent = "Message sent ✓";
    status.textContent = "Thanks! We'll get back to you within 24 hours.";
    form.reset();
    setTimeout(() => (btnText.textContent = "Send message"), 4000);
  });

  form.querySelectorAll("input, textarea").forEach((el) =>
    el.addEventListener("input", () => el.closest(".field")?.classList.remove("is-invalid"))
  );
};
