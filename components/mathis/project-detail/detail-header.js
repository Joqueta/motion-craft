import { escapeHtml } from "../../../lib/text.js";

function metaColumn(label, value) {
  if (!value) return "";
  return `
    <div class="mathis-detail-header__meta-item">
      <span class="mathis-detail-header__meta-label">${escapeHtml(label)}</span>
      <span class="mathis-detail-header__meta-value">${escapeHtml(value)}</span>
    </div>
  `;
}

export function DetailHeader(props) {
  const header = document.createElement("header");
  header.className = "mathis-detail-header";

  header.innerHTML = `
    <a class="mathis-detail-header__back" href="/mathis#projets" data-route aria-label="Retour aux projets">←</a>
    <h1 class="mathis-detail-header__title">${escapeHtml(props.title)}</h1>
    <div class="mathis-detail-header__meta">
      ${metaColumn("Rôle", props.role)}
      ${metaColumn("Année", props.year)}
      ${metaColumn("Langage principal", props.language)}
      ${metaColumn("Durée du projet", props.duration)}
    </div>
  `;

  return header;
}
