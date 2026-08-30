import { escapeHtml } from "../../../lib/text.js";

export function DetailHeader(props) {
  const header = document.createElement("header");
  header.className = "detail-header";

  header.innerHTML = `
    <span class="detail-header__badge">${escapeHtml(props.statusBadge)}</span>
    <h1 class="detail-header__title">${escapeHtml(props.title)}</h1>
    <div class="detail-header__row">
      <div class="detail-header__tags">
        ${props.tags.map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join("")}
      </div>
      <a class="detail-header__back" href="/abdoulaye/projets" data-route>← Retour aux projets</a>
    </div>
  `;

  return header;
}
