import { escapeHtml } from "../../../lib/text.js";

if (!String.prototype.isValidEmail) {
  Object.defineProperty(String.prototype, "isValidEmail", {
    value: function isValidEmail() {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.toString());
    },
    enumerable: false,
  });
}

function fakeSendMessage(payload) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!payload.email.isValidEmail()) {
        reject(new Error("Email invalide"));
        return;
      }
      resolve({ ok: true });
    }, 400);
  });
}

export function ContactForm(props = {}) {
  const sendLabel = props.sendLabel || "Envoyer";

  const form = document.createElement("form");
  form.className = "contact-form";
  form.noValidate = true;

  form.innerHTML = `
    <div class="contact-form__field">
      <label for="nom">Nom complet</label>
      <input id="nom" name="nom" type="text" placeholder="John Doe" required />
      <span class="contact-form__error" data-error-for="nom"></span>
    </div>

    <div class="contact-form__field">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" placeholder="john@entreprise.com" required />
      <span class="contact-form__error" data-error-for="email"></span>
    </div>

    <div class="contact-form__field">
      <label for="sujet">Sujet</label>
      <input id="sujet" name="sujet" type="text" placeholder="Proposition d'alternance" required />
      <span class="contact-form__error" data-error-for="sujet"></span>
    </div>

    <div class="contact-form__field">
      <label for="message">Message</label>
      <textarea id="message" name="message" placeholder="Bonjour Abdoulaye, ..." required></textarea>
      <span class="contact-form__error" data-error-for="message"></span>
    </div>

    <div class="contact-form__submit-row">
      <span class="contact-form__status" role="status" aria-live="polite"></span>
      <button type="submit" class="btn btn--primary">${escapeHtml(sendLabel)} →</button>
    </div>
  `;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleSubmit(form);
  });

  return form;
}

async function handleSubmit(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const errors = validateContactForm(data);
  clearErrors(form);

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([field, message]) => {
      const errorEl = form.querySelector(`[data-error-for="${field}"]`);
      if (errorEl) errorEl.textContent = message;
    });
    return;
  }

  const statusEl = form.querySelector(".contact-form__status");
  const submitBtn = form.querySelector("button[type='submit']");
  statusEl.textContent = "Envoi en cours…";
  submitBtn.disabled = true;

  try {
    await fakeSendMessage(data);
    statusEl.textContent = "Message envoyé — merci !";
    form.reset();
  } catch (error) {
    statusEl.textContent = `Erreur : ${error.message}`;
  } finally {
    submitBtn.disabled = false;
  }
}

function validateContactForm(data) {
  const errors = {};

  if (!data.nom?.trim()) errors.nom = "Le nom est obligatoire";
  if (!data.email?.trim()) {
    errors.email = "L'email est obligatoire";
  } else if (!data.email.isValidEmail()) {
    errors.email = "Le format de l'email est invalide";
  }
  if (!data.sujet?.trim()) errors.sujet = "Le sujet est obligatoire";
  if (!data.message?.trim()) errors.message = "Le message est obligatoire";

  return errors;
}

function clearErrors(form) {
  form.querySelectorAll(".contact-form__error").forEach((el) => (el.textContent = ""));
  form.querySelector(".contact-form__status").textContent = "";
}
