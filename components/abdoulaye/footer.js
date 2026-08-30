import { escapeHtml } from "../../lib/text.js";

export function Footer(props = {}) {
  const year = new Date().getFullYear();

  const footer = document.createElement("footer");
  footer.className = "abdoulaye-footer";

  footer.innerHTML = `
    <p class="abdoulaye-footer__text">© ${year} ${escapeHtml(props.name ?? "")}</p>
    <div class="abdoulaye-footer__links">
      ${props.github ? `<a href="${escapeHtml(props.github)}" target="_blank" rel="noopener">GitHub</a>` : ""}
      ${props.email ? `<a href="mailto:${escapeHtml(props.email)}">${escapeHtml(props.email)}</a>` : ""}
    </div>
  `;

  return footer;
}
