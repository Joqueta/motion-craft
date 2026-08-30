import { escapeHtml } from "../../lib/text.js";

export function Footer(props = {}) {
  const year = new Date().getFullYear();
  const tagline = props.tagline ?? "Portfolio";

  const footer = document.createElement("footer");
  footer.className = "abdoulaye-footer";

  footer.innerHTML = `
    <p class="abdoulaye-footer__text">© ${year} ${escapeHtml(props.name ?? "")} — ${escapeHtml(tagline)}</p>
    <p class="abdoulaye-footer__signature">Fait par mes soins</p>
  `;

  return footer;
}
