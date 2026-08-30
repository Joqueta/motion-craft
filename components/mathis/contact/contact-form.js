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
  form.className = "mathis-contact-form";
  form.noValidate = true;

  form.innerHTML = `
    <div class="mathis-contact-form__row">
      <div class="mathis-contact-form__field">
        <label for="prenom">Prénom</label>
        <input id="prenom" name="prenom" type="text" required />
        <span class="mathis-contact-form__error" data-error-for="prenom"></span>
      </div>
      <div class="mathis-contact-form__field">
        <label for="nom">Nom</label>
        <input id="nom" name="nom" type="text" required />
        <span class="mathis-contact-form__error" data-error-for="nom"></span>
      </div>
    </div>

    <div class="mathis-contact-form__row">
      <div class="mathis-contact-form__field">
        <label for="email">Adresse mail</label>
        <input id="email" name="email" type="email" required />
        <span class="mathis-contact-form__error" data-error-for="email"></span>
      </div>
      <div class="mathis-contact-form__field">
        <label for="telephone">Téléphone</label>
        <input id="telephone" name="telephone" type="tel" />
        <span class="mathis-contact-form__error" data-error-for="telephone"></span>
      </div>
    </div>

    <div class="mathis-contact-form__field">
      <label for="message">Message</label>
      <textarea id="message" name="message" placeholder="Votre message..." required></textarea>
      <span class="mathis-contact-form__error" data-error-for="message"></span>
    </div>

    <div class="mathis-contact-form__submit-row">
      <span class="mathis-contact-form__status" role="status" aria-live="polite"></span>
      <button type="submit" class="btn btn--primary">${escapeHtml(sendLabel)}</button>
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

  const statusEl = form.querySelector(".mathis-contact-form__status");
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

  if (!data.prenom?.trim()) errors.prenom = "Le prénom est obligatoire";
  if (!data.nom?.trim()) errors.nom = "Le nom est obligatoire";
  if (!data.email?.trim()) {
    errors.email = "L'email est obligatoire";
  } else if (!data.email.isValidEmail()) {
    errors.email = "Le format de l'email est invalide";
  }
  if (!data.message?.trim()) errors.message = "Le message est obligatoire";

  return errors;
}

function clearErrors(form) {
  form.querySelectorAll(".mathis-contact-form__error").forEach((el) => (el.textContent = ""));
  form.querySelector(".mathis-contact-form__status").textContent = "";
}
