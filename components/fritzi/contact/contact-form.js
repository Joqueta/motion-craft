import { escapeHtml } from "../../../lib/text.js";

/**
 * Validation simple d'email via une extension du prototype String
 * (répond à la contrainte "utilisation des prototypes d'objet natif").
 */
if (!String.prototype.isValidEmail) {
    Object.defineProperty(String.prototype, "isValidEmail", {
        value: function isValidEmail() {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.toString());
        },
        enumerable: false
    });
}

/**
 * Simule l'envoi du message (à remplacer par le vrai service de mailing
 * choisi dans l'appel d'offres Lot 2 — Services de communication).
 * @param {Object} payload
 * @returns {Promise<{ok: boolean}>}
 */
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

/**
 * Formulaire de contact.
 * @param {Object} props
 * @param {string} [props.sendLabel]
 * @returns {HTMLElement}
 */
export function ContactForm(props = {}) {
    const sendLabel = props.sendLabel || "Send me";

    const form = document.createElement("form");
    form.className = "contact-form";
    form.noValidate = true;

    form.innerHTML = `
    <div class="contact-form__field">
      <label for="firstname">Firstname</label>
      <input id="firstname" name="firstname" type="text" placeholder="Your firstname here" required />
      <span class="contact-form__error" data-error-for="firstname"></span>
    </div>

    <div class="contact-form__field">
      <label for="lastname">Lastname</label>
      <input id="lastname" name="lastname" type="text" placeholder="Your lastname here" required />
      <span class="contact-form__error" data-error-for="lastname"></span>
    </div>

    <div class="contact-form__field">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" placeholder="Your email here" required />
      <span class="contact-form__error" data-error-for="email"></span>
    </div>

    <div class="contact-form__field">
      <label for="message">Message</label>
      <input id="message" name="message" type="text" placeholder="Your message here" required />
      <span class="contact-form__error" data-error-for="message"></span>
    </div>

    <div class="contact-form__submit-row">
      <span class="contact-form__status" role="status" aria-live="polite"></span>
      <button type="submit" class="btn btn--outline">[${escapeHtml(sendLabel)}]</button>
    </div>
  `;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        handleSubmit(form);
    });

    return form;
}

/**
 * Validation + soumission du formulaire.
 * @param {HTMLFormElement} form
 */
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
    statusEl.textContent = "Sending…";
    submitBtn.disabled = true;

    try {
        await fakeSendMessage(data);
        statusEl.textContent = "Message sent — thank you!";
        form.reset();
    } catch (error) {
        statusEl.textContent = `Error: ${error.message}`;
    } finally {
        submitBtn.disabled = false;
    }
}

/**
 * Règles de validation des champs.
 * @param {Object} data
 * @returns {Object} erreurs par champ
 */
function validateContactForm(data) {
    const errors = {};

    if (!data.firstname?.trim()) errors.firstname = "Firstname is required";
    if (!data.lastname?.trim()) errors.lastname = "Lastname is required";
    if (!data.email?.trim()) {
        errors.email = "Email is required";
    } else if (!data.email.isValidEmail()) {
        errors.email = "Email format is invalid";
    }
    if (!data.message?.trim()) errors.message = "Message is required";

    return errors;
}

function clearErrors(form) {
    form.querySelectorAll(".contact-form__error").forEach((el) => (el.textContent = ""));
    form.querySelector(".contact-form__status").textContent = "";
}