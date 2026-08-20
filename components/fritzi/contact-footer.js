import { escapeHtml } from "../../lib/text.js";

/**
 * Bloc de contact final ("Come say hi") avec cadre et liens.
 * @param {Object} props
 * @param {string[]} props.heading
 * @param {{url: string, alt: string}} props.logo
 * @param {string[]} props.nav
 * @param {string} props.linkedin
 * @param {string} props.email
 * @param {string} props.instagram
 * @returns {HTMLElement}
 */
export function ContactFooter(props) {
  validateContactProps(props);

  const section = document.createElement("section");
  section.className = "contact";

  section.innerHTML = `
    <div class="contact__panel">
      <h2 class="contact__heading">
        ${props.heading.map((word) => `<span>${escapeHtml(word)}</span>`).join("")}
      </h2>

      <div class="contact__center">
        <span class="contact__frame" aria-hidden="true"></span>
        <img class="contact__logo" src="${escapeHtml(props.logo.url)}" alt="${escapeHtml(props.logo.alt)}" />
      </div>

      <nav class="contact__nav" aria-label="Navigation footer">
        ${props.nav.map((link) => `<a href="#" class="contact__nav-link">${escapeHtml(link)}</a>`).join("")}
      </nav>

      <div class="contact__links">
        <a class="contact__link" href="${escapeHtml(props.linkedin)}" target="_blank" rel="noopener">Linkedin →</a>
        <a class="contact__link_email" href="mailto:${escapeHtml(props.email)}">${escapeHtml(props.email)}</a>
        <a class="contact__link" href="${escapeHtml(props.instagram)}" target="_blank" rel="noopener">Instagram →</a>
      </div>
    </div>
  `;

  return section;
}

function validateContactProps(props) {
  const required = ["heading", "logo", "nav", "linkedin", "email", "instagram"];
  const missing = required.filter((key) => !props[key]);
  if (missing.length > 0) {
    throw new Error(`[ContactFooter] Props manquantes: ${missing.join(", ")}`);
  }
}