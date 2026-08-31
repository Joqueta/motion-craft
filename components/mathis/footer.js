import { escapeHtml } from "../../lib/text.js";

export function Footer(props = {}) {
  const year = new Date().getFullYear();

  const footer = document.createElement("footer");
  footer.className = "mathis-footer";

  footer.innerHTML = `
    <p class="mathis-footer__text">${escapeHtml(props.name ?? "")} - Portfolio ${year}</p>
  `;

  return footer;
}
